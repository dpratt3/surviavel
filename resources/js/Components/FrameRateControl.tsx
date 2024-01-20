import React, { useState, ChangeEvent, useEffect } from "react";

interface FrameRateControlProps {
    onChange: (frameRate: number) => void;
    currentFrameRate: number;
}

const FrameRateControl: React.FC<FrameRateControlProps> = ({
    onChange,
    currentFrameRate,
}) => {
    const [frameRate, setFrameRate] = useState<number>(currentFrameRate);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newFrameRate = parseInt(event.target.value, 10);
        setFrameRate(isNaN(newFrameRate) ? 0 : newFrameRate);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLInputElement>) => {
        // Update frame rate while the mouse is moved
        const newFrameRate = parseInt(event.currentTarget.value, 10);
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
            <input
                type="range"
                id="frameRateInput"
                min="1"
                max="80"
                step="1"
                value={frameRate}
                onChange={handleInputChange}
                onMouseMove={handleMouseMove}
                onMouseUp={handleBlur} // Add this to handle the case when the mouse is released
                onBlur={handleBlur}
            />
        </div>
    );
};

export default FrameRateControl;
