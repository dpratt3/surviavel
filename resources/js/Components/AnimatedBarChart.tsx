// AnimatedBarChart.tsx
import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

interface AnimatedBarChartProps {
  data: { [key: number]: Record<string, string> }[] | null;
}

const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({ data, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [referenceYear, setReferenceYear] = useState(2004);
  const [referenceData, setReferenceData] = useState([]);

  useEffect(() => {
    let animationInterval: NodeJS.Timeout;

    if (isAnimating) {
      animationInterval = setInterval(() => {
        setCurrentIndex((current) => (current + 1) % (data ? data.length : 1));
      }, 1000/10); // Frames per second (equal to denominator)
    }

    return () => {
      clearInterval(animationInterval);
    };
  }, [isAnimating, data]);

  // Initial run to populate reference data
  useEffect(() => {
    const dataArray = Object.values(data);
    const subsettedData = dataArray.filter((item) => item.year === String(referenceYear));
    console.log('Subsetted Data:', subsettedData);
    setReferenceData(subsettedData);
  }, []);

  // Subsequent runs to plot initial data
  useEffect(() => {
    const dataArray = Object.values(data);
    const subsettedData = dataArray.filter((item) => item.year === String(referenceYear));
    console.log('Subsetted Data:', subsettedData);
    setReferenceData(subsettedData);
  }, [referenceYear, data]);

  const onNextFrame = () => {
    setCurrentIndex((current) => (current + 1) % (data ? data.length : 1));
  };

  const onPriorFrame = () => {
    setCurrentIndex((current) => (current - 1 + (data ? data.length : 1)) % (data ? data.length : 1));
  };
  

  const onToggleAnimation = () => {
    setIsAnimating((prev) => !prev);
  };

  const Eligibleyears = Array.from({ length: 2020 - 2004 + 1 }, (_, index) => 2004 + index);

  const handleChange = (event) => {
    setReferenceYear(parseInt(event.target.value, 10)); // Convert the value to an integer
  };

  // Check if data is available
  if (!data || data.length === 0 || !data[currentIndex] || !data[currentIndex].year) {
    return <div>Loading...</div>;
  }

  const yearData = data[currentIndex];
  const keys = Object.keys(yearData).filter((key) => key !== 'year');
  const values = keys.map((key) => Number(yearData[key]));

  // Line trace (static)
  let refData = { ...referenceData['0'] }; // don't delete year key from other objects by reference
  delete refData.year;
  let lineKeys = Object.keys(refData);
  let lineVals = Object.values(refData);

  const frames = [
    {
      name: `Bar Chart ${currentIndex}`,
      data: [
        {
          x: keys,
          y: values,
          type: 'bar',
          name: 'Current Year',
        },
        {
          x: lineKeys,
          y: lineVals,
          type: 'scatter',
          mode: 'lines',
          name: 'Reference Year',
        },
      ],
    },
  ];

  const layout = {
    title: `${title} for ${Math.floor(yearData.year)}`,
    xaxis: {
      title: 'Values',
      range: [0, 120],
    },
    yaxis: {
      title: 'Count',
      //range: [0, 100000]
    },
    legend: {
      x: 0.5,
      xanchor: 'center', 
      y: 1.125, // Set y to a value less than 1 to position the legend at the bottom
      traceorder: 'normal', // Set the trace order in the legend
      orientation: 'h', // Set the orientation to horizontal
    },
  };

  return (
    <div>
      <div>
        <label htmlFor="yearDropdown">Select a Year:</label>
        <select id="yearDropdown" value={referenceYear} onChange={handleChange}>
          {Eligibleyears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        {/* <p>Selected Year: {referenceYear}</p> */}
      </div>
      <Plot data={frames[0].data} layout={layout} config={{ displayModeBar: false }} />
      
      <div style={{ display: 'flex', margin: '10px', justifyContent: 'center' }}>
        <button onClick={onPriorFrame}>Prior Frame</button>
        <button onClick={onNextFrame}>Next Frame</button>
        <button onClick={onToggleAnimation}>
          {isAnimating ? 'Stop Continuous Animation' : 'Start Continuous Animation'}
        </button>
      </div>
      {/* {referenceData.map((item) => (
        <div key={item.year}>
          <div>Year: {item.year}, Value: {item['37']}, Value: {item['77']}</div>
        </div>
      ))} */}
    </div>
  );
};

export default AnimatedBarChart;
