// AnimatedBarChart.tsx
import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

interface AnimatedBarChartProps {
  data: { [key: number]: Record<string, string> }[] | null;
}

const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let animationInterval: NodeJS.Timeout;

    if (isAnimating) {
      animationInterval = setInterval(() => {
        setCurrentIndex(current => (current + 1) % (data ? data.length : 1));
      }, 1000/50 ); // Frames per second (equal to denominator)
    }

    return () => {
      clearInterval(animationInterval);
    };
  }, [isAnimating, data]);

  const onNextFrame = () => {
    setCurrentIndex(current => (current + 1) % (data ? data.length : 1));
  };

  const onToggleAnimation = () => {
    setIsAnimating(prev => !prev);
  };

  // Check if data is available
  if (!data || data.length === 0 || !data[currentIndex] || !data[currentIndex].year) {
    return <div>Loading...</div>;
  }

  const yearData = data[currentIndex];
  const keys = Object.keys(yearData).filter(key => key !== 'year');
  const values = keys.map(key => Number(yearData[key]));

  const frames = [
    {
      name: `Frame ${currentIndex}`,
      data: [
        {
          x: keys,
          y: values,
          type: 'bar',
        },
      ],
    },
  ];

  const layout = {
    title: `Bar Chart for ${ Math.floor(yearData.year)}`,
    xaxis: {
      title: 'Values',
    },
    yaxis: {
      title: 'Count',
    },
  };

  return (
    <div>
      <Plot data={frames[0].data} layout={layout} config={{ displayModeBar: false }} />
      <button onClick={onNextFrame}>Next Frame</button>
      <button onClick={onToggleAnimation}>
        {isAnimating ? 'Stop Continuous Animation' : 'Start Continuous Animation'}
      </button>
    </div>
  );
};

export default AnimatedBarChart;
