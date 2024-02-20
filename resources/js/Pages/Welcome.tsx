import React, { useEffect, useState, ChangeEvent } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import AnimatedBarChart from '../Components/AnimatedBarChart';
import { usePage } from '@inertiajs/react'; // Import usePage hook
import { Helmet } from 'react-helmet';
import ReactGA from "react-ga4";

ReactGA.initialize("G-X9ZPTD9PEL");

ReactGA.event({
  action: "animation_interaction",
  category: "Survival Statistics Animation",
  label: "Started Animation"
});

// Example event tracking for data filter interactions
ReactGA.event({
  action: "data_filter_interaction",
  category: "Survival Statistics Filter",
  label: "Selected Dataset"
});

// Example event tracking for downloads
ReactGA.event({
  action: "download",
  category: "Survival Statistics Download",
  label: "Downloaded Image"
});

// Example event tracking for external link clicks
ReactGA.event({
  action: "external_link_click",
  category: "Link Interaction",
  label: "Clicked External Link"
});


interface DataItem {
  year: number;
  [key: number]: Record<string, string>;
}

interface AnimatedBarChartProps {
  data: DataItem[];
  title: string;
}

const Welcome = () => {
  const { appUrl } = usePage().props; // Access shared data
  const [data, setData] = useState<DataItem[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('female-number-of-lives-interpolated');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


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
        const response = await axios.get<DataItem[]>(`${appUrl}/api/${selectedOption}`);
        setData(response.data);
        setError(null); // Reset error state if successful
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again later.'); // Set error message
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
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap" rel="stylesheet" />
      </Helmet>
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

      {error && <div style={{ marginTop: '8px', marginBottom: '8px', color: 'red', fontFamily: 'Comfortaa', fontWeight: 'bold' }}>{error}</div>}

      {!loading && !error && data.length > 0 && (
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

export default Welcome;