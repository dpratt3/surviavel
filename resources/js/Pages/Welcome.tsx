import React, { useEffect, useState, ChangeEvent } from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import axios from 'axios';
import AnimatedBarChart from '../Components/AnimatedBarChart';
import '../../css/app.css';

interface DataItem {
  year: number;
  [key: number]: Record<string, string>;
}

interface AnimatedBarChartProps {
  data: DataItem[];
  title: string;
}

const App = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('female-number-of-lives-interpolated');
  const [loading, setLoading] = useState<boolean>(false);

  const titleMap: { [key: string]: string } = {
    'female-life-expectancy-interpolated': 'Female Life Expectancy',
    'female-death-probability-interpolated': 'Female Death Probability',
    'female-number-of-lives-interpolated': 'Female Number of Lives',
    'male-life-expectancy-interpolated': 'Male Life Expectancy',
    'male-number-of-lives-interpolated': 'Male Number of Lives',
    'male-death-probability-interpolated': 'Male Death Probability',
  };

  const title = titleMap[selectedOption];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<DataItem[]>(`http://localhost:8000/api/${selectedOption}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedOption]);

  const handleDropdownChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'Comfortaa' }}>Survivorage</h1>
      <label style={{ color: 'white' }}>
        <span style={{ marginRight: '10px', fontFamily: 'Comfortaa', fontSize: 16, fontWeight: 'bold' }}>Select a series:</span>
        <select className="dropdown" style={{ width: '200px' }} value={selectedOption} onChange={handleDropdownChange}>
          <option value="female-life-expectancy-interpolated">Female Life Expectancy</option>
          <option value="female-death-probability-interpolated">Female Death Probability</option>
          <option value="female-number-of-lives-interpolated">Female Number of Lives</option>
          <option value="male-life-expectancy-interpolated">Male Life Expectancy</option>
          <option value="male-number-of-lives-interpolated">Male Number of Lives</option>
          <option value="male-death-probability-interpolated">Male Death Probability</option>
        </select>
      </label>

      {loading && <div style={{ marginTop: '8px', marginBottom: '8px', color: 'white', fontFamily: 'Comfortaa', fontWeight: 'bold' }}>Loading...</div>}

      {!loading && data.length > 0 && (
        <div>
          <div style={{ margin: 'auto', width: '50%' }}>
            <AnimatedBarChart data={data} title={title} />
          </div>
          <div className="container">
            Data is from the <a href="https://site.demog.berkeley.edu/" className="link">Berkeley Mortality Database</a> (1941-2003)
            <div style={{ marginTop: '10px' }}>
              and the <a href="https://www.ssa.gov/oact/STATS/table4c6.html" className="link">Social Security Administration</a> (2004-2020)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Include Google Fonts stylesheet directly in the component
const Head = () => (
  <head>
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap" rel="stylesheet" />
  </head>
);

const appElement = document.getElementById('app');

if (appElement) {
  createRoot(appElement).render( // Use createRoot instead of ReactDOM.render
    <>
      <Head />
      <App />
    </>,
  );
} else {
  console.error("Element with ID 'app' not found in the DOM.");
}
