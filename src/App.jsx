import Home from '@/components/Home';
import DriveMedia from '@/components/DriveMedia';
import useAriData from '@/hooks/useAriData';

function App() {
  // useAriData returns an object with data, loading, and error properties
  // data is an array of objects, each containing timestamp, name, message, and gid properties 
  // loading is a boolean indicating if the data is still being fetched
  // error is a string containing any error message that occurred during the fetch
  const { data, loading, error } = useAriData();
  
  return (
    <>
      <Home />
      { loading && <div>Loading...</div> }
      { error && <div>Error: {error}</div> }
      { data && data.map((item, index) => (
        <div key={index}>
          <p>{item.timestamp}</p>
          <p>{item.name}</p>
          <p>{item.message}</p>
          { item.gid && <DriveMedia fileId={item.gid} /> }
        </div>
      )) }
    </>
  )
}

export default App
