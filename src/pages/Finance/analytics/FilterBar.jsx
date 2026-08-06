import { Calendar, Filter, RotateCcw } from "lucide-react";
import "./FilterBar.css";

function FilterBar({

    range,
    setRange,

    startDate,
    setStartDate,

    endDate,
    setEndDate,

}) {

    const handleRangeChange = (e) => {

        const value = e.target.value;

        setRange(value);

        if (value !== "custom") {

            setStartDate("");
            setEndDate("");

        }

    };

    const handleReset = () => {

        setRange("all");

        setStartDate("");

        setEndDate("");

    };

    return (

        <div className="analytics-filter">

            {/* Left Side */}

            <div className="analytics-filter-left">

                <div className="filter-select">

                    <Filter size={18} />

                    <select
                        value={range}
                        onChange={handleRangeChange}
                    >

                        <option value="all">
                            All Time
                        </option>

                        <option value="7">
                            Last 7 Days
                        </option>

                        <option value="30">
                            Last 30 Days
                        </option>

                        <option value="90">
                            Last 3 Months
                        </option>

                        <option value="180">
                            Last 6 Months
                        </option>

                        <option value="365">
                            Last 1 Year
                        </option>

                        <option value="custom">
                            Custom Range
                        </option>

                    </select>

                </div>

            </div>

            {/* Center */}

            {range === "custom" && (

                <div className="analytics-custom-date">

                    <div className="date-box">

                        <Calendar size={18} />

                        <div className="date-content">

                            <label>
                                Start Date
                            </label>

                            <input
                                type="date"
                                value={startDate}
                                max={endDate || ""}
                                onChange={(e) =>
                                    setStartDate(e.target.value)
                                }
                            />

                        </div>

                    </div>

                    <div className="date-box">

                        <Calendar size={18} />

                        <div className="date-content">

                            <label>
                                End Date
                            </label>

                            <input
                                type="date"
                                value={endDate}
                                min={startDate || ""}
                                onChange={(e) =>
                                    setEndDate(e.target.value)
                                }
                            />

                        </div>

                    </div>

                </div>

            )}

            {/* Right */}

            <button

                className="reset-filter"

                type="button"

                onClick={handleReset}

            >

                <RotateCcw size={18} />

                <span>

                    Reset

                </span>

            </button>

        </div>

    );

}

export default FilterBar;