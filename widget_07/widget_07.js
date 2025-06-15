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
    const isoDateMinus2Years = getIsoDateWithOffsetDynamic(year, month, day, -720);
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
        const tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateMinus2Years}&end=${isoDateToday}&office=${office}&page-size=1000000`;
        console.log('tsidData:', tsidData);
        try {
            const response = await fetch(tsidData, {
                headers: {
                    "Accept": "application/json;version=2",
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

            const tsidConsensus = tsidConsensusData['assigned-time-series'][0]['timeseries-id'];
            const tsidComputedInflow = tsidComputedInflowData['assigned-time-series'][0]['timeseries-id'];

            console.log("tsidConsensus:", tsidConsensus);
            console.log("tsidComputedInflow:", tsidComputedInflow);

            const timeSeriesData1 = await fetchTimeSeriesData(tsidConsensus);
            const timeSeriesData2 = await fetchTimeSeriesData(tsidComputedInflow);

            console.log("timeSeriesData1:", timeSeriesData1);
            console.log("timeSeriesData2:", timeSeriesData2);

            const hourlyConsensusData = getMidnightData(timeSeriesData1, tsidConsensus);
            const hourlyComputedInflowData = getMidnightData(timeSeriesData2, tsidComputedInflow);

            console.log("hourlyConsensusData:", hourlyConsensusData);
            console.log("hourlyComputedInflowData:", hourlyComputedInflowData);

            let formattedConsensusData = hourlyConsensusData.map(entry => {
                const formattedTimestamp = formatISODate2ReadableDate(Number(entry.timestamp)); // Ensure timestamp is a number
                const formattedTimestampUtc = (new Date(entry.timestamp)).toISOString();
                return {
                    ...entry,
                    formattedTimestamp,
                    formattedTimestampUtc
                };
            });

            let formattedComputedData = hourlyComputedInflowData.map(entry => {
                const formattedTimestamp = formatISODate2ReadableDate(Number(entry.timestamp)); // Ensure timestamp is a number
                const formattedTimestampUtc = (new Date(entry.timestamp)).toISOString();
                return {
                    ...entry,
                    formattedTimestamp,
                    formattedTimestampUtc
                };
            });

            console.log("formattedConsensusData:", formattedConsensusData);
            console.log("formattedComputedData:", formattedComputedData);

            function createTable(formattedConsensusData, formattedComputedData) {

                let isUpToDate = formattedConsensusData[formattedConsensusData.length - 1]['formattedTimestamp'];
                isUpToDate = isUpToDate.split(" ")[0];
                console.log("isUpToDate:", isUpToDate);

                // Parse isUpToDate
                const date1 = new Date(isUpToDate);

                // Add one day (milliseconds in a day = 24 * 60 * 60 * 1000)
                const date1PlusOne = new Date(date1.getTime() + 24 * 60 * 60 * 1000);

                // Parse datetime
                const date2 = new Date(datetime);

                // Compare dates (ignoring time of day)
                const sameDate = date1PlusOne.toDateString() === date2.toDateString();

                if (sameDate) {
                    console.log("After adding one day, the dates are the same.");
                } else {
                    console.log("After adding one day, the dates are different.");
                }

                // Find the most recent consensus data point with qualityCode === 5
                const latestEntry = formattedConsensusData
                    .filter(d => d.qualityCode === 5)
                    .reduce((latest, current) =>
                        new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest,
                        { timestamp: 0 }
                    );

                const latestTimestamp = new Date(latestEntry.timestamp).getTime();
                const formattedDateTime = latestEntry.formattedTimestamp.split(' ')[0]; // includes date and time
                console.log("latestTimestamp:", latestTimestamp);
                console.log("formattedDateTime:", formattedDateTime);

                // Sum values after the latest consensus timestamp
                const sumConsensus = formattedConsensusData
                    .filter(d => d.timestamp > latestTimestamp)
                    .reduce((sum, d) => sum + d.value, 0);

                // Sum values after the latest computed timestamp    
                let runningSum = 0;

                const filteredData = formattedComputedData
                    .filter(entry => entry.timestamp > latestTimestamp);

                filteredData.forEach((entry, index) => {
                    runningSum += entry.value;
                    console.log(`Entry ${index + 1}:`, entry);
                    console.log(`Running sum: ${runningSum}`);
                });

                console.log("Final sumComputed:", runningSum);

                const sumComputed = filteredData.reduce((sum, entry) => sum + entry.value, 0);

                console.log("sumConsensus:", sumConsensus);
                console.log("sumComputed:", sumComputed);

                const output7Div = document.getElementById("output7");

                if (sameDate) {
                    // Create table
                    const table = document.createElement("table");
                    table.id = "balance-window";
                    table.style.margin = "10px 0";

                    // Add table title
                    const titleRow = table.insertRow();
                    const titleCell = document.createElement("th");
                    titleCell.colSpan = 3;
                    titleCell.textContent = "Balance Window";
                    titleRow.appendChild(titleCell);

                    // Add header row
                    const headerRow = table.insertRow();
                    ["Date of Last Balance", "Sum of Computed Inflow", "Sum of Consensus Inflow"].forEach(text => {
                        const cell = headerRow.insertCell();
                        cell.textContent = text;
                    });

                    // Add data row
                    const dataRow = table.insertRow();
                    [formattedDateTime, sumComputed, sumConsensus].forEach(value => {
                        const cell = dataRow.insertCell();
                        cell.textContent = typeof value === 'number' ? parseFloat(value).toFixed(0) : value;
                    });

                    // Insert table into DOM
                    output7Div.appendChild(table);
                }

                // Create the first button
                const div = document.createElement('div');
                div.textContent = 'Balance Inflow Module';
                div.id = 'balance-inflow-div';
                div.className = 'fetch-btn';

                // Open link in a new tab when clicked
                const isoDateLastBalance = new Date(latestTimestamp).toISOString();;
                div.addEventListener('click', () => {
                    window.open(`widget_5_Inflow.html?office=${office}&lake=${lake}&datetime=${datetime}&lookback=${isoDateLastBalance}`, '_blank');
                });

                output7Div.appendChild(div);

                let instructionWidget7 = null;
                if (sameDate) {
                    instructionWidget7 = document.createElement("h2");
                    instructionWidget7.textContent = `Ensure the Computed and Consensus Inflow values match those in the old lake sheets each day.`;
                    instructionWidget7.id = "instruction-span-blinking-widget7";
                } else {
                    instructionWidget7 = document.createElement("span");
                    instructionWidget7.textContent = `Complete Widget 5: Inflow, then click refresh button to Ensure the Computed and Consensus Inflow values match those in the old lake sheets each day.`;
                    instructionWidget7.id = "instruction-span-widget7";
                }
                instructionWidget7.style.color = "red";
                instructionWidget7.style.fontWeight = "bold";
                instructionWidget7.disabled = false;
                output7Div.appendChild(instructionWidget7);

                // Create the refresh button
                const buttonRefresh = document.createElement('button');
                buttonRefresh.textContent = 'Refresh';
                buttonRefresh.id = 'refresh-balance-window-button';
                buttonRefresh.className = 'fetch-btn';
                output7Div.appendChild(buttonRefresh);

                // Add click event to refresh the table and remove buttons
                buttonRefresh.addEventListener('click', () => {
                    // Remove existing table
                    const existingTable = document.getElementById('balance-window');
                    if (existingTable) {
                        existingTable.remove();
                    }

                    // Remove both buttons
                    const existingButton = document.getElementById('balance-inflow-div');
                    if (existingButton) {
                        existingButton.remove();
                    }

                    const existingRefresh = document.getElementById('refresh-balance-window-button');
                    if (existingRefresh) {
                        existingRefresh.remove();
                    }

                    const existingInstructionWidget7 = document.getElementById('instruction-span-widget7');
                    if (existingInstructionWidget7) {
                        existingInstructionWidget7.remove();
                    }

                    const existingInstructionBlinkingWidget7 = document.getElementById('instruction-span-blinking-widget7');
                    if (existingInstructionBlinkingWidget7) {
                        existingInstructionBlinkingWidget7.remove();
                    }

                    // Fetch and create new table
                    fetchTsidData();
                });
            }

            createTable(formattedConsensusData, formattedComputedData);
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
});