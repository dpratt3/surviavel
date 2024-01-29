// AnimatedBarChart.tsx
import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import FrameRateControl from "./FrameRateControl";
import "../../css/app.css"

interface AnimatedBarChartProps {
    data: { [key: number]: Record<string, string> }[] | null;
}

const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({ data, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [referenceYear, setReferenceYear] = useState(1941);
    const [referenceData, setReferenceData] = useState([]);
    const [forceRerender, setForceRerender] = useState(false);
    const [currentFrameRate, setCurrentFrameRate] = useState<number>(20);

    useEffect(() => {
        let animationInterval: NodeJS.Timeout;

        if (isAnimating) {
            animationInterval = setInterval(() => {
                setCurrentIndex(
                    (current) => (current + 1) % (data ? data.length : 1)
                );
            }, 1000 / currentFrameRate); // Frames per second (equal to denominator)
        }

        return () => {
            clearInterval(animationInterval);
        };
    }, [isAnimating, data, currentFrameRate]);

    // Initial run to populate reference data
    useEffect(() => {
        const dataArray = Object.values(data);
        const subsettedData = dataArray.filter(
            (item) => item.year === String(referenceYear)
        );
        console.log("Subsetted Data:", subsettedData);
        setReferenceData(subsettedData);
    }, []);

    // Subsequent runs to plot initial data
    useEffect(() => {
        const dataArray = Object.values(data);
        const subsettedData = dataArray.filter(
            (item) => item.year === String(referenceYear)
        );
        console.log("Subsetted Data:", subsettedData);
        setReferenceData(subsettedData);
    }, [referenceYear, data]);

    const onNextFrame = () => {
        setCurrentIndex((current) => (current + 1) % (data ? data.length : 1));
    };

    const onPriorFrame = () => {
        setCurrentIndex(
            (current) =>
                (current - 1 + (data ? data.length : 1)) %
                (data ? data.length : 1)
        );
    };

    const onToggleAnimation = () => {
        setIsAnimating((prev) => !prev);
    };      

    const Eligibleyears = Array.from(
        { length: 2020 - 1941 + 1 },
        (_, index) => 1941 + index
    );

    const handleChange = (event) => {
        setReferenceYear(parseInt(event.target.value, 10)); // Convert the value to an integer
    };

    const resetParams = () => {
        setReferenceYear(1941);
        setCurrentIndex(0);
        setCurrentFrameRate(20);
        setIsAnimating(false)
        setForceRerender((prev) => !prev); // Toggle forceRerender to trigger a rerender
    };

    const handleFrameRateChange = (newFrameRate: number) => {
        setCurrentFrameRate(newFrameRate);
    };

    // Check if data is available
    if (
        !data ||
        data.length === 0 ||
        !data[currentIndex] ||
        !data[currentIndex].year
    ) {
        return <div>Loading...</div>;
    }

    // if title changes, 

    const yearData = data[currentIndex];
    const keys = Object.keys(yearData).filter((key) => key !== "year");
    const values = keys.map((key) => Number(yearData[key]));

    // Line trace (static)
    let refData = { ...referenceData["0"] }; // don't delete year key from other objects by reference
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
                    type: "bar",
                    name: "Current Year",
                    marker: {
                        color: '#006400', // Set bar color to a darker blue-green
                      },
                },
                {
                    x: lineKeys,
                    y: lineVals,
                    type: "scatter",
                    mode: "lines",
                    name: "Reference Year",
                    marker: {
                        color: '#800020', // Set bar color to a darker blue-green
                      },
                },
            ],
        },
    ];

    // Set chart y-axis title and range
    if(title.endsWith("Probability")){
        var reactiveTitle = "Probability";
        // highest toward the end of life
        const deathProbs = data.map(x => Number(x[110]));
        const maxProb = Math.max(...deathProbs);
        const maxY = Math.ceil(maxProb * 10) / 10;
        var optimalRange = [0, maxY];
    }else if(title.endsWith("Expectancy")){
        // highest life expectancy around age 1
        const lifeExpectancies = data.map(x => x[1])
        const maxLifeExp = Math.max(...lifeExpectancies)
        const maxY = Math.ceil(maxLifeExp * 10) / 10 + 5;
        var optimalRange = [0, maxY];
        var reactiveTitle = "Years";
    }else{  
        var reactiveTitle = "Survivors";
        var optimalRange = [0, 100000];
    }

    const layout = {
        title: `${title} for ${Math.floor(yearData.year)}`,
        xaxis: {
            title: "Age",
            range: [-1.5, 111.5],
        },
        yaxis: {
            title: reactiveTitle,
            range: optimalRange,
        },
        legend: {
            x: 0.5,
            xanchor: "center",
            y: 1.125,
            traceorder: "normal",
            orientation: "h",
        },
        autosize: false,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        // margin: {
        //     l: 220, // left margin
        //     r: 180, // right margin
        //     t: 100, // top margin
        //     b: 50,  // bottom margin
        // },
        responsive: true, // Enable responsive behavior
    };
    
    // Dynamically adjust margins for cellphones (media alternative query)
    if (window.innerWidth <= 767) {
        layout.margin = {
            l: 220, // left margin
            r: 180, // right margin
            t: 100, // top margin
            b: 50,  // bottom margin
        };
    } else {
        layout.margin = {
            l: 50, // left margin
            r: 25, // right margin
            t: 100, // top margin
            b: 50,  // bottom margin
        };
    }


    return (
        <div>
            <div>
                <label htmlFor="yearDropdown" className="label" style={{ color: "white", marginRight: "5px"}}> Select a reference year:</label>
                <select className="dropdown"
                    id="yearDropdown"
                    value={referenceYear}
                    onChange={handleChange}
                >
                    {Eligibleyears.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
                {/* <p>Selected Year: {referenceYear}</p> */}
            </div>
            <div className="plot-container">
                <Plot
                    data={frames[0].data}
                    layout={layout}
                    config={{ displayModeBar: false }}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    margin: "10px",
                    justifyContent: "center",
                }}
            >
                <button onClick={onPriorFrame}>Prior Frame</button>
                <button onClick={onNextFrame}>Next Frame</button>
                <button className={isAnimating ? "pause-button" : "play-button"} onClick={onToggleAnimation}>
                    {/* {isAnimating
                        ? "Stop Continuous Animation"
                        : "Start Continuous Animation"} */}
                </button>
                <button onClick={resetParams}> Reset </button>
            </div>
            {/* {referenceData.map((item) => (
        <div key={item.year}>
          <div>Year: {item.year}, Value: {item['37']}, Value: {item['77']}</div>
        </div>
      ))} */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <label htmlFor="frameRateInput" style={{ marginRight: "8px", marginBottom: "8px" }}>
                    Frame rate:
                </label>
                <FrameRateControl
                    onChange={handleFrameRateChange}
                    currentFrameRate={currentFrameRate}
                />
                <span style={{ marginLeft: "8px", marginBottom: "8px" }}>
                    {currentFrameRate} FPS
                </span>
            </div>
        </div>
    );
};

export default AnimatedBarChart;
