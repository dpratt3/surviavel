import { createRoot } from 'react-dom/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AnimatedBarChart from './Components/AnimatedBarChart';

const App = () => {
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('male-number-of-lives-interpolated');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/${selectedOption}`);
        console.log(response);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedOption]);

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      {/* Add a dropdown menu */}
      <label>
        Select Data:
        <select value={selectedOption} onChange={handleDropdownChange}>
          <option value="life-expectancies">Life Expectancies</option>
          <option value="female-life-expectancy-interpolated">Female Life Expectancy Interpolated</option>
          <option value="female-death-probability-interpolated">Female Death Probability Interpolated</option>
          <option value="female-number-of-lives-interpolated">Female Number of Lives Interpolated</option>
          <option value="male-life-expectancy-interpolated">Male Life Expectancy Interpolated</option>
          <option value="male-number-of-lives-interpolated">Male Number of Lives</option>
          <option value="male-death-probability-interpolated">Male Death Probability Interpolated</option>
        </select>
      </label>

      {/* {data.map(item => (
        <div key={item.year}>
          <div>Year: {item.year}, Value: {item['37']}, Value: {item['77']}</div>
        </div>
      ))} */}

      <div>
        <AnimatedBarChart data = {data} />
      </div>
    </div>
  );
};

const appElement = document.getElementById('app');

if (appElement) {
  createRoot(appElement).render(<App />);
} else {
  console.error("Element with ID 'app' not found in the DOM.");
}
