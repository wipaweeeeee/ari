// media-loader.js
class MediaLoader {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  async getBatch(fileIds) {
    let chunk = 0;
    let allResults = {};
    
    while (true) {
      const response = await fetch('/.netlify/functions/fetch-media-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileIds, chunk }),
      });

      const { results, nextChunk, complete } = await response.json();
      
      // Merge results
      allResults = { ...allResults, ...results };
      
      // Cache successful results
      Object.entries(results).forEach(([fileId, result]) => {
        if (!result.error) this.cache.set(fileId, result);
      });

      if (complete) break;
      chunk = nextChunk;
    }

    return allResults;
  }

  async getMedia(fileId) {
    if (this.cache.has(fileId)) return this.cache.get(fileId);
  
    return new Promise((resolve) => {
      if (!this.pendingRequests.has(fileId)) {
        this.pendingRequests.set(fileId, resolve);
        // Automatically trigger processing (debounced)
        this._debouncedProcessQueue();
      }
    });
  }
  
  // Debounce to batch quickly queued requests
  _debouncedProcessQueue = (() => {
    let timeout = null;
    return () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => this.processQueue(), 10); // slight delay to allow batching
    };
  })();

  async processQueue() {
    if (this.pendingRequests.size === 0) return;
    
    const fileIds = Array.from(this.pendingRequests.keys());
    const results = await this.getBatch(fileIds);
    
    fileIds.forEach(fileId => {
      const resolve = this.pendingRequests.get(fileId);
      resolve(results[fileId] || { error: 'Not processed' });
      this.pendingRequests.delete(fileId);
    });
  }
}

export default new MediaLoader();