document.addEventListener('DOMContentLoaded', async function () {
    if (lake === "Rend Lk-Big Muddy" || lake === "Rend Lk") {
        console.log("****************** Rend Lk-Big Muddy");
        console.log('datetime: ', datetime);

        let setBaseUrl = null;
        if (cda === "internal") {
            setBaseUrl = `https://wm.${office.toLowerCase()}.ds.usace.army.mil:8243/${office.toLowerCase()}-data/`;
        } else if (cda === "internal-coop") {
            setBaseUrl = `https://wm-${office.toLowerCase()}coop.mvk.ds.usace.army.mil:8243/${office.toLowerCase()}-data/`;
        } else if (cda === "public") {
            setBaseUrl = `https://cwms-data.usace.army.mil/cwms-data/`;
        }
        console.log("setBaseUrl: ", setBaseUrl);

        // Get current date and time
        const currentDateTime = new Date();
        console.log('currentDateTime:', currentDateTime);

        // Subtract thirty hours from current date and time
        const currentDateTimeMinus30Hours = subtractHoursFromDate(currentDateTime, 8 * 24);
        console.log('currentDateTimeMinus30Hours :', currentDateTimeMinus30Hours);

        const urltsid1 = `${setBaseUrl}timeseries/group/Stage?office=${office}&category-id=${lake}`;
        const urltsid2 = `${setBaseUrl}timeseries/group/Flow?office=${office}&category-id=${lake}`;

        const fetchTimeSeriesData = async (tsid) => {
            const tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${currentDateTimeMinus30Hours.toISOString()}&end=${currentDateTime.toISOString()}&office=${office}`;
            // console.log('tsidData:', tsidData);
            try {
                const response = await fetch(tsidData);
                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Error fetching time series data:", error);
            }
        };

        const fetchTsidData = async () => {
            try {
                const response1 = await fetch(urltsid1);
                const response2 = await fetch(urltsid2);

                const tsidData1 = await response1.json();
                const tsidData2 = await response2.json();

                // Extract the timeseries-id from the response
                const tsid1 = tsidData1['assigned-time-series'][0]['timeseries-id']; // Grab the first timeseries-id
                const tsid2 = tsidData2['assigned-time-series'][0]['timeseries-id']; // Grab the first timeseries-id

                console.log("tsid1:", tsid1);
                console.log("tsid2:", tsid2);

                // Fetch time series data using tsid values
                const timeSeriesData1 = await fetchTimeSeriesData(tsid1);
                const timeSeriesData2 = await fetchTimeSeriesData(tsid2);

                // Call getHourlyDataOnTopOfHour for both time series data
                const hourlyData1 = getMidnightData(timeSeriesData1, tsid1);
                const hourlyData2 = getMidnightData(timeSeriesData2, tsid2);

                console.log("hourlyData1:", hourlyData1);
                console.log("hourlyData2:", hourlyData2);

                const formattedData1 = hourlyData1.map(entry => {
                    const formattedTimestamp = formatISODate2ReadableDate(Number(entry.timestamp)); // Ensure timestamp is a number
                    // console.log("Original (hourlyData1):", entry.timestamp, "Formatted:", formattedTimestamp);
                    return {
                        ...entry,
                        formattedTimestamp
                    };
                });

                const formattedData2 = hourlyData2.map(entry => {
                    const formattedTimestamp = formatISODate2ReadableDate(Number(entry.timestamp)); // Ensure timestamp is a number
                    // console.log("Original (hourlyData2):", entry.timestamp, "Formatted:", formattedTimestamp);
                    return {
                        ...entry,
                        formattedTimestamp
                    };
                });

                // Now you have formatted data for both datasets
                console.log("Formatted Data for HourlyData1:", formattedData1);
                console.log("Formatted Data for HourlyData2:", formattedData2);

                function createTable(formattedData1, formattedData2) {
                    // Create the table element
                    const table = document.createElement("table");
                    table.border = "1"; // Add border for the table
                
                    // Create the table header row
                    const headerRow = document.createElement("tr");
                
                    const stageHeader = document.createElement("th");
                    stageHeader.textContent = "Stage";
                    headerRow.appendChild(stageHeader);
                
                    const outflowHeader = document.createElement("th");
                    outflowHeader.textContent = "Outflow";
                    headerRow.appendChild(outflowHeader);
                
                    table.appendChild(headerRow);
                
                    // Combine the data based on matching timestamps
                    let i = 0;
                    let j = 0;
                
                    while (i < formattedData1.length && j < formattedData2.length) {
                        // Find matching formattedTimestamps
                        if (formattedData1[i].formattedTimestamp === formattedData2[j].formattedTimestamp) {
                            const row = document.createElement("tr");
                
                            // Stage column (from formattedData1)
                            const stageCell = document.createElement("td");
                            stageCell.textContent = formattedData1[i].value.toFixed(2); // Assuming stage is from formattedData1
                            row.appendChild(stageCell);
                
                            // Outflow column (from formattedData2)
                            const outflowCell = document.createElement("td");
                            outflowCell.textContent = formattedData2[j].value.toFixed(0); // Assuming outflow is from formattedData2
                            row.appendChild(outflowCell);
                
                            table.appendChild(row);
                
                            // Move to next entry in both datasets
                            i++;
                            j++;
                        } else if (formattedData1[i].formattedTimestamp < formattedData2[j].formattedTimestamp) {
                            // If the timestamp in formattedData1 is earlier, just move to the next entry in formattedData1
                            i++;
                        } else {
                            // If the timestamp in formattedData2 is earlier, just move to the next entry in formattedData2
                            j++;
                        }
                    }
                
                    // Append the table to the specific container (id="output4")
                    const output4Div = document.getElementById("output4");
                    output4Div.innerHTML = ""; // Clear any existing content
                    output4Div.appendChild(table);
                }

                // Call the function with formattedData1 and formattedData2
                createTable(formattedData1, formattedData2);
                
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

    } else if (lake === "Carlyle Lk-Kaskaskia" || lake === "Rend Lk") {
        console.log("****************** Carlyle Lk-Kaskaskia");
        console.log('datetime: ', datetime);

    } else if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
        console.log("****************** Lk Shelbyville-Kaskaskia");
        console.log('datetime: ', datetime);

    } else if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
        console.log("****************** Mark Twain Lk-Salt");
        console.log('datetime: ', datetime);

    } else if (lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
        console.log("****************** Wappapello Lk-St Francis");
        console.log('datetime: ', datetime);

    }
});