import React, { useState } from 'react';

const ZoomButton = ({ minAge, maxAge, onMinAgeChange, onMaxAgeChange }) => {
  const [newMinAge, setNewMinAge] = useState(minAge);
  const [newMaxAge, setNewMaxAge] = useState(maxAge);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const resetParams = () => {
    // Perform the zoom logic with newMinAge and newMaxAge values
    console.log('Zooming with min age:', newMinAge, 'and max age:', newMaxAge);

    // Update the parent component state using onMinAgeChange and onMaxAgeChange
    onMinAgeChange(newMinAge);
    onMaxAgeChange(newMaxAge);

    // Reset the dropdown values and hide the dropdown
    setDropdownVisible(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button style={{ height: '50px' }} onClick={toggleDropdown}>
        Zoom
      </button>
      {dropdownVisible && (
        <div
          className="dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%', // Set to 50% to center horizontally
            transform: 'translateX(-50%)', // Center the dropdown
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'purple',
          }}
        >
          <label style={{ width: '100px' }}>
            Min age:
            <input
              style={{ width: '50px', marginTop: '5px' }}
              type="text"
              value={newMinAge}
              onChange={(e) => setNewMinAge(e.target.value)}
            />
          </label>
          <label style={{ width: '100px' }}>
            Max age:
            <input
              style={{ width: '50px', marginTop: '5px' }}
              type="text"
              value={newMaxAge}
              onChange={(e) => setNewMaxAge(e.target.value)}
            />
          </label>
          <button style={{ width: '60px', marginTop: '5px' }} onClick={resetParams}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default ZoomButton;
