import { createRoot } from 'react-dom/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import HelloWorld from './Components/HelloWorld';

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/life-expectancies');
        setData(response.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <HelloWorld />
      
      {data.map(item => (
        <div key={item.id}>
          {/* Render the desired data fields */}
          <div>Exact Age: {item.exact_age}</div>
          <div>Male Death Probability: {item.male_death_probability}</div>
          <div>Male Number of Lives: {item.male_number_of_lives}</div>
          <div>Female Death Probability: {item.female_death_probability}</div>
          <div>Female Number of Lives: {item.female_number_of_lives}</div>
          <div>Year: {item.year}</div>
          {/* Add more fields as needed */}
        </div>
      ))}
      
    </div>
  );
};

const appElement = document.getElementById('app');

if (appElement) {
  createRoot(appElement).render(<App />);
} else {
  console.error("Element with ID 'app' not found in the DOM.");
}
