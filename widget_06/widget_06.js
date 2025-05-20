document.addEventListener('DOMContentLoaded', async function () {
    if (lake === "Rend Lk-Big Muddy" || lake === "Rend Lk" || lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk" || lake === "Carlyle Lk-Kaskaskia" || lake === "Rend Lk" || lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
        console.log("****************** Rend Lk-Big Muddy ******************");
        console.log('lake: ', lake);
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

        let dstOffsetHours = getDSTOffsetInHours();
        console.log(`dstOffsetHours: ${dstOffsetHours} hours`);

        const urltsid = `${setBaseUrl}timeseries/group/Forecast-Lake?office=${office}&category-id=${lake}`;
        console.log("urltsid:", urltsid);

        const fetchTsidData = async () => {
            try {
                const response = await fetch(urltsid);

                const tsidData = await response.json();
                console.log("tsidData:", tsidData);

                // Extract the timeseries-id from the response
                const tsidOutflow = tsidData['assigned-time-series'][0]['timeseries-id'];
                console.log("tsidOutflow:", tsidOutflow);

                let tsidInflow = null;
                let timeSeriesDataInflow = null;
                if (tsidData && tsidData['assigned-time-series'] && tsidData['assigned-time-series'][1]) {
                    tsidInflow = tsidData['assigned-time-series'][1]['timeseries-id'];
                    console.log("tsidInflow:", tsidInflow);

                    timeSeriesDataInflow = await fetchTimeSeriesData(tsidInflow);
                    console.log("timeSeriesDataInflow:", timeSeriesDataInflow);
                } else {
                    console.log("The required data does not exist.");
                }

                // Fetch time series data using tsidOutflow values
                const timeSeriesDataOutflow = await fetchTimeSeriesData(tsidOutflow);
                console.log("timeSeriesDataOutflow:", timeSeriesDataOutflow);

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
                    cdaSaveBtn = document.getElementById("cda-btn-lake-forecast"); // Get the button by its ID

                    cdaSaveBtn.disabled = true; // Disable button while checking login state

                    // Update button text based on login status
                    if (await isLoggedIn()) {
                        cdaSaveBtn.innerText = "Save";
                    } else {
                        cdaSaveBtn.innerText = "Login";
                    }

                    cdaSaveBtn.disabled = false; // Re-enable button
                }

                if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                    if (timeSeriesDataOutflow && timeSeriesDataOutflow.values && timeSeriesDataOutflow.values.length > 0 && timeSeriesDataInflow && timeSeriesDataInflow.values && timeSeriesDataInflow.values.length > 0) {
                        console.log("Calling Mark Twain Lk createTable ...");

                        createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidOutflow, timeSeriesDataOutflow, tsidInflow, timeSeriesDataInflow);

                        loginStateController()
                        // Setup timers
                        setInterval(async () => {
                            loginStateController()
                        }, 10000) // time is in millis
                    } else {
                        console.log("Calling Mark Twain Lk createDataEntryTable ...");
                        createDataEntryTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidOutflow, timeSeriesDataOutflow, tsidInflow, timeSeriesDataInflow);

                        loginStateController()
                        // Setup timers
                        setInterval(async () => {
                            loginStateController()
                        }, 10000) // time is in millis
                    }

                } else {
                    if (timeSeriesDataOutflow && timeSeriesDataOutflow.values && timeSeriesDataOutflow.values.length > 0) {
                        console.log("Calling createTable ...");

                        createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidOutflow, timeSeriesDataOutflow, tsidInflow, timeSeriesDataInflow);

                        loginStateController()
                        // Setup timers
                        setInterval(async () => {
                            loginStateController()
                        }, 10000) // time is in millis
                    } else {
                        console.log("Calling createDataEntryTable ...");
                        createDataEntryTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidOutflow, timeSeriesDataOutflow, tsidInflow, timeSeriesDataInflow);

                        loginStateController()
                        // Setup timers
                        setInterval(async () => {
                            loginStateController()
                        }, 10000) // time is in millis
                    }
                }

            } catch (error) {
                console.error("Error fetching tsidOutflow data:", error);
            }

            function createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidOutflow, timeSeriesDataOutflow, tsidInflow, timeSeriesDataInflow) {
                console.log("timeSeriesDataOutflow:", timeSeriesDataOutflow);
                console.log("timeSeriesDataInflow:", timeSeriesDataInflow);

                const formattedData = timeSeriesDataOutflow.values.map(entry => {
                    const timestamp = Number(entry[0]); // Ensure timestamp is a number

                    return {
                        ...entry, // Retain other data
                        formattedTimestampUTC: convertUnixTimestamp(timestamp, true),  // UTC time
                        formattedTimestampCST: convertUnixTimestamp(timestamp, false),    // CST/CDT adjusted time
                    };
                });
                console.log("Formatted timeSeriesDataOutflow:", formattedData);

                let formattedDataInflow;
                if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                    formattedDataInflow = timeSeriesDataInflow.values.map(entry => {
                        const timestamp = entry[0]; // Timestamp is in milliseconds in the array

                        return {
                            ...entry, // Retain other data
                            formattedTimestampUTC: convertUnixTimestamp(timestamp, true),  // UTC time
                            formattedTimestampCST: convertUnixTimestamp(timestamp, false),    // CST/CDT adjusted time
                        };
                    });

                    // Now you have formatted data for both datasets
                    console.log("Formatted timeSeriesDataInflow:", formattedDataInflow);
                }

                const table = document.createElement("table");
                table.id = "lake-forecast";

                const headerRow = document.createElement("tr");
                const dateHeader = document.createElement("th");
                dateHeader.textContent = "Date";
                headerRow.appendChild(dateHeader);

                if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                    const inflowHeader = document.createElement("th");
                    inflowHeader.textContent = "Forecast Inflow (cfs)";
                    headerRow.appendChild(inflowHeader);
                }

                const outflowHeader = document.createElement("th");
                outflowHeader.textContent = "Forecast Outflow (cfs)";
                headerRow.appendChild(outflowHeader);

                table.appendChild(headerRow);

                // Loop over the data (use formattedData for outflow and formattedDataInflow for inflow if lake matches)
                formattedData.forEach((entry, index) => {
                    const row = document.createElement("tr");

                    const dateCell = document.createElement("td");
                    // dateCell.textContent = entry.formattedTimestampCST ? entry.formattedTimestampCST : entry[0];
                    dateCell.textContent = entry.formattedTimestampCST ? new Date(entry.formattedTimestampCST).toISOString().slice(5, 7) + '-' + new Date(entry.formattedTimestampCST).toISOString().slice(8, 10) + '-' + new Date(entry.formattedTimestampCST).toISOString().slice(0, 4) : entry[0];
                    row.appendChild(dateCell);

                    // Inflow cell (editable)
                    if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                        const inflowCell = document.createElement("td");
                        const inflowInput = document.createElement("input");
                        inflowInput.type = "number";
                        inflowInput.value = formattedDataInflow[index][1].toFixed(0); // Use inflow data if available
                        inflowInput.className = "inflow-input";
                        inflowInput.id = `inflowInput-${entry[0]}`;
                        inflowInput.style.textAlign = "center";
                        inflowInput.style.verticalAlign = "middle";
                        inflowCell.appendChild(inflowInput);
                        row.appendChild(inflowCell);
                    }

                    // Outflow cell (editable)
                    const outflowCell = document.createElement("td");
                    const outflowInput = document.createElement("input");
                    outflowInput.type = "number";
                    outflowInput.step = "10.0";
                    outflowInput.value = entry[1].toFixed(0); // Outflow uses formattedData
                    outflowInput.className = "outflow-input";
                    outflowInput.id = `outflowInput-${entry[0]}`;
                    outflowInput.style.textAlign = "center";
                    outflowInput.style.verticalAlign = "middle";
                    outflowCell.appendChild(outflowInput);
                    row.appendChild(outflowCell);

                    table.appendChild(row);
                });

                const output6Div = document.getElementById("output6");
                output6Div.innerHTML = "";
                output6Div.appendChild(table);

                // Create the buttonRefresh button
                const cdaSaveBtn = document.createElement("button");
                cdaSaveBtn.textContent = "Submit";
                cdaSaveBtn.id = "cda-btn-lake-forecast";
                cdaSaveBtn.disabled = true;
                output6Div.appendChild(cdaSaveBtn);

                // Create the statusDiv
                const statusDiv = document.createElement("div");
                statusDiv.className = "status-lake-forecast";
                output6Div.appendChild(statusDiv);

                // Create the buttonRefresh button
                const buttonRefresh = document.createElement('button');
                buttonRefresh.textContent = 'Refresh';
                buttonRefresh.id = 'refresh-lake-forecast-button';
                buttonRefresh.className = 'fetch-btn';
                output6Div.appendChild(buttonRefresh);

                buttonRefresh.addEventListener('click', () => {
                    // Remove existing table
                    const existingTable = document.getElementById('lake-forecast');
                    if (existingTable) {
                        existingTable.remove();
                    }

                    const existingRefresh = document.getElementById('cda-btn-lake-forecast');
                    if (existingRefresh) {
                        existingRefresh.remove();
                    }

                    // Fetch and create new table
                    fetchTsidData();
                });

                cdaSaveBtn.addEventListener("click", async () => {
                    const payloadForecastOutflow = {
                        "date-version-type": "MAX_AGGREGATE",
                        "name": tsidOutflow,
                        "office-id": "MVS",
                        "units": "cfs",
                        "values": formattedData.map(entry => {
                            const outflowValue = document.getElementById(`outflowInput-${entry[0]}`).value;
                            // console.log("outflowValue:", outflowValue);

                            const timestampUnix = new Date(entry[0]).getTime();
                            console.log("timestampUnix:", timestampUnix);

                            return [
                                timestampUnix,
                                parseFloat(outflowValue),
                                0
                            ];
                        }),
                        "version-date": convertTo6AMCST(isoDateToday),
                    };
                    console.log("Preparing payload...");
                    console.log("payloadForecastOutflow:", payloadForecastOutflow);

                    let payloadInflow = null;
                    if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                        payloadInflow = {
                            "date-version-type": "MAX_AGGREGATE",
                            "name": tsidInflow,
                            "office-id": "MVS",
                            "units": "cfs",
                            "values": formattedData.map(entry => {
                                let inflowValue = document.getElementById(`inflowInput-${entry[0]}`).value; // Get value from input field
                                // console.log("inflowValue:", inflowValue);

                                // Convert ISO date string to timestamp
                                const timestampUnix = new Date(entry[0]).getTime();
                                // console.log("timestampUnix:", timestampUnix);

                                // Convert 6am in milliseconds and add it
                                const adjustedTimestampUnix = timestampUnix + 6 * 60 * 60 * 1000;
                                console.log("adjustedTimestampUnix:", adjustedTimestampUnix);

                                return [
                                    timestampUnix,  // Timestamp for the day at 6 AM
                                    parseInt(inflowValue), // Stage value (forecast outflow) as number
                                    0 // Placeholder for the third value (set to 0 for now)
                                ];
                            }),
                            "version-date": convertTo6AMCST(isoDateToday), // Ensure this is the correct ISO formatted date
                        };

                        console.log("payloadInflow: ", payloadInflow);
                    }

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

                    async function fetchUpdatedData(name, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay6) {
                        let response = null;

                        if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                            response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?name=${name}&begin=${isoDateMinus1Day}&end=${isoDateDay6}&office=MVS&version-date=${convertTo6AMCST(isoDateToday)}`, {
                                headers: {
                                    "Accept": "application/json;version=2", // Ensuring the correct version is used
                                    "cache-control": "no-cache"
                                }
                            });
                        } else {
                            response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?name=${name}&begin=${isoDateToday}&end=${isoDateDay6}&office=MVS&version-date=${convertTo6AMCST(isoDateToday)}`, {
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
                        statusDiv.innerText = loginResult ? "" : "Failed to Login!";
                    } else {
                        try {
                            showSpinner(); // Show the spinner before creating the version
                            await createVersionTS(payloadForecastOutflow);
                            statusDiv.innerText = "Write successful!";

                            if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                                await createVersionTS(payloadInflow);
                                statusDiv.innerText = "Write payloadInflow successful!";
                            }

                            // Optional: small delay to allow backend to process the new data
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            // Fetch updated data and refresh the table
                            const updatedData = await fetchUpdatedData(tsidOutflow, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay6);

                            let updatedDataInflow = null;
                            if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                                updatedDataInflow = await fetchUpdatedData(tsidInflow, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay6);
                            }
                            createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidOutflow, updatedData, tsidInflow, updatedDataInflow);
                        } catch (error) {
                            hideSpinner(); // Hide the spinner if an error occurs
                            statusDiv.innerText = "Failed to write data!";
                            console.error(error);
                        }

                        hideSpinner(); // Hide the spinner after the operation completes
                    }
                });

            }

            function createDataEntryTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidOutflow, timeSeriesDataOutflow, tsidInflow, timeSeriesDataInflow) {
                // Create the empty table element
                const table = document.createElement("table");

                table.id = "lake-forecast";

                // Create the table header row
                const headerRow = document.createElement("tr");

                const dateHeader = document.createElement("th");
                dateHeader.textContent = "Day";
                headerRow.appendChild(dateHeader);

                if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                    const inflowHeader = document.createElement("th");
                    inflowHeader.textContent = "Forecast Inflow (cfs)";
                    headerRow.appendChild(inflowHeader);
                }

                const outflowHeader = document.createElement("th");
                outflowHeader.textContent = "Forecast Outflow (cfs)";
                headerRow.appendChild(outflowHeader);

                table.appendChild(headerRow);

                let dates = [];
                // Make the dates to be 6am
                if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                    dates = [convertTo6AMCST(isoDateMinus1Day), convertTo6AMCST(isoDateToday), convertTo6AMCST(isoDateDay1), convertTo6AMCST(isoDateDay2), convertTo6AMCST(isoDateDay3), convertTo6AMCST(isoDateDay4), convertTo6AMCST(isoDateDay5)];
                } else {
                    dates = [convertTo6AMCST(isoDateToday), convertTo6AMCST(isoDateDay1), convertTo6AMCST(isoDateDay2), convertTo6AMCST(isoDateDay3), convertTo6AMCST(isoDateDay4), convertTo6AMCST(isoDateDay5)];
                }
                console.log("dates are 6am cst in utc timezone:", dates);

                dates.forEach((date, index) => {
                    const row = document.createElement("tr");

                    // Date cell
                    const dateCell = document.createElement("td");
                    // dateCell.textContent = dates[index];
                    dateCell.textContent = new Date(dates[index]).toISOString().slice(5, 7) + '-' + new Date(dates[index]).toISOString().slice(8, 10) + '-' + new Date(dates[index]).toISOString().slice(0, 4);
                    row.appendChild(dateCell);

                    // Inflow cell (editable)
                    if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                        const inflowCell = document.createElement("td");
                        const inflowInput = document.createElement("input");
                        inflowInput.type = "text";
                        inflowInput.value = "";
                        inflowInput.id = `inflowInput-${date}`;
                        inflowInput.style.backgroundColor = "pink";  // Set pink background
                        inflowCell.appendChild(inflowInput);
                        row.appendChild(inflowCell);
                    }

                    // Outflow cell (editable)
                    const outflowCell = document.createElement("td");
                    const outflowInput = document.createElement("input");
                    outflowInput.type = "text";
                    outflowInput.value = "";
                    outflowInput.id = `outflowInput-${date}`;
                    outflowInput.style.backgroundColor = "pink";  // Set pink background
                    outflowCell.appendChild(outflowInput);
                    row.appendChild(outflowCell);

                    table.appendChild(row);
                });

                // Append the table to the specific container (id="output6")
                const output6Div = document.getElementById("output6");
                output6Div.innerHTML = ""; // Clear any existing content
                output6Div.appendChild(table);

                const cdaSaveBtn = document.createElement("button");
                cdaSaveBtn.textContent = "Submit";
                cdaSaveBtn.id = "cda-btn-lake-forecast";
                cdaSaveBtn.disabled = true;
                output6Div.appendChild(cdaSaveBtn);

                const statusDiv = document.createElement("div");
                statusDiv.className = "status-lake-forecast";
                output6Div.appendChild(statusDiv);

                // Create the buttonRefresh button
                const buttonRefresh = document.createElement('button');
                buttonRefresh.textContent = 'Refresh';
                buttonRefresh.id = 'refresh-lake-forecast-button';
                buttonRefresh.className = 'fetch-btn';
                output6Div.appendChild(buttonRefresh);

                buttonRefresh.addEventListener('click', () => {
                    // Remove existing table
                    const existingTable = document.getElementById('lake-forecast');
                    if (existingTable) {
                        existingTable.remove();
                    }

                    const existingRefresh = document.getElementById('cda-btn-lake-forecast');
                    if (existingRefresh) {
                        existingRefresh.remove();
                    }

                    // Fetch and create new table
                    fetchTsidData();
                });

                // Add event listener to the submit button
                cdaSaveBtn.addEventListener("click", async () => {
                    const payloadForecastOutflow = {
                        "date-version-type": "MAX_AGGREGATE",
                        "name": tsidOutflow,
                        "office-id": "MVS",
                        "units": "cfs",
                        "values": dates.map((date, index) => {
                            let outflowValue = document.getElementById(`outflowInput-${date}`).value; // Get value from input field
                            // console.log("outflowValue:", outflowValue);

                            // If outflowValue is empty or null, set it to 909
                            if (!outflowValue) {
                                outflowValue = "909";
                            }

                            console.log("date:", date); // this is 6am cst in UTC timezone

                            // Convert ISO date string to timestamp
                            const timestampUnix = new Date(date).getTime();
                            console.log("timestampUnix:", timestampUnix);

                            return [
                                timestampUnix,
                                parseInt(outflowValue),
                                0
                            ];
                        }),
                        "version-date": convertTo6AMCST(isoDateToday), // Ensure this is the correct ISO formatted date
                    };

                    console.log("payloadForecastOutflow: ", payloadForecastOutflow);

                    let payloadInflow = null;
                    if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                        payloadInflow = {
                            "date-version-type": "MAX_AGGREGATE",
                            "name": tsidInflow,
                            "office-id": "MVS",
                            "units": "cfs",
                            "values": dates.map((date, index) => {
                                let inflowValue = document.getElementById(`inflowInput-${date}`).value; // Get value from input field
                                // console.log("inflowValue:", inflowValue);

                                // If inflowValue is empty or null, set it to 909
                                if (!inflowValue) {
                                    inflowValue = "909"; // Default value when empty or null
                                }

                                // Convert ISO date string to timestamp
                                const timestampUnix = new Date(date).getTime(); // Correct timestamp conversion
                                // console.log("timestampUnix:", timestampUnix);

                                // Convert 6am in milliseconds and add it, this is CST/CDT
                                const adjustedTimestampUnix = timestampUnix + 6 * 60 * 60 * 1000;
                                // console.log("adjustedTimestampUnix:", adjustedTimestampUnix);

                                return [
                                    adjustedTimestampUnix,  // Timestamp for the day at 6 AM
                                    parseInt(inflowValue), // Stage value (forecast outflow) as number
                                    0 // Placeholder for the third value (set to 0 for now)
                                ];
                            }),
                            "version-date": convertTo6AMCST(isoDateToday), // Ensure this is the correct ISO formatted date
                        };

                        console.log("payloadInflow: ", payloadInflow);
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

                    async function createVersionTS(payload) {

                        if (!payload) throw new Error("You must specify a payload!");
                        try {
                            const response = await fetch("https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?store-rule=REPLACE%20ALL", {
                                method: "POST",
                                headers: {
                                    // "accept": "*/*",
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

                    async function fetchUpdatedData(name, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay6) {
                        let response = null;

                        if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                            response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?name=${name}&begin=${isoDateMinus1Day}&end=${isoDateDay6}&office=MVS&version-date=${convertTo6AMCST(isoDateToday)}`, {
                                headers: {
                                    "Accept": "application/json;version=2", // Ensuring the correct version is used
                                    "cache-control": "no-cache"
                                }
                            });
                        } else {
                            response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?name=${name}&begin=${isoDateToday}&end=${isoDateDay6}&office=MVS&version-date=${convertTo6AMCST(isoDateToday)}`, {
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
                        statusDiv.innerText = loginResult ? "" : "Failed to Login!";
                    } else {
                        try {
                            showSpinner(); // Show the spinner before creating the version
                            await createVersionTS(payloadForecastOutflow);
                            statusDiv.innerText = "Write successful!";

                            if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                                await createVersionTS(payloadInflow);
                                statusDiv.innerText = "Write payloadInflow successful!";
                            }

                            // Optional: small delay to allow backend to process the new data
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            // Fetch updated data and refresh the table
                            const updatedData = await fetchUpdatedData(tsidOutflow, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay6);

                            let updatedDataInflow = null;
                            if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                                updatedDataInflow = await fetchUpdatedData(tsidInflow, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay6);
                            }
                            createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidOutflow, updatedData, tsidInflow, updatedDataInflow);
                        } catch (error) {
                            hideSpinner(); // Hide the spinner if an error occurs
                            statusDiv.innerText = "Failed to write data!";
                            console.error(error);
                        }

                        hideSpinner(); // Hide the spinner after the operation completes
                    }
                });

            }
        };

        const fetchTimeSeriesData = async (tsid) => {
            let tsidData = null;
            if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateMinus1Day}&end=${isoDateDay6}&office=${office}&version-date=${convertTo6AMCST(isoDateToday)}`;
            } else {
                tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateToday}&end=${isoDateDay6}&office=${office}&version-date=${convertTo6AMCST(isoDateToday)}`;
            }
            console.log('tsidData:', tsidData);

            try {
                const response = await fetch(tsidData, {
                    headers: {
                        "Accept": "application/json;version=2", // Ensuring the correct version is used
                        "cache-control": "no-cache"
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Error fetching time series data:", error);
            }
        };

        fetchTsidData();
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

        // Add 6 hours or make it 6 AM if needed
        // date.setUTCHours(6);  // Ensure it's 6 AM UTC

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

    function convertTo6AMCST(isoDateToday) {
        // Parse the input date
        let date = new Date(isoDateToday);

        // Add 6 hours (6 * 60 * 60 * 1000 ms)
        date = new Date(date.getTime() + 6 * 60 * 60 * 1000);

        // Return the new ISO string
        return date.toISOString();
    }
});


// Run this PL/SQL to delete data only (not tsid) for testing purposes
// BEGIN
//     CWMS_20.CWMS_TS.DELETE_TS(
//         p_cwms_ts_id    => 'Lk Shelbyville-Kaskaskia.Flow-Out.Inst.~1Day.0.lakerep-rev-forecast',
//         p_delete_action => CWMS_UTIL.DELETE_TS_DATA,  -- Only delete the data, keeping metadata
//         p_db_office_id  => 'MVS'
//     );
// END;

// Run this PL/SQL to delete tsid and data
// BEGIN
//     CWMS_20.CWMS_TS.DELETE_TS(
//         p_cwms_ts_id    => 'Mark Twain Lk-Salt.Flow-In.Inst.~1Day.0.lakerep-rev-forecast',
//         p_delete_action => CWMS_UTIL.DELETE_TS_CASCADE,  -- Delete time series and all dependencies
//         p_db_office_id  => 'MVS'
//     );
// END;

// To Create tsid, run write_data_versioned app

// Timeseries used in this Widget
// Rend Lk-Big Muddy.Flow-Out.Inst.~1Day.0.lakerep-rev-forecast
// Carlyle Lk-Kaskaskia.Flow-Out.Inst.~1Day.0.lakerep-rev-forecast
// Lk Shelbyville-Kaskaskia.Flow-Out.Inst.~1Day.0.lakerep-rev-forecast
// Mark Twain Lk-Salt.Flow-In.Inst.~1Day.0.lakerep-rev-forecast
// Mark Twain Lk-Salt.Flow-Out.Inst.~1Day.0.lakerep-rev-forecast
// Wappapello Lk-St Francis.Flow-Out.Inst.~1Day.0.lakerep-rev-forecast