// AnimatedBarChart.tsx
import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import FrameRateControl from "./FrameRateControl";
import ZoomButton from "./ZoomButton";
import "../../css/app.css";
import { FaBackwardStep, FaForwardStep, FaPlay, FaStop } from "react-icons/fa6";
import { GrPowerReset } from "react-icons/gr";
import { Layout as PlotlyLayout } from 'plotly.js';

interface AnimatedBarChartProps {
    data: { [key: number]: Record<string, string> }[] | null;
    title: string;
}

interface DataItem {
    year: number;
    [key: number]: Record<string, string>;
}

interface Data {
    x: string[];
    y: number[];
    type: string;
    name: string;
    marker?: {
        color: string;
    };
    mode?: string;
}

interface Layout {
    font: {
        color: string;
    };
    title: {
        text: string;
        font: {
            color: string;
            size: number;
            family: string;
        };
    };
    titlefont: {
        color: string;
        size: number;
        bold: boolean;
    };
    dragmode: string;
    xaxis: {
        title: {
            text: string;
            font: {
                color: string;
                size: number;
                family: string;
            };
        };
        tickfont: {
            color: string;
            size: number;
            family: string;
        };
        tickmode: string;
        tickformat: string;
        range: number[];
    };
    yaxis: {
        title: {
            text: string;
            font: {
                color: string;
                size: number;
                family: string;
                weight?: string;
            };
        };
        range?: number[];
        tickfont: {
            color: string;
            size: number;
            family: string;
        };
        automargin?: boolean;
    };
    legend?: {
        x: number;
        xanchor: string;
        y: number;
        traceorder: string;
        orientation: string;
        font: {
            color: string;
            size: number;
            family: string;
        };
    };
    autosize: boolean;
    paper_bgcolor: string;
    plot_bgcolor: string;
    responsive: boolean;
    margin?: {  // Add margin property here
        l: number;
        r: number;
        t: number;
        b: number;
    };
}



interface Config {
    displayModeBar: boolean;
    // Add other config options as needed
}

interface XAxisLayout {
    title: {
        text: string;
        font: {
            color: string;
            size: number;
            family: string;
        };
    };
    tickfont: {
        color: string;
        size: number;
        family: string;
    };
    tickmode: string;
    tickformat: string;
    range: number[];
    tickvals?: number[]; // Ensure tickvals is optional
}

