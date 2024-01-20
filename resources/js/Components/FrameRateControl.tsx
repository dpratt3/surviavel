// FrameRateControl.tsx
import React, { useState, ChangeEvent } from 'react';
import { useEffect } from 'react';

interface FrameRateControlProps {
  onChange: (frameRate: number) => void;
}

const FrameRateControl: React.FC<FrameRateControlProps> = ({ onChange, currentFrameRate }) => {
  const [frameRate, setFrameRate] = useState<number>(currentFrameRate);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFrameRate = parseInt(event.target.value, 10);
    setFrameRate(isNaN(newFrameRate) ? 0 : newFrameRate);
  };

  useEffect(() => {
    setFrameRate(currentFrameRate);
  }, [currentFrameRate]);

  const handleBlur = () => {
    onChange(frameRate);
  };

  return (
    <div>
      <label htmlFor="frameRateInput">Frame Rate:</label>
      <input
        type="range"
        id="frameRateInput"
        min="1"
        max="60"
        step="1"
        value={frameRate}
        onChange={handleInputChange}
        onBlur={handleBlur}
      />
      <span>{frameRate} FPS</span>
    </div>
  );
};

export default FrameRateControl;
