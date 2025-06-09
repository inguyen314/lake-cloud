document.addEventListener('DOMContentLoaded', async function () {
    console.log("lake: ", lake);
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

    const tsid = `${setBaseUrl}timeseries/group/Project-Logs?office=${office}&category-id=${lake}`;
    console.log("tsid:", tsid);

    const fetchTsidData = async () => {
        try {
            const response1 = await fetch(tsid);

            const tsidDataProjectLogs = await response1.json();

            // Extract the timeseries-id from the response
            const tsidProjectLogs = tsidDataProjectLogs['assigned-time-series'][0]['timeseries-id']; // Grab the first timeseries-id
            console.log("tsidProjectLogs:", tsidProjectLogs);

            // Fetch time series data using tsid values
            const timeSeriesDataProjectLogs = await fetchTimeSeriesData(tsidProjectLogs);
            console.log("timeSeriesDataProjectLogs:", timeSeriesDataProjectLogs);

            const timeSeriesDataProjectLogsYesterday = await fetchTimeSeriesDataYesterday(tsidProjectLogs);
            console.log("timeSeriesDataProjectLogsYesterday:", timeSeriesDataProjectLogsYesterday);

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
                cdaSaveBtn = document.getElementById("cda-btn-project-logs"); // Get the button by its ID

                cdaSaveBtn.disabled = true; // Disable button while checking login state

                // Update button text based on login status
                if (await isLoggedIn()) {
                    cdaSaveBtn.innerText = "Save";
                } else {
                    cdaSaveBtn.innerText = "Login";
                }

                cdaSaveBtn.disabled = false; // Re-enable button
            }

            console.log("Calling createTable ...");
            createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidProjectLogs, timeSeriesDataProjectLogs, timeSeriesDataProjectLogsYesterday);

            loginStateController()
            // Setup timers
            setInterval(async () => {
                loginStateController()
            }, 10000) // time is in millis


            function createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidProjectLogs, timeSeriesDataProjectLogs, timeSeriesDataProjectLogsYesterday) {
                // Convert timestamps in "regular-text-values" array
                timeSeriesDataProjectLogs["regular-text-values"].forEach(item => {
                    // Check if "date-time" exists and is a valid Unix timestamp (number)
                    if (item["date-time"] && typeof item["date-time"] === "number") {
                        item["date-time-iso"] = convertUnixTimestampToISO(item["date-time"]);
                    } else {
                        console.error("Invalid timestamp for date-time:", item["date-time"]);
                    }

                    if (item["date-time"] && typeof item["date-time"] === "number") {
                        item["date-time-iso-cst"] = convertUnixTimestampToISO_CST(item["date-time"], dstOffsetHours);
                    } else {
                        console.error("Invalid timestamp for date-time:", item["date-time"]);
                    }

                    // Check if "data-entry-date" exists and is a valid Unix timestamp (number)
                    if (item["data-entry-date"] && typeof item["data-entry-date"] === "number") {
                        // Add the ISO format for "data-entry-date" without overwriting the existing "data-entry-date-iso" field
                        if (!item["data-entry-date-iso"]) {
                            item["data-entry-date-iso"] = convertUnixTimestampToISO(item["data-entry-date"]);
                        }
                    } else if (item["data-entry-date"] && typeof item["data-entry-date"] === "string" && !isNaN(Date.parse(item["data-entry-date"]))) {
                        // If "data-entry-date" is already an ISO string, just add a new field with the same value
                        item["data-entry-date-iso"] = item["data-entry-date"];
                    } else {
                        console.error("Invalid date format for data-entry-date:", item["data-entry-date"]);
                    }
                });

                console.log("timeSeriesDataProjectLogs:", timeSeriesDataProjectLogs);

                timeSeriesDataProjectLogsYesterday["regular-text-values"].forEach(item => {
                    // Check if "date-time" exists and is a valid Unix timestamp (number)
                    if (item["date-time"] && typeof item["date-time"] === "number") {
                        item["date-time-iso"] = convertUnixTimestampToISO(item["date-time"]);
                    } else {
                        console.error("Invalid timestamp for date-time:", item["date-time"]);
                    }

                    if (item["date-time"] && typeof item["date-time"] === "number") {
                        item["date-time-iso-cst"] = convertUnixTimestampToISO_CST(item["date-time"], dstOffsetHours);
                    } else {
                        console.error("Invalid timestamp for date-time:", item["date-time"]);
                    }

                    // Check if "data-entry-date" exists and is a valid Unix timestamp (number)
                    if (item["data-entry-date"] && typeof item["data-entry-date"] === "number") {
                        // Add the ISO format for "data-entry-date" without overwriting the existing "data-entry-date-iso" field
                        if (!item["data-entry-date-iso"]) {
                            item["data-entry-date-iso"] = convertUnixTimestampToISO(item["data-entry-date"]);
                        }
                    } else if (item["data-entry-date"] && typeof item["data-entry-date"] === "string" && !isNaN(Date.parse(item["data-entry-date"]))) {
                        // If "data-entry-date" is already an ISO string, just add a new field with the same value
                        item["data-entry-date-iso"] = item["data-entry-date"];
                    } else {
                        console.error("Invalid date format for data-entry-date:", item["data-entry-date"]);
                    }
                });

                console.log("timeSeriesDataProjectLogsYesterday:", timeSeriesDataProjectLogsYesterday);

                const formattedData = timeSeriesDataProjectLogs;
                console.log("formattedData:", formattedData);

                const formattedDataYesterday = timeSeriesDataProjectLogsYesterday;
                console.log("formattedDataYesterday:", formattedDataYesterday);

                const table = document.createElement("table");
                table.id = "project-logs";

                const headerRow = document.createElement("tr");
                const dateHeader = document.createElement("th");
                dateHeader.textContent = "Date";
                headerRow.appendChild(dateHeader);

                const textValueHeader = document.createElement("th");
                textValueHeader.textContent = "Project Log";
                headerRow.appendChild(textValueHeader);

                table.appendChild(headerRow);

                // Check if "regular-text-values" exists and is an array
                if (Array.isArray(formattedData["regular-text-values"]) && formattedData["regular-text-values"].length > 0) {
                    console.log("Existing data found.");

                    // Render rows from "regular-text-values"
                    formattedData["regular-text-values"].forEach((entry) => {
                        const row = document.createElement("tr");

                        // Format date
                        const dateCell = document.createElement("td");
                        const date = new Date(entry["date-time-iso-cst"]);
                        dateCell.textContent = date.toISOString().slice(5, 7) + '-' + date.toISOString().slice(8, 10) + '-' + date.toISOString().slice(0, 4);
                        row.appendChild(dateCell);

                        // Create dynamic textarea
                        const textValueCell = document.createElement("td");
                        const textarea = document.createElement("textarea");
                        textarea.value = entry["text-value"];
                        textarea.className = "text-value-input-project-logs";
                        textarea.id = `textValueInputProjectLogs-${entry["date-time-iso"]}`;

                        // Required styles for dynamic height
                        textarea.style.width = "100%";
                        textarea.style.minHeight = "40px";
                        textarea.style.boxSizing = "border-box";
                        textarea.style.overflow = "hidden";
                        textarea.style.resize = "none";
                        textarea.style.fontSize = "14px";
                        textarea.style.lineHeight = "1.4";
                        textarea.style.padding = "6px";
                        textarea.style.textAlign = "center";
                        textarea.style.border = "1px solid #ccc";
                        textarea.style.borderRadius = "4px";

                        // Adjust height automatically
                        const autoResize = () => {
                            textarea.style.height = "auto";
                            textarea.style.height = textarea.scrollHeight + "px";
                        };

                        textarea.addEventListener("input", autoResize);
                        textarea.addEventListener("focus", autoResize);
                        setTimeout(autoResize, 0); // Initial adjustment after DOM insert

                        textValueCell.appendChild(textarea);
                        row.appendChild(textValueCell);
                        table.appendChild(row);
                    });
                } else {
                    console.log("No existing data.");

                    const row = document.createElement("tr");

                    // Use "isoDateToday" as a fallback for the date
                    const dateCell = document.createElement("td");
                    const date = new Date(isoDateToday);
                    dateCell.textContent = date.toISOString().slice(5, 7) + '-' + date.toISOString().slice(8, 10) + '-' + date.toISOString().slice(0, 4);
                    row.appendChild(dateCell);

                    // Create dynamic textarea
                    const textValueCell = document.createElement("td");
                    const textarea = document.createElement("textarea");
                    textarea.value = timeSeriesDataProjectLogsYesterday["regular-text-values"]?.[0]?.["text-value"] || "--";
                    textarea.className = "text-value-input-project-logs";
                    textarea.id = `textValueInputProjectLogs-${isoDateToday}`;

                    // Required styles for dynamic height
                    textarea.style.width = "100%";
                    textarea.style.minHeight = "40px";
                    textarea.style.boxSizing = "border-box";
                    textarea.style.overflow = "hidden";
                    textarea.style.resize = "none";
                    textarea.style.fontSize = "14px";
                    textarea.style.lineHeight = "1.4";
                    textarea.style.padding = "6px";
                    textarea.style.textAlign = "center";
                    textarea.style.border = "1px solid #ccc";
                    textarea.style.borderRadius = "4px";
                    textarea.style.backgroundColor = "pink";

                    // Auto-resize logic
                    const autoResize = () => {
                        textarea.style.height = "auto";
                        textarea.style.height = textarea.scrollHeight + "px";
                    };

                    textarea.addEventListener("input", autoResize);
                    textarea.addEventListener("focus", autoResize);
                    setTimeout(autoResize, 0); // Initial adjustment after DOM insert

                    textValueCell.appendChild(textarea);
                    row.appendChild(textValueCell);

                    table.appendChild(row);
                }

                const output14Div = document.getElementById("output14");
                output14Div.innerHTML = "";
                output14Div.appendChild(table);

                // Save Button
                const cdaSaveBtn = document.createElement("button");
                cdaSaveBtn.textContent = "Submit";
                cdaSaveBtn.id = "cda-btn-project-logs";
                cdaSaveBtn.disabled = false;
                output14Div.appendChild(cdaSaveBtn);

                // Status Div
                const statusDiv = document.createElement("div");
                statusDiv.className = "status-project-logs";
                output14Div.appendChild(statusDiv);

                // Refresh Button
                const buttonRefresh = document.createElement('button');
                buttonRefresh.textContent = 'Refresh';
                buttonRefresh.id = 'refresh-project-logs-button';
                buttonRefresh.className = 'fetch-btn';
                output14Div.appendChild(buttonRefresh);

                buttonRefresh.addEventListener('click', () => {
                    // Remove existing data table
                    const existingTable = document.getElementById('project-logs');
                    if (existingTable) {
                        existingTable.remove();
                    }

                    // Remove existing save button
                    const existingRefresh = document.getElementById('cda-btn-project-logs');
                    if (existingRefresh) {
                        existingRefresh.remove();
                    }

                    // Fetch and create new table
                    fetchTsidData();
                });

                cdaSaveBtn.addEventListener("click", async () => {
                    let textValues = [];

                    // If data exists in "regular-text-values", grab values from the inputs
                    if (Array.isArray(formattedData["regular-text-values"]) && formattedData["regular-text-values"].length > 0) {
                        // Loop through each entry and get the input values
                        formattedData["regular-text-values"].forEach((entry) => {
                            const textValueInputProjectLogs = document.getElementById(`textValueInputProjectLogs-${entry["date-time-iso"]}`);
                            if (textValueInputProjectLogs) {
                                textValues.push({
                                    "date-time-iso": entry["date-time-iso"],
                                    "text-value": textValueInputProjectLogs.value
                                });
                            }
                        });
                    } else {
                        // If no data exists, get the value from the input for today's date
                        const textValueInputProjectLogs = document.getElementById(`textValueInputProjectLogs-${isoDateToday}`);
                        if (textValueInputProjectLogs) {
                            textValues.push({
                                "date-time-iso": isoDateToday,
                                "text-value": textValueInputProjectLogs.value
                            });
                        }
                    }
                    console.log("Updated Text Values:", textValues);
                    console.log("Value: ", textValues[0]['text-value']);

                    const payload = {
                        "office-id": "MVS",
                        "name": tsidProjectLogs,
                        "interval-offset": 0,
                        "time-zone": "GMT",
                        "date-version-type": "MAX_AGGREGATE",
                        "version-date": isoDateToday,
                        "regular-text-values": [
                            {
                                "date-time": isoDateToday,
                                "data-entry-date": isoDateToday,
                                "text-value": textValues[0]['text-value'],
                                "filename": "test.txt",
                                "media-type": "text/plain",
                                "quality-code": 0,
                                "dest-flag": 0,
                                "value-url": "https://cwms-data.usace.army.mil/cwms-data/timeseries/text/ignored?text-id=someId&office-id=MVS&value=true"
                            }
                        ]
                    }
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

                    async function writeTSText(payload) {
                        // Ensure payload is provided
                        if (!payload) throw new Error("You must specify a payload!");

                        try {
                            // Send a POST request to write time series data
                            const response = await fetch("https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries/text?replace-all=true", {
                                method: "POST",
                                headers: {
                                    // "accept": "*/*",
                                    "Content-Type": "application/json;version=2",
                                },
                                // Convert payload to JSON and include in request body
                                body: JSON.stringify(payload)
                            });

                            // Handle non-OK responses
                            if (!response.ok) {
                                const errorText = await response.text();
                                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                            }

                            // Return true to indicate success
                            return true;

                        } catch (error) {
                            // Log any errors that occur during the write operation
                            console.error('Error writing timeseries:', error);
                            throw error;
                        }

                    }

                    async function fetchUpdatedData(tsidProjectLogs, isoDateDay5, isoDateToday, isoDateMinus1Day) {
                        let response = null;

                        response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries/text?office=MVS&name=${tsidProjectLogs}&begin=${isoDateToday}&end=${isoDateToday}`, {
                            method: "GET",
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

                    async function fetchUpdatedDataYesterday(tsidProjectLogs, isoDateDay5, isoDateToday, isoDateMinus1Day) {
                        let response = null;

                        response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries/text?office=MVS&name=${tsidProjectLogs}&begin=${isoDateMinus1Day}&end=${isoDateMinus1Day}`, {
                            method: "GET",
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
                        statusDiv.innerText = loginResult ? "" : "Failed to Login!";
                    } else {
                        try {
                            showSpinner(); // Show the spinner before creating the version
                            await writeTSText(payload);
                            statusDiv.innerText = "Write successful!";

                            // Optional: small delay to allow backend to process the new data
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            // Fetch updated data and refresh the table
                            const updatedData = await fetchUpdatedData(tsidProjectLogs, isoDateDay5, isoDateToday, isoDateMinus1Day);
                            const updatedDataYesterday = await fetchUpdatedDataYesterday(tsidProjectLogs, isoDateDay5, isoDateToday, isoDateMinus1Day);
                            createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidProjectLogs, updatedData, updatedDataYesterday);
                        } catch (error) {
                            hideSpinner(); // Hide the spinner if an error occurs
                            statusDiv.innerText = "Failed to write data!";
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

    const fetchTimeSeriesData = async (tsid) => {
        const tsidData = `${setBaseUrl}timeseries/text?name=${tsid}&begin=${isoDateToday}&end=${isoDateToday}&office=${office}`;
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

    const fetchTimeSeriesDataYesterday = async (tsid) => {
        const tsidData = `${setBaseUrl}timeseries/text?name=${tsid}&begin=${isoDateMinus1Day}&end=${isoDateMinus1Day}&office=${office}`;
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

    function getIsoDateWithOffsetDynamic(year, month, day, offset) {
        // Create a date object in UTC (midnight UTC)
        const date = new Date(Date.UTC(year, month - 1, day, 6, 0, 0, 0)); // Set the initial time at 6 AM UTC

        // Convert the date to CST (UTC -6)
        const cstOffset = 0 * 60; // CST is UTC -6 hours, in minutes
        date.setMinutes(date.getMinutes() + cstOffset); // Adjust to CST

        // Add the offset in days (if positive, it moves forward, if negative, backward)
        date.setUTCDate(date.getUTCDate() + offset);

        // Return the ISO string
        return date.toISOString();
    }

    function convertUnixTimestampToISO(timestamp) {
        if (typeof timestamp !== "number") {
            console.error("Invalid timestamp:", timestamp);
            return "Invalid Date";
        }

        const date = new Date(timestamp); // Convert milliseconds to Date object

        if (isNaN(date.getTime())) {
            console.error("Invalid date conversion:", timestamp);
            return "Invalid Date";
        }

        return date.toISOString(); // Convert to "YYYY-MM-DDTHH:mm:ssZ" format
    }

    function convertUnixTimestampToISO_CST(timestamp, dstOffsetHours) {
        if (typeof timestamp !== "number") {
            console.error("Invalid timestamp:", timestamp);
            return "Invalid Date";
        }

        const date = new Date(timestamp); // Convert milliseconds to Date object

        if (isNaN(date.getTime())) {
            console.error("Invalid date conversion:", timestamp);
            return "Invalid Date";
        }

        // Convert UTC time to CST (UTC-6) by subtracting 6 hours
        date.setUTCHours(date.getUTCHours() - dstOffsetHours);

        return date.toISOString(); // Return in "YYYY-MM-DDTHH:mm:ss.000Z" format
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
});