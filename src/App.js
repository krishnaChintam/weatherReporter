import './App.css';
import WeatherTable from './components/weatherCard/WeatherCard';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="App">
    <ToastContainer />
      <WeatherTable />
    </div>
  );
}

export default App;
