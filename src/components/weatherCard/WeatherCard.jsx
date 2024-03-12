import React, { useState } from 'react';
import './weather.css';
import moment from 'moment';
import Loader from '../loader/loader';

const WeatherBlock = ({ date, temp, minTemp, maxTemp, pressure, humidity }) => {
  return (
    <div className='block'>
      <table>
        <thead>
          <tr>
            <th colSpan="2">
              Date: {date}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td colSpan="2" className='color'>Temp: {temp}</td>
          </tr>
          <tr>
            <td>Min</td>
            <td>Max</td>
          </tr>
          <tr>
            <td>{minTemp}</td>
            <td>{maxTemp}</td>
          </tr>
          <tr>
            <td>Pressure</td>
            <td>{pressure}</td>
          </tr>
          <tr>
            <td>Humidity</td>
            <td>{humidity}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const WeatherTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   getLocation();
  // }, []);

  // const getLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         // fetchData(latitude, longitude);
  //       },
  //       (error) => {
  //         setError(error.message);
  //       }
  //     );
  //   } else {
  //     setError("Geolocation is not supported by this browser.");
  //   }
  // };

  const fetchData = async (latitude, longitude) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${'1635890035cbba097fd5c26c8ea672a1'}`
      );

      if (!response.ok) {
        setLoading(false);
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      // Filter out duplicate data entries with the same date
      const uniqueData = filterDuplicateDates(data.list);
      setWeatherData(uniqueData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Function to filter out duplicate data entries with the same date
  const filterDuplicateDates = (dataList) => {
    const uniqueDates = new Set();
    const uniqueData = dataList.filter(item => {
      const date = moment(item.dt_txt).format('YYYY-MM-DD');
      if (uniqueDates.has(date)) {
        return false; // If duplicate date, filter it out
      } else {
        uniqueDates.add(date); // Add date to Set
        return true; // Otherwise, keep it in the filtered array
      }
    });

    return uniqueData;
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${'1635890035cbba097fd5c26c8ea672a1'}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setLoading(false);
      fetchData(data.coord.lat, data.coord.lon);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loader loading={loading} />
      <div>
        <div className="heading">Weather in Your<span className="accent">City</span></div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter city name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">Search</button>
        </div>
        <div className='block-section'>
          {weatherData?.map((item, index) => (
            <WeatherBlock
              key={index}
              date={moment(item.dt_txt).format('DD-MM-YYYY')}
              temp={item?.main.temp}
              minTemp={item?.main.temp_min}
              maxTemp={item?.main.temp_max}
              pressure={item?.main.pressure}
              humidity={item?.main.humidity}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default WeatherTable;
