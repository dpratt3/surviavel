import React from "react";
import "../../css/app.css";

const AnimationControls = ({
    onPriorFrame,
    onNextFrame,
    onToggleAnimation,
    isAnimating,
    resetParams,
}) => {
    return (
        <div className="button-container">
            <button
                onClick={onToggleAnimation}
                className={`${
                    isAnimating ? "bg-red-500" : "bg-green-500"
                } text-white p-4 rounded-full inline-flex items-center align-middle space-x-2`}
            >
                {isAnimating ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                )}
                {/* {isAnimating
    ? "Stop Animation"
    : "Start Animation"} */}
            </button>

            <button onClick={onPriorFrame} className="btn">
                Prior Frame
            </button>
            <button onClick={onNextFrame} className="btn">
                Next Frame
            </button>
            <button onClick={resetParams} className="btn">
                Reset
            </button>
        </div>
    );
};

export default AnimationControls;
