import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";

const ZoomButton = ({ minAge, maxAge, onMinAgeChange, onMaxAgeChange}) => {
    const [newMinAge, setNewMinAge] = useState(minAge);
    const [newMaxAge, setNewMaxAge] = useState(maxAge);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    // If reset button is pressed, reset values in dropdown
    useEffect(() => {
        setNewMinAge(minAge);
        setNewMaxAge(maxAge);
    }, [minAge, maxAge]);

    // Gray out button if min-max age range is invalid (min > max) or max > 130
    useEffect(() => {
        const minAge = parseInt(newMinAge);
        const maxAge = parseInt(newMaxAge);
    
        const isInvalidAgeRange = minAge >= maxAge || minAge < 0 || maxAge > 110 || isNaN(minAge) || isNaN(maxAge);
    
        setIsDisabled(isInvalidAgeRange);
    }, [newMinAge, newMaxAge]);
    


    const resetParams = () => {
        // Hide dropdown when apply button is pressed
        setDropdownVisible(!dropdownVisible);
        
        // Update the parent component state using onMinAgeChange and onMaxAgeChange and onMaxYChange
        onMinAgeChange(newMinAge);
        onMaxAgeChange(newMaxAge);

        const updatedLayout = { ...layout };
        layout.xaxis.range = [minAge - 1.5, maxAge + 1.5] // keep bars from getting cut off

        // Update the layout using the passed function
        updateLayout(updatedLayout);
        
    };

    // Disable Apply button if age range is invalid (minAge > maxAge )
    const handleApplyClick = () => {
        if (parseInt(newMinAge) > parseInt(newMaxAge)) {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
            resetParams();
        }
    };


    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <FaSearch
                onClick={toggleDropdown}
                style={{
                    fontSize: "2.30rem", // Adjust the font size as needed
                    color: "white",
                    cursor: "pointer",
                    transform: "rotate(-270deg) rotateX(180deg)", // Rotate and flip
                    background: "#485965",
                    border: "2px solid skyblue",
                    marginRight: "10px",
                    borderRadius: "10px",
                    padding: '5px', // Add padding to the icon
                    boxSizing: 'content-box', // Ensure padding is included within the specified width and height
                }}
                className="hover-effect"
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = "rotate(-270deg) rotateX(180deg) scale(1.15)";
                    e.currentTarget.style.borderColor = "orange";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = "rotate(-270deg) rotateX(180deg) scale(1)";
                    e.currentTarget.style.borderColor = "skyblue";
                }}
            />

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
                        backgroundColor: '#F5F5F5',
                    }}
                >
                    <label style={{ width: '100px', marginTop: '5px', marginBottom: '2px' }}>
                        Min age:
                        <input
                            style={{ width: '50px' }}
                            type="text"
                            value={newMinAge}
                            onChange={(e) => setNewMinAge(e.target.value)}
                        />
                    </label>
                    <label style={{ width: '100px', marginTop: '5px', marginBottom: '2px'  }}>
                        Max age:
                        <input
                            style={{ width: '50px'}}
                            type="text"
                            value={newMaxAge}
                            onChange={(e) => setNewMaxAge(e.target.value)}
                        />
                    </label>

                    <button
                        style={{
                            width: '60px',
                            padding: '8px',
                            fontSize: '1rem',
                            color: 'white',
                            cursor: 'pointer',
                            background: "#485965",
                            border: '2px solid #FF007B', /* Border color similar to the gradient */
                            borderRadius: '10px',
                            transition: 'transform 0.3s ease, border-color 0.3s ease',
                            marginTop: '3px',
                            opacity: isDisabled ? 0.25 : 1,
                        }}
                        onClick={handleApplyClick}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.borderColor = 'orange';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.borderColor = '#FF007B';
                        }}
                    >
                        Apply
                    </button>

                </div>
            )}
        </div>
    );
};

export default ZoomButton;
