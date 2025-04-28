document.addEventListener('DOMContentLoaded', async function () {
    if (lake === "Rend Lk-Big Muddy" || lake === "Rend Lk") {
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

        const urltsid1 = `${setBaseUrl}timeseries/group/Stage?office=${office}&category-id=${lake}`;
        const urltsid2 = `${setBaseUrl}timeseries/group/Flow?office=${office}&category-id=${lake}`;
        const urltsid3 = `${setBaseUrl}timeseries/group/Outflow-Average-Lake-Test?office=${office}&category-id=${lake}`;

        const fetchTimeSeriesData = async (tsid) => {
            const tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateMinus7Days}&end=${isoDateToday}&office=${office}`;
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
                const response1 = await fetch(urltsid1);
                const response2 = await fetch(urltsid2);
                const response3 = await fetch(urltsid3);

                const tsidData1 = await response1.json();
                const tsidData2 = await response2.json();
                const tsidData3 = await response3.json();

                // Extract the timeseries-id from the response
                const tsid1 = tsidData1['assigned-time-series'][0]['timeseries-id']; // Grab the first timeseries-id
                const tsid2 = tsidData2['assigned-time-series'][0]['timeseries-id']; // Grab the first timeseries-id
                const tsid3 = tsidData3['assigned-time-series'][0]['timeseries-id']; // Grab the first timeseries-id

                console.log("tsid1:", tsid1);
                console.log("tsid2:", tsid2);
                console.log("tsid3:", tsid3);

                // Fetch time series data using tsid values
                const timeSeriesData1 = await fetchTimeSeriesData(tsid1);
                const timeSeriesData2 = await fetchTimeSeriesData(tsid2);
                const timeSeriesData3 = await fetchTimeSeriesData(tsid3);

                console.log("timeSeriesData1:", timeSeriesData1);
                console.log("timeSeriesData2:", timeSeriesData2);
                console.log("timeSeriesData3:", timeSeriesData3);

                let cdaSaveBtn;

                async function isLoggedIn() {
                    try {
                        const response = await fetch("https://wm.mvs.ds.usace.army.mil/mvs-data/auth/keys", {
                            method: "GET"
                        });

                        if (response.status === 401) return false;

                        console.log('status', response.status);
                        return true;

                    } catch (error) {
                        console.error('Error checking login status:', error);
                        return false;
                    }
                }

                async function loginStateController() {
                    cdaSaveBtn = document.getElementById("cda-btn-gate"); // Get the button by its ID

                    cdaSaveBtn.disabled = true; // Disable button while checking login state

                    // Update button text based on login status
                    if (await isLoggedIn()) {
                        cdaSaveBtn.innerText = "Save";
                    } else {
                        cdaSaveBtn.innerText = "Login";
                    }

                    cdaSaveBtn.disabled = false; // Re-enable button
                }

                createTable(timeSeriesData1, timeSeriesData2, timeSeriesData3);

                loginStateController()
                setInterval(async () => {
                    loginStateController()
                }, 10000)


                function createTable(timeSeriesData1, timeSeriesData2, timeSeriesData3) {
                    console.log("Creating table with formatted data...");

                    // Call getHourlyDataOnTopOfHour for both time series data
                    const midNightData1 = updateDataWithMidnight(timeSeriesData1, tsid1);
                    const midNightData2 = updateDataWithMidnight(timeSeriesData2, tsid2);
                    const midNightData3 = updateDataWithMidnight(timeSeriesData3, tsid3);

                    console.log("midNightData1:", midNightData1);
                    console.log("midNightData2:", midNightData2);
                    console.log("midNightData3:", midNightData3);

                    // Stage Hourly Data
                    let formattedData1 = {
                        ...midNightData1,
                        values: midNightData1.values.map(entry => {
                            const readable = formatISODate2ReadableDate(entry[0]);
                            return [...entry, readable];
                        }),
                        midnight: midNightData1.midnight.map(entry => {
                            const readable = formatISODate2ReadableDate(entry[0]);
                            return [...entry, readable];
                        })
                    };

                    // Flow Hourly Data
                    let formattedData2 = {
                        ...midNightData2,
                        values: midNightData2.values.map(entry => {
                            const readable = formatISODate2ReadableDate(entry[0]);
                            return [...entry, readable];
                        }),
                        midnight: midNightData2.midnight.map(entry => {
                            const readable = formatISODate2ReadableDate(entry[0]);
                            return [...entry, readable];
                        })
                    };

                    // Outflow Daily Data
                    let formattedData3 = {
                        ...midNightData3,
                        values: midNightData3.values.map(entry => {
                            const readable = formatISODate2ReadableDate(entry[0]);
                            return [...entry, readable];
                        }),
                        midnight: midNightData3.midnight.map(entry => {
                            const readable = formatISODate2ReadableDate(entry[0]);
                            return [...entry, readable];
                        })
                    };

                    console.log("formattedData1:", formattedData1);
                    console.log("formattedData2:", formattedData2);
                    console.log("formattedData3:", formattedData3);

                    const averagesOutflow = calculateDailyAverages(formattedData2);
                    console.log("averagesOutflow: ", averagesOutflow);

                    const averageOutflowYesterday = averagesOutflow[averagesOutflow.length - 2];
                    console.log("averageOutflowYesterday: ", averageOutflowYesterday);

                    const table = document.createElement("table");
                    table.id = "gate-settings";

                    // Create header row
                    const headerRow = document.createElement("tr");

                    const dateHeader = document.createElement("th");
                    dateHeader.textContent = "Date";
                    headerRow.appendChild(dateHeader);

                    const stageHeader = document.createElement("th");
                    stageHeader.textContent = "Stage";
                    headerRow.appendChild(stageHeader);

                    const sluice2Header = document.createElement("th");
                    sluice2Header.textContent = "Outflow";
                    headerRow.appendChild(sluice2Header);

                    table.appendChild(headerRow);

                    // Loop through formattedData1 and find midnight values
                    formattedData1.midnight.forEach((map, index) => {
                        const row = document.createElement("tr");

                        // Date
                        const dateCell = document.createElement("td");
                        dateCell.textContent = map[3];
                        row.appendChild(dateCell);

                        // Stage
                        const stageCell = document.createElement("td");
                        stageCell.textContent = map[1].toFixed(2);
                        stageCell.title = formattedData1.name + " " + formattedData1.midnight[index]?.[3];
                        row.appendChild(stageCell);

                        // Outflow
                        const outflowValue = formattedData2.midnight[index]?.[1];
                        const outflowCell = document.createElement("td");
                        outflowCell.textContent = outflowValue !== undefined ? outflowValue.toFixed(0) : "N/A";
                        outflowCell.title = formattedData2.name + " " + formattedData2.midnight[index]?.[3];
                        row.appendChild(outflowCell);

                        table.appendChild(row);
                    });

                    const output4Div = document.getElementById("output4");
                    output4Div.innerHTML = "";
                    output4Div.appendChild(table);

                    // Calculate the average of the last two values
                    let averageOutflowYesterdayValue = averageOutflowYesterday.average;

                    let isSaved = false; // Flag to track if the data has been saved
                    if (formattedData1.midnight.length === formattedData3.midnight.length) {
                        isSaved = true; // Set to true if the lengths match
                    }

                    // Create the table structure
                    const tableOutflow = document.createElement("table");

                    // Apply the ID "gate-settings" to the table
                    tableOutflow.id = "gate-settings";
                    tableOutflow.style.width = "50%";
                    tableOutflow.style.marginTop = "10px";
                    tableOutflow.style.marginBottom = "10px";

                    // Create the header row
                    const headerOutflowRow = tableOutflow.insertRow();
                    const col1 = headerOutflowRow.insertCell();
                    const col2 = headerOutflowRow.insertCell();

                    col1.textContent = "Average Outflow for Yesterday:";
                    col2.textContent = (Math.round(averageOutflowYesterdayValue / 10) * 10).toFixed(0);
                    col2.value = averageOutflowYesterdayValue;
                    col2.style.fontWeight = "bold";
                    if (isSaved === false) {
                        col2.style.backgroundColor = "pink";
                    }
                    col2.id = 'averageOutflowYesterdayValue';

                    // Set column widths: 2/3 for col1 and 1/3 for col2
                    col1.style.width = "66%";  // 2/3 width
                    col2.style.width = "33%";  // 1/3 width

                    // Add a title for the tooltip when hovering over col2
                    col2.title = `The average outflow value for yesterday is: ${averageOutflowYesterdayValue.toFixed(0)}`;

                    // Insert the table into the "output4" div
                    const outputDiv = document.getElementById("output4");
                    outputDiv.appendChild(tableOutflow);

                    // Save and Status Button
                    const cdaSaveBtn = document.createElement("button");
                    cdaSaveBtn.textContent = "Submit";
                    cdaSaveBtn.id = "cda-btn-gate";
                    cdaSaveBtn.disabled = true;
                    outputDiv.appendChild(cdaSaveBtn);

                    const statusDiv = document.createElement("div");
                    statusDiv.className = "status";
                    const cdaStatusBtn = document.createElement("button");
                    cdaStatusBtn.textContent = "";
                    cdaStatusBtn.id = "cda-btn-gate";
                    cdaStatusBtn.disabled = false;
                    statusDiv.appendChild(cdaStatusBtn);
                    outputDiv.appendChild(statusDiv);

                    cdaSaveBtn.addEventListener("click", async () => {
                        const values = [];
                        const averageOutflowYesterdayInput = document.getElementById(`averageOutflowYesterdayValue`).value;
                        let averageOutflowYesterdayValue = averageOutflowYesterdayInput ? parseFloat(parseFloat(averageOutflowYesterdayInput).toFixed(2)) : 909;
                        const timestampUnix = new Date(new Date(isoDateToday).getTime()).toISOString(); // Today Midnight CST
                        values.push([timestampUnix, averageOutflowYesterdayValue, 0]);

                        const payload = {
                            "name": tsid3,
                            "office-id": office,
                            "units": "cfs",
                            "values": values
                        };

                        console.log("Preparing payload...");
                        console.log("payload:", payload);

                        async function loginCDA() {
                            if (await isLoggedIn()) return true;
                            window.location.href = `https://wm.mvs.ds.usace.army.mil:8243/CWMSLogin/login?OriginalLocation=${encodeURIComponent(window.location.href)}`;
                        }

                        async function isLoggedIn() {
                            try {
                                const response = await fetch("https://wm.mvs.ds.usace.army.mil/mvs-data/auth/keys", { method: "GET" });
                                return response.status !== 401;
                            } catch (error) {
                                console.error('Error checking login status:', error);
                                return false;
                            }
                        }

                        async function createTS(payload) {
                            if (!payload) throw new Error("You must specify a payload!");
                            const response = await fetch("https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?store-rule=REPLACE%20ALL", {
                                method: "POST",
                                headers: { "Content-Type": "application/json;version=2" },
                                body: JSON.stringify(payload)
                            });

                            if (!response.ok) {
                                const errorText = await response.text();
                                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                            }
                        }

                        async function fetchUpdatedData(isoDateMinus8Days, isoDateToday, tsid) {
                            let response = null;
                            response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?name=${tsid}&begin=${isoDateMinus7Days}&end=${isoDateToday}&office=${office}`, {
                                headers: {
                                    "Accept": "application/json;version=2", // Ensuring the correct version is used
                                    "cache-control": "no-cache"
                                }
                            });

                            if (!response.ok) {
                                throw new Error(`Failed to fetch updated data: ${response.status}`);
                            }

                            const data = await response.json();

                            // Log the raw data received
                            console.log('Fetched Data:', data);

                            return data;
                        }

                        // Function to show the spinner while waiting
                        function showSpinner() {
                            const spinner = document.createElement('img');
                            spinner.src = 'images/loading4.gif';
                            spinner.id = 'loadingSpinner';
                            spinner.style.width = '40px';  // Set the width to 40px
                            spinner.style.height = '40px'; // Set the height to 40px
                            document.body.appendChild(spinner);
                        }

                        // Function to hide the spinner once the operation is complete
                        function hideSpinner() {
                            const spinner = document.getElementById('loadingSpinner');
                            if (spinner) {
                                spinner.remove();
                            }
                        }

                        if (cdaSaveBtn.innerText === "Login") {
                            showSpinner(); // Show the spinner before the login
                            const loginResult = await loginCDA();
                            hideSpinner(); // Hide the spinner after login is complete

                            cdaSaveBtn.innerText = loginResult ? "Submit" : "Login";
                            cdaStatusBtn.innerText = loginResult ? "" : "Failed to Login!";
                        } else {
                            try {
                                showSpinner(); // Show the spinner before creating the version
                                await createTS(payload);
                                cdaStatusBtn.innerText = "Write successful!";

                                // Fetch updated data and refresh the table
                                const timeSeriesData1 = await fetchUpdatedData(isoDateMinus8Days, isoDateToday, tsid1);
                                const timeSeriesData2 = await fetchUpdatedData(isoDateMinus8Days, isoDateToday, tsid2);
                                const timeSeriesData3 = await fetchUpdatedData(isoDateMinus8Days, isoDateToday, tsid3);

                                createTable(timeSeriesData1, timeSeriesData2, timeSeriesData3);
                            } catch (error) {
                                hideSpinner(); // Hide the spinner if an error occurs
                                cdaStatusBtn.innerText = "Failed to write data!";
                                console.error(error);
                            }

                            hideSpinner(); // Hide the spinner after the operation completes
                        }
                    });
                }
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
                    midnightData.push([timestamp, value, qualityCode]);
                }
            });

            return midnightData;
        };

        function updateDataWithMidnight(data) {
            return {
                ...data,
                'midnight': getMidnightData(data),
            };
        }

        function calculateDailyAverages(data) {
            // Helper function to format the timestamp into just the date (YYYY-MM-DD)
            function extractDate(timestamp) {
                const date = timestamp.split(' ')[0]; // Get the date part before the space (remove time)
                return date; // Returns the date as YYYY-MM-DD
            }

            // Create an object to store the sums and counts for each day
            const dailyData = {};

            // Iterate over each data entry in the values array
            data.values.forEach(entry => {
                const timestamp = entry[3]; // The 4th item in the array (timestamp '04-14-2025 00:00')
                const value = entry[1]; // The second item in the array (the value to average)

                const date = extractDate(timestamp); // Extract the date (YYYY-MM-DD)

                // If the date doesn't exist in dailyData, initialize it
                if (!dailyData[date]) {
                    dailyData[date] = { sum: 0, count: 0, values: [] }; // Store values for logging
                }

                // Add the value to the sum and increment the count for the date
                dailyData[date].sum += value;
                dailyData[date].count += 1;
                dailyData[date].values.push(value);

                // Log the value and the current sum and count for this day
                // console.log(`Date: ${date}, Timestamp: ${timestamp}, Value: ${value}`);
                // console.log(`Current Sum: ${dailyData[date].sum}, Current Count: ${dailyData[date].count}`);
            });

            // Now calculate the average for each day
            const dailyAverages = [];
            for (const date in dailyData) {
                const avg = dailyData[date].sum / dailyData[date].count;

                // Log the final average for the day
                // console.log(`Final Average for ${date}: ${avg}`);

                dailyAverages.push({ date, average: avg });
            }

            return dailyAverages;
        }
    } else {
        const loadingIndicator = document.getElementById('loading_json');
        loadingIndicator.style.display = 'block';

        console.log('lake: ', lake);
        console.log('datetime: ', datetime);

        let setBaseUrl = null;
        if (cda === "internal") {
            setBaseUrl = `https://wm.${office.toLowerCase()}.ds.usace.army.mil/${office.toLowerCase()}-data/`;
        } else if (cda === "internal-coop") {
            setBaseUrl = `https://wm-${office.toLowerCase()}coop.mvk.ds.usace.army.mil/${office.toLowerCase()}-data/`;
        } else if (cda === "public") {
            // setBaseUrl = `https://cwms-data.usace.army.mil/cwms-data/`;
            setBaseUrl = `https://cwms-data-test.cwbi.us/cwms-data/`;
        }
        console.log("setBaseUrl: ", setBaseUrl);

        const [month, day, year] = datetime.split('-');
        console.log("month: ", month);
        console.log("day: ", day);
        console.log("year: ", year);

        // Generate ISO strings for the previous 7 days and today
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

        let dstOffsetHours = getDSTOffsetInHours();
        console.log(`dstOffsetHours: ${dstOffsetHours} hours`);

        let urlTsidSluice = null;
        let urlTsidSluiceTotal = null;
        let urlTsidOutflowTotal = null;

        if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
            urlTsidSluice = `${setBaseUrl}timeseries/group/Sluice-Lake-Test?office=${office}&category-id=${lake}`;
            console.log("urlTsidSluice:", urlTsidSluice);

            urlTsidSluiceTotal = `${setBaseUrl}timeseries/group/Sluice-Total-Lake-Test?office=${office}&category-id=${lake}`;
            console.log("urlTsidSluiceTotal:", urlTsidSluiceTotal);
        }

        if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
            urlTsidSluiceTotal = `${setBaseUrl}timeseries/group/Sluice-Total-Lake-Test?office=${office}&category-id=${lake}`;
            console.log("urlTsidSluiceTotal:", urlTsidSluiceTotal);

            urlTsidOutflowTotal = `${setBaseUrl}timeseries/group/Outflow-Total-Lake-Test?office=${office}&category-id=${lake}`;
            console.log("urlTsidOutflowTotal:", urlTsidOutflowTotal);
        }

        const urlTsidGate = `${setBaseUrl}timeseries/group/Gate-Lake-Test?office=${office}&category-id=${lake}`;
        console.log("urlTsidGate:", urlTsidGate);

        const urlTsidGateTotal = `${setBaseUrl}timeseries/group/Gate-Total-Lake-Test?office=${office}&category-id=${lake}`;
        console.log("urlTsidGateTotal:", urlTsidGateTotal);

        const urlTsidOutflowAverage = `${setBaseUrl}timeseries/group/Outflow-Average-Lake-Test?office=${office}&category-id=${lake}`;
        console.log("urlTsidOutflowAverage:", urlTsidOutflowAverage);

        const fetchTsidData = async () => {
            try {
                let responseSluice = null;
                let tsidSluiceData = null;
                let responseSluiceTotal = null;
                let tsidSluiceTotalData = null;
                let responseOutflowTotal = null;
                let tsidOutflowTotalData = null;
                if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                    responseSluice = await fetch(urlTsidSluice);
                    tsidSluiceData = await responseSluice.json();
                    console.log("tsidSluiceData:", tsidSluiceData);
                }

                if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                    responseSluiceTotal = await fetch(urlTsidSluiceTotal);
                    tsidSluiceTotalData = await responseSluiceTotal.json();
                    console.log("tsidSluiceTotalData:", tsidSluiceTotalData);

                    responseOutflowTotal = await fetch(urlTsidOutflowTotal);
                    tsidOutflowTotalData = await responseOutflowTotal.json();
                    console.log("tsidOutflowTotalData:", tsidOutflowTotalData);
                }

                const responseGate = await fetch(urlTsidGate);
                const tsidGateData = await responseGate.json();
                console.log("tsidGateData:", tsidGateData);

                const responseGateTotal = await fetch(urlTsidGateTotal);
                const tsidGateTotalData = await responseGateTotal.json();
                console.log("tsidGateTotalData:", tsidGateTotalData);

                const responseOutflowAverage = await fetch(urlTsidOutflowAverage);
                const tsidOutflowAverageData = await responseOutflowAverage.json();
                console.log("tsidOutflowAverageData:", tsidOutflowAverageData);

                let cdaSaveBtn;

                async function isLoggedIn() {
                    try {
                        const response = await fetch("https://wm.mvs.ds.usace.army.mil/mvs-data/auth/keys", {
                            method: "GET"
                        });

                        if (response.status === 401) return false;

                        console.log('status', response.status);
                        return true;

                    } catch (error) {
                        console.error('Error checking login status:', error);
                        return false;
                    }
                }

                async function loginStateController() {
                    cdaSaveBtn = document.getElementById("cda-btn-gate");

                    cdaSaveBtn.disabled = true;

                    if (await isLoggedIn()) {
                        cdaSaveBtn.innerText = "Save";
                    } else {
                        cdaSaveBtn.innerText = "Login";
                    }

                    cdaSaveBtn.disabled = false;
                }

                let tsidSluice1 = null;
                let tsidSluice2 = null;
                let tsidSluiceTotal = null;
                let tsidGate1 = null;
                let tsidGate2 = null;
                let tsidGate3 = null;
                let tsidGate4 = null;
                let tsidGateTotal = null;
                let tsidOutflowTotal = null;
                let tsidOutflowAverage = null;

                let timeSeriesDataSluice1 = null;
                let timeSeriesDataSluice2 = null;
                let timeSeriesDataSluiceTotal = null;
                let timeSeriesDataGate1 = null;
                let timeSeriesDataGate2 = null;
                let timeSeriesDataGate3 = null;
                let timeSeriesDataGate4 = null;
                let timeSeriesDataGateTotal = null;
                let timeSeriesDataOutflowTotal = null;
                let timeSeriesDataOutflowAverage = null;

                let timeSeriesYesterdayDataSluice1 = null;
                let timeSeriesYesterdayDataSluice2 = null;
                let timeSeriesYesterdayDataSluiceTotal = null;
                let timeSeriesYesterdayDataGate1 = null;
                let timeSeriesYesterdayDataGate2 = null;
                let timeSeriesYesterdayDataGate3 = null;
                let timeSeriesYesterdayDataGate4 = null;
                let timeSeriesYesterdayDataGateTotal = null;
                let timeSeriesYesterdayDataOutflowTotal = null;
                let timeSeriesYesterdayDataOutflowAverage = null;

                let timeSeriesTomorrowDataOutflow = null;

                if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                    tsidSluice1 = tsidSluiceData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidSluice1:", tsidSluice1);

                    tsidSluice2 = tsidSluiceData['assigned-time-series'][1]['timeseries-id'];
                    console.log("tsidSluice2:", tsidSluice2);

                    tsidSluiceTotal = tsidSluiceTotalData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidSluiceTotal:", tsidSluiceTotal);

                    tsidGate1 = tsidGateData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidGate1:", tsidGate1);

                    tsidGate2 = tsidGateData['assigned-time-series'][1]['timeseries-id'];
                    console.log("tsidGate2:", tsidGate2);

                    tsidGate3 = tsidGateData['assigned-time-series'][2]['timeseries-id'];
                    console.log("tsidGate3:", tsidGate3);

                    tsidGateTotal = tsidGateTotalData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidGateTotal:", tsidGateTotal);

                    tsidOutflowTotal = tsidOutflowTotalData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidOutflowTotal:", tsidOutflowTotal);

                    tsidOutflowAverage = tsidOutflowAverageData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidOutflowAverage:", tsidOutflowAverage);

                    // Fetch time series data
                    timeSeriesDataSluice1 = await fetchTimeSeriesData(tsidSluice1);
                    console.log("timeSeriesDataSluice1:", timeSeriesDataSluice1);

                    timeSeriesDataSluice2 = await fetchTimeSeriesData(tsidSluice2);
                    console.log("timeSeriesDataSluice2:", timeSeriesDataSluice2);

                    timeSeriesDataSluiceTotal = await fetchTimeSeriesData(tsidSluiceTotal);
                    console.log("timeSeriesDataSluiceTotal:", timeSeriesDataSluiceTotal);

                    timeSeriesDataGate1 = await fetchTimeSeriesData(tsidGate1);
                    console.log("timeSeriesDataGate1:", timeSeriesDataGate1);

                    timeSeriesDataGate2 = await fetchTimeSeriesData(tsidGate2);
                    console.log("timeSeriesDataGate2:", timeSeriesDataGate2);

                    timeSeriesDataGate3 = await fetchTimeSeriesData(tsidGate3);
                    console.log("timeSeriesDataGate3:", timeSeriesDataGate3);

                    timeSeriesDataGateTotal = await fetchTimeSeriesData(tsidGateTotal);
                    console.log("timeSeriesDataGateTotal:", timeSeriesDataGateTotal);

                    timeSeriesDataOutflowTotal = await fetchTimeSeriesData(tsidOutflowTotal);
                    console.log("timeSeriesDataOutflowTotal:", timeSeriesDataOutflowTotal);

                    timeSeriesDataOutflowAverage = await fetchTimeSeriesData(tsidOutflowAverage);
                    console.log("timeSeriesDataOutflowAverage:", timeSeriesDataOutflowAverage);

                    // Fetch yesterday time series data
                    timeSeriesYesterdayDataSluice1 = await fetchTimeSeriesYesterdayData(tsidSluice1);
                    console.log("timeSeriesYesterdayDataSluice1:", timeSeriesYesterdayDataSluice1);

                    timeSeriesYesterdayDataSluice2 = await fetchTimeSeriesYesterdayData(tsidSluice2);
                    console.log("timeSeriesYesterdayDataSluice2:", timeSeriesYesterdayDataSluice2);

                    timeSeriesYesterdayDataSluiceTotal = await fetchTimeSeriesYesterdayData(tsidSluiceTotal);
                    console.log("timeSeriesYesterdayDataSluiceTotal:", timeSeriesYesterdayDataSluiceTotal);

                    timeSeriesYesterdayDataGate1 = await fetchTimeSeriesYesterdayData(tsidGate1);
                    console.log("timeSeriesYesterdayDataGate1:", timeSeriesYesterdayDataGate1);

                    timeSeriesYesterdayDataGate2 = await fetchTimeSeriesYesterdayData(tsidGate2);
                    console.log("timeSeriesYesterdayDataGate2:", timeSeriesYesterdayDataGate2);

                    timeSeriesYesterdayDataGate3 = await fetchTimeSeriesYesterdayData(tsidGate3);
                    console.log("timeSeriesYesterdayDataGate3:", timeSeriesYesterdayDataGate3);

                    timeSeriesYesterdayDataGateTotal = await fetchTimeSeriesYesterdayData(tsidGateTotal);
                    console.log("timeSeriesYesterdayDataGateTotal:", timeSeriesYesterdayDataGateTotal);

                    timeSeriesYesterdayDataOutflowTotal = await fetchTimeSeriesYesterdayData(tsidOutflowTotal);
                    console.log("timeSeriesYesterdayDataOutflowTotal:", timeSeriesYesterdayDataOutflowTotal);

                    timeSeriesYesterdayDataOutflowAverage = await fetchTimeSeriesYesterdayData(tsidOutflowAverage);
                    console.log("timeSeriesYesterdayDataOutflowAverage:", timeSeriesYesterdayDataOutflowAverage);

                    // Fetch tomorrow time series data
                    timeSeriesTomorrowDataOutflow = await fetchTimeSeriesTomorrowData(tsidOutflowTotal);
                    console.log("timeSeriesTomorrowDataOutflow:", timeSeriesTomorrowDataOutflow);

                    if ((timeSeriesDataGate1 && timeSeriesDataGate1.values && timeSeriesDataGate1.values.length > 0) || (timeSeriesYesterdayDataGate1 && timeSeriesYesterdayDataGate1.values && timeSeriesYesterdayDataGate1.values.length > 0)) {
                        console.log("Data for today found, Calling createTable ...");
                        console.log("This is a multiple row save.");

                        createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
                            tsidSluice1, timeSeriesDataSluice1, tsidSluice2, timeSeriesDataSluice2, tsidSluiceTotal, timeSeriesDataSluiceTotal,
                            tsidGate1, timeSeriesDataGate1, tsidGate2, timeSeriesDataGate2, tsidGate3, timeSeriesDataGate3, tsidGateTotal, timeSeriesDataGateTotal,
                            tsidOutflowTotal, timeSeriesDataOutflowTotal, tsidOutflowAverage, timeSeriesDataOutflowAverage,
                            timeSeriesYesterdayDataSluice1, timeSeriesYesterdayDataSluice2, timeSeriesYesterdayDataSluiceTotal, timeSeriesYesterdayDataGate1, timeSeriesYesterdayDataGate2,
                            timeSeriesYesterdayDataGate3, timeSeriesYesterdayDataGateTotal, timeSeriesYesterdayDataOutflowTotal, timeSeriesYesterdayDataOutflowAverage, tsidGate4, timeSeriesDataGate4, timeSeriesYesterdayDataGate4, timeSeriesTomorrowDataOutflow);

                        loadingIndicator.style.display = 'none';

                        loginStateController()
                        setInterval(async () => {
                            loginStateController()
                        }, 10000)
                    } else {
                        alert("No data from today or previous day found, Please enter data for the previous day.");
                    }
                } else if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                    tsidGate1 = tsidGateData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidGate1:", tsidGate1);

                    tsidGate2 = tsidGateData['assigned-time-series'][1]['timeseries-id'];
                    console.log("tsidGate2:", tsidGate2);

                    tsidGate3 = tsidGateData['assigned-time-series'][2]['timeseries-id'];
                    console.log("tsidGate3:", tsidGate3);

                    tsidGate4 = tsidGateData['assigned-time-series'][3]['timeseries-id'];
                    console.log("tsidGate4:", tsidGate4);

                    tsidGateTotal = tsidGateTotalData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidGateTotal:", tsidGateTotal);

                    tsidOutflowAverage = tsidOutflowAverageData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidOutflowAverage:", tsidOutflowAverage);

                    // Fetch time series data
                    timeSeriesDataGate1 = await fetchTimeSeriesData(tsidGate1);
                    console.log("timeSeriesDataGate1:", timeSeriesDataGate1);

                    timeSeriesDataGate2 = await fetchTimeSeriesData(tsidGate2);
                    console.log("timeSeriesDataGate2:", timeSeriesDataGate2);

                    timeSeriesDataGate3 = await fetchTimeSeriesData(tsidGate3);
                    console.log("timeSeriesDataGate3:", timeSeriesDataGate3);

                    timeSeriesDataGate4 = await fetchTimeSeriesData(tsidGate4);
                    console.log("timeSeriesDataGate4:", timeSeriesDataGate4);

                    timeSeriesDataGateTotal = await fetchTimeSeriesData(tsidGateTotal);
                    console.log("timeSeriesDataGateTotal:", timeSeriesDataGateTotal);

                    timeSeriesDataOutflowAverage = await fetchTimeSeriesData(tsidOutflowAverage);
                    console.log("timeSeriesDataOutflowAverage:", timeSeriesDataOutflowAverage);

                    // Fetch yesterday time series data
                    timeSeriesYesterdayDataGate1 = await fetchTimeSeriesYesterdayData(tsidGate1);
                    console.log("timeSeriesYesterdayDataGate1:", timeSeriesYesterdayDataGate1);

                    timeSeriesYesterdayDataGate2 = await fetchTimeSeriesYesterdayData(tsidGate2);
                    console.log("timeSeriesYesterdayDataGate2:", timeSeriesYesterdayDataGate2);

                    timeSeriesYesterdayDataGate3 = await fetchTimeSeriesYesterdayData(tsidGate3);
                    console.log("timeSeriesYesterdayDataGate3:", timeSeriesYesterdayDataGate3);

                    timeSeriesYesterdayDataGate4 = await fetchTimeSeriesYesterdayData(tsidGate4);
                    console.log("timeSeriesYesterdayDataGate4:", timeSeriesYesterdayDataGate4);

                    timeSeriesYesterdayDataGateTotal = await fetchTimeSeriesYesterdayData(tsidGateTotal);
                    console.log("timeSeriesYesterdayDataGateTotal:", timeSeriesYesterdayDataGateTotal);

                    timeSeriesYesterdayDataOutflowAverage = await fetchTimeSeriesYesterdayData(tsidOutflowAverage);
                    console.log("timeSeriesYesterdayDataOutflowAverage:", timeSeriesYesterdayDataOutflowAverage);

                    // Fetch tomorrow time series data
                    timeSeriesTomorrowDataOutflow = await fetchTimeSeriesTomorrowData(tsidOutflowTotal);
                    console.log("timeSeriesTomorrowDataOutflow:", timeSeriesTomorrowDataOutflow);

                    if ((timeSeriesDataGate1 && timeSeriesDataGate1.values && timeSeriesDataGate1.values.length > 0) || (timeSeriesYesterdayDataGate1 && timeSeriesYesterdayDataGate1.values && timeSeriesYesterdayDataGate1.values.length > 0)) {
                        console.log("Data for today found, Calling createTable ...");
                        console.log("This is a multiple row save.");

                        createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
                            tsidSluice1, timeSeriesDataSluice1, tsidSluice2, timeSeriesDataSluice2, tsidSluiceTotal, timeSeriesDataSluiceTotal,
                            tsidGate1, timeSeriesDataGate1, tsidGate2, timeSeriesDataGate2, tsidGate3, timeSeriesDataGate3, tsidGateTotal, timeSeriesDataGateTotal,
                            tsidOutflowTotal, timeSeriesDataOutflowTotal, tsidOutflowAverage, timeSeriesDataOutflowAverage,
                            timeSeriesYesterdayDataSluice1, timeSeriesYesterdayDataSluice2, timeSeriesYesterdayDataSluiceTotal, timeSeriesYesterdayDataGate1, timeSeriesYesterdayDataGate2,
                            timeSeriesYesterdayDataGate3, timeSeriesYesterdayDataGateTotal, timeSeriesYesterdayDataOutflowTotal, timeSeriesYesterdayDataOutflowAverage, tsidGate4, timeSeriesDataGate4, timeSeriesYesterdayDataGate4, timeSeriesTomorrowDataOutflow);

                        loadingIndicator.style.display = 'none';

                        loginStateController()
                        setInterval(async () => {
                            loginStateController()
                        }, 10000)
                    } else {
                        alert("No data from today or previous day found, Please enter data for the previous day.");
                    }
                } else if (lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                    tsidGate1 = tsidGateData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidGate1:", tsidGate1);

                    tsidGate2 = tsidGateData['assigned-time-series'][1]['timeseries-id'];
                    console.log("tsidGate2:", tsidGate2);

                    tsidGate3 = tsidGateData['assigned-time-series'][2]['timeseries-id'];
                    console.log("tsidGate3:", tsidGate3);

                    tsidGate4 = tsidGateData['assigned-time-series'][3]['timeseries-id'];
                    console.log("tsidGate4:", tsidGate4);

                    tsidSluiceTotal = tsidSluiceTotalData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidSluiceTotal:", tsidSluiceTotal);

                    tsidGateTotal = tsidGateTotalData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidGateTotal:", tsidGateTotal);

                    tsidOutflowTotal = tsidOutflowTotalData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidOutflowTotal:", tsidOutflowTotal);

                    tsidOutflowAverage = tsidOutflowAverageData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidOutflowAverage:", tsidOutflowAverage);

                    // Fetch time series data
                    timeSeriesDataGate1 = await fetchTimeSeriesData(tsidGate1);
                    console.log("timeSeriesDataGate1:", timeSeriesDataGate1);

                    timeSeriesDataGate2 = await fetchTimeSeriesData(tsidGate2);
                    console.log("timeSeriesDataGate2:", timeSeriesDataGate2);

                    timeSeriesDataGate3 = await fetchTimeSeriesData(tsidGate3);
                    console.log("timeSeriesDataGate3:", timeSeriesDataGate3);

                    timeSeriesDataGate4 = await fetchTimeSeriesData(tsidGate4);
                    console.log("timeSeriesDataGate4:", timeSeriesDataGate4);

                    timeSeriesDataSluiceTotal = await fetchTimeSeriesData(tsidSluiceTotal);
                    console.log("timeSeriesDataSluiceTotal:", timeSeriesDataSluiceTotal);

                    timeSeriesDataGateTotal = await fetchTimeSeriesData(tsidGateTotal);
                    console.log("timeSeriesDataGateTotal:", timeSeriesDataGateTotal);

                    timeSeriesDataOutflowTotal = await fetchTimeSeriesData(tsidOutflowTotal);
                    console.log("timeSeriesDataOutflowTotal:", timeSeriesDataOutflowTotal);

                    timeSeriesDataOutflowAverage = await fetchTimeSeriesData(tsidOutflowAverage);
                    console.log("timeSeriesDataOutflowAverage:", timeSeriesDataOutflowAverage);

                    // Fetch yesterday time series data
                    timeSeriesYesterdayDataGate1 = await fetchTimeSeriesYesterdayData(tsidGate1);
                    console.log("timeSeriesYesterdayDataGate1:", timeSeriesYesterdayDataGate1);

                    timeSeriesYesterdayDataGate2 = await fetchTimeSeriesYesterdayData(tsidGate2);
                    console.log("timeSeriesYesterdayDataGate2:", timeSeriesYesterdayDataGate2);

                    timeSeriesYesterdayDataGate3 = await fetchTimeSeriesYesterdayData(tsidGate3);
                    console.log("timeSeriesYesterdayDataGate3:", timeSeriesYesterdayDataGate3);

                    timeSeriesYesterdayDataGate4 = await fetchTimeSeriesYesterdayData(tsidGate4);
                    console.log("timeSeriesYesterdayDataGate4:", timeSeriesYesterdayDataGate4);

                    timeSeriesYesterdayDataSluiceTotal = await fetchTimeSeriesYesterdayData(tsidSluiceTotal);
                    console.log("timeSeriesYesterdayDataSluiceTotal:", timeSeriesYesterdayDataSluiceTotal);

                    timeSeriesYesterdayDataGateTotal = await fetchTimeSeriesYesterdayData(tsidGateTotal);
                    console.log("timeSeriesYesterdayDataGateTotal:", timeSeriesYesterdayDataGateTotal);

                    timeSeriesYesterdayDataOutflowTotal = await fetchTimeSeriesYesterdayData(tsidOutflowTotal);
                    console.log("timeSeriesYesterdayDataOutflowTotal:", timeSeriesYesterdayDataOutflowTotal);

                    timeSeriesYesterdayDataOutflowAverage = await fetchTimeSeriesYesterdayData(tsidOutflowAverage);
                    console.log("timeSeriesYesterdayDataOutflowAverage:", timeSeriesYesterdayDataOutflowAverage);

                    // Fetch tomorrow time series data
                    timeSeriesTomorrowDataOutflow = await fetchTimeSeriesTomorrowData(tsidOutflowTotal);
                    console.log("timeSeriesTomorrowDataOutflow:", timeSeriesTomorrowDataOutflow);

                    if ((timeSeriesDataGate1 && timeSeriesDataGate1.values && timeSeriesDataGate1.values.length > 0) || (timeSeriesYesterdayDataGate1 && timeSeriesYesterdayDataGate1.values && timeSeriesYesterdayDataGate1.values.length > 0)) {
                        console.log("Data for today found, Calling createTable ...");
                        console.log("This is a multiple row save.");

                        createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
                            tsidSluice1, timeSeriesDataSluice1, tsidSluice2, timeSeriesDataSluice2, tsidSluiceTotal, timeSeriesDataSluiceTotal,
                            tsidGate1, timeSeriesDataGate1, tsidGate2, timeSeriesDataGate2, tsidGate3, timeSeriesDataGate3, tsidGateTotal, timeSeriesDataGateTotal,
                            tsidOutflowTotal, timeSeriesDataOutflowTotal, tsidOutflowAverage, timeSeriesDataOutflowAverage,
                            timeSeriesYesterdayDataSluice1, timeSeriesYesterdayDataSluice2, timeSeriesYesterdayDataSluiceTotal, timeSeriesYesterdayDataGate1, timeSeriesYesterdayDataGate2,
                            timeSeriesYesterdayDataGate3, timeSeriesYesterdayDataGateTotal, timeSeriesYesterdayDataOutflowTotal, timeSeriesYesterdayDataOutflowAverage, tsidGate4, timeSeriesDataGate4, timeSeriesYesterdayDataGate4, timeSeriesTomorrowDataOutflow);

                        loadingIndicator.style.display = 'none';

                        loginStateController()
                        setInterval(async () => {
                            loginStateController()
                        }, 10000)
                    } else {
                        alert("No data from today or previous day found, Please enter data for the previous day.");
                    }
                } else if (lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
                    tsidGate1 = tsidGateData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidGate1:", tsidGate1);

                    tsidGate2 = tsidGateData['assigned-time-series'][1]['timeseries-id'];
                    console.log("tsidGate2:", tsidGate2);

                    tsidGate3 = tsidGateData['assigned-time-series'][2]['timeseries-id'];
                    console.log("tsidGate3:", tsidGate3);

                    tsidGateTotal = tsidGateTotalData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidGateTotal:", tsidGateTotal);

                    tsidOutflowAverage = tsidOutflowAverageData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidOutflowAverage:", tsidOutflowAverage);

                    // Fetch time series data
                    timeSeriesDataGate1 = await fetchTimeSeriesData(tsidGate1);
                    console.log("timeSeriesDataGate1:", timeSeriesDataGate1);

                    timeSeriesDataGate2 = await fetchTimeSeriesData(tsidGate2);
                    console.log("timeSeriesDataGate2:", timeSeriesDataGate2);

                    timeSeriesDataGate3 = await fetchTimeSeriesData(tsidGate3);
                    console.log("timeSeriesDataGate3:", timeSeriesDataGate3);

                    timeSeriesDataGateTotal = await fetchTimeSeriesData(tsidGateTotal);
                    console.log("timeSeriesDataGateTotal:", timeSeriesDataGateTotal);

                    timeSeriesDataOutflowAverage = await fetchTimeSeriesData(tsidOutflowAverage);
                    console.log("timeSeriesDataOutflowAverage:", timeSeriesDataOutflowAverage);

                    // Fetch yesterday time series data
                    timeSeriesYesterdayDataGate1 = await fetchTimeSeriesYesterdayData(tsidGate1);
                    console.log("timeSeriesYesterdayDataGate1:", timeSeriesYesterdayDataGate1);

                    timeSeriesYesterdayDataGate2 = await fetchTimeSeriesYesterdayData(tsidGate2);
                    console.log("timeSeriesYesterdayDataGate2:", timeSeriesYesterdayDataGate2);

                    timeSeriesYesterdayDataGate3 = await fetchTimeSeriesYesterdayData(tsidGate3);
                    console.log("timeSeriesYesterdayDataGate3:", timeSeriesYesterdayDataGate3);

                    timeSeriesYesterdayDataGateTotal = await fetchTimeSeriesYesterdayData(tsidGateTotal);
                    console.log("timeSeriesYesterdayDataGateTotal:", timeSeriesYesterdayDataGateTotal);

                    timeSeriesYesterdayDataOutflowAverage = await fetchTimeSeriesYesterdayData(tsidOutflowAverage);
                    console.log("timeSeriesYesterdayDataOutflowAverage:", timeSeriesYesterdayDataOutflowAverage);

                    // Fetch tomorrow time series data
                    timeSeriesTomorrowDataOutflow = await fetchTimeSeriesTomorrowData(tsidOutflowAverage);
                    console.log("timeSeriesTomorrowDataOutflow:", timeSeriesTomorrowDataOutflow);

                    if ((timeSeriesDataGate1 && timeSeriesDataGate1.values && timeSeriesDataGate1.values.length > 0) || (timeSeriesYesterdayDataGate1 && timeSeriesYesterdayDataGate1.values && timeSeriesYesterdayDataGate1.values.length > 0)) {
                        console.log("Data for today or yesterday found, Calling createTable ...");

                        createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
                            tsidSluice1, timeSeriesDataSluice1, tsidSluice2, timeSeriesDataSluice2, tsidSluiceTotal, timeSeriesDataSluiceTotal,
                            tsidGate1, timeSeriesDataGate1, tsidGate2, timeSeriesDataGate2, tsidGate3, timeSeriesDataGate3, tsidGateTotal, timeSeriesDataGateTotal,
                            tsidOutflowTotal, timeSeriesDataOutflowTotal, tsidOutflowAverage, timeSeriesDataOutflowAverage,
                            timeSeriesYesterdayDataSluice1, timeSeriesYesterdayDataSluice2, timeSeriesYesterdayDataSluiceTotal, timeSeriesYesterdayDataGate1, timeSeriesYesterdayDataGate2,
                            timeSeriesYesterdayDataGate3, timeSeriesYesterdayDataGateTotal, timeSeriesYesterdayDataOutflowTotal, timeSeriesYesterdayDataOutflowAverage, tsidGate4, timeSeriesDataGate4, timeSeriesYesterdayDataGate4, timeSeriesTomorrowDataOutflow);

                        loadingIndicator.style.display = 'none';

                        loginStateController()
                        setInterval(async () => {
                            loginStateController()
                        }, 10000)
                    } else {
                        alert("No data from today or previous day found, Please enter data for the previous day.");
                    }
                }

                function createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
                    tsidSluice1, timeSeriesDataSluice1, tsidSluice2, timeSeriesDataSluice2, tsidSluiceTotal, timeSeriesDataSluiceTotal,
                    tsidGate1, timeSeriesDataGate1, tsidGate2, timeSeriesDataGate2, tsidGate3, timeSeriesDataGate3, tsidGateTotal, timeSeriesDataGateTotal,
                    tsidOutflowTotal, timeSeriesDataOutflowTotal, tsidOutflowAverage, timeSeriesDataOutflowAverage,
                    timeSeriesYesterdayDataSluice1, timeSeriesYesterdayDataSluice2, timeSeriesYesterdayDataSluiceTotal, timeSeriesYesterdayDataGate1, timeSeriesYesterdayDataGate2,
                    timeSeriesYesterdayDataGate3, timeSeriesYesterdayDataGateTotal, timeSeriesYesterdayDataOutflowTotal, timeSeriesYesterdayDataOutflowAverage, tsidGate4, timeSeriesDataGate4, timeSeriesYesterdayDataGate4, timeSeriesTomorrowDataOutflow) {

                    const formatData = (data) => {
                        if (!data || !Array.isArray(data.values)) return [];

                        return data.values.map((entry) => {
                            const timestamp = entry[0];
                            const formattedTimestampCST = formatISODateToCSTString(Number(timestamp));
                            return {
                                ...entry,
                                formattedTimestampCST
                            };
                        });
                    };

                    // Today's data
                    let formattedDataSluice1 = null;
                    let formattedDataSluice2 = null;
                    let formattedDataSluiceTotal = null;
                    let formattedDataGate1 = null;;
                    let formattedDataGate2 = null;;
                    let formattedDataGate3 = null;
                    let formattedDataGate4 = null;
                    let formattedDataGateTotal = null;
                    let formattedDataOutflowTotal = null;;
                    let formattedDataOutflowAverage = null;

                    // Yesterday's data
                    let formattedYesterdayDataSluice1 = null;
                    let formattedYesterdayDataSluice2 = null;
                    let formattedYesterdayDataSluiceTotal = null;
                    let formattedYesterdayDataGate1 = null;
                    let formattedYesterdayDataGate2 = null;
                    let formattedYesterdayDataGate3 = null;
                    let formattedYesterdayDataGate4 = null;
                    let formattedYesterdayDataGateTotal = null;
                    let formattedYesterdayDataOutflowTotal = null;
                    let formattedYesterdayDataOutflowAverage = null;

                    // Tomorrow's data
                    let formattedTomorrowDataOutflowAverage = null;

                    if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                        // Today's data
                        formattedDataSluice1 = formatData(timeSeriesDataSluice1);
                        formattedDataSluice2 = formatData(timeSeriesDataSluice2);
                        formattedDataSluiceTotal = formatData(timeSeriesDataSluiceTotal);
                        formattedDataGate1 = formatData(timeSeriesDataGate1);
                        formattedDataGate2 = formatData(timeSeriesDataGate2);
                        formattedDataGate3 = formatData(timeSeriesDataGate3);
                        formattedDataGateTotal = formatData(timeSeriesDataGateTotal);
                        formattedDataOutflowTotal = formatData(timeSeriesDataOutflowTotal);
                        formattedDataOutflowAverage = formatData(timeSeriesDataOutflowAverage);

                        console.log("formattedDataSluice1:", formattedDataSluice1);
                        console.log("formattedDataSluice2:", formattedDataSluice2);
                        console.log("formattedDataSluiceTotal:", formattedDataSluiceTotal);
                        console.log("formattedDataGate1:", formattedDataGate1);
                        console.log("formattedDataGate2:", formattedDataGate2);
                        console.log("formattedDataGate3:", formattedDataGate3);
                        console.log("formattedDataGateTotal:", formattedDataGateTotal);
                        console.log("formattedDataOutflowTotal:", formattedDataOutflowTotal);
                        console.log("formattedDataOutflowAverage:", formattedDataOutflowAverage);

                        // Yesterday's data
                        formattedYesterdayDataSluice1 = formatData(timeSeriesYesterdayDataSluice1);
                        formattedYesterdayDataSluice2 = formatData(timeSeriesYesterdayDataSluice2);
                        formattedYesterdayDataSluiceTotal = formatData(timeSeriesYesterdayDataSluiceTotal);
                        formattedYesterdayDataGate1 = formatData(timeSeriesYesterdayDataGate1);
                        formattedYesterdayDataGate2 = formatData(timeSeriesYesterdayDataGate2);
                        formattedYesterdayDataGate3 = formatData(timeSeriesYesterdayDataGate3);
                        formattedYesterdayDataGateTotal = formatData(timeSeriesYesterdayDataGateTotal);
                        formattedYesterdayDataOutflowTotal = formatData(timeSeriesYesterdayDataOutflowTotal);
                        formattedYesterdayDataOutflowAverage = formatData(timeSeriesYesterdayDataOutflowAverage);

                        console.log("formattedYesterdayDataSluice1:", formattedYesterdayDataSluice1);
                        console.log("formattedYesterdayDataSluice2:", formattedYesterdayDataSluice2);
                        console.log("formattedYesterdayDataSluiceTotal:", formattedYesterdayDataSluiceTotal);
                        console.log("formattedYesterdayDataGate1:", formattedYesterdayDataGate1);
                        console.log("formattedYesterdayDataGate2:", formattedYesterdayDataGate2);
                        console.log("formattedYesterdayDataGate3:", formattedYesterdayDataGate3);
                        console.log("formattedYesterdayDataGateTotal:", formattedYesterdayDataGateTotal);
                        console.log("formattedYesterdayDataOutflowTotal:", formattedYesterdayDataOutflowTotal);
                        console.log("formattedYesterdayDataOutflowAverage:", formattedYesterdayDataOutflowAverage);

                        // Tomorrow's data
                        formattedTomorrowDataOutflowAverage = formatData(timeSeriesTomorrowDataOutflow);
                        console.log("formattedTomorrowDataOutflowAverage:", formattedTomorrowDataOutflowAverage);
                    } else if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                        // Today's data
                        formattedDataGate1 = formatData(timeSeriesDataGate1);
                        formattedDataGate2 = formatData(timeSeriesDataGate2);
                        formattedDataGate3 = formatData(timeSeriesDataGate3);
                        formattedDataGate4 = formatData(timeSeriesDataGate4);
                        formattedDataGateTotal = formatData(timeSeriesDataGateTotal);
                        formattedDataOutflowAverage = formatData(timeSeriesDataOutflowAverage);

                        console.log("formattedDataGate1:", formattedDataGate1);
                        console.log("formattedDataGate2:", formattedDataGate2);
                        console.log("formattedDataGate3:", formattedDataGate3);
                        console.log("formattedDataGate4:", formattedDataGate4);
                        console.log("formattedDataGateTotal:", formattedDataGateTotal);
                        console.log("formattedDataOutflowAverage:", formattedDataOutflowAverage);

                        // Yesterday's data
                        formattedYesterdayDataGate1 = formatData(timeSeriesYesterdayDataGate1);
                        formattedYesterdayDataGate2 = formatData(timeSeriesYesterdayDataGate2);
                        formattedYesterdayDataGate3 = formatData(timeSeriesYesterdayDataGate3);
                        formattedYesterdayDataGate4 = formatData(timeSeriesYesterdayDataGate4);
                        formattedYesterdayDataGateTotal = formatData(timeSeriesYesterdayDataGateTotal);
                        formattedYesterdayDataOutflowAverage = formatData(timeSeriesYesterdayDataOutflowAverage);

                        console.log("formattedYesterdayDataGate1:", formattedYesterdayDataGate1);
                        console.log("formattedYesterdayDataGate2:", formattedYesterdayDataGate2);
                        console.log("formattedYesterdayDataGate3:", formattedYesterdayDataGate3);
                        console.log("formattedYesterdayDataGate4:", formattedYesterdayDataGate4);
                        console.log("formattedYesterdayDataGateTotal:", formattedYesterdayDataGateTotal);
                        console.log("formattedYesterdayDataOutflowAverage:", formattedYesterdayDataOutflowAverage);

                        // Tomorrow's data
                        formattedTomorrowDataOutflowAverage = formatData(timeSeriesTomorrowDataOutflow);
                        console.log("formattedTomorrowDataOutflowAverage:", formattedTomorrowDataOutflowAverage);
                    } else if (lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                        // Today's data
                        formattedDataSluiceTotal = formatData(timeSeriesDataSluiceTotal);
                        formattedDataGate1 = formatData(timeSeriesDataGate1);
                        formattedDataGate2 = formatData(timeSeriesDataGate2);
                        formattedDataGate3 = formatData(timeSeriesDataGate3);
                        formattedDataGate4 = formatData(timeSeriesDataGate4);
                        formattedDataGateTotal = formatData(timeSeriesDataGateTotal);
                        formattedDataOutflowTotal = formatData(timeSeriesDataOutflowTotal);
                        formattedDataOutflowAverage = formatData(timeSeriesDataOutflowAverage);

                        console.log("formattedDataSluiceTotal:", formattedDataSluiceTotal);
                        console.log("formattedDataGate1:", formattedDataGate1);
                        console.log("formattedDataGate2:", formattedDataGate2);
                        console.log("formattedDataGate3:", formattedDataGate3);
                        console.log("formattedDataGate4:", formattedDataGate4);
                        console.log("formattedDataGateTotal:", formattedDataGateTotal);
                        console.log("formattedDataOutflowTotal:", formattedDataOutflowTotal);
                        console.log("formattedDataOutflowAverage:", formattedDataOutflowAverage);

                        // Yesterday's data
                        formattedYesterdayDataSluiceTotal = formatData(timeSeriesYesterdayDataSluiceTotal);
                        formattedYesterdayDataGate1 = formatData(timeSeriesYesterdayDataGate1);
                        formattedYesterdayDataGate2 = formatData(timeSeriesYesterdayDataGate2);
                        formattedYesterdayDataGate3 = formatData(timeSeriesYesterdayDataGate3);
                        formattedYesterdayDataGate4 = formatData(timeSeriesYesterdayDataGate4);
                        formattedYesterdayDataGateTotal = formatData(timeSeriesYesterdayDataGateTotal);
                        formattedYesterdayDataOutflowTotal = formatData(timeSeriesYesterdayDataOutflowTotal);
                        formattedYesterdayDataOutflowAverage = formatData(timeSeriesYesterdayDataOutflowAverage);

                        console.log("formattedYesterdayDataSluiceTotal:", formattedYesterdayDataSluiceTotal);
                        console.log("formattedYesterdayDataGate1:", formattedYesterdayDataGate1);
                        console.log("formattedYesterdayDataGate2:", formattedYesterdayDataGate2);
                        console.log("formattedYesterdayDataGate3:", formattedYesterdayDataGate3);
                        console.log("formattedYesterdayDataGate4:", formattedYesterdayDataGate4);
                        console.log("formattedYesterdayDataGateTotal:", formattedYesterdayDataGateTotal);
                        console.log("formattedYesterdayDataOutflowTotal:", formattedYesterdayDataOutflowTotal);
                        console.log("formattedYesterdayDataOutflowAverage:", formattedYesterdayDataOutflowAverage);

                        // Tomorrow's data
                        formattedTomorrowDataOutflowAverage = formatData(timeSeriesTomorrowDataOutflow);
                        console.log("formattedTomorrowDataOutflowAverage:", formattedTomorrowDataOutflowAverage);
                    } else if (lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
                        // Today's data
                        formattedDataGate1 = formatData(timeSeriesDataGate1);
                        formattedDataGate2 = formatData(timeSeriesDataGate2);
                        formattedDataGate3 = formatData(timeSeriesDataGate3);
                        formattedDataGateTotal = formatData(timeSeriesDataGateTotal);
                        formattedDataOutflowAverage = formatData(timeSeriesDataOutflowAverage);

                        console.log("formattedDataGate1:", formattedDataGate1);
                        console.log("formattedDataGate2:", formattedDataGate2);
                        console.log("formattedDataGate3:", formattedDataGate3);
                        console.log("formattedDataGateTotal:", formattedDataGateTotal);
                        console.log("formattedDataOutflowAverage:", formattedDataOutflowAverage);

                        // Yesterday's data
                        formattedYesterdayDataGate1 = formatData(timeSeriesYesterdayDataGate1);
                        formattedYesterdayDataGate2 = formatData(timeSeriesYesterdayDataGate2);
                        formattedYesterdayDataGate3 = formatData(timeSeriesYesterdayDataGate3);
                        formattedYesterdayDataGateTotal = formatData(timeSeriesYesterdayDataGateTotal);
                        formattedYesterdayDataOutflowAverage = formatData(timeSeriesYesterdayDataOutflowAverage);

                        console.log("formattedYesterdayDataGate1:", formattedYesterdayDataGate1);
                        console.log("formattedYesterdayDataGate2:", formattedYesterdayDataGate2);
                        console.log("formattedYesterdayDataGate3:", formattedYesterdayDataGate3);
                        console.log("formattedYesterdayDataGateTotal:", formattedYesterdayDataGateTotal);
                        console.log("formattedYesterdayDataOutflowAverage:", formattedYesterdayDataOutflowAverage);

                        // Tomorrow's data
                        formattedTomorrowDataOutflowAverage = formatData(timeSeriesTomorrowDataOutflow);
                        console.log("formattedTomorrowDataOutflowAverage:", formattedTomorrowDataOutflowAverage);
                    }

                    const table = document.createElement("table");

                    table.id = "gate-settings";

                    const headerRow = document.createElement("tr");

                    const dateHeader = document.createElement("th");
                    dateHeader.textContent = "Time";
                    headerRow.appendChild(dateHeader);

                    if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                        const sluice1Header = document.createElement("th");
                        sluice1Header.textContent = "Sluice 1 (ft)";
                        headerRow.appendChild(sluice1Header);

                        const sluice2Header = document.createElement("th");
                        sluice2Header.textContent = "Sluice 2 (ft)";
                        headerRow.appendChild(sluice2Header);

                        const sluiceTotalHeader = document.createElement("th");
                        sluiceTotalHeader.textContent = "Sluice Total (cfs)";
                        headerRow.appendChild(sluiceTotalHeader);
                    }

                    if (lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                        const sluiceTotalHeader = document.createElement("th");
                        sluiceTotalHeader.textContent = "Sluice Total (cfs)";
                        headerRow.appendChild(sluiceTotalHeader);
                    }

                    const gate1Header = document.createElement("th");
                    gate1Header.textContent = "Gate 1 (ft)";
                    headerRow.appendChild(gate1Header);

                    const gate2Header = document.createElement("th");
                    gate2Header.textContent = "Gate 2 (ft)";
                    headerRow.appendChild(gate2Header);

                    const gate3Header = document.createElement("th");
                    gate3Header.textContent = "Gate 3 (ft)";
                    headerRow.appendChild(gate3Header);

                    if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                        const gate4Header = document.createElement("th");
                        gate4Header.textContent = "Gate 4 (ft)";
                        headerRow.appendChild(gate4Header);
                    }

                    const gateTotalHeader = document.createElement("th");
                    gateTotalHeader.textContent = "Gate Total (cfs)";
                    headerRow.appendChild(gateTotalHeader);

                    if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                        const outflowTotalHeader = document.createElement("th");
                        outflowTotalHeader.textContent = "Outflow Total (cfs)";
                        headerRow.appendChild(outflowTotalHeader);
                    }

                    table.appendChild(headerRow);

                    // Determine wheathe to display exising data or new data
                    let todayDataExists = false;

                    if (formattedDataGate1.length > 0) {
                        todayDataExists = true;
                    }
                    console.log("todayDataExists:", todayDataExists);

                    // ********************************************************************************************************************************************** New Entry Data
                    if (todayDataExists === false) {
                        let entryDates = [1]; // Single hardcoded entry

                        const selectedHours = {};
                        let averageOutflowCalculate = null;

                        entryDates.forEach((date, index) => {
                            const row = document.createElement("tr");

                            const timeCell = document.createElement("td");

                            // Hardcode the time to "00:00"
                            const timeText = document.createElement("span");
                            timeText.textContent = "00:00";

                            // Set a fixed id since there's only one row
                            timeText.id = "timeText";

                            selectedHours["hour1"] = "00:00";

                            timeCell.appendChild(timeText);
                            row.appendChild(timeCell);

                            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                                // Sluice1 cell (editable)
                                const sluice1Cell = document.createElement("td");
                                const sluice1Input = document.createElement("input");
                                sluice1Input.type = "number";
                                sluice1Input.value = formattedYesterdayDataSluice1.at(-1)[1].toFixed(1);
                                sluice1Input.id = `sluice1Input`;

                                if (index === 0) {
                                    sluice1Input.style.backgroundColor = "pink";
                                }

                                sluice1Cell.appendChild(sluice1Input);
                                row.appendChild(sluice1Cell);
                                // console.log(document.getElementById(`sluice1Input`));  // Check if element exists

                                // Sluice2 cell (editable)
                                const sluice2Cell = document.createElement("td");
                                const sluice2Input = document.createElement("input");
                                sluice2Input.type = "number";
                                sluice2Input.value = formattedYesterdayDataSluice2.at(-1)[1].toFixed(1);
                                sluice2Input.id = `sluice2Input`;

                                if (index === 0) {
                                    sluice2Input.style.backgroundColor = "pink";
                                }

                                sluice2Cell.appendChild(sluice2Input);
                                row.appendChild(sluice2Cell);
                            }

                            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                // Sluice Total cell (editable)
                                const sluiceTotalCell = document.createElement("td");
                                const sluiceTotalInput = document.createElement("input");
                                sluiceTotalInput.type = "number";
                                sluiceTotalInput.value = formattedYesterdayDataSluiceTotal.at(-1)[1].toFixed(0);
                                sluiceTotalInput.id = `sluiceTotalInput`;

                                if (index === 0) {
                                    sluiceTotalInput.style.backgroundColor = "pink";
                                }

                                sluiceTotalCell.appendChild(sluiceTotalInput);
                                row.appendChild(sluiceTotalCell);
                            }

                            // Gate 1 (editable)
                            const gate1Cell = document.createElement("td");
                            const gate1Input = document.createElement("input");
                            gate1Input.type = "number";
                            gate1Input.value = formattedYesterdayDataGate1.at(-1)[1].toFixed(1);
                            gate1Input.id = `gate1Input`;
                            if (index === 0) {
                                gate1Input.style.backgroundColor = "pink";
                            }
                            gate1Cell.appendChild(gate1Input);
                            row.appendChild(gate1Cell);

                            // Gate 2 (editable)
                            const gate2Cell = document.createElement("td");
                            const gate2Input = document.createElement("input");
                            gate2Input.type = "number";
                            gate2Input.value = formattedYesterdayDataGate2.at(-1)[1].toFixed(1);
                            gate2Input.id = `gate2Input`;
                            if (index === 0) {
                                gate2Input.style.backgroundColor = "pink";
                            }
                            gate2Cell.appendChild(gate2Input);
                            row.appendChild(gate2Cell);

                            // Gate 3 (editable)
                            const gate3Cell = document.createElement("td");
                            const gate3Input = document.createElement("input");
                            gate3Input.type = "number";
                            gate3Input.value = formattedYesterdayDataGate3.at(-1)[1].toFixed(1);
                            gate3Input.id = `gate3Input`;
                            if (index === 0) {
                                gate3Input.style.backgroundColor = "pink";
                            }
                            gate3Cell.appendChild(gate3Input);
                            row.appendChild(gate3Cell);

                            // Gate 4 (editable)
                            if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                const gate4Cell = document.createElement("td");
                                const gate4Input = document.createElement("input");
                                gate4Input.type = "number";
                                gate4Input.value = formattedYesterdayDataGate4.at(-1)[1].toFixed(1);
                                gate4Input.id = `gate4Input`;
                                if (index === 0) {
                                    gate4Input.style.backgroundColor = "pink";
                                }
                                gate4Cell.appendChild(gate4Input);
                                row.appendChild(gate4Cell);
                            }

                            // Gate Total Flow (editable)
                            const gateTotalCell = document.createElement("td");
                            const gateTotalInput = document.createElement("input");
                            gateTotalInput.type = "number";
                            gateTotalInput.value = formattedYesterdayDataGateTotal.at(-1)[1].toFixed(0);
                            gateTotalInput.id = `gateTotalInput`;
                            if (index === 0) {
                                gateTotalInput.style.backgroundColor = "pink";
                            }
                            gateTotalCell.appendChild(gateTotalInput);
                            row.appendChild(gateTotalCell);

                            // Outflow Average Total (calculated)
                            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                averageOutflowCalculate = (formattedYesterdayDataGateTotal.at(-1)[1] + formattedYesterdayDataSluiceTotal.at(-1)[1]).toFixed(0);
                                const gateOutflowTotalCell = document.createElement("td");
                                const gateOutflowTotalInput = document.createElement("input");
                                gateOutflowTotalInput.type = "number";
                                gateOutflowTotalInput.value = averageOutflowCalculate;
                                gateOutflowTotalInput.id = `gateOutflowTotalInput`;
                                gateOutflowTotalInput.readOnly = true; // Make it read-only
                                gateOutflowTotalInput.style.backgroundColor = "#f0f0f0";
                                gateOutflowTotalCell.appendChild(gateOutflowTotalInput);
                                row.appendChild(gateOutflowTotalCell);
                            }

                            table.appendChild(row);
                        });
                    }

                    // ********************************************************************************************************************************************** Existing Data
                    if (todayDataExists === true) {
                        let entryDates = [];

                        // Generate options for dropdown (24-hour format)
                        const times = [];
                        for (let hour = 0; hour < 24; hour++) {
                            const time = `${hour.toString().padStart(2, '0')}:00`;
                            times.push(time);
                        }

                        console.log("times for dropdown:", times);

                        entryDates = [1];

                        const selectedHours = {};

                        // Display existing data
                        formattedDataGate1.forEach((date, index) => {
                            const row = document.createElement("tr");

                            const timeCell = document.createElement("td");
                            const timeSelect = document.createElement("select");
                            timeSelect.id = `timeSelect${index}`;

                            // Extract only the time part (HH:mm) from formattedTimestampCST
                            const formattedTime = date.formattedTimestampCST.split(" ")[1].slice(0, 5);

                            // Add "NONE" as the first option
                            const noneOption = document.createElement("option");
                            noneOption.value = "23:59";
                            noneOption.textContent = "NONE";
                            timeSelect.appendChild(noneOption);

                            // Create options for the dropdown (24 hours)
                            times.forEach(time => {
                                const option = document.createElement("option");
                                option.value = time;
                                option.textContent = time;
                                if (time === formattedTime) {
                                    option.selected = true; // Match the extracted time
                                }
                                timeSelect.appendChild(option);
                            });

                            // Disable selection for the first row
                            if (index === 0) {
                                timeSelect.disabled = true;
                            }

                            // Update the selected time when changed
                            timeSelect.addEventListener("change", (event) => {
                                console.log(`Row ${index + 1} selected time:`, event.target.value, "Type:", typeof event.target.value);
                            });

                            timeCell.appendChild(timeSelect);
                            row.appendChild(timeCell);

                            // Sluice1 cell (editable)
                            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                                const sluice1Cell = document.createElement("td");
                                const sluice1Input = document.createElement("input");
                                sluice1Input.type = "number";
                                sluice1Input.step = "0.1";
                                sluice1Input.value = formattedDataSluice1[index] ? formattedDataSluice1[index][1].toFixed(1) : 909; // (date[1]).toFixed(1);
                                sluice1Input.id = `sluice1Input-${index}`;
                                sluice1Cell.appendChild(sluice1Input);
                                row.appendChild(sluice1Cell);
                                // console.log("sluice1Input: ", `sluice1Input-${index}`)


                                // Sluice2 cell (editable)
                                const sluice2Cell = document.createElement("td");
                                const sluice2Input = document.createElement("input");
                                sluice2Input.type = "number";
                                sluice2Input.step = "0.1";
                                sluice2Input.value = formattedDataSluice2[index] ? formattedDataSluice2[index][1].toFixed(1) : 909;
                                sluice2Input.id = `sluice2Input-${index}`;
                                sluice2Cell.appendChild(sluice2Input);
                                row.appendChild(sluice2Cell);
                                // console.log("sluice2Input: ", `sluice2Input-${index}`)
                            }

                            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                // Sluice Total cell (editable)
                                const sluiceTotalCell = document.createElement("td");
                                const sluiceTotalInput = document.createElement("input");
                                sluiceTotalInput.type = "number";
                                sluiceTotalInput.step = "10.0";
                                sluiceTotalInput.value = formattedDataSluiceTotal[index] ? formattedDataSluiceTotal[index][1].toFixed(0) : 909;
                                sluiceTotalInput.id = `sluiceTotalInput-${index}`;
                                sluiceTotalCell.appendChild(sluiceTotalInput);
                                row.appendChild(sluiceTotalCell);
                            }

                            // Gate 1 (editable)
                            const gate1Cell = document.createElement("td");
                            const gate1Input = document.createElement("input");
                            gate1Input.type = "number";
                            gate1Input.step = "0.1";
                            gate1Input.value = formattedDataGate1[index] ? formattedDataGate1[index][1].toFixed(1) : 909;
                            gate1Input.id = `gate1Input-${index}`;
                            gate1Cell.appendChild(gate1Input);
                            row.appendChild(gate1Cell);

                            // Gate 2 (editable)
                            const gate2Cell = document.createElement("td");
                            const gate2Input = document.createElement("input");
                            gate2Input.type = "number";
                            gate2Input.step = "0.1";
                            gate2Input.value = formattedDataGate2[index] ? formattedDataGate2[index][1].toFixed(1) : 909;
                            gate2Input.id = `gate2Input-${index}`;
                            gate2Cell.appendChild(gate2Input);
                            row.appendChild(gate2Cell);

                            // Gate 3 (editable)
                            const gate3Cell = document.createElement("td");
                            const gate3Input = document.createElement("input");
                            gate3Input.type = "number";
                            gate3Input.step = "0.1";
                            gate3Input.value = formattedDataGate3[index] ? formattedDataGate3[index][1].toFixed(1) : 909;
                            gate3Input.id = `gate3Input-${index}`;
                            gate3Cell.appendChild(gate3Input);
                            row.appendChild(gate3Cell);

                            // Gate 4 (editable)
                            if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                const gate4Cell = document.createElement("td");
                                const gate4Input = document.createElement("input");
                                gate4Input.type = "number";
                                gate4Input.step = "0.1";
                                gate4Input.value = formattedDataGate4[index] ? formattedDataGate4[index][1].toFixed(1) : 909;
                                gate4Input.id = `gate4Input-${index}`;
                                gate4Cell.appendChild(gate4Input);
                                row.appendChild(gate4Cell);
                            }

                            // Total Gate Outflow (calculated)
                            const gateTotalCell = document.createElement("td");
                            const gateTotalInput = document.createElement("input");
                            gateTotalInput.type = "number";
                            gateTotalInput.step = "10.0";
                            gateTotalInput.value = formattedDataGateTotal[index][1].toFixed(0);
                            gateTotalInput.id = `gateTotalInput-${index}`;
                            gateTotalCell.appendChild(gateTotalInput);
                            row.appendChild(gateTotalCell);


                            // Total Outflow (calculated)
                            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                const gateOutflowTotalCell = document.createElement("td");
                                const gateOutflowTotalInput = document.createElement("input");
                                gateOutflowTotalInput.type = "number";

                                const gateValue = formattedDataGateTotal[index]?.[1] || 0;
                                const sluiceValue = formattedDataSluiceTotal ? (formattedDataSluiceTotal[index]?.[1] || 0) : 0;

                                gateOutflowTotalInput.value = (gateValue + sluiceValue).toFixed(0);
                                gateOutflowTotalInput.id = `gateOutflowTotalInput-${index}`;
                                gateOutflowTotalInput.readOnly = true;
                                gateOutflowTotalInput.style.backgroundColor = "#f0f0f0";

                                gateOutflowTotalCell.appendChild(gateOutflowTotalInput);
                                row.appendChild(gateOutflowTotalCell);
                            }

                            table.appendChild(row);
                        });

                        // Display new data entry
                        entryDates.forEach((date, index) => {
                            const row = document.createElement("tr");
                            const timeCell = document.createElement("td");
                            const timeSelect = document.createElement("select");
                            timeSelect.id = "timeSelect";

                            const hourKey = "hour1";
                            selectedHours[hourKey] = "NONE"; // Default value

                            // Add "NONE" option
                            const noneOption = new Option("NONE", "NONE");
                            timeSelect.appendChild(noneOption);

                            // Add 24-hour options
                            times.forEach(time => {
                                timeSelect.appendChild(new Option(time, time));
                            });

                            // Set default selection
                            timeSelect.value = selectedHours[hourKey];

                            // Update selectedHours on change
                            timeSelect.addEventListener("change", (event) => {
                                selectedHours[hourKey] = event.target.value;
                                console.log(`${hourKey} selected:`, selectedHours[hourKey]);
                            });

                            timeCell.appendChild(timeSelect);
                            row.appendChild(timeCell);

                            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                                // Sluice1 cell (editable)
                                const sluice1Cell = document.createElement("td");
                                const sluice1Input = document.createElement("input");
                                sluice1Input.type = "number";
                                sluice1Input.value = null;
                                sluice1Input.id = `sluice1AdditionalInput`;
                                sluice1Input.style.backgroundColor = "lightgray";
                                sluice1Cell.appendChild(sluice1Input);
                                row.appendChild(sluice1Cell);

                                // Sluice2 cell (editable)
                                const sluice2Cell = document.createElement("td");
                                const sluice2Input = document.createElement("input");
                                sluice2Input.type = "number";
                                sluice2Input.value = null;
                                sluice2Input.id = `sluice2AdditionalInput`;
                                sluice2Input.style.backgroundColor = "lightgray";
                                sluice2Cell.appendChild(sluice2Input);
                                row.appendChild(sluice2Cell);
                            }

                            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                // Sluice Total cell (editable)
                                const sluiceTotalCell = document.createElement("td");
                                const sluiceTotalInput = document.createElement("input");
                                sluiceTotalInput.type = "number";
                                sluiceTotalInput.value = null;
                                sluiceTotalInput.id = `sluiceTotalAdditionalInput`;
                                sluiceTotalInput.style.backgroundColor = "lightgray";
                                sluiceTotalCell.appendChild(sluiceTotalInput);
                                row.appendChild(sluiceTotalCell);
                            }

                            // Gate 1 (editable)
                            const gate1Cell = document.createElement("td");
                            const gate1Input = document.createElement("input");
                            gate1Input.type = "number";
                            gate1Input.value = null;
                            gate1Input.id = `gate1AdditionalInput`;
                            gate1Input.style.backgroundColor = "lightgray";
                            gate1Cell.appendChild(gate1Input);
                            row.appendChild(gate1Cell);

                            // Gate 2 (editable)
                            const gate2Cell = document.createElement("td");
                            const gate2Input = document.createElement("input");
                            gate2Input.type = "number";
                            gate2Input.value = null;
                            gate2Input.id = `gate2AdditionalInput`;
                            gate2Input.style.backgroundColor = "lightgray";
                            gate2Cell.appendChild(gate2Input);
                            row.appendChild(gate2Cell);

                            // Gate 3 (editable)
                            const gate3Cell = document.createElement("td");
                            const gate3Input = document.createElement("input");
                            gate3Input.type = "number";
                            gate3Input.value = null;
                            gate3Input.id = `gate3AdditionalInput`;
                            gate3Input.style.backgroundColor = "lightgray";
                            gate3Cell.appendChild(gate3Input);
                            row.appendChild(gate3Cell);

                            if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                // Gate 4 (editable)
                                const gate4Cell = document.createElement("td");
                                const gate4Input = document.createElement("input");
                                gate4Input.type = "number";
                                gate4Input.value = null;
                                gate4Input.id = `gate4AdditionalInput`;
                                gate4Input.style.backgroundColor = "lightgray";
                                gate4Cell.appendChild(gate4Input);
                                row.appendChild(gate4Cell);
                            }

                            // Gate Total (calculated)
                            const gateTotalCell = document.createElement("td");
                            const gateTotalInput = document.createElement("input");
                            gateTotalInput.type = "number";
                            gateTotalInput.value = null;
                            gateTotalInput.id = `gateTotalAdditionalInput`;
                            gateTotalInput.style.backgroundColor = "lightgray";
                            gateTotalCell.appendChild(gateTotalInput);
                            row.appendChild(gateTotalCell);

                            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                // Total Outflow (calculated)
                                const gateOutflowTotalCell = document.createElement("td");
                                const gateOutflowTotalInput = document.createElement("input");
                                gateOutflowTotalInput.type = "number";
                                gateOutflowTotalInput.value = null;
                                gateOutflowTotalInput.id = `gateOutflowTotalAdditionalInput`;
                                gateOutflowTotalInput.readOnly = true; // Make it read-only
                                gateOutflowTotalInput.style.backgroundColor = "#f0f0f0";
                                gateOutflowTotalCell.appendChild(gateOutflowTotalInput);
                                row.appendChild(gateOutflowTotalCell);
                            }

                            table.appendChild(row);
                        });
                    }

                    // Append the table to the specific container (id="output4")
                    const output6Div = document.getElementById("output4");
                    output6Div.innerHTML = ""; // Clear any existing content
                    output6Div.appendChild(table);

                    const gateAverageDiv = document.createElement("div");
                    gateAverageDiv.className = "status";

                    // Create a tableOutflowAvg
                    const tableOutflowAvg = document.createElement("table");
                    const tableRow = document.createElement("tr");
                    tableOutflowAvg.style.width = "50%";
                    tableOutflowAvg.style.marginTop = "10px";
                    tableOutflowAvg.id = "gate-outflow-average-table";

                    // Create the first cell for "Average Outflow (cfs)"
                    const firstCell = document.createElement("td");
                    firstCell.textContent = "Average Outflow (cfs)";
                    tableRow.appendChild(firstCell);

                    // Create the second cell with "--"
                    const secondCell = document.createElement("td");
                    secondCell.id = `gateOutflowAverageInput`;

                    // Determine average outflow value
                    let outflowValue;
                    let isYesterdayOrDefault = false;
                    if (formattedDataOutflowAverage?.[0]?.[1] !== undefined) {
                        outflowValue = formattedDataOutflowAverage[0][1];
                    } else if (formattedYesterdayDataOutflowAverage?.[0]?.[1] !== undefined) {
                        outflowValue = formattedYesterdayDataOutflowAverage[0][1];
                        isYesterdayOrDefault = true;
                    } else {
                        outflowValue = 909;
                        isYesterdayOrDefault = true;
                    }
                    secondCell.value = outflowValue;
                    secondCell.innerHTML = outflowValue.toFixed(0);
                    // Only color pink if yesterday's data or 909
                    if (isYesterdayOrDefault) {
                        secondCell.style.backgroundColor = "pink";
                    }
                    tableRow.appendChild(secondCell);

                    // Append the row to the tableOutflowAvg
                    tableOutflowAvg.appendChild(tableRow);

                    // Append the tableOutflowAvg to the div
                    gateAverageDiv.appendChild(tableOutflowAvg);

                    // Append the div to output6Div
                    output6Div.appendChild(gateAverageDiv);

                    const cdaSaveBtn = document.createElement("button");
                    cdaSaveBtn.textContent = "Submit";
                    cdaSaveBtn.id = "cda-btn-gate";
                    cdaSaveBtn.disabled = true;
                    output6Div.appendChild(cdaSaveBtn);

                    const statusDiv = document.createElement("div");
                    statusDiv.className = "status";
                    const cdaStatusBtn = document.createElement("button");
                    cdaStatusBtn.textContent = "";
                    cdaStatusBtn.id = "cda-btn-gate";
                    cdaStatusBtn.disabled = false;
                    statusDiv.appendChild(cdaStatusBtn);
                    output6Div.appendChild(statusDiv);

                    // Create the buttonRefresh button
                    const buttonRefresh = document.createElement('button');
                    buttonRefresh.textContent = 'Refresh';
                    buttonRefresh.id = 'refresh-gate-settings-button';
                    buttonRefresh.className = 'fetch-btn';
                    output6Div.appendChild(buttonRefresh);

                    buttonRefresh.addEventListener('click', () => {
                        // Remove existing table
                        const existingTable = document.getElementById('gate-settings');
                        if (existingTable) {
                            existingTable.remove();
                        }

                        // Remove both buttons
                        const existingButton = document.getElementById('gate-outflow-average-table');
                        if (existingButton) {
                            existingButton.remove();
                        }

                        const existingRefresh = document.getElementById('cda-btn-gate');
                        if (existingRefresh) {
                            existingRefresh.remove();
                        }

                        // Fetch and create new table
                        fetchTsidData();
                    });

                    let hasValidNewEntryHour = null;
                    let payloads = null;
                    let payloadAverageOutflow = null;

                    let payloadNewEntrySluice1 = null;
                    let payloadNewEntrySluice2 = null;
                    let payloadNewEntrySluiceTotal = null;
                    let payloadNewEntryGate1 = null;
                    let payloadNewEntryGate2 = null;
                    let payloadNewEntryGate3 = null;
                    let payloadNewEntryGate4 = null;
                    let payloadNewEntryGateTotal = null;
                    let payloadNewEntryOutflowTotal = null;
                    let payloadNewEntryOutflowAverage = null;

                    let isDeleteEntryPayload = null;

                    cdaSaveBtn.addEventListener("click", async () => {
                        // ********************************************************************************************************************************************** Prepare the payloads for new entry
                        if (todayDataExists === false) {
                            console.log("todayDataExists is false, preparing payloads for new entry...");

                            let sluice1Input = null;
                            let sluice2Input = null;
                            let sluiceTotalInput = null;
                            let gate1Input = null;
                            let gate2Input = null;
                            let gate3Input = null;
                            let gate4Input = null;
                            let gateTotalInput = null;
                            let gateOutflowTotalInput = null;
                            let gateOutflowAverageInput = null;

                            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                                // Get the sluice1 input element and check if it exists
                                sluice1Input = document.getElementById(`sluice1Input`);
                                if (!sluice1Input) {
                                    console.error("sluice1Input element not found!");
                                    return; // Exit if input is missing
                                }
                                if (!sluice1Input.value) {
                                    sluice1Input.value = 909;
                                }

                                // Get the sluice2 input element and check if it exists
                                sluice2Input = document.getElementById('sluice2Input');
                                if (!sluice2Input) {
                                    console.error("sluice2Input element not found!");
                                    return; // Exit if input is missing
                                }
                                if (!sluice2Input.value) {
                                    sluice2Input.value = 909;
                                }
                            }

                            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                // Get the sluiceTotal input element and check if it exists
                                sluiceTotalInput = document.getElementById('sluiceTotalInput');
                                if (!sluiceTotalInput) {
                                    console.error("sluiceTotalInput element not found!");
                                    return; // Exit if input is missing
                                }
                                if (!sluiceTotalInput.value) {
                                    sluiceTotalInput.value = 909;
                                }
                            }

                            // Get the Gate1 input element and check if it exists
                            gate1Input = document.getElementById('gate1Input');
                            if (!gate1Input) {
                                console.error("gate1Input element not found!");
                                return; // Exit if input is missing
                            }
                            if (!gate1Input.value) {
                                gate1Input.value = 909;
                            }

                            // Get the Gate2 input element and check if it exists
                            gate2Input = document.getElementById('gate2Input');
                            if (!gate2Input) {
                                console.error("gate2Input element not found!");
                                return; // Exit if input is missing
                            }
                            if (!gate2Input.value) {
                                gate2Input.value = 909;
                            }

                            // Get the Gate3 input element and check if it exists
                            gate3Input = document.getElementById('gate3Input');
                            if (!gate3Input) {
                                console.error("gate3Input element not found!");
                                return; // Exit if input is missing
                            }
                            if (!gate3Input.value) {
                                gate3Input.value = 909;
                            }

                            if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                // Get the Gate4 input element and check if it exists
                                gate4Input = document.getElementById('gate4Input');
                                if (!gate4Input) {
                                    console.error("gate4Input element not found!");
                                    return; // Exit if input is missing
                                }
                                if (!gate4Input.value) {
                                    gate4Input.value = 909;
                                }
                            }

                            // Get the GateTotal input element and check if it exists
                            gateTotalInput = document.getElementById('gateTotalInput');
                            if (!gateTotalInput) {
                                console.error("gateTotalInput element not found!");
                                return; // Exit if input is missing
                            }
                            if (!gateTotalInput.value) {
                                gateTotalInput.value = 909;
                            }

                            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                // Get the gateOutflowTotal input element and check if it exists
                                gateOutflowTotalInput = document.getElementById('gateOutflowTotalInput');
                                console.log("gateOutflowTotalInput: ", gateOutflowTotalInput);
                                if (!gateOutflowTotalInput) {
                                    console.error("gateOutflowTotalInput element not found!");
                                    return; // Exit if input is missing
                                }
                                if (!gateOutflowTotalInput.value) {
                                    gateOutflowTotalInput.value = 909;
                                }
                            }

                            timeInput = document.getElementById('timeText').textContent;
                            if (!timeInput) {
                                console.error("timeInput element not found!");
                                return; // Exit if input is missing
                            }

                            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                                payloadNewEntrySluice1 = {
                                    "name": tsidSluice1,
                                    "office-id": office,
                                    "units": "ft",
                                    "values": [
                                        [
                                            timeInput,
                                            sluice1Input.value,
                                            0
                                        ],
                                    ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                                };
                                console.log("payloadNewEntrySluice1: ", payloadNewEntrySluice1);

                                payloadNewEntrySluice2 = {
                                    "name": tsidSluice2,
                                    "office-id": office,
                                    "units": "ft",
                                    "values": [
                                        [
                                            convertToISO(timeInput),
                                            sluice2Input.value,
                                            0
                                        ],
                                    ].filter(item => item[0] !== null),
                                };
                                console.log("payloadNewEntrySluice2: ", payloadNewEntrySluice2);
                            }

                            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                payloadNewEntrySluiceTotal = {
                                    "name": tsidSluiceTotal,
                                    "office-id": office,
                                    "units": "cfs",
                                    "values": [
                                        [
                                            convertToISO(timeInput),
                                            sluiceTotalInput.value,
                                            0
                                        ],
                                    ].filter(item => item[0] !== null),
                                };
                                console.log("payloadNewEntrySluiceTotal: ", payloadNewEntrySluiceTotal);
                            }

                            payloadNewEntryGate1 = {
                                "name": tsidGate1,
                                "office-id": office,
                                "units": "ft",
                                "values": [
                                    [
                                        convertToISO(timeInput),
                                        gate1Input.value,
                                        0
                                    ],
                                ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                            };
                            console.log("payloadNewEntryGate1: ", payloadNewEntryGate1);

                            payloadNewEntryGate2 = {
                                "name": tsidGate2,
                                "office-id": office,
                                "units": "ft",
                                "values": [
                                    [
                                        convertToISO(timeInput),
                                        gate2Input.value,
                                        0
                                    ],
                                ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                            };
                            console.log("payloadNewEntryGate2: ", payloadNewEntryGate2);

                            payloadNewEntryGate3 = {
                                "name": tsidGate3,
                                "office-id": office,
                                "units": "ft",
                                "values": [
                                    [
                                        convertToISO(timeInput),
                                        gate3Input.value,
                                        0
                                    ],
                                ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                            };
                            console.log("payloadNewEntryGate3: ", payloadNewEntryGate3);

                            if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                payloadNewEntryGate4 = {
                                    "name": tsidGate4,
                                    "office-id": office,
                                    "units": "ft",
                                    "values": [
                                        [
                                            convertToISO(timeInput),
                                            gate4Input.value,
                                            0
                                        ],
                                    ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                                };
                                console.log("payloadNewEntryGate4: ", payloadNewEntryGate4);
                            }

                            payloadNewEntryGateTotal = {
                                "name": tsidGateTotal,
                                "office-id": office,
                                "units": "cfs",
                                "values": [
                                    [
                                        convertToISO(timeInput),
                                        gateTotalInput.value,
                                        0
                                    ],
                                ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                            };
                            console.log("payloadNewEntryGateTotal: ", payloadNewEntryGateTotal);

                            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                payloadNewEntryOutflowTotal = {
                                    "name": tsidOutflowTotal,
                                    "office-id": office,
                                    "units": "cfs",
                                    "values": [
                                        [
                                            convertToISO(timeInput),
                                            gateOutflowTotalInput.value,
                                            0
                                        ],
                                    ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                                };
                                console.log("payloadNewEntryOutflowTotal: ", payloadNewEntryOutflowTotal);
                            }

                            if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
                                payloadNewEntryOutflowAverage = {
                                    "name": tsidOutflowAverage,
                                    "office-id": office,
                                    "units": "cfs",
                                    "values": [
                                        [
                                            convertToISO(timeInput),
                                            gateTotalInput.value,
                                            0
                                        ],
                                    ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                                };
                            }
                            console.log("payloadNewEntryOutflowAverage: ", payloadNewEntryOutflowAverage);
                        }

                        // ********************************************************************************************************************************************** Prepare the payloads for existing entry
                        if (todayDataExists === true) {
                            console.log("todayDataExists is true, preparing payloads for existing entry...");

                            // Get existing data for the selected times
                            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                                console.log("getAllSelectedTimes: ", getAllSelectedTimes());
                                console.log("getAllSluice1Values: ", getAllSluice1Values());
                                console.log("getAllSluice2Values: ", getAllSluice2Values());
                                console.log("getAllSluiceTotalValues: ", getAllSluiceTotalValues());
                                console.log("getAllGate1Values: ", getAllGate1Values());
                                console.log("getAllGate2Values: ", getAllGate2Values());
                                console.log("getAllGate3Values: ", getAllGate3Values());
                                console.log("getAllGateTotalValues: ", getAllGateTotalValues());
                                console.log("getAllOutflowTotalValues: ", getAllOutflowTotalValues());
                                console.log("getAllOutflowAverageValues: ", getAllOutflowAverageValues());
                            } else if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                                console.log("getAllSelectedTimes: ", getAllSelectedTimes());
                                console.log("getAllGate1Values: ", getAllGate1Values());
                                console.log("getAllGate2Values: ", getAllGate2Values());
                                console.log("getAllGate3Values: ", getAllGate3Values());
                                console.log("getAllGate4Values: ", getAllGate4Values());
                                console.log("getAllGateTotalValues: ", getAllGateTotalValues());
                                console.log("getAllOutflowAverageValues: ", getAllOutflowAverageValues());
                            } else if (lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                console.log("getAllSelectedTimes: ", getAllSelectedTimes());
                                console.log("getAllSluiceTotalValues: ", getAllSluiceTotalValues());
                                console.log("getAllGate1Values: ", getAllGate1Values());
                                console.log("getAllGate2Values: ", getAllGate2Values());
                                console.log("getAllGate3Values: ", getAllGate3Values());
                                console.log("getAllGate4Values: ", getAllGate4Values());
                                console.log("getAllGateTotalValues: ", getAllGateTotalValues());
                                console.log("getAllOutflowTotalValues: ", getAllOutflowTotalValues());
                                console.log("getAllOutflowAverageValues: ", getAllOutflowAverageValues());
                            } else if (lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
                                console.log("getAllSelectedTimes: ", getAllSelectedTimes());
                                console.log("getAllGate1Values: ", getAllGate1Values());
                                console.log("getAllGate2Values: ", getAllGate2Values());
                                console.log("getAllGate3Values: ", getAllGate3Values());
                                console.log("getAllGateTotalValues: ", getAllGateTotalValues());
                                console.log("getAllOutflowAverageValues: ", getAllOutflowAverageValues());
                            }

                            const selectedTimes = getAllSelectedTimes();

                            let tsidCategories = {};
                            let dataCategories = {};

                            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                                tsidCategories = {
                                    sluice1: tsidSluice1,
                                    sluice2: tsidSluice2,
                                    sluiceTotal: tsidSluiceTotal,
                                    gate1: tsidGate1,
                                    gate2: tsidGate2,
                                    gate3: tsidGate3,
                                    gateTotal: tsidGateTotal,
                                    outflowTotal: tsidOutflowTotal,
                                };
                            } else if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                                tsidCategories = {
                                    gate1: tsidGate1,
                                    gate2: tsidGate2,
                                    gate3: tsidGate3,
                                    gate4: tsidGate4,
                                    gateTotal: tsidGateTotal,
                                };
                            } else if (lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                tsidCategories = {
                                    sluiceTotal: tsidSluiceTotal,
                                    gate1: tsidGate1,
                                    gate2: tsidGate2,
                                    gate3: tsidGate3,
                                    gate4: tsidGate4,
                                    gateTotal: tsidGateTotal,
                                    outflowTotal: tsidOutflowTotal,
                                };
                            } else if (lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
                                tsidCategories = {
                                    gate1: tsidGate1,
                                    gate2: tsidGate2,
                                    gate3: tsidGate3,
                                    gateTotal: tsidGateTotal,
                                };
                            }

                            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                                dataCategories = {
                                    sluice1: getAllSluice1Values(),
                                    sluice2: getAllSluice2Values(),
                                    sluiceTotal: getAllSluiceTotalValues(),
                                    gate1: getAllGate1Values(),
                                    gate2: getAllGate2Values(),
                                    gate3: getAllGate3Values(),
                                    gateTotal: getAllGateTotalValues(),
                                    outflowTotal: getAllOutflowTotalValues(),
                                };
                            } else if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                                dataCategories = {
                                    gate1: getAllGate1Values(),
                                    gate2: getAllGate2Values(),
                                    gate3: getAllGate3Values(),
                                    gate4: getAllGate4Values(),
                                    gateTotal: getAllGateTotalValues(),
                                };
                            } else if (lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                dataCategories = {
                                    sluiceTotal: getAllSluiceTotalValues(),
                                    gate1: getAllGate1Values(),
                                    gate2: getAllGate2Values(),
                                    gate3: getAllGate3Values(),
                                    gate4: getAllGate4Values(),
                                    gateTotal: getAllGateTotalValues(),
                                    outflowTotal: getAllOutflowTotalValues(),
                                };
                            } else if (lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
                                dataCategories = {
                                    gate1: getAllGate1Values(),
                                    gate2: getAllGate2Values(),
                                    gate3: getAllGate3Values(),
                                    gateTotal: getAllGateTotalValues(),
                                };
                            }

                            console.log("dataCategories: ", dataCategories);
                            console.log("tsidCategories: ", tsidCategories);

                            if (Array.isArray(formattedTomorrowDataOutflowAverage)) {
                                formattedTomorrowDataOutflowAverage = formattedTomorrowDataOutflowAverage.map(entry => ({
                                    ...entry,
                                    "iso": new Date(entry["0"]).toISOString(),
                                }));
                            } else {
                                console.error('formattedTomorrowDataOutflowAverage is not an array:', formattedTomorrowDataOutflowAverage);
                            }

                            payloads = {};
                            if (Array.isArray(selectedTimes) && Object.values(dataCategories).every(Array.isArray)) {

                                Object.entries(dataCategories).forEach(([key, values]) => {
                                    const updatedValues = selectedTimes.map((time, index) => [
                                        convertToISO(time), // Convert time to ISO format // time,
                                        values[index] ?? 0, // Default to 0 if undefined
                                        0
                                    ]);

                                    // Determine the units based on the key
                                    const units = key === "sluiceTotal" || key === "gateTotal" || key === "outflowTotal" ? "cfs" : "ft";

                                    payloads[key] = {
                                        "name": tsidCategories[key],
                                        "office-id": office,
                                        "units": units,
                                        "values": updatedValues.filter(item => item[0] !== null),
                                    };
                                });

                                console.log("Payloads: ", payloads);
                            } else {
                                console.error("One or more arrays are not valid", selectedTimes, dataCategories);
                            }

                        }

                        function getAllSelectedTimes() {
                            let selectedTimes = [];
                            formattedDataGate1.forEach((_, index) => {
                                const selectedTime = document.getElementById(`timeSelect${index}`).value;
                                selectedTimes.push(selectedTime);
                            });
                    
                            // // Append selectedHours['hour1'] if it exists
                            // if (selectedHours && selectedHours['hour1'] !== undefined) {
                            //     selectedTimes.push(selectedHours['hour1']);
                            // }
                    
                            console.log("Selected Times:", selectedTimes); // Log the selected times
                            return selectedTimes;
                        }
                    
                        function getAllSluice1Values() {
                            return formattedDataSluice1.map((_, index) =>
                                parseFloat(document.getElementById(`sluice1Input-${index}`).value)
                            );
                        }
                    
                        function getAllSluice2Values() {
                            return formattedDataSluice2.map((_, index) =>
                                parseFloat(document.getElementById(`sluice2Input-${index}`).value)
                            );
                        }
                    
                        function getAllSluiceTotalValues() {
                            return formattedDataSluiceTotal.map((_, index) =>
                                parseFloat(document.getElementById(`sluiceTotalInput-${index}`).value)
                            );
                        }
                    
                        function getAllGate1Values() {
                            let values = formattedDataGate1.map((_, index) =>
                                parseFloat(document.getElementById(`gate1Input-${index}`).value)
                            );
                    
                            // Check if 'gate1AdditionalInput' exists and add its value if present
                            const additionalInput = document.getElementById('gate1AdditionalInput');
                            if (additionalInput) {
                                values.push(parseFloat(additionalInput.value));
                            }
                    
                            return values;
                        }
                    
                        function getAllGate2Values() {
                            let values = formattedDataGate2.map((_, index) =>
                                parseFloat(document.getElementById(`gate2Input-${index}`).value)
                            );
                    
                            // Check if 'gate2AdditionalInput' exists and add its value if present
                            const additionalInput = document.getElementById('gate2AdditionalInput');
                            if (additionalInput) {
                                values.push(parseFloat(additionalInput.value));
                            }
                    
                            return values;
                        }
                    
                        function getAllGate3Values() {
                            let values = formattedDataGate3.map((_, index) =>
                                parseFloat(document.getElementById(`gate3Input-${index}`).value)
                            );
                    
                            const additionalInput = document.getElementById('gate3AdditionalInput');
                            if (additionalInput) {
                                values.push(parseFloat(additionalInput.value));
                            }
                    
                            return values;
                        }
                    
                        function getAllGate4Values() {
                            let values = formattedDataGate4.map((_, index) =>
                                parseFloat(document.getElementById(`gate4Input-${index}`).value)
                            );
                    
                            const additionalInput = document.getElementById('gate4AdditionalInput');
                            if (additionalInput) {
                                values.push(parseFloat(additionalInput.value));
                            }
                    
                            return values;
                        }
                    
                        function getAllGateTotalValues() {
                            let values = formattedDataGateTotal.map((_, index) =>
                                parseFloat(document.getElementById(`gateTotalInput-${index}`).value)
                            );
                    
                            const additionalInput = document.getElementById('gateTotalAdditionalInput');
                            if (additionalInput) {
                                values.push(parseFloat(additionalInput.value));
                            }
                    
                            return values;
                        }
                    
                        function getAllOutflowTotalValues() {
                            return formattedDataSluiceTotal.map((_, index) =>
                                parseFloat(document.getElementById(`sluiceTotalInput-${index}`).value) +
                                parseFloat(document.getElementById(`gateTotalInput-${index}`).value)
                            );
                        }
                    
                        function getAllOutflowAverageValues() {
                            return formattedDataOutflowAverage.map((_, index) =>
                                parseFloat(document.getElementById(`gateOutflowAverageInput`).value)
                            );
                        }

                        async function loginCDA() {
                            console.log("page");
                            if (await isLoggedIn()) return true;
                            console.log('is false');

                            // Redirect to login page
                            window.location.href = `https://wm.mvs.ds.usace.army.mil:8243/CWMSLogin/login?OriginalLocation=${encodeURIComponent(window.location.href)}`;
                        }

                        async function isLoggedIn() {
                            try {
                                const response = await fetch("https://wm.mvs.ds.usace.army.mil/mvs-data/auth/keys", {
                                    method: "GET"
                                });

                                if (response.status === 401) return false;

                                console.log('status', response.status);
                                return true;

                            } catch (error) {
                                console.error('Error checking login status:', error);
                                return false;
                            }
                        }

                        async function createTS(payload) {
                            if (!payload) throw new Error("You must specify a payload!");
                            const response = await fetch("https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?store-rule=REPLACE%20ALL", {
                                method: "POST",
                                headers: { "Content-Type": "application/json;version=2" },
                                body: JSON.stringify(payload)
                            });

                            if (!response.ok) {
                                const errorText = await response.text();
                                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                            }
                        }

                        async function fetchUpdatedData(name, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1) {
                            // Convert to Date object
                            const date = new Date(isoDateDay1);

                            // Add 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
                            date.setTime(date.getTime() - (1 * 60 * 60 * 1000));

                            // Convert back to ISO string (preserve UTC format)
                            const end = date.toISOString();

                            const tsidData = `${setBaseUrl}timeseries?name=${name}&begin=${isoDateToday}&end=${end}&office=${office}`;
                            // console.log('tsidData:', tsidData);
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
                        }

                        function showSpinner() {
                            const spinner = document.createElement('img');
                            spinner.src = 'images/loading4.gif';
                            spinner.id = 'loadingSpinner';
                            spinner.style.width = '40px';  // Set the width to 40px
                            spinner.style.height = '40px'; // Set the height to 40px
                            document.body.appendChild(spinner);
                        }

                        function hideSpinner() {
                            const spinner = document.getElementById('loadingSpinner');
                            if (spinner) {
                                spinner.remove();
                            }
                        }

                        if (cdaSaveBtn.innerText === "Login") {
                            showSpinner();
                            const loginResult = await loginCDA();
                            hideSpinner();

                            cdaSaveBtn.innerText = loginResult ? "Submit" : "Login";
                            cdaStatusBtn.innerText = loginResult ? "" : "Failed to Login!";
                        } else {
                            try {
                                // ******************************************************************************************************************************************* Save payloads for new entry
                                if (todayDataExists === false) {
                                    showSpinner();
                                    if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                                        await createTS(payloadNewEntrySluice1);
                                        cdaStatusBtn.innerText = "Write payloadNewEntrySluice1 successful!";
                                        await createTS(payloadNewEntrySluice2);
                                        cdaStatusBtn.innerText = "Write payloadNewEntrySluice2 successful!";
                                    }
                                    if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                        await createTS(payloadNewEntrySluiceTotal);
                                        cdaStatusBtn.innerText = "Write payloadNewEntrySluiceTotal successful!";
                                    }
                                    await createTS(payloadNewEntryGate1);
                                    cdaStatusBtn.innerText = "Write payloadNewEntryGate1 successful!";
                                    await createTS(payloadNewEntryGate2);
                                    cdaStatusBtn.innerText = "Write payloadNewEntryGate2 successful!";
                                    await createTS(payloadNewEntryGate3);
                                    cdaStatusBtn.innerText = "Write payloadNewEntryGate3 successful!";
                                    if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                        await createTS(payloadNewEntryGate4);
                                        cdaStatusBtn.innerText = "Write payloadNewEntryGate4 successful!";
                                    }
                                    await createTS(payloadNewEntryGateTotal);
                                    cdaStatusBtn.innerText = "Write payloadNewEntryGateTotal successful!";
                                    if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                        await createTS(payloadNewEntryOutflowTotal);
                                        cdaStatusBtn.innerText = "Write payloadNewEntryOutflowTotal successful!";
                                    }
                                    await createTS(payloadNewEntryOutflowAverage);
                                    cdaStatusBtn.innerText = "Write payloadNewEntryOutflowAverage successful!";

                                    // Initialize variables to prevent reference errors
                                    let updatedDataSluice1 = null;
                                    let updatedDataSluice2 = null;
                                    let updatedDataSluiceTotal = null;
                                    let updatedDataGate1 = null;
                                    let updatedDataGate2 = null;
                                    let updatedDataGate3 = null;
                                    let updatedDataGate4 = null;
                                    let updatedDataGateTotal = null;
                                    let updatedDataOutflowTotal = null;
                                    let updatedDataOutflowAverage = null;

                                    if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                                        [
                                            updatedDataSluice1,
                                            updatedDataSluice2,
                                            updatedDataSluiceTotal,
                                            updatedDataGate1,
                                            updatedDataGate2,
                                            updatedDataGate3,
                                            updatedDataGateTotal,
                                            updatedDataOutflowTotal,
                                            updatedDataOutflowAverage
                                        ] = await Promise.all([
                                            fetchUpdatedData(tsidSluice1, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidSluice2, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidSluiceTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidGate1, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidGate2, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidGate3, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidGateTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidOutflowTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidOutflowAverage, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1)
                                        ]);
                                    } else if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                                        [
                                            updatedDataGate1,
                                            updatedDataGate2,
                                            updatedDataGate3,
                                            updatedDataGate4,
                                            updatedDataGateTotal,
                                            updatedDataOutflowAverage
                                        ] = await Promise.all([
                                            fetchUpdatedData(tsidGate1, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidGate2, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidGate3, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidGate4, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidGateTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidOutflowAverage, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1)
                                        ]);
                                    } else if (lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                                        [
                                            updatedDataSluiceTotal,
                                            updatedDataGate1,
                                            updatedDataGate2,
                                            updatedDataGate3,
                                            updatedDataGate4,
                                            updatedDataGateTotal,
                                            updatedDataOutflowTotal,
                                            updatedDataOutflowAverage
                                        ] = await Promise.all([
                                            fetchUpdatedData(tsidSluiceTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidGate1, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidGate2, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidGate3, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidGate4, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidGateTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidOutflowTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidOutflowAverage, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1)
                                        ]);
                                    } else if (lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
                                        [
                                            updatedDataGate1,
                                            updatedDataGate2,
                                            updatedDataGate3,
                                            updatedDataGateTotal,
                                            updatedDataOutflowAverage
                                        ] = await Promise.all([
                                            fetchUpdatedData(tsidGate1, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidGate2, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidGate3, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidGateTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                                            fetchUpdatedData(tsidOutflowAverage, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1)
                                        ]);
                                    }

                                    createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
                                        tsidSluice1, updatedDataSluice1, tsidSluice2, updatedDataSluice2, tsidSluiceTotal, updatedDataSluiceTotal,
                                        tsidGate1, updatedDataGate1, tsidGate2, updatedDataGate2, tsidGate3, updatedDataGate3, tsidGateTotal, updatedDataGateTotal,
                                        tsidOutflowTotal, updatedDataOutflowTotal, tsidOutflowAverage, updatedDataOutflowAverage,
                                        timeSeriesYesterdayDataSluice1, timeSeriesYesterdayDataSluice2, timeSeriesYesterdayDataSluiceTotal,
                                        timeSeriesYesterdayDataGate1, timeSeriesYesterdayDataGate2, timeSeriesYesterdayDataGate3,
                                        timeSeriesYesterdayDataGateTotal, timeSeriesYesterdayDataOutflowTotal, timeSeriesYesterdayDataOutflowAverage, tsidGate4, updatedDataGate4, null); // null is for yesterday data
                                }

                                // ******************************************************************************************************************************************* Save payloads for existing entry
                                if (todayDataExists === false) {
                                }
                            } catch (error) {
                                hideSpinner(); // Hide the spinner if an error occurs
                                cdaStatusBtn.innerText = "Failed to write data!";
                                console.error(error);
                            }

                            hideSpinner(); // Hide the spinner after the operation completes
                        }
                    });

                }
            } catch (error) {
                console.error("Error fetching tsidOutflow data:", error);

                // Show the "Report Issue" button
                document.getElementById('reportIssueBtn').style.display = "block";

                // Ensure sendEmail is globally accessible
                window.sendEmail = function () {
                    const subject = encodeURIComponent("Cloud Database Down");
                    const body = encodeURIComponent("Hello,\n\nIt appears that the cloud database is down. Please investigate the issue." + setBaseUrl);
                    const email = "DLL-CEMVS-WM-SysAdmins@usace.army.mil"; // Replace with actual support email

                    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
                };
            }
        };

        const fetchTimeSeriesData = async (tsid) => {
            // Convert to Date object
            const date = new Date(isoDateDay1);

            // Add 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
            date.setTime(date.getTime() - (1 * 60 * 60 * 1000));

            // Convert back to ISO string (preserve UTC format)
            const end = date.toISOString();

            const tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateToday}&end=${end}&office=${office}`;
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

        const fetchTimeSeriesYesterdayData = async (tsid) => {
            // Convert to Date object
            const date = new Date(isoDateToday);

            // Add 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
            date.setTime(date.getTime() - (1 * 60 * 60 * 1000));

            // Convert back to ISO string (preserve UTC format)
            const end = date.toISOString();

            const tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateMinus1Day}&end=${end}&office=${office}`;
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

        const fetchTimeSeriesTomorrowData = async (tsid) => {
            // Convert to Date object
            const date = new Date(isoDateDay2);

            // Add 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
            date.setTime(date.getTime() - (1 * 60 * 60 * 1000));

            // Convert back to ISO string (preserve UTC format)
            const end = date.toISOString();

            const tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateDay1}&end=${end}&office=${office}`;
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

        function convertToISO(time) {
            // Create a new Date object with isoDateToday and the selected time
            const date = new Date(isoDateToday.slice(0, 10) + "T" + time + ":00Z");

            // Add 5 hours
            date.setHours(date.getHours() + 5); // Convert time to UTC time

            // Return the new ISO string
            return date.toISOString();
        }

        fetchTsidData();
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
});

// Lk Shelbyville-Kaskaskia
// Lk Shelbyville-Kaskaskia.Opening.Inst.~30Minutes.0.lakerep-rev-G1-test (Gate-Lake-Test)
// Lk Shelbyville-Kaskaskia.Opening.Inst.~30Minutes.0.lakerep-rev-G2-test (Gate-Lake-Test)
// Lk Shelbyville-Kaskaskia.Opening.Inst.~30Minutes.0.lakerep-rev-G3-test (Gate-Lake-Test)
// Lk Shelbyville-Kaskaskia.Opening.Inst.~30Minutes.0.lakerep-rev-G4-test (NOT USED)
// Lk Shelbyville-Kaskaskia.Flow-Taint.Inst.~30Minutes.0.lakerep-rev-test (Gate-Total-Lake-Test)

// Lk Shelbyville-Kaskaskia.Opening.Inst.~30Minutes.0.lakerep-rev-S1-test (Sluice-Lake-Test)
// Lk Shelbyville-Kaskaskia.Opening.Inst.~30Minutes.0.lakerep-rev-S2-test (Sluice-Lake-Test)
// Lk Shelbyville-Kaskaskia.Opening.Inst.~30Minutes.0.lakerep-rev-S3-test (NOT USED)
// Lk Shelbyville-Kaskaskia.Flow-Sluice.Inst.~30Minutes.0.lakerep-rev-test (Sluice-Total-Lake-Test)

// Lk Shelbyville-Kaskaskia.Flow.Inst.~30Minutes.0.lakerep-rev-test (Outflow-Total-Lake-Test)

// Lk Shelbyville-Kaskaskia.Flow-Out.Ave.~1Day.1Day.lakerep-rev-test (Outflow-Average-Lake-Test)

// **************************************************************************************************************************************************************************

// Rend Lk-Big Muddy
// Rend Lk-Big Muddy.Flow-Out.Ave.~1Day.1Day.lakerep-rev-test (Outflow-Total-Lake-Test)

// **************************************************************************************************************************************************************************

// Mark Twain Lk-Salt
// Mark Twain Lk-Salt.Opening.Inst.~30Minutes.0.lakerep-rev-G1 (Gate-Lake-Test)
// Mark Twain Lk-Salt.Opening.Inst.~30Minutes.0.lakerep-rev-G2 (Gate-Lake-Test)
// Mark Twain Lk-Salt.Opening.Inst.~30Minutes.0.lakerep-rev-G3 (Gate-Lake-Test)
// Mark Twain Lk-Salt.Opening.Inst.~30Minutes.0.lakerep-rev-G4 (Gate-Lake-Test)
// Mark Twain Lk-Salt.Flow-Taint.Inst.~30Minutes.0.lakerep-rev-test (Gate-Total-Lake-Test)
// Mark Twain Lk-Salt.Flow-Spill.Ave.~1Day.1Day.lakerep-rev-test (Outflow-Average-Lake-Test)

// **************************************************************************************************************************************************************************

// Carlyle Lk-Kaskaskia
// Carlyle Lk-Kaskaskia.Opening.Inst.~30Minutes.0.lakerep-rev-G1-test (Gate-Lake-Test)
// Carlyle Lk-Kaskaskia.Opening.Inst.~30Minutes.0.lakerep-rev-G2-test (Gate-Lake-Test)
// Carlyle Lk-Kaskaskia.Opening.Inst.~30Minutes.0.lakerep-rev-G3-test (Gate-Lake-Test)
// Carlyle Lk-Kaskaskia.Opening.Inst.~30Minutes.0.lakerep-rev-G4-test (Gate-Lake-Test)

// Carlyle Lk-Kaskaskia.Flow-Taint.Inst.~30Minutes.0.lakerep-rev-test (Gate-Total-Lake-Test)

// Carlyle Lk-Kaskaskia.Flow-Sluice.Inst.~30Minutes.0.lakerep-rev-test (Sluice-Total-Lake-Test)

// Carlyle Lk-Kaskaskia.Flow.Inst.~30Minutes.0.lakerep-rev-test (Outflow-Total-Lake-Test)

// Carlyle Lk-Kaskaskia.Flow-Out.Ave.~1Day.1Day.lakerep-rev-test (Outflow-Average-Lake-Test) use this now: Carlyle Lk-Kaskaskia.Flow.Ave.~1Day.1Day.lakerep-rev-test

// **************************************************************************************************************************************************************************

// Wappapello Lk-St Francis
// Wappapello Lk-St Francis.Opening.Inst.~30Minutes.0.lakerep-rev-G1-test (Gate-Lake-Test)
// Wappapello Lk-St Francis.Opening.Inst.~30Minutes.0.lakerep-rev-G2-test (Gate-Lake-Test)
// Wappapello Lk-St Francis.Opening.Inst.~30Minutes.0.lakerep-rev-G3-test (Gate-Lake-Test)

// Wappapello Lk-St Francis.Flow-Taint.Inst.~30Minutes.0.lakerep-rev-test (Gate-Total-Lake-Test)

// Wappapello Lk-St Francis.Flow-Out.Ave.~1Day.1Day.lakerep-rev-test (Outflow-Average-Lake-Test)


// DECLARE
//     v_ts_category_id     VARCHAR2(255) := 'Wappapello Lk-St Francis'; --Replace with actual ID
//     v_ts_group_id        VARCHAR2(255) := 'Outflow-Average-Lake-Test'; --Replace with actual ID
//     v_ts_group_desc      VARCHAR2(255) := NULL; --Optional description
//     v_fail_if_exists     VARCHAR2(1) := 'T'; --Optional, defaults to 'F'
//     v_ignore_nulls       VARCHAR2(1) := 'T'; --Optional, defaults to 'T'
//     v_shared_alias_id    VARCHAR2(255) := NULL; --Optional
//     v_shared_ts_ref_id   VARCHAR2(255) := NULL; --Optional
//     v_db_office_id       VARCHAR2(255) := NULL; --Optional
// BEGIN
// CWMS_TS.store_ts_group(
//     p_ts_category_id => v_ts_category_id,
//     p_ts_group_id => v_ts_group_id,
//     p_ts_group_desc => v_ts_group_desc,
//     p_fail_if_exists => v_fail_if_exists,
//     p_ignore_nulls => v_ignore_nulls,
//     p_shared_alias_id => v_shared_alias_id,
//     p_shared_ts_ref_id => v_shared_ts_ref_id,
//     p_db_office_id => v_db_office_id
// );
// END;



// DECLARE
//     v_ts_category_id   VARCHAR2(255) := 'Wappapello Lk-St Francis'; --Replace with actual category ID
//     v_ts_group_id        VARCHAR2(255) := 'Outflow-Average-Lake-Test'; --Replace with actual ID
//     v_ts_id            VARCHAR2(255) := 'Wappapello Lk-St Francis.Flow-Out.Ave.~1Day.1Day.lakerep-rev-test'; --Replace with actual TS ID
//     v_ts_attribute     NUMBER:= 1;
//     v_ts_alias_id      VARCHAR2(255) := null; --Optional alias ID
//     v_ref_ts_id        VARCHAR2(255) := NULL; --Optional reference TS ID
//     v_db_office_id     VARCHAR2(255) := NULL; --Optional office ID
// BEGIN
// CWMS_TS.assign_ts_group(
//     p_ts_category_id => v_ts_category_id,
//     p_ts_group_id => v_ts_group_id,
//     p_ts_id => v_ts_id,
//     p_ts_attribute => v_ts_attribute,
//     p_ts_alias_id => v_ts_alias_id,
//     p_ref_ts_id => v_ref_ts_id,
//     p_db_office_id => v_db_office_id
// );
// END;