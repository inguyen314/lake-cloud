document.addEventListener('DOMContentLoaded', async function () {
    if (lake === "Rend Lk-Big Muddy" || lake === "Rend Lk") {
        console.log("****************** Rend Lk-Big Muddy");
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

        const fetchTimeSeriesData = async (tsid) => {
            const tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateMinus8Days}&end=${isoDateToday}&office=${office}`;
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

                    // Apply the ID "gate-settings" to the table
                    table.id = "gate-settings";

                    // Create the table header row
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

                    // Combine the data based on matching timestamps
                    let i = 0;
                    let j = 0;

                    while (i < formattedData1.length && j < formattedData2.length) {
                        // Find matching formattedTimestamps
                        if (formattedData1[i].formattedTimestamp === formattedData2[j].formattedTimestamp) {
                            const row = document.createElement("tr");

                            // Date column (from formattedData1)
                            const dateCell = document.createElement("td");
                            dateCell.textContent = formattedData1[i].formattedTimestamp; // Display formattedTimestamp as Date
                            row.appendChild(dateCell);

                            // Stage column (from formattedData1)
                            const stageCell = document.createElement("td");
                            stageCell.textContent = formattedData1[i].value.toFixed(2); // Assuming stage is from formattedData1
                            row.appendChild(stageCell);

                            // Outflow column (from formattedData2)
                            const sluice2Cell = document.createElement("td");
                            sluice2Cell.textContent = formattedData2[j].value.toFixed(0); // Assuming outflow is from formattedData2
                            row.appendChild(sluice2Cell);

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

                function createTableAvg(formattedData2) {
                    // Extract the last two values
                    const lastValue = formattedData2[formattedData2.length - 1].value;
                    const secondLastValue = formattedData2[formattedData2.length - 2].value;

                    // Calculate the average of the last two values
                    const averageValue = (lastValue + secondLastValue) / 2;

                    // Create the table structure
                    const table = document.createElement("table");

                    // Apply the ID "gate-settings" to the table
                    table.id = "gate-settings";
                    table.style.width = "50%";
                    table.style.marginTop = "10px";
                    table.style.marginBottom = "10px";

                    // Create the header row
                    const headerRow = table.insertRow();
                    const col1 = headerRow.insertCell();
                    const col2 = headerRow.insertCell();

                    col1.textContent = "Average Outflow for Yesterday:";
                    col2.textContent = averageValue.toFixed(0);  // Format the average value to 0 decimal places
                    col2.style.fontWeight = "bold";

                    // Set column widths: 2/3 for col1 and 1/3 for col2
                    col1.style.width = "66%";  // 2/3 width
                    col2.style.width = "33%";  // 1/3 width

                    // Add a title for the tooltip when hovering over col2
                    col2.title = `The average outflow value for yesterday is: ${lastValue.toFixed(0)}/${secondLastValue.toFixed(0)} =  ${averageValue.toFixed(0)}`;

                    // Insert the table into the "output4" div
                    const outputDiv = document.getElementById("output4");
                    outputDiv.appendChild(table);
                }

                // Call the function with formattedData1 and formattedData2
                createTable(formattedData1, formattedData2);

                // Call the function
                createTableAvg(formattedData2);

            } catch (error) {
                console.error("Error fetching tsid data:", error);

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

    } else {
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

        const urlTsidSluice = `${setBaseUrl}timeseries/group/Sluice-Lake-Test?office=${office}&category-id=${lake}`;
        console.log("urlTsidSluice:", urlTsidSluice);

        const urlTsidSluiceTotal = `${setBaseUrl}timeseries/group/Sluice-Total-Lake-Test?office=${office}&category-id=${lake}`;
        console.log("urlTsidSluiceTotal:", urlTsidSluiceTotal);

        const urlTsidGate = `${setBaseUrl}timeseries/group/Gate-Lake-Test?office=${office}&category-id=${lake}`;
        console.log("urlTsidGate:", urlTsidGate);

        const urlTsidGateTotal = `${setBaseUrl}timeseries/group/Gate-Total-Lake-Test?office=${office}&category-id=${lake}`;
        console.log("urlTsidGateTotal:", urlTsidGateTotal);

        const urlTsidOutflowTotal = `${setBaseUrl}timeseries/group/Outflow-Total-Lake-Test?office=${office}&category-id=${lake}`;
        console.log("urlTsidOutflowTotal:", urlTsidOutflowTotal);

        const urlTsidOutflowAverage = `${setBaseUrl}timeseries/group/Outflow-Average-Lake-Test?office=${office}&category-id=${lake}`;
        console.log("urlTsidOutflowAverage:", urlTsidOutflowAverage);

        const fetchTsidData = async () => {
            try {
                const responseSluice = await fetch(urlTsidSluice);
                const tsidSluiceData = await responseSluice.json();
                console.log("tsidSluiceData:", tsidSluiceData);

                const responseSluiceTotal = await fetch(urlTsidSluiceTotal);
                const tsidSluiceTotalData = await responseSluiceTotal.json();
                console.log("tsidSluiceTotalData:", tsidSluiceTotalData);

                const responseGate = await fetch(urlTsidGate);
                const tsidGateData = await responseGate.json();
                console.log("tsidGateData:", tsidGateData);

                const responseGateTotal = await fetch(urlTsidGateTotal);
                const tsidGateTotalData = await responseGateTotal.json();
                console.log("tsidGateTotalData:", tsidGateTotalData);

                const responseOutflowTotal = await fetch(urlTsidOutflowTotal);
                const tsidOutflowTotalData = await responseOutflowTotal.json();
                console.log("tsidOutflowTotalData:", tsidOutflowTotalData);

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
                    cdaSaveBtn = document.getElementById("cda-btn"); // Get the button by its ID

                    cdaSaveBtn.disabled = true; // Disable button while checking login state

                    // Update button text based on login status
                    if (await isLoggedIn()) {
                        cdaSaveBtn.innerText = "Save";
                    } else {
                        cdaSaveBtn.innerText = "Login";
                    }

                    cdaSaveBtn.disabled = false; // Re-enable button
                }

                if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                    const tsidSluice1 = tsidSluiceData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidSluice1:", tsidSluice1);

                    const tsidSluice2 = tsidSluiceData['assigned-time-series'][1]['timeseries-id'];
                    console.log("tsidSluice2:", tsidSluice2);

                    const tsidSluiceTotal = tsidSluiceTotalData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidSluiceTotal:", tsidSluiceTotal);

                    const tsidGate1 = tsidGateData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidGate1:", tsidGate1);

                    const tsidGate2 = tsidGateData['assigned-time-series'][1]['timeseries-id'];
                    console.log("tsidGate2:", tsidGate2);

                    const tsidGate3 = tsidGateData['assigned-time-series'][1]['timeseries-id'];
                    console.log("tsidGate3:", tsidGate3);

                    const tsidGateTotal = tsidGateTotalData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidGateTotal:", tsidGateTotal);

                    const tsidOutflowTotal = tsidOutflowTotalData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidOutflowTotal:", tsidOutflowTotal);

                    const tsidOutflowAverage = tsidOutflowAverageData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidOutflowAverage:", tsidOutflowAverage);


                    // Fetch time series data
                    const timeSeriesDataSluice1 = await fetchTimeSeriesData(tsidSluice1);
                    console.log("timeSeriesDataSluice1:", timeSeriesDataSluice1);

                    const timeSeriesDataSluice2 = await fetchTimeSeriesData(tsidSluice2);
                    console.log("timeSeriesDataSluice2:", timeSeriesDataSluice2);

                    const timeSeriesDataSluiceTotal = await fetchTimeSeriesData(tsidSluiceTotal);
                    console.log("timeSeriesDataSluiceTotal:", timeSeriesDataSluiceTotal);

                    const timeSeriesDataGate1 = await fetchTimeSeriesData(tsidGate1);
                    console.log("timeSeriesDataGate1:", timeSeriesDataGate1);

                    const timeSeriesDataGate2 = await fetchTimeSeriesData(tsidGate2);
                    console.log("timeSeriesDataGate2:", timeSeriesDataGate2);

                    const timeSeriesDataGate3 = await fetchTimeSeriesData(tsidGate3);
                    console.log("timeSeriesDataGate3:", timeSeriesDataGate3);

                    const timeSeriesDataGateTotal = await fetchTimeSeriesData(tsidGateTotal);
                    console.log("timeSeriesDataGateTotal:", timeSeriesDataGateTotal);

                    const timeSeriesDataOutflowTotal = await fetchTimeSeriesData(tsidGateTotal);
                    console.log("timeSeriesDataOutflowTotal:", timeSeriesDataOutflowTotal);

                    const timeSeriesDataOutflowAverage = await fetchTimeSeriesData(tsidGateTotal);
                    console.log("timeSeriesDataOutflowAverage:", timeSeriesDataOutflowAverage);

                    if (timeSeriesDataSluice1 && timeSeriesDataSluice1.values && timeSeriesDataSluice1.values.length > 0) {
                        console.log("Calling createTable ...");

                        createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
                            tsidSluice1, timeSeriesDataSluice1, tsidSluice2, timeSeriesDataSluice2, tsidSluiceTotal, timeSeriesDataSluiceTotal,
                            tsidGate1, timeSeriesDataGate1, tsidGate2, timeSeriesDataGate2, tsidGate3, timeSeriesDataGate3, tsidGateTotal, timeSeriesDataGateTotal,
                            tsidOutflowTotal, timeSeriesDataOutflowTotal, tsidOutflowAverage, timeSeriesDataOutflowAverage);

                        loginStateController()
                        setInterval(async () => {
                            loginStateController()
                        }, 10000)
                    } else {
                        console.log("Calling createDataEntryTable ...");

                        createDataEntryTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
                            tsidSluice1, timeSeriesDataSluice1, tsidSluice2, timeSeriesDataSluice2, tsidSluiceTotal, timeSeriesDataSluiceTotal,
                            tsidGate1, timeSeriesDataGate1, tsidGate2, timeSeriesDataGate2, tsidGate3, timeSeriesDataGate3, tsidGateTotal, timeSeriesDataGateTotal,
                            tsidOutflowTotal, timeSeriesDataOutflowTotal, tsidOutflowAverage, timeSeriesDataOutflowAverage);

                        loginStateController()
                        setInterval(async () => {
                            loginStateController()
                        }, 10000)
                    }
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

            function createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
                tsidSluice1, timeSeriesDataSluice1, tsidSluice2, timeSeriesDataSluice2, tsidSluiceTotal, timeSeriesDataSluiceTotal,
                tsidGate1, timeSeriesDataGate1, tsidGate2, timeSeriesDataGate2, tsidGate3, timeSeriesDataGate3, tsidGateTotal, timeSeriesDataGateTotal,
                tsidOutflowTotal, timeSeriesDataOutflowTotal, tsidOutflowAverage, timeSeriesDataOutflowAverage) {

                console.log("timeSeriesDataSluice1:", timeSeriesDataSluice1);
                console.log("timeSeriesDataSluice2:", timeSeriesDataSluice2);
                console.log("timeSeriesDataSluiceTotal:", timeSeriesDataSluiceTotal)
                console.log("timeSeriesDataGate1:", timeSeriesDataGate1)
                console.log("timeSeriesDataGate2:", timeSeriesDataGate2)
                console.log("timeSeriesDataGate3:", timeSeriesDataGate3)
                console.log("timeSeriesDataGateTotal:", timeSeriesDataGateTotal)
                console.log("timeSeriesDataOutflowTotal:", timeSeriesDataOutflowTotal)
                console.log("timeSeriesDataOutflowAverage:", timeSeriesDataOutflowAverage);

                let formattedDataSluice1 = timeSeriesDataSluice1.values.map(entry => {
                    const timestamp = entry[0]; // Timestamp is in milliseconds in the array
                    const formattedTimestampCST = formatISODateToCSTString(Number(timestamp)); // Ensure timestamp is a number

                    return {
                        ...entry, // Retain other data
                        formattedTimestampCST // Add formatted timestamp
                    };
                });

                console.log("Formatted timeSeriesDataSluice1:", formattedDataSluice1);

                let formattedDataSluice2 = timeSeriesDataSluice2.values.map(entry => {
                    const timestamp = entry[0]; // Timestamp is in milliseconds in the array
                    const formattedTimestampCST = formatISODateToCSTString(Number(timestamp)); // Ensure timestamp is a number

                    return {
                        ...entry, // Retain other data
                        formattedTimestampCST // Add formatted timestamp
                    };
                });

                console.log("Formatted timeSeriesDataSluice2:", formattedDataSluice2);

                let formattedDataSluiceTotal = timeSeriesDataSluiceTotal.values.map(entry => {
                    const timestamp = entry[0]; // Timestamp is in milliseconds in the array
                    const formattedTimestampCST = formatISODateToCSTString(Number(timestamp)); // Ensure timestamp is a number

                    return {
                        ...entry, // Retain other data
                        formattedTimestampCST // Add formatted timestamp
                    };
                });

                console.log("Formatted timeSeriesDataSluiceTotal:", formattedDataSluiceTotal);

                let formattedDataGate1 = timeSeriesDataGate1.values.map(entry => {
                    const timestamp = entry[0]; // Timestamp is in milliseconds in the array
                    const formattedTimestampCST = formatISODateToCSTString(Number(timestamp)); // Ensure timestamp is a number

                    return {
                        ...entry, // Retain other data
                        formattedTimestampCST // Add formatted timestamp
                    };
                });

                console.log("Formatted timeSeriesDataGate1:", formattedDataGate1);

                let formattedDataGate2 = timeSeriesDataGate2.values.map(entry => {
                    const timestamp = entry[0]; // Timestamp is in milliseconds in the array
                    const formattedTimestampCST = formatISODateToCSTString(Number(timestamp)); // Ensure timestamp is a number

                    return {
                        ...entry, // Retain other data
                        formattedTimestampCST // Add formatted timestamp
                    };
                });

                console.log("Formatted timeSeriesDataGate2:", formattedDataGate2);

                let formattedDataGate3 = timeSeriesDataGate3.values.map(entry => {
                    const timestamp = entry[0]; // Timestamp is in milliseconds in the array
                    const formattedTimestampCST = formatISODateToCSTString(Number(timestamp)); // Ensure timestamp is a number

                    return {
                        ...entry, // Retain other data
                        formattedTimestampCST // Add formatted timestamp
                    };
                });

                console.log("Formatted timeSeriesDataGate3:", formattedDataGate3);

                let formattedDataGateTotal = timeSeriesDataGateTotal.values.map(entry => {
                    const timestamp = entry[0]; // Timestamp is in milliseconds in the array
                    const formattedTimestampCST = formatISODateToCSTString(Number(timestamp)); // Ensure timestamp is a number

                    return {
                        ...entry, // Retain other data
                        formattedTimestampCST // Add formatted timestamp
                    };
                });

                console.log("Formatted timeSeriesDataGateTotal:", formattedDataGateTotal);

                let formattedDataOutflowTotal = timeSeriesDataOutflowTotal.values.map(entry => {
                    const timestamp = entry[0]; // Timestamp is in milliseconds in the array
                    const formattedTimestampCST = formatISODateToCSTString(Number(timestamp)); // Ensure timestamp is a number

                    return {
                        ...entry, // Retain other data
                        formattedTimestampCST // Add formatted timestamp
                    };
                });

                console.log("Formatted timeSeriesDataOutflowTotal:", formattedDataOutflowTotal);

                let formattedDataOutflowAverage = timeSeriesDataOutflowAverage.values.map(entry => {
                    const timestamp = entry[0]; // Timestamp is in milliseconds in the array
                    const formattedTimestampCST = formatISODateToCSTString(Number(timestamp)); // Ensure timestamp is a number

                    return {
                        ...entry, // Retain other data
                        formattedTimestampCST // Add formatted timestamp
                    };
                });

                console.log("Formatted timeSeriesDataOutflowAverage:", formattedDataOutflowAverage);

                const table = document.createElement("table");
                table.id = "gate-settings";

                const headerRow = document.createElement("tr");
                const dateHeader = document.createElement("th");
                dateHeader.textContent = "Date";
                headerRow.appendChild(dateHeader);

                const sluice1Header = document.createElement("th");
                sluice1Header.textContent = "Sluice 1 (ft)";
                headerRow.appendChild(sluice1Header);


                const sluice2Header = document.createElement("th");
                sluice2Header.textContent = "Sluice 2 (ft)";
                headerRow.appendChild(sluice2Header);

                table.appendChild(headerRow);

                formattedDataSluice1.forEach((entry, index) => {
                    const row = document.createElement("tr");

                    const dateCell = document.createElement("td");
                    dateCell.textContent = entry.formattedTimestampCST ? entry.formattedTimestampCST : entry[0];
                    row.appendChild(dateCell);

                    const sluice1Cell = document.createElement("td");
                    const sluice1Input = document.createElement("input");
                    sluice1Input.type = "number";
                    sluice1Input.value = formattedDataSluice2[index] ? formattedDataSluice2[index][1].toFixed(0) : 0;
                    sluice1Input.className = "inflow-input";
                    sluice1Input.id = `sluice1Input-${entry[0]}`;
                    sluice1Cell.appendChild(sluice1Input);
                    row.appendChild(sluice1Cell);

                    // Outflow cell (editable)
                    const sluice2Cell = document.createElement("td");
                    const sluice2Input = document.createElement("input");
                    sluice2Input.type = "number";
                    sluice2Input.value = entry[1].toFixed(0);
                    sluice2Input.className = "outflow-input";
                    sluice2Input.id = `sluice2Input-${entry[0]}`;
                    sluice2Cell.appendChild(sluice2Input);
                    row.appendChild(sluice2Cell);

                    table.appendChild(row);
                });

                const output6Div = document.getElementById("output4");
                output6Div.innerHTML = "";
                output6Div.appendChild(table);

                const cdaSaveBtn = document.createElement("button");
                cdaSaveBtn.textContent = "Submit";
                cdaSaveBtn.id = "cda-btn";
                cdaSaveBtn.disabled = true;
                output6Div.appendChild(cdaSaveBtn);

                const statusDiv = document.createElement("div");
                statusDiv.className = "status";
                const cdaStatusBtn = document.createElement("button");
                cdaStatusBtn.textContent = "";
                cdaStatusBtn.id = "cda-btn";
                cdaStatusBtn.disabled = false;
                statusDiv.appendChild(cdaStatusBtn);
                output6Div.appendChild(statusDiv);

                cdaSaveBtn.addEventListener("click", async () => {
                    console.log("Preparing payloadSluice1...");
                    const payloadSluice1 = {
                        "date-version-type": "MAX_AGGREGATE",
                        "name": tsidOutflow,
                        "office-id": "MVS",
                        "units": "ft",
                        "values": formattedDataSluice1.map(entry => {
                            const sluice1Value = document.getElementById(`sluice2Input-${entry[0]}`).value;
                            // console.log("sluice1Value:", sluice1Value);

                            const timestampUnix = new Date(entry[0]).getTime();
                            // console.log("timestampUnix:", timestampUnix);

                            return [
                                timestampUnix,
                                parseFloat(sluice1Value),
                                0
                            ];
                        }),
                        "version-date": isoDateToday,
                    };
                    console.log("payloadSluice1:", payloadSluice1);

                    console.log("Preparing payloadSluice2...");
                    let payloadSluice2 = null;
                    payloadSluice2 = {
                        "date-version-type": "MAX_AGGREGATE",
                        "name": tsidInflow,
                        "office-id": "MVS",
                        "units": "ft",
                        "values": formattedDataSluice1.map(entry => {
                            let sluice2Value = document.getElementById(`sluice1Input-${entry[0]}`).value; // Get value from input field
                            // console.log("sluice2Value:", sluice2Value);

                            // Convert ISO date string to timestamp
                            const timestampUnix = new Date(entry[0]).getTime();
                            // console.log("timestampUnix:", timestampUnix);

                            return [
                                timestampUnix,  // Timestamp for the day at 6 AM
                                parseInt(sluice2Value), // Stage value (forecast outflow) as number
                                0 // Placeholder for the third value (set to 0 for now)
                            ];
                        }),
                        "version-date": isoDateToday, // Ensure this is the correct ISO formatted date
                    };
                    console.log("payloadSluice2: ", payloadSluice2);

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

                    async function createVersionTS(payload) {
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

                    async function fetchUpdatedData(name, isoDateDay5, isoDateToday, isoDateMinus1Day) {
                        let response = null;

                        if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                            response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?name=${name}&begin=${isoDateMinus1Day}&end=${isoDateDay5}&office=MVS&version-date=${isoDateToday}`, {
                                headers: {
                                    "Accept": "application/json;version=2", // Ensuring the correct version is used
                                    "cache-control": "no-cache"
                                }
                            });
                        } else {
                            response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?name=${name}&begin=${isoDateToday}&end=${isoDateDay5}&office=MVS&version-date=${isoDateToday}`, {
                                headers: {
                                    "Accept": "application/json;version=2", // Ensuring the correct version is used
                                    "cache-control": "no-cache"
                                }
                            });
                        }

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
                            // showSpinner(); // Show the spinner before creating the version
                            // await createVersionTS(payloadSluice1);
                            // cdaStatusBtn.innerText = "Write successful!";

                            // await createVersionTS(payloadSluice2);
                            // cdaStatusBtn.innerText = "Write payloadSluice2 successful!";

                            // const updatedData = await fetchUpdatedData(tsidOutflow, isoDateDay5, isoDateToday, isoDateMinus1Day);

                            // let updatedDataInflow = null;
                            // updatedDataInflow = await fetchUpdatedData(tsidInflow, isoDateDay5, isoDateToday, isoDateMinus1Day);
                            // createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidOutflow, updatedData, tsidInflow, updatedDataInflow);
                        } catch (error) {
                            // hideSpinner(); // Hide the spinner if an error occurs
                            // cdaStatusBtn.innerText = "Failed to write data!";
                            // console.error(error);
                        }

                        hideSpinner(); // Hide the spinner after the operation completes
                    }
                });

            }

            function createDataEntryTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
                tsidSluice1, timeSeriesDataSluice1, tsidSluice2, timeSeriesDataSluice2, tsidSluiceTotal, timeSeriesDataSluiceTotal,
                tsidGate1, timeSeriesDataGate1, tsidGate2, timeSeriesDataGate2, tsidGate3, timeSeriesDataGate3, tsidGateTotal, timeSeriesDataGateTotal,
                tsidOutflowTotal, timeSeriesDataOutflowTotal, tsidOutflowAverage, timeSeriesDataOutflowAverage) {

                const table = document.createElement("table");

                table.id = "gate-settings";

                const headerRow = document.createElement("tr");

                const dateHeader = document.createElement("th");
                dateHeader.textContent = "Time";
                headerRow.appendChild(dateHeader);

                const sluice1Header = document.createElement("th");
                sluice1Header.textContent = "Sluice 1 (ft)";
                headerRow.appendChild(sluice1Header);

                const sluice2Header = document.createElement("th");
                sluice2Header.textContent = "Sluice 2 (ft)";
                headerRow.appendChild(sluice2Header);

                const sluiceTotalHeader = document.createElement("th");
                sluiceTotalHeader.textContent = "Sluice Total (cfs)";
                headerRow.appendChild(sluiceTotalHeader);

                const gate1Header = document.createElement("th");
                gate1Header.textContent = "Gate 1 (ft)";
                headerRow.appendChild(gate1Header);

                const gate2Header = document.createElement("th");
                gate2Header.textContent = "Gate 2 (ft)";
                headerRow.appendChild(gate2Header);

                const gate3Header = document.createElement("th");
                gate3Header.textContent = "Gate 3 (ft)";
                headerRow.appendChild(gate3Header);

                const gateTotalHeader = document.createElement("th");
                gateTotalHeader.textContent = "Gate Total (cfs)";
                headerRow.appendChild(gateTotalHeader);

                const outflowTotalHeader = document.createElement("th");
                outflowTotalHeader.textContent = "Outflow Total (cfs)";
                headerRow.appendChild(outflowTotalHeader);

                table.appendChild(headerRow);

                let dates = [];
                dates = [isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5];

                let entryDates = [];

                // Generate options for dropdown (24-hour format)
                const times = [];
                for (let hour = 0; hour < 24; hour++) {
                    const time = `${hour.toString().padStart(2, '0')}:00`;  // "00:00", "01:00", ..., "23:00"
                    times.push(time);
                }

                console.log("times for dropdown:", times);

                // entryDates = ["", "", "", "", "", ""]; // Blank entries for dropdown
                entryDates = [1, 2, 3, 4, 5, 6]; // Blank entries for dropdown

                const options = {
                    timeZone: 'America/Chicago', // Handle CST/CDT automatically
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false, // Use 24-hour format
                };

                const formattedDates = dates.map(date => {
                    const d = new Date(date);
                    const cstDate = new Intl.DateTimeFormat('en-US', options).format(d);

                    // Extract parts and format as MM-DD-YYYY HH:mm
                    const [month, day, year, hour, minute] = cstDate.match(/(\d{2})\/(\d{2})\/(\d{4}),? (\d{2}):(\d{2})/).slice(1);

                    return `${month}-${day}-${year} ${hour}:${minute}`;
                });

                console.log("formattedDates (CST):", formattedDates);

                const selectedHours = {};

                entryDates.forEach((date, index) => {
                    const row = document.createElement("tr");

                    // const selectedHours = {}; // Object to store each hour as hour1, hour2, etc.
                    const timeCell = document.createElement("td");
                    const timeSelect = document.createElement("select");
                    timeSelect.id = `timeSelect-${index}`;

                    // Create a dynamic key for each row (hour1, hour2, hour3, etc.)
                    const hourKey = `hour${index + 1}`;
                    selectedHours[hourKey] = index === 0 ? times[0] : "NONE";  // Set default hour value

                    if (index !== 0) {
                        // Create "NONE" option as the default for all rows except the first
                        const noneOption = document.createElement("option");
                        noneOption.value = "NONE";
                        noneOption.textContent = "NONE";
                        timeSelect.appendChild(noneOption);
                    }

                    // Create options for the dropdown (24 hours)
                    times.forEach(time => {
                        const option = document.createElement("option");
                        option.value = time;
                        option.textContent = time;
                        timeSelect.appendChild(option);
                    });

                    // Set the default value
                    timeSelect.value = selectedHours[hourKey];

                    // Update the corresponding hour when changed
                    timeSelect.addEventListener("change", (event) => {
                        selectedHours[hourKey] = event.target.value;
                        console.log(`${hourKey} selected:`, selectedHours[hourKey]);
                    });

                    // Example of accessing the selected hours:
                    // setTimeout(() => {
                    //     // Log the value for specific hours
                    //     console.log(`hour1 selected:`, selectedHours['hour1']);
                    //     console.log(`hour4 selected:`, selectedHours['hour4']);
                    // }, 5000);

                    timeCell.appendChild(timeSelect);
                    row.appendChild(timeCell);


                    // Sluice1 cell (editable)
                    const sluice1Cell = document.createElement("td");
                    const sluice1Input = document.createElement("input");
                    sluice1Input.type = "number";
                    sluice1Input.value = null;
                    sluice1Input.id = `sluice1Input`;

                    if (index === 0) {
                        sluice1Input.style.backgroundColor = "pink";
                    }

                    sluice1Cell.appendChild(sluice1Input);
                    row.appendChild(sluice1Cell);
                    console.log(document.getElementById(`sluice1Input`));  // Check if element exists


                    // Sluice2 cell (editable)
                    const sluice2Cell = document.createElement("td");
                    const sluice2Input = document.createElement("input");
                    sluice2Input.type = "number";
                    sluice2Input.value = null;
                    sluice2Input.id = `sluice2Input`;

                    if (index === 0) {
                        sluice2Input.style.backgroundColor = "pink";
                    }

                    sluice2Cell.appendChild(sluice2Input);
                    row.appendChild(sluice2Cell);

                    // Sluice Total cell (editable)
                    const sluiceTotalCell = document.createElement("td");
                    const sluiceTotalInput = document.createElement("input");
                    sluiceTotalInput.type = "number";
                    sluiceTotalInput.value = null;
                    sluiceTotalInput.id = `sluiceTotalInput-${date}`;

                    if (index === 0) {
                        sluiceTotalInput.style.backgroundColor = "pink";
                    }

                    sluiceTotalCell.appendChild(sluiceTotalInput);
                    row.appendChild(sluiceTotalCell);

                    // Gate 1 (editable)
                    const gate1Cell = document.createElement("td");
                    const gate1Input = document.createElement("input");
                    gate1Input.type = "number";
                    gate1Input.value = null;
                    gate1Input.id = `gate1Input-${date}`;
                    if (index === 0) {
                        gate1Input.style.backgroundColor = "pink";
                    }
                    gate1Cell.appendChild(gate1Input);
                    row.appendChild(gate1Cell);

                    // Gate 2 (editable)
                    const gate2Cell = document.createElement("td");
                    const gate2Input = document.createElement("input");
                    gate2Input.type = "number";
                    gate2Input.value = null;
                    gate2Input.id = `gate2Input-${date}`;
                    if (index === 0) {
                        gate2Input.style.backgroundColor = "pink";
                    }
                    gate2Cell.appendChild(gate2Input);
                    row.appendChild(gate2Cell);

                    // Gate 3 (editable)
                    const gate3Cell = document.createElement("td");
                    const gate3Input = document.createElement("input");
                    gate3Input.type = "number";
                    gate3Input.value = null;
                    gate3Input.id = `gate3Input-${date}`;
                    if (index === 0) {
                        gate3Input.style.backgroundColor = "pink";
                    }
                    gate3Cell.appendChild(gate3Input);
                    row.appendChild(gate3Cell);

                    // Gate Total (calculated)
                    const gateTotalCell = document.createElement("td");
                    const gateTotalInput = document.createElement("input");
                    gateTotalInput.type = "number";
                    gateTotalInput.value = null;
                    gateTotalInput.id = `gateTotalInput-${date}`;
                    if (index === 0) {
                        gateTotalInput.style.backgroundColor = "pink";
                    }
                    gateTotalCell.appendChild(gateTotalInput);
                    row.appendChild(gateTotalCell);

                    // Gate Average (calculated)
                    const gateAverageCell = document.createElement("td");
                    const gateAverageInput = document.createElement("input");
                    gateAverageInput.type = "number";
                    gateAverageInput.value = null;
                    gateAverageInput.id = `gateAverageInput-${date}`;
                    gateAverageInput.readOnly = true; // Make it read-only
                    gateAverageInput.style.backgroundColor = "#f0f0f0";
                    gateAverageCell.appendChild(gateAverageInput);
                    row.appendChild(gateAverageCell);

                    table.appendChild(row);
                });

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


                // Create the first cell for "Average Outflow (cfs)"
                const firstCell = document.createElement("td");
                firstCell.textContent = "Average Outflow (cfs)";
                tableRow.appendChild(firstCell);

                // Create the second cell with "--"
                const secondCell = document.createElement("td");
                secondCell.textContent = "--";
                tableRow.appendChild(secondCell);

                // Append the row to the tableOutflowAvg
                tableOutflowAvg.appendChild(tableRow);

                // Append the tableOutflowAvg to the div
                gateAverageDiv.appendChild(tableOutflowAvg);

                // Append the div to output6Div
                output6Div.appendChild(gateAverageDiv);


                const cdaSaveBtn = document.createElement("button");
                cdaSaveBtn.textContent = "Submit";
                cdaSaveBtn.id = "cda-btn";
                cdaSaveBtn.disabled = true;
                output6Div.appendChild(cdaSaveBtn);

                const statusDiv = document.createElement("div");
                statusDiv.className = "status";
                const cdaStatusBtn = document.createElement("button");
                cdaStatusBtn.textContent = "";
                cdaStatusBtn.id = "cda-btn";
                cdaStatusBtn.disabled = false;
                statusDiv.appendChild(cdaStatusBtn);
                output6Div.appendChild(statusDiv);

                // Add event listener to the submit button
                cdaSaveBtn.addEventListener("click", async () => {

                    // Log selected hours for debugging
                    Object.keys(selectedHours).forEach(hour => {
                        console.log(`${hour} selected:`, selectedHours[hour]);
                    });

                    // Get the sluice1 input element and check if it exists
                    const sluice1Input = document.getElementById('sluice1Input');
                    if (!sluice1Input) {
                        console.error("sluice1Input element not found!");
                        return; // Exit if input is missing
                    }
                    if (!sluice1Input.value) { 
                        sluice1Input.value = 909; 
                    }

                    // Get the sluice2 input element and check if it exists
                    const sluice2Input = document.getElementById('sluice2Input');
                    if (!sluice2Input) {
                        console.error("sluice2Input element not found!");
                        return; // Exit if input is missing
                    }
                    if (!sluice2Input.value) { 
                        sluice2Input.value = 909; 
                    }

                    let time1 = null;
                    if (selectedHours['hour1'] !== "NONE") {
                        time1 = isoDateToday.slice(0, 10) + "T" + selectedHours['hour1'] + `:00Z`;
                    }

                    let time2 = null;
                    if (selectedHours['hour2'] !== "NONE") {
                        time2 = isoDateToday.slice(0, 10) + "T" + selectedHours['hour2'] + `:00Z`;
                    }

                    let time3 = null;
                    if (selectedHours['hour3'] !== "NONE") {
                        time3 = isoDateToday.slice(0, 10) + "T" + selectedHours['hour3'] + `:00Z`;
                    }

                    let time4 = null;
                    if (selectedHours['hour4'] !== "NONE") {
                        time4 = isoDateToday.slice(0, 10) + "T" + selectedHours['hour4'] + `:00Z`;
                    }

                    let time5 = null;
                    if (selectedHours['hour5'] !== "NONE") {
                        time5 = isoDateToday.slice(0, 10) + "T" + selectedHours['hour5'] + `:00Z`;
                    }

                    let time6 = null;
                    if (selectedHours['hour6'] !== "NONE") {
                        time6 = isoDateToday.slice(0, 10) + "T" + selectedHours['hour6'] + `:00Z`;
                    }

                    // Payload for sluice1 values
                    const payloadSluice1 = {
                        "name": tsidSluice1,
                        "office-id": "MVS",
                        "units": "ft",
                        "values": [
                            [
                                time1,
                                sluice1Input.value,
                                0
                            ],
                            [
                                time2,
                                sluice1Input.value,
                                0
                            ],
                            [
                                time3,
                                sluice1Input.value,
                                0
                            ],
                            [
                                time4,
                                sluice1Input.value,
                                0
                            ],
                            [
                                time5,
                                sluice1Input.value,
                                0
                            ],
                            [
                                time6,
                                sluice1Input.value,
                                0
                            ],
                        ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                    };

                    console.log("payloadSluice1: ", payloadSluice1);

                    const payloadSluice2 = {
                        "name": tsidSluice2,
                        "office-id": "MVS",
                        "units": "ft",
                        "values": [
                            [
                                time1,
                                sluice2Input.value,
                                0
                            ],
                            [
                                time2,
                                sluice2Input.value,
                                0
                            ],
                            [
                                time3,
                                sluice2Input.value,
                                0
                            ],
                            [
                                time4,
                                sluice2Input.value,
                                0
                            ],
                            [
                                time5,
                                sluice2Input.value,
                                0
                            ],
                            [
                                time6,
                                sluice2Input.value,
                                0
                            ],
                        ].filter(item => item[0] !== null),
                    };

                    console.log("payloadSluice2: ", payloadSluice2);


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

                    async function createVersionTS(payload) {

                        if (!payload) throw new Error("You must specify a payload!");
                        try {
                            const response = await fetch("https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?store-rule=REPLACE%20ALL", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json;version=2",
                                },


                                body: JSON.stringify(payload)
                            });

                            if (!response.ok) {
                                const errorText = await response.text();
                                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                            }

                            return true;

                        } catch (error) {
                            console.error('Error writing timeseries:', error);
                            throw error;
                        }

                    }

                    async function fetchUpdatedData(name, isoDateDay5, isoDateToday) {
                        let response = null;

                        if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                            response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?name=${name}&begin=${isoDateMinus1Day}&end=${isoDateDay5}&office=MVS&version-date=${isoDateToday}`, {
                                headers: {
                                    "Accept": "application/json;version=2", // Ensuring the correct version is used
                                    "cache-control": "no-cache"
                                }
                            });
                        } else {
                            response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?name=${name}&begin=${isoDateToday}&end=${isoDateDay5}&office=MVS&version-date=${isoDateToday}`, {
                                headers: {
                                    "Accept": "application/json;version=2", // Ensuring the correct version is used
                                    "cache-control": "no-cache"
                                }
                            });
                        }

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
                            // showSpinner(); // Show the spinner before creating the version
                            // await createVersionTS(payloadSluice1);
                            // cdaStatusBtn.innerText = "Write successful!";

                            // await createVersionTS(payloadSluice2);
                            // cdaStatusBtn.innerText = "Write payloadSluice2 successful!";

                            // // Fetch updated data and refresh the table
                            // const updatedData = await fetchUpdatedData(tsidOutflow, isoDateDay5, isoDateToday, isoDateMinus1Day);

                            // let updatedDataInflow = null;
                            // updatedDataInflow = await fetchUpdatedData(tsidInflow, isoDateDay5, isoDateToday, isoDateMinus1Day);

                            // createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidOutflow, updatedData, tsidInflow, updatedDataInflow);
                        } catch (error) {
                            hideSpinner(); // Hide the spinner if an error occurs
                            cdaStatusBtn.innerText = "Failed to write data!";
                            console.error(error);
                        }

                        hideSpinner(); // Hide the spinner after the operation completes
                    }
                });

            }
        };

        const fetchTimeSeriesData = async (tsid) => {
            // Convert to Date object
            const date = new Date(isoDateMinus2Days);

            // Add 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
            date.setTime(date.getTime() + (1 * 60 * 60 * 1000));

            // Convert back to ISO string (preserve UTC format)
            const isoDateMinus1DayPlus1Hour = date.toISOString();

            console.log("isoDateMinus1DayPlus1Hour: ", isoDateMinus1DayPlus1Hour);

            const tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateMinus1DayPlus1Hour}&end=${isoDateDay1}&office=${office}`;
            // const tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateMinus1DayPlus1Hour}&end=${isoDateDay1}&office=${office}`;
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

        fetchTsidData();  
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
});

// Lk Shelbyville-Kaskaskia.Opening.Inst.~30Minutes.0.lakerep-rev-G1-test (Gate-Lake-Test)
// Lk Shelbyville-Kaskaskia.Opening.Inst.~30Minutes.0.lakerep-rev-G2-test (Gate-Lake-Test)
// Lk Shelbyville-Kaskaskia.Opening.Inst.~30Minutes.0.lakerep-rev-G3-test (Gate-Lake-Test)
// Lk Shelbyville-Kaskaskia.Opening.Inst.~30Minutes.0.lakerep-rev-G4-test (NOT USED)
// Lk Shelbyville-Kaskaskia.Flow-Sluice.Inst.~30Minutes.0.lakerep-rev-test (Gate-Total-Lake-Test)

// Lk Shelbyville-Kaskaskia.Opening.Inst.~30Minutes.0.lakerep-rev-S1-test (Sluice-Lake-Test)
// Lk Shelbyville-Kaskaskia.Opening.Inst.~30Minutes.0.lakerep-rev-S2-test (Sluice-Lake-Test)
// Lk Shelbyville-Kaskaskia.Opening.Inst.~30Minutes.0.lakerep-rev-S3-test (NOT USED)
// Lk Shelbyville-Kaskaskia.Flow-Taint.Inst.~30Minutes.0.lakerep-rev-test (Sluice-Total-Lake-Test)

// Lk Shelbyville-Kaskaskia.Flow.Inst.~30Minutes.0.lakerep-rev-test (Outflow-Total-Lake-Test)

// Lk Shelbyville-Kaskaskia.Flow-Out.Ave.~1Day.1Day.lakerep-rev-test (Outflow-Average-Lake-Test)