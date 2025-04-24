document.addEventListener('DOMContentLoaded', async function () {
    if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
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

        const urltsid = `${setBaseUrl}timeseries/group/Turbines-Lake-Test?office=${office}&category-id=${lake}`;
        console.log("urltsid:", urltsid);

        const urltsid2 = `${setBaseUrl}timeseries/group/Spillway-Lake-Test?office=${office}&category-id=${lake}`;
        console.log("urltsid2:", urltsid2);

        const urltsid3 = `${setBaseUrl}timeseries/group/Generation-Release-Lake-Test?office=${office}&category-id=${lake}`;
        console.log("urltsid3:", urltsid3);

        const fetchTsidData = async () => {
            try {
                const response = await fetch(urltsid);
                const response2 = await fetch(urltsid2);
                const response3 = await fetch(urltsid3);

                const tsidData = await response.json();
                console.log("tsidData:", tsidData);

                const tsidData2 = await response2.json();
                console.log("tsidData2:", tsidData2);

                const tsidData3 = await response3.json();
                console.log("tsidData3:", tsidData3);

                let timeSeriesDataTurb = null;
                let tsidTurb = null;
                if (tsidData && tsidData['assigned-time-series'] && tsidData['assigned-time-series'][0]) {
                    tsidTurb = tsidData['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidTurb:", tsidTurb);

                    timeSeriesDataTurb = await fetchTimeSeriesData(tsidTurb);
                    console.log("timeSeriesDataTurb:", timeSeriesDataTurb);
                } else {
                    console.log("The required data does not exist.");
                }

                let timeSeriesDataSpillway = null;
                let tsidSpillway = null;
                if (tsidData2 && tsidData2['assigned-time-series'] && tsidData2['assigned-time-series'][0]) {
                    tsidSpillway = tsidData2['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidSpillway:", tsidSpillway);

                    timeSeriesDataSpillway = await fetchTimeSeriesData(tsidSpillway);
                    console.log("timeSeriesDataSpillway:", timeSeriesDataSpillway);
                } else {
                    console.log("The required data does not exist.");
                }

                let timeSeriesDataTotal = null;
                let tsidTotal = null;
                if (tsidData && tsidData3['assigned-time-series'] && tsidData3['assigned-time-series'][0]) {
                    tsidTotal = tsidData3['assigned-time-series'][0]['timeseries-id'];
                    console.log("tsidTotal:", tsidTotal);

                    timeSeriesDataTotal = await fetchTimeSeriesData(tsidTotal);
                    console.log("timeSeriesDataTotal:", timeSeriesDataTotal);
                } else {
                    console.log("The required data does not exist.");
                }

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
                    cdaSaveBtn = document.getElementById("cda-btn-generation"); // Get the button by its ID

                    cdaSaveBtn.disabled = true; // Disable button while checking login state

                    // Update button text based on login status
                    if (await isLoggedIn()) {
                        cdaSaveBtn.innerText = "Save";
                    } else {
                        cdaSaveBtn.innerText = "Login";
                    }

                    cdaSaveBtn.disabled = false; // Re-enable button
                }

                // Check if timeSeriesDataSpillway have values and if they are greater than 1 (this means you saved gate settings data)
                if (timeSeriesDataSpillway && timeSeriesDataSpillway.values && timeSeriesDataSpillway.values.length > 1) {
                    console.log("Calling createTable ...");

                    createTable(isoDateMinus3Days, isoDateMinus2Days, isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidTurb, timeSeriesDataTurb, tsidSpillway, timeSeriesDataSpillway, tsidTotal, timeSeriesDataTotal);

                    loginStateController()
                    // Setup timers
                    setInterval(async () => {
                        loginStateController()
                    }, 10000) // time is in millis
                } else {
                    console.log("Calling createDataEntryTable ...");
                    createDataEntryTable(isoDateMinus3Days, isoDateMinus2Days, isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidTurb, timeSeriesDataTurb, tsidSpillway, timeSeriesDataSpillway, tsidTotal, timeSeriesDataTotal);

                    loginStateController()
                    // Setup timers
                    setInterval(async () => {
                        loginStateController()
                    }, 10000) // time is in millis
                }
            } catch (error) {
                console.error("Error fetching tsidOutflow data:", error);
            }

            function createTable(isoDateMinus3Days, isoDateMinus2Days, isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidTurb, timeSeriesDataTurb, tsidSpillway, timeSeriesDataSpillway, tsidTotal, timeSeriesDataTotal) {
                const formattedDataTurb = timeSeriesDataTurb.values.map(entry => {
                    const timestamp = Number(entry[0]); // Ensure timestamp is a number

                    return {
                        ...entry, // Retain other data
                        formattedTimestampUTC: convertUnixTimestamp(timestamp, true),  // UTC time
                        formattedTimestampCST: convertUnixTimestamp(timestamp, false),    // CST/CDT adjusted time
                    };
                });
                console.log("formattedDataTurb:", formattedDataTurb);

                const formattedDataSpillway = timeSeriesDataSpillway.values.map(entry => {
                    const timestamp = entry[0]; // Timestamp is in milliseconds in the array

                    return {
                        ...entry, // Retain other data
                        formattedTimestampUTC: convertUnixTimestamp(timestamp, true),  // UTC time
                        formattedTimestampCST: convertUnixTimestamp(timestamp, false),    // CST/CDT adjusted time
                    };
                });

                // Now you have formatted data for both datasets
                console.log("formattedDataSpillway:", formattedDataSpillway);

                const formattedDataTotal = timeSeriesDataTotal.values.map(entry => {
                    const timestamp = entry[0]; // Timestamp is in milliseconds in the array

                    return {
                        ...entry, // Retain other data
                        formattedTimestampUTC: convertUnixTimestamp(timestamp, true),  // UTC time
                        formattedTimestampCST: convertUnixTimestamp(timestamp, false),    // CST/CDT adjusted time
                    };
                });

                // Now you have formatted data for both datasets
                console.log("formattedDataTotal:", formattedDataTotal);

                const table = document.createElement("table");
                table.id = "generation-release";

                const headerRow = document.createElement("tr");
                const dateHeader = document.createElement("th");
                dateHeader.textContent = "Date";
                headerRow.appendChild(dateHeader);

                const inflowHeader = document.createElement("th");
                inflowHeader.textContent = "Turbines (dsf)";
                headerRow.appendChild(inflowHeader);

                const outflowHeader = document.createElement("th");
                outflowHeader.textContent = "Spillway (dsf)";
                headerRow.appendChild(outflowHeader);

                const totalHeader = document.createElement("th");
                totalHeader.textContent = "Total Flow (dsf)";
                headerRow.appendChild(totalHeader);

                table.appendChild(headerRow);

                // Loop over the data (use formattedData for outflow and formattedDataTurb for inflow if lake matches)
                formattedDataSpillway.forEach((entry, index) => {
                    console.log("entry:", entry);
                    console.log("index:", index);

                    const row = document.createElement("tr");

                    // Create and populate the date cell
                    const dateCell = document.createElement("td");
                    dateCell.textContent = (entry.formattedTimestampCST || entry[0]).split('T')[0].replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$2-$3-$1');
                    row.appendChild(dateCell);

                    // Create and populate the inflow (Turb) cell
                    const turbCell = document.createElement("td");
                    const turbInput = document.createElement("input");
                    turbInput.type = "number";
                    turbInput.step = "10.0"; 
                    const value = (formattedDataTurb[index] && formattedDataTurb[index][1] !== undefined)
                        ? formattedDataTurb[index][1].toFixed(0)
                        : 909;
                    turbInput.value = value;
                    turbInput.className = "turb-input";
                    turbInput.id = `turbInput-${entry[0]}`;
                    turbInput.style.textAlign = "center";
                    turbInput.style.verticalAlign = "middle";
                    if (value === 909) {
                        turbInput.style.backgroundColor = "pink";
                    }
                    turbCell.appendChild(turbInput);
                    row.appendChild(turbCell);


                    // Spillway cell (non-editable)
                    const outflowCell = document.createElement("td");
                    const outflowSpan = document.createElement("span");
                    outflowSpan.textContent = entry[1].toFixed(0);
                    outflowSpan.className = "spillway-value";
                    outflowSpan.id = `spillwayInput-${entry[0]}`;
                    outflowCell.appendChild(outflowSpan);
                    row.appendChild(outflowCell);

                    // Total cell (non-editable)
                    const totalCell = document.createElement("td");
                    const totalSpan = document.createElement("span");
                    const valueTotal = (formattedDataTotal[index] && formattedDataTotal[index][1] !== undefined)
                        ? formattedDataTotal[index][1].toFixed(0)
                        : 0;
                    totalSpan.textContent = valueTotal;
                    totalSpan.className = "total-value";
                    totalSpan.id = `totalInput-${entry[0]}`;
                    totalCell.appendChild(totalSpan);
                    row.appendChild(totalCell);

                    table.appendChild(row);
                });

                const output6Div = document.getElementById("output12");
                output6Div.innerHTML = "";
                output6Div.appendChild(table);

                const cdaSaveBtn = document.createElement("button");
                cdaSaveBtn.textContent = "Submit";
                cdaSaveBtn.id = "cda-btn-generation";
                cdaSaveBtn.disabled = true;
                output6Div.appendChild(cdaSaveBtn);

                const statusDiv = document.createElement("div");
                statusDiv.className = "status";
                const cdaStatusBtn = document.createElement("button");
                cdaStatusBtn.textContent = "";
                cdaStatusBtn.id = "cda-btn-generation";
                cdaStatusBtn.disabled = false;
                statusDiv.appendChild(cdaStatusBtn);
                output6Div.appendChild(statusDiv);

                // Create the refresh button
                const buttonRefresh = document.createElement('button');
                buttonRefresh.textContent = 'Refresh';
                buttonRefresh.id = 'refreshBtnGen'; // Unique ID
                buttonRefresh.className = 'fetch-btn';
                output6Div.appendChild(buttonRefresh);

                // Add click event to refresh the table and remove buttons
                buttonRefresh.addEventListener('click', () => {
                    // Remove existing table
                    const existingTable = document.getElementById('generation-release');
                    if (existingTable) {
                        existingTable.remove();
                    }

                    const existingRefresh = document.getElementById('refreshBtnGen');
                    if (existingRefresh) {
                        existingRefresh.remove();
                    }

                    // Fetch and create new table
                    fetchTsidData();
                });

                cdaSaveBtn.addEventListener("click", async () => {
                    const payloadTurb = {
                        "name": tsidTurb,
                        "office-id": "MVS",
                        "units": "cfs",
                        "values": formattedDataSpillway.map(entry => {
                            const turbValue = document.getElementById(`turbInput-${entry[0]}`).value;
                            const parsedTurbValue = parseFloat(turbValue);
                            if (isNaN(parsedTurbValue)) {
                                console.error(`Invalid turbidity value for entry ${entry[0]}`);
                                return;
                            }

                            const timestampUnix = new Date(entry[0]).getTime();
                            return [
                                timestampUnix,
                                parsedTurbValue,
                                0
                            ];
                        }).filter(item => item !== undefined), // Filter out undefined entries
                    };
                    console.log("payloadTurb:", payloadTurb);

                    const payloadSpillway = {
                        "name": tsidSpillway,
                        "office-id": "MVS",
                        "units": "cfs",
                        "values": formattedDataSpillway.map(entry => {
                            // Get the element by ID
                            const spillwayElement = document.getElementById(`spillwayInput-${entry[0]}`);

                            // Check if the element exists and retrieve its value
                            if (!spillwayElement) {
                                console.error(`Element with id spillwayInput-${entry[0]} not found`);
                                return;  // Return undefined if the element doesn't exist
                            }

                            // Get the value and parse it
                            let spillwayValue = spillwayElement.textContent || spillwayElement.value;  // Handle either input or span
                            const parsedSpillwayValue = parseInt(spillwayValue);

                            // Check if the parsed value is valid
                            if (isNaN(parsedSpillwayValue)) {
                                console.error(`Invalid spillway value for entry ${entry[0]}`);
                                return;  // Return undefined if the value is invalid
                            }

                            // Get the timestamp and return the mapped entry
                            const timestampUnix = new Date(entry[0]).getTime();
                            return [
                                timestampUnix,
                                parsedSpillwayValue,
                                0
                            ];
                        }).filter(item => item !== undefined), // Filter out undefined values
                    };
                    console.log("payloadSpillway: ", payloadSpillway);

                    const payloadTotal = {
                        "name": tsidTotal,
                        "office-id": "MVS",
                        "units": "cfs",
                        "values": formattedDataSpillway.map(entry => {
                            // Get the elements by ID
                            const turbElement = document.getElementById(`turbInput-${entry[0]}`);
                            const spillwayElement = document.getElementById(`spillwayInput-${entry[0]}`);

                            // Check if elements exist
                            if (!turbElement || !spillwayElement) {
                                console.error(`Element(s) not found for entry ${entry[0]}`);
                                return;  // Return undefined if any element is missing
                            }

                            // Get values and parse them
                            const turbValue = turbElement.textContent || turbElement.value;
                            const spillwayValue = spillwayElement.textContent || spillwayElement.value;

                            const parsedTurbValue = parseInt(turbValue);
                            const parsedSpillwayValue = parseInt(spillwayValue);

                            // Validate parsed values
                            if (isNaN(parsedTurbValue) || isNaN(parsedSpillwayValue)) {
                                console.error(`Invalid values for entry ${entry[0]}`);
                                return;  // Return undefined if any parsed value is invalid
                            }

                            // Calculate the total value
                            const totalValue = parsedTurbValue + parsedSpillwayValue;

                            // Get the timestamp
                            const timestampUnix = new Date(entry[0]).getTime();

                            return [
                                timestampUnix,
                                totalValue,
                                0
                            ];
                        }).filter(item => item !== undefined), // Filter out undefined values
                    };
                    console.log("payloadTotal: ", payloadTotal);

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

                    async function fetchUpdatedData(name, isoDateMinus2Days, isoDateMinus1Day, isoDateToday) {
                        let response = null;
                        response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?name=${name}&begin=${isoDateMinus1Day}&end=${isoDateToday}&office=MVS`, {
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
                        showSpinner(); // Show the spinner before the login
                        const loginResult = await loginCDA();
                        hideSpinner(); // Hide the spinner after login is complete

                        cdaSaveBtn.innerText = loginResult ? "Submit" : "Login";
                        cdaStatusBtn.innerText = loginResult ? "" : "Failed to Login!";
                    } else {
                        try {
                            showSpinner(); // Show the spinner before creating the version
                            await createTS(payloadTurb);
                            cdaStatusBtn.innerText = "Write payloadTurb successful!";

                            await createTS(payloadSpillway);
                            cdaStatusBtn.innerText = "Write payloadSpillway successful!";

                            await createTS(payloadTotal);
                            cdaStatusBtn.innerText = "Write payloadTotal successful!";

                            // Fetch updated data and refresh the table
                            const updatedTurbData = await fetchUpdatedData(tsidTurb, isoDateMinus2Days, isoDateMinus1Day, isoDateToday);

                            const updatedSpillwayData = await fetchUpdatedData(tsidSpillway, isoDateMinus2Days, isoDateMinus1Day, isoDateToday);

                            const updatedTotalData = await fetchUpdatedData(tsidTotal, isoDateMinus2Days, isoDateMinus1Day, isoDateToday);

                            createTable(isoDateMinus3Days, isoDateMinus2Days, isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidTurb, updatedTurbData, tsidSpillway, updatedSpillwayData, tsidTotal, updatedTotalData);
                        } catch (error) {
                            hideSpinner(); // Hide the spinner if an error occurs
                            cdaStatusBtn.innerText = "Failed to write data!";
                            console.error(error);
                        }

                        hideSpinner(); // Hide the spinner after the operation completes
                    }
                });

            }

            function createDataEntryTable(isoDateMinus3Days, isoDateMinus2Days, isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidTurb, timeSeriesDataTurb, tsidSpillway, timeSeriesDataSpillway, tsidTotal, timeSeriesDataTotal) {
                const table = document.createElement("table");
                table.id = "generation-release";

                const headerRow = document.createElement("tr");
                const dateHeader = document.createElement("th");
                dateHeader.textContent = "Date";
                headerRow.appendChild(dateHeader);

                const inflowHeader = document.createElement("th");
                inflowHeader.textContent = "Turbines (dsf)";
                headerRow.appendChild(inflowHeader);

                const outflowHeader = document.createElement("th");
                outflowHeader.textContent = "Spillway (dsf)";
                headerRow.appendChild(outflowHeader);

                const totalHeader = document.createElement("th");
                totalHeader.textContent = "Total Flow (dsf)";
                headerRow.appendChild(totalHeader);

                table.appendChild(headerRow);

                // Append the table to the specific container (id="output12")
                const output6Div = document.getElementById("output12");
                output6Div.innerHTML = ""; // Clear any existing content
                output6Div.appendChild(table);

                const cdaSaveBtn = document.createElement("button");
                cdaSaveBtn.textContent = "Submit";
                cdaSaveBtn.id = "cda-btn-generation";
                cdaSaveBtn.disabled = true;
                output6Div.appendChild(cdaSaveBtn);

                const statusDiv = document.createElement("div");
                statusDiv.className = "status";
                const cdaStatusBtn = document.createElement("button");
                cdaStatusBtn.textContent = "Save 'Gate Settings', then Click Refresh!";
                cdaStatusBtn.style.color = "red";
                cdaStatusBtn.style.fontWeight = "bold";
                cdaStatusBtn.id = "cda-btn-generation";
                cdaStatusBtn.disabled = false;
                statusDiv.appendChild(cdaStatusBtn);
                output6Div.appendChild(statusDiv);

                // Create the refresh button
                const buttonRefresh = document.createElement('button');
                buttonRefresh.textContent = 'Refresh';
                buttonRefresh.id = 'refreshBtnGen'; // Unique ID
                buttonRefresh.className = 'fetch-btn';
                output6Div.appendChild(buttonRefresh);

                // Add click event to refresh the table and remove buttons
                buttonRefresh.addEventListener('click', () => {
                    // Remove existing table
                    const existingTable = document.getElementById('generation-release');
                    if (existingTable) {
                        existingTable.remove();
                    }

                    const existingRefresh = document.getElementById('refreshBtnGen');
                    if (existingRefresh) {
                        existingRefresh.remove();
                    }

                    // Fetch and create new table
                    fetchTsidData();
                });
            }
        };

        const fetchTimeSeriesData = async (tsid) => {
            let tsidData = null;
            tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateMinus1Day}&end=${isoDateToday}&office=${office}`;
            console.log('tsidData:', tsidData);

            try {
                const response = await fetch(tsidData, {
                    headers: {
                        "Accept": "application/json;version=2",
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

// Turbines tsid (Turbines-Lake-Test)
// declare
//    l_svt  cwms_t_tsv_array := cwms_t_tsv_array();
//    l_tsv  cwms_t_tsv;
// begin
//     CWMS_20.CWMS_ENV.SET_SESSION_OFFICE_ID('MVS');
//        l_svt := cwms_t_tsv_array();
//        l_tsv := cwms_t_tsv( to_date('04-22-2025 00:00:00','MM-DD-YYYY hh24:mi:ss') , 0, 0 );
//        l_svt.extend();
//        l_svt(1) := l_tsv;
//           CWMS_20.CWMS_TS.store_ts(
//               p_office_id => 'MVS',
//               p_cwms_ts_id => 'Mark Twain Lk-Salt.Flow-Turb.Ave.~1Day.1Day.lakerep-rev-test',
//               p_units => 'cfs',
//               p_timeseries_data => l_svt,
//               p_store_rule => CWMS_20.Cwms_Util.Replace_All,
//               p_override_prot => CWMS_20.Cwms_Util.False_Num,
//               p_versiondate => CWMS_20.Cwms_Util.Non_Versioned
//               );
//         commit;
// end;

// Spillway tsid (gates) (Spillway-Lake-Test)
// Mark Twain Lk-Salt.Flow-Spill.Ave.~1Day.1Day.lakerep-rev-test

// Total Flow tsid (gates + turbines) (Generation-Release-Lake-Test)
// declare
//    l_svt  cwms_t_tsv_array := cwms_t_tsv_array();
//    l_tsv  cwms_t_tsv;
// begin
//     CWMS_20.CWMS_ENV.SET_SESSION_OFFICE_ID('MVS');
//        l_svt := cwms_t_tsv_array();
//        l_tsv := cwms_t_tsv( to_date('04-22-2025 00:00:00','MM-DD-YYYY hh24:mi:ss') , 0, 0 );
//        l_svt.extend();
//        l_svt(1) := l_tsv;
//           CWMS_20.CWMS_TS.store_ts(
//               p_office_id => 'MVS',
//               p_cwms_ts_id => 'Mark Twain Lk-Salt.Flow.Ave.~1Day.1Day.lakerep-rev-test',
//               p_units => 'cfs',
//               p_timeseries_data => l_svt,
//               p_store_rule => CWMS_20.Cwms_Util.Replace_All,
//               p_override_prot => CWMS_20.Cwms_Util.False_Num,
//               p_versiondate => CWMS_20.Cwms_Util.Non_Versioned
//               );
//         commit;
// end;
