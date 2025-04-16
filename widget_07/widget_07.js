document.addEventListener('DOMContentLoaded', async function () {
    console.log('datetime: ', datetime);

    let setBaseUrl = null;
    if (cda === "internal") {
        setBaseUrl = `https://wm.${office.toLowerCase()}.ds.usace.army.mil/${office.toLowerCase()}-data/`;
    } else if (cda === "internal-coop") {
        setBaseUrl = `https://wm-${office.toLowerCase()}coop.mvk.ds.usace.army.mil/${office.toLowerCase()}-data/`;
    } else if (cda === "public") {
        setBaseUrl = `https://cwms-data.usace.army.mil/cwms-data/`;
    }
    console.log("setBaseUrl: ", setBaseUrl);

    const [month, day, year] = datetime.split('-');

    // Generate ISO strings for the previous 7 days and today
    const isoDateMinus2Years = getIsoDateWithOffsetDynamic(year, month, day, -730);
    const isoDateMinus8Days = getIsoDateWithOffsetDynamic(year, month, day, -8);
    const isoDateMinus7Days = getIsoDateWithOffsetDynamic(year, month, day, -7);
    const isoDateMinus6Days = getIsoDateWithOffsetDynamic(year, month, day, -6);
    const isoDateMinus5Days = getIsoDateWithOffsetDynamic(year, month, day, -5);
    const isoDateMinus4Days = getIsoDateWithOffsetDynamic(year, month, day, -4);
    const isoDateMinus3Days = getIsoDateWithOffsetDynamic(year, month, day, -3);
    const isoDateMinus2Days = getIsoDateWithOffsetDynamic(year, month, day, -2);
    const isoDateMinus1Day = getIsoDateWithOffsetDynamic(year, month, day, -1);
    const isoDateToday = getIsoDateWithOffsetDynamic(year, month, day, 0);

    // Generate ISO strings for the next 7 days
    const isoDateDay1 = getIsoDateWithOffsetDynamic(year, month, day, 1);
    const isoDateDay2 = getIsoDateWithOffsetDynamic(year, month, day, 2);
    const isoDateDay3 = getIsoDateWithOffsetDynamic(year, month, day, 3);
    const isoDateDay4 = getIsoDateWithOffsetDynamic(year, month, day, 4);
    const isoDateDay5 = getIsoDateWithOffsetDynamic(year, month, day, 5);
    const isoDateDay6 = getIsoDateWithOffsetDynamic(year, month, day, 6);
    const isoDateDay7 = getIsoDateWithOffsetDynamic(year, month, day, 7);

    console.log("isoDateMinus8Days:", isoDateMinus8Days);
    console.log("isoDateMinus7Days:", isoDateMinus7Days);
    console.log("isoDateMinus6Days:", isoDateMinus6Days);
    console.log("isoDateMinus5Days:", isoDateMinus5Days);
    console.log("isoDateMinus4Days:", isoDateMinus4Days);
    console.log("isoDateMinus3Days:", isoDateMinus3Days);
    console.log("isoDateMinus2Days:", isoDateMinus2Days);
    console.log("isoDateMinus1Day:", isoDateMinus1Day);
    console.log("isoDateToday:", isoDateToday);
    console.log("isoDateDay1:", isoDateDay1);
    console.log("isoDateDay2:", isoDateDay2);
    console.log("isoDateDay3:", isoDateDay3);
    console.log("isoDateDay4:", isoDateDay4);
    console.log("isoDateDay5:", isoDateDay5);
    console.log("isoDateDay6:", isoDateDay6);
    console.log("isoDateDay7:", isoDateDay7);

    const urlTsidConsensus = `${setBaseUrl}timeseries/group/Consensus-Test?office=${office}&category-id=${lake}`;
    const urlTsidComputedInflow = `${setBaseUrl}timeseries/group/Computed-Inflow?office=${office}&category-id=${lake}`;

    const fetchTimeSeriesData = async (tsid) => {
        const tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateMinus2Years}&end=${isoDateToday}&office=${office}`;
        console.log('tsidData:', tsidData);
        try {
            const response = await fetch(tsidData, {
                headers: {
                    "Accept": "application/json;version=2", // Ensuring the correct version is used
                    "cache-control": "no-cache"
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching time series data:", error);
        }
    };

    const fetchTsidData = async () => {
        try {
            const response4 = await fetch(urlTsidConsensus);
            const response5 = await fetch(urlTsidComputedInflow);

            const tsidConsensusData = await response4.json();
            const tsidComputedInflowData = await response5.json();

            // Extract the timeseries-id from the response
            const tsidConsensus = tsidConsensusData['assigned-time-series'][0]['timeseries-id']; // Grab the first timeseries-id
            const tsidComputedInflow = tsidComputedInflowData['assigned-time-series'][0]['timeseries-id']; // Grab the first timeseries-id

            console.log("tsidConsensus:", tsidConsensus);
            console.log("tsidComputedInflow:", tsidComputedInflow);

            // Fetch time series data using tsid values
            const timeSeriesData3 = await fetchTimeSeriesData(tsidConsensus);
            const timeSeriesData4 = await fetchTimeSeriesData(tsidComputedInflow);

            console.log("timeSeriesData3:", timeSeriesData3);
            console.log("timeSeriesData4:", timeSeriesData4);

            // Call getHourlyDataOnTopOfHour for both time series data
            const hourlyConsensusData = getMidnightData(timeSeriesData3, tsidConsensus);
            const hourlyComputedInflowData = getMidnightData(timeSeriesData4, tsidComputedInflow);

            console.log("hourlyConsensusData:", hourlyConsensusData);
            console.log("hourlyComputedInflowData:", hourlyComputedInflowData);

            let formattedConsensusData = hourlyConsensusData.map(entry => {
                const formattedTimestamp = formatISODate2ReadableDate(Number(entry.timestamp)); // Ensure timestamp is a number
                return {
                    ...entry,
                    formattedTimestamp
                };
            });

            let formattedComputedInflowData = hourlyComputedInflowData.map(entry => {
                const formattedTimestamp = formatISODate2ReadableDate(Number(entry.timestamp)); // Ensure timestamp is a number
                return {
                    ...entry,
                    formattedTimestamp
                };
            });

            console.log("formattedConsensusData:", formattedConsensusData);
            console.log("formattedComputedInflowData:", formattedComputedInflowData);

            function createTableAvg(formattedConsensusData, formattedComputedInflowData) {
                // Find the most recent consensus data point with qualityCode === 5
                const latestEntry = formattedConsensusData
                    .filter(d => d.qualityCode === 5)
                    .reduce((latest, current) =>
                        new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest,
                        { timestamp: 0 }
                    );

                const latestTimestamp = new Date(latestEntry.timestamp).getTime();
                const formattedDateTime = latestEntry.formattedTimestamp.split(' ')[0]; // includes date and time
                console.log("Latest Timestamp:", formattedDateTime);

                // Sum values after the latest consensus timestamp
                const sumConsensusAfter = formattedConsensusData
                    .filter(d => new Date(d.timestamp).getTime() > latestTimestamp)
                    .reduce((sum, d) => sum + d.value, 0);

                const sumComputedInflowAfter = formattedComputedInflowData
                    .filter(entry => entry.timestamp > latestTimestamp)
                    .reduce((sum, entry) => sum + entry.value, 0);

                console.log("Sum (Consensus After):", sumConsensusAfter);
                console.log("Sum (Computed Inflow After):", sumComputedInflowAfter);

                // Create table
                const table = document.createElement("table");
                table.id = "gate-settings";
                table.style.margin = "10px 0";

                // Add table title
                const titleRow = table.insertRow();
                const titleCell = document.createElement("th");
                titleCell.colSpan = 3;
                titleCell.style.fontWeight = "bold";
                titleCell.style.fontSize = "1.2em";
                titleCell.textContent = "Balance Window";
                titleRow.appendChild(titleCell);

                // Add header row
                const headerRow = table.insertRow();
                ["Date of Last Balance", "Sum of Computed Inflow", "Sum of Consensus Inflow"].forEach(text => {
                    const cell = headerRow.insertCell();
                    cell.textContent = text;
                    cell.style.fontWeight = "bold";
                });

                // Add data row
                const dataRow = table.insertRow();
                [formattedDateTime, sumComputedInflowAfter, sumConsensusAfter].forEach(value => {
                    const cell = dataRow.insertCell();
                    cell.textContent = typeof value === 'number' ? parseFloat(value).toFixed(0) : value;
                });

                // Insert table into DOM
                const outputDiv = document.getElementById("output7");
                outputDiv.appendChild(table);

                // Create a button element
                const button = document.createElement('button');

                // Set the button text
                button.textContent = 'Balance Inflow Module';

                // Optionally add an ID or class
                button.id = 'myButton';
                button.className = 'btn';

                // Append the button to the same container (output7)
                outputDiv.appendChild(button);

            }

            // Call the function
            createTableAvg(formattedConsensusData, formattedComputedInflowData);
        } catch (error) {
            console.error("Error fetching tsid data:", error);
        }
    };

    fetchTsidData();

    function formatISODate2ReadableDate(timestamp) {
        if (typeof timestamp !== "number") {
            console.error("Invalid timestamp:", timestamp);
            return "Invalid Date";
        }

        const date = new Date(timestamp); // Ensure timestamp is in milliseconds
        if (isNaN(date.getTime())) {
            console.error("Invalid date conversion:", timestamp);
            return "Invalid Date";
        }

        const mm = String(date.getMonth() + 1).padStart(2, '0'); // Month
        const dd = String(date.getDate()).padStart(2, '0'); // Day
        const yyyy = date.getFullYear(); // Year
        const hh = String(date.getHours()).padStart(2, '0'); // Hours
        const min = String(date.getMinutes()).padStart(2, '0'); // Minutes
        return `${mm}-${dd}-${yyyy} ${hh}:${min}`;
    }

    function getHourlyDataOnTopOfHour(data, tsid) {
        const hourlyData = [];

        data.values.forEach(entry => {
            const [timestamp, value, qualityCode] = entry;

            // Normalize the timestamp
            let date;
            if (typeof timestamp === "string") {
                date = new Date(timestamp.replace(/-/g, '/')); // Replace hyphens with slashes for iOS
            } else if (typeof timestamp === "number") {
                date = new Date(timestamp); // Assume it's a UNIX timestamp
            } else {
                console.warn("Unrecognized timestamp format:", timestamp);
                return; // Skip invalid entries
            }

            // Validate date
            if (isNaN(date.getTime())) {
                console.warn("Invalid date:", timestamp);
                return; // Skip invalid dates
            }

            // Check if the time is exactly at the top of the hour
            if (date.getMinutes() === 0 && date.getSeconds() === 0) {
                hourlyData.push({ timestamp, value, qualityCode, tsid });
            }
        });

        return hourlyData;
    };

    function getMidnightData(data, tsid) {
        const midnightData = [];

        data.values.forEach(entry => {
            const [timestamp, value, qualityCode] = entry;

            // Normalize the timestamp
            let date;
            if (typeof timestamp === "string") {
                date = new Date(timestamp.replace(/-/g, '/')); // Replace hyphens with slashes for iOS
            } else if (typeof timestamp === "number") {
                date = new Date(timestamp); // Assume it's a UNIX timestamp
            } else {
                console.warn("Unrecognized timestamp format:", timestamp);
                return; // Skip invalid entries
            }

            // Validate date
            if (isNaN(date.getTime())) {
                console.warn("Invalid date:", timestamp);
                return; // Skip invalid dates
            }

            // Check if the time is exactly midnight (00:00:00)
            if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0) {
                midnightData.push({ timestamp, value, qualityCode, tsid });
            }
        });

        return midnightData;
    };

    function subtractHoursFromDate(date, hoursToSubtract) {
        return new Date(date.getTime() - (hoursToSubtract * 60 * 60 * 1000));
    }



    function formatISODateToUTCString(timestamp) {
        if (typeof timestamp !== "number") {
            console.error("Invalid timestamp:", timestamp);
            return "Invalid Date";
        }

        const date = new Date(timestamp); // Ensure timestamp is in milliseconds
        if (isNaN(date.getTime())) {
            console.error("Invalid date conversion:", timestamp);
            return "Invalid Date";
        }

        return date.toISOString().replace(/\.\d{3}Z$/, 'Z'); // Removes milliseconds
    }

    function formatISODateToCSTString(timestamp) {
        if (typeof timestamp !== "number") {
            console.error("Invalid timestamp:", timestamp);
            return "Invalid Date";
        }

        const date = new Date(timestamp); // Ensure timestamp is in milliseconds
        if (isNaN(date.getTime())) {
            console.error("Invalid date conversion:", timestamp);
            return "Invalid Date";
        }

        // Convert to CST (Central Standard Time)
        const options = {
            timeZone: 'America/Chicago',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };

        const formatter = new Intl.DateTimeFormat('en-US', options);
        const formattedDate = formatter.format(date);

        return formattedDate.replace(',', ''); // Removes the comma between date and time
    }

    function getIsoDateWithOffsetDynamic(year, month, day, offset) {
        // Create a date object at 6 AM UTC
        const date = new Date(Date.UTC(year, month - 1, day, 6, 0, 0, 0));

        // Get the timezone offset dynamically based on CST/CDT
        const localTime = new Date(date.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
        const timeOffset = (date.getTime() - localTime.getTime()) / (60 * 1000); // Offset in minutes

        // Adjust to 5 AM if not in daylight saving time
        if (localTime.getHours() !== 6) {
            date.setUTCHours(5);
        }

        // Adjust for the offset in days
        date.setUTCDate(date.getUTCDate() + offset);

        // Adjust for the timezone offset
        date.setMinutes(date.getMinutes() + timeOffset);

        // Return the ISO string
        return date.toISOString();
    }

    function getDSTOffsetInHours() {
        // Get the current date
        const now = new Date();

        // Get the current time zone offset in minutes (with DST, if applicable)
        const currentOffset = now.getTimezoneOffset();

        // Convert the offset from minutes to hours
        const dstOffsetHours = currentOffset / 60;

        return dstOffsetHours; // Returns the offset in hours (e.g., -5 or -6)
    }

    function filterPayloads(payloads) {
        let filteredPayloads = {};

        for (const key in payloads) {
            if (payloads.hasOwnProperty(key)) {
                let filteredValues = payloads[key].values.filter(entry => !entry[0].includes("T04:59:00.000Z"));

                if (filteredValues.length > 0) {
                    filteredPayloads[key] = {
                        ...payloads[key],
                        values: filteredValues
                    };
                }
            }
        }

        return filteredPayloads;
    }

    function convertUnixTimestamp(timestamp, toCST = false) {
        if (typeof timestamp !== "number") {
            console.error("Invalid timestamp:", timestamp);
            return "Invalid Date";
        }

        const dateUTC = new Date(timestamp); // Convert milliseconds to Date object
        if (isNaN(dateUTC.getTime())) {
            console.error("Invalid date conversion:", timestamp);
            return "Invalid Date";
        }

        if (!toCST) {
            return dateUTC.toISOString(); // Return UTC time
        }

        // Convert to CST/CDT (America/Chicago) while adjusting for daylight saving time
        const options = { timeZone: "America/Chicago", hour12: false };
        const cstDateString = dateUTC.toLocaleString("en-US", options);
        const cstDate = new Date(cstDateString + " UTC"); // Convert back to Date

        return cstDate.toISOString();
    }

    function addDeltaAsDsfToData(data) {
        return data.map((entry, index) => {
            if (index === 0) {
                return { ...entry, delta: null };
            }
            const delta = (entry.value - data[index - 1].value) / 1.9834591996927;
            return { ...entry, delta };
        });
    }

    function shiftDeltaUp(data) {
        for (let i = 0; i < data.length - 1; i++) {
            data[i].delta = data[i + 1].delta;
        }
        // Optional: set the last delta to null since there's no next value
        data[data.length - 1].delta = null;
        return data;
    }

    function getEvapValueForMonth(data, month) {
        // Convert string or number month to integer and adjust for 0-based offset
        const offset = parseInt(month, 10) - 1;
        console.log("offset: ", offset)

        const matchingValue = data[`seasonal-values`].find(
            (entry) => entry[`offset-months`] === offset
        );
        console.log("matchingValue: ", matchingValue)

        return matchingValue ? matchingValue.value : null;
    }
});