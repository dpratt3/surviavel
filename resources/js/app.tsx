import { createRoot } from 'react-dom/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AnimatedBarChart from './Components/AnimatedBarChart';
import '../css/app.css'

const App = () => {
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('female-number-of-lives-interpolated');

  const titleMap = {
      'female-life-expectancy-interpolated': 'Female Life Expectancy',
      'female-death-probability-interpolated': 'Female Death Probability',
      'female-number-of-lives-interpolated': 'Female Number of Lives',
      'male-life-expectancy-interpolated': 'Male Life Expectancy',
      'male-number-of-lives-interpolated': 'Male Number of Lives',
      'male-death-probability-interpolated': 'Male Death Probability'
    };

  const title = titleMap[selectedOption]

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
    <div style={{ textAlign: 'center' }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;700&display=swap"></link>
      <h1>Surviavel</h1>
      {/* Add a dropdown menu */}
      <label style={{ color: "white"}}>
      <span style={{ marginRight: "5px" }}>Select a series:</span> 
        <select className="dropdown" style={{width:"175px"}}value={selectedOption} onChange={handleDropdownChange}>
          {/* <option value="life-expectancies">Life Expectancies</option> */}
          <option value="female-life-expectancy-interpolated">Female Life Expectancy</option>
          <option value="female-death-probability-interpolated">Female Death Probability</option>
          <option value="female-number-of-lives-interpolated">Female Number of Lives</option>
          <option value="male-life-expectancy-interpolated">Male Life Expectancy</option>
          <option value="male-number-of-lives-interpolated">Male Number of Lives</option>
          <option value="male-death-probability-interpolated">Male Death Probability</option>
        </select>
      </label>
      
      {/* {data.map(item => (
        <div key={item.year}>
          <div>Year: {item.year}, Value: {item['37']}, Value: {item['77']}</div>
        </div>
      ))} */}

      <div style={{ margin: 'auto', width: '50%' }}>
        <AnimatedBarChart data={data} title={title} />
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
