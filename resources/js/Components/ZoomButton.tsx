import React, { useState } from 'react';

const ZoomButton = ( {layout, updateLayout} ) => {
    const [minAge, setMinAge] = useState(0);
    const [maxAge, setMaxAge] = useState(110);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const resetParams = () => {
        // Perform the zoom logic with minAge and maxAge values
        console.log('Zooming with min age:', minAge, 'and max age:', maxAge);
        
        const updatedLayout = { ...layout };
        layout.xaxis.range = [minAge - 1.5, maxAge + 1.5]

        // Update the layout using the passed function
        updateLayout(updatedLayout);

        // Reset the dropdown values and hide the dropdown
        setMinAge(minAge);
        setMaxAge(maxAge);
        setDropdownVisible(false);
        
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button style={{ height: "50px" }} onClick={toggleDropdown}>Zoom</button>
            {dropdownVisible && (
                <div className="dropdown"  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%', // Set left to 50%
                    transform: 'translateX(-50%)', // Center the dropdown horizontally
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'purple',
                  }}>
                    <label style={{ width: '100px' }}>
                        Min age:
                        <input style={{ width: '50px', marginTop: '5px' }} type="text" value={minAge} onChange={(e) => setMinAge(e.target.value)} />
                    </label>
                    <label style={{ width: '100px' }}>
                        Max age:
                        <input style={{ width: '50px', marginTop: '5px' }} type="text" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} />
                    </label>
                    <button style={{ width: '60px', marginTop: '5px' }} onClick={resetParams}>Apply</button>
                </div>
            )}
        </div>
    );
};

export default ZoomButton;