const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({ data, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [referenceYear, setReferenceYear] = useState(1941);
    const [referenceData, setReferenceData] = useState<DataItem[]>([]);
    const [currentFrameRate, setCurrentFrameRate] = useState<number>(24);
    const [minAge, setMinAge] = useState(0);
    const [maxAge, setMaxAge] = useState(110);
    const [maxY, setMaxY] = useState(100000)
    const [dropdownValues, setDropdownValues] = useState([minAge, maxAge]);

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

    // Subsequent runs to plot initial data
    useEffect(() => {
        // Assert that data is of type DataItem[]
        const dataArray: DataItem[] = (data as DataItem[]) || []; // Ensure data is treated as DataItem[]
        const subsettedData = dataArray.filter(
            (item) => String(item.year) === String(referenceYear)
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

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setReferenceYear(parseInt(event.target.value, 10)); // Convert the value to an integer
    };

    const resetParams = () => {
        setReferenceYear(1941);
        setCurrentIndex(0);
        setCurrentFrameRate(24);
        setIsAnimating(false)
        setMinAge(0)
        setMaxAge(110)
    };

    const handleFrameRateChange = (newFrameRate: number) => {
        setCurrentFrameRate(newFrameRate);
    };

    // Check if data is available
    if (
        !data ||
        data.length === 0 ||
        !data[currentIndex]
    ) {
        return <div style={{ marginTop: "8px", marginBottom: "8px", color: "white", fontFamily: "Comfortaa", fontWeight: "bold" }}>Loading...</div>;
    }

    // if title changes, 
    interface YearData {
        year: number;
        [key: string]: string | number; // Index signature
    }

    const yearData: YearData = data[currentIndex];
    const keys = Object.keys(yearData).filter((key) => key !== "year");
    const values = keys.map((key) => Number(yearData[key]));

    // Line trace (static)
    let refData = { ...referenceData["0"] }; // don't delete year key from other objects by reference
    // delete refData.year;
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
                    name: "<b>Current Year</b>",
                    marker: {
                        color: '#006400', // Set bar color to a darker blue-green
                    },
                },
                {
                    x: lineKeys,
                    y: lineVals,
                    type: "scatter",
                    mode: "lines",
                    name: "<b>Reference Year</b>",
                    marker: {
                        color: '#800020', // Set bar color to a darker blue-green
                    },
                },
            ],
        },
    ];

    // Set chart y-axis title and range
    if (title.endsWith("Probability")) {
        var reactiveTitle = "<b>Probability<b>";
        // highest toward the end of life
        const deathProbs = data.map(x => Number(x[maxAge])); // Convert to number
        const maxProb = Math.max(...deathProbs);
        const maxY = Math.ceil(maxProb * 10) / 10;
        var optimalRange = [0, maxY];
    } else if (title.endsWith("Expectancy")) {
        // highest life expectancy around age 1
        const lifeExpectancies = data.map(x => Number(x[minAge])); // Convert to number
        const maxLifeExp = Math.max(...lifeExpectancies);
        const maxY = 1.10 * Math.ceil(maxLifeExp * 10) / 10;
        var optimalRange = [0, maxY];
        var reactiveTitle = "<b>Years<b>";
    } else {
        const survivorCount = data.map(x => Number(x[minAge + 1])); // Convert to number
        console.log(survivorCount);
        const maxSurvivorCount = Math.max(...survivorCount);
        var reactiveTitle = "<b>Survivors<b>";
        var optimalRange = [0, maxSurvivorCount];
    }

    // Make plotly only plot integer tick values
    const tickBuffer = 0.5;
    const min = Math.floor(Number(minAge));
    const max = Math.ceil(Number(maxAge));

    const layout: Partial<PlotlyLayout> = {
        font: {
            color: 'white',
        },
        title: {
            text: `<b>${title} in ${Math.floor(yearData.year)}</b>`,
            font: {
                color: 'white',
                size: 24,
                family: 'Comfortaa',
            },
        },
        titlefont: {
            color: 'white',
            size: 24,
        },
        xaxis: {
            title: {
                text: "<b>Age</b>",
                font: {
                    color: 'white',
                    size: 18,
                    family: 'Comfortaa',
                },
            },
            tickfont: {
                color: 'white',
                size: 18,
                family: 'Comfortaa',
            },
            tickmode: 'auto',
            tickformat: 'd',
            range: [Number(minAge) - 0.50, Number(maxAge) + 0.50],
        },
        yaxis: {
            title: {
                text: reactiveTitle,
                font: {
                    color: 'white',
                    size: 18,
                    family: 'Comfortaa',
                },
            },
            range: optimalRange,
            tickfont: {
                color: 'white',
                size: 18,
                family: 'Comfortaa',
            },
            automargin: true,
        },
        legend: {
            x: 0.5,
            xanchor: "center",
            y: 1.125,
            traceorder: "normal",
            orientation: "h",
            font: {
                color: 'white',
                size: 14,
                family: 'Comfortaa',
            },
        },
        autosize: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        // Add any additional properties as needed
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

    // Conditionally change layout to fit small age ranges
    if (Number(maxAge) - Number(minAge) < 6) {
        if (layout.xaxis) {
            layout.xaxis.tickmode = 'array';
            layout.xaxis.tickformat = 'd';
            layout.xaxis.range = [Number(minAge) - 0.50, Number(maxAge) + 0.50];
        } else {
            // If layout.xaxis is undefined, you might want to handle this case accordingly
            console.error('layout.xaxis is undefined');
        }
    }

    return (
        <div>
            <div>
                <label htmlFor="yearDropdown" className="label" style={{ color: "white", marginRight: "10px", fontFamily: "Comfortaa", fontSize: 16, fontWeight: "bold" }}> Select a reference year:</label>
                <select className="dropdown" style={{ width: "130px", marginTop: "5px" }}
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
            <div className="plot-container" style={{ marginBottom: "20px", marginLeft: "10px" }}>
            <Plot
                data={frames[0].data as Plotly.Data[]}
                layout={layout as Partial<Plotly.Layout>}
                config={{ displayModeBar: false }}
            />

            </div>
            <div
                style={{
                    display: "grid",
                    gridAutoFlow: "column", // Set the flow direction to column
                    justifyContent: "center",
                    margin: "10px 5px",
                }}

            >
                <div style={{ marginRight: "10px" }}>
                    {isAnimating ? (
                        // Display FaStop if isAnimating is true
                        <FaStop
                            onClick={onToggleAnimation}
                            style={{
                                fontSize: "2.52rem", // Adjust the font size as needed
                                color: "white",
                                cursor: "pointer",
                                background: "#485965",
                                border: "2px solid skyblue",
                                transition: "transform 0.3s ease, border-color 0.3s ease",
                                borderRadius: '10px',
                                padding: "3px"
                            }}
                            className="hover-effect"
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = "scale(1.15)";
                                e.currentTarget.style.borderColor = "orange";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.borderColor = "skyblue";
                            }}
                        />

                    ) : (
                        // Display FaPlay if isAnimating is false
                        <FaPlay
                            onClick={onToggleAnimation}
                            style={{
                                fontSize: "2.50rem", // Adjust the font size as needed
                                color: "white",
                                cursor: "pointer",
                                background: "#485965",
                                border: "2px solid skyblue",
                                transition: "transform 0.3s ease, border-color 0.3s ease",
                                borderRadius: "10px",
                                padding: "3px"
                            }}
                            className="hover-effect"
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = "scale(1.15)";
                                e.currentTarget.style.borderColor = "orange";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.borderColor = "skyblue";
                            }}
                        />
                    )}
                </div>


                <FaBackwardStep
                    onClick={onPriorFrame}
                    style={{
                        fontSize: "2.52rem", // Adjust the font size as needed
                        color: "white",
                        cursor: "pointer",
                        marginRight: "10px",
                        background: "#485965",
                        border: "2px solid skyblue",
                        transition: "transform 0.3s ease, border-color 0.3s ease",
                        borderRadius: "10px",
                        padding: "3px"
                    }}
                    className="hover-effect"
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = "scale(1.15)";
                        e.currentTarget.style.borderColor = "orange";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.borderColor = "skyblue";
                    }}
                />


                {/* <button onClick={onPriorFrame}>Prior Frame</button> */}
                {/* <button onClick={onNextFrame}>Next Frame</button> */}
                <FaForwardStep
                    onClick={onNextFrame}
                    style={{
                        fontSize: "2.52rem",
                        color: "white",
                        cursor: "pointer",
                        marginRight: "10px",
                        background: "#485965",
                        border: "2px solid skyblue",
                        transition: "transform 0.3s ease, border-color 0.3s ease",
                        borderRadius: "10px",
                        padding: "3px"
                    }}
                    className="hover-effect"
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = "scale(1.15)";
                        e.currentTarget.style.borderColor = "orange";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.borderColor = "skyblue";
                    }}
                />

                <ZoomButton
                    minAge={minAge}
                    maxAge={maxAge}
                    maxY={maxY}
                    onMinAgeChange={setMinAge}
                    onMaxAgeChange={setMaxAge}
                    onMaxYChange={setMaxY}
                    dropdownValues={dropdownValues}
                    layout={layout}
                />

                {/* <button onClick={resetParams}> Reset </button> */}
                <GrPowerReset
                    onClick={resetParams}
                    style={{
                        fontSize: "2.52rem", // Adjust the font size as needed
                        color: "white",
                        cursor: "pointer",
                        transform: "rotate(-180deg) rotateX(180deg)", // Flip 180 degrees on the vertical axis
                        background: "#485965",
                        border: "2px solid skyblue",
                        transition: "transform 0.3s ease, border-color 0.3s ease",
                        marginRight: "10px",
                        borderRadius: "10px",
                        padding: "3px"
                    }}
                    className="hover-effect"
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = "scale(1.15) rotate(-180deg) rotateX(180deg)";
                        e.currentTarget.style.borderColor = "orange";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = "scale(1) rotate(-180deg) rotateX(180deg)";
                        e.currentTarget.style.borderColor = "skyblue";
                    }}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <label htmlFor="frameRateInput" style={{ marginRight: "8px", marginBottom: "8px", color: "white", fontFamily: "Comfortaa", fontWeight: "bold" }}>
                    Frame rate:
                </label>
                <FrameRateControl
                    onChange={handleFrameRateChange}
                    currentFrameRate={currentFrameRate}
                />
                <span style={{ marginLeft: "8px", marginBottom: "8px", color: "white", fontFamily: "Comfortaa", fontWeight: "bold" }}>
                    {currentFrameRate} FPS
                </span>
            </div>
        </div>
    );
};

export default AnimatedBarChart;
