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
    const isoDateMinus8Days = getIsoDateWithOffset(year, month, day, -8);
    const isoDateMinus7Days = getIsoDateWithOffset(year, month, day, -7);
    const isoDateMinus6Days = getIsoDateWithOffset(year, month, day, -6);
    const isoDateMinus5Days = getIsoDateWithOffset(year, month, day, -5);
    const isoDateMinus4Days = getIsoDateWithOffset(year, month, day, -4);
    const isoDateMinus3Days = getIsoDateWithOffset(year, month, day, -3);
    const isoDateMinus2Days = getIsoDateWithOffset(year, month, day, -2);
    const isoDateMinus1Day = getIsoDateWithOffset(year, month, day, -1);
    const isoDateToday = getIsoDateWithOffset(year, month, day, 0);

    // Generate ISO strings for the next 7 days
    const isoDateDay1 = getIsoDateWithOffset(year, month, day, 1);
    const isoDateDay2 = getIsoDateWithOffset(year, month, day, 2);
    const isoDateDay3 = getIsoDateWithOffset(year, month, day, 3);
    const isoDateDay4 = getIsoDateWithOffset(year, month, day, 4);
    const isoDateDay5 = getIsoDateWithOffset(year, month, day, 5);
    const isoDateDay6 = getIsoDateWithOffset(year, month, day, 6);
    const isoDateDay7 = getIsoDateWithOffset(year, month, day, 7);

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

    const tsid = `${setBaseUrl}timeseries/group/Note-Lake?office=${office}&category-id=${lake}`;
    console.log("tsid:", tsid);

    const fetchTsidData = async () => {
        try {
            const response1 = await fetch(tsid);

            const tsidDataNote = await response1.json();

            // Extract the timeseries-id from the response
            const tsidNote = tsidDataNote['assigned-time-series'][0]['timeseries-id']; // Grab the first timeseries-id
            console.log("tsidNote:", tsidNote);

            // Fetch time series data using tsid values
            const timeSeriesDataNote = await fetchTimeSeriesData(tsidNote);
            console.log("timeSeriesDataNote:", timeSeriesDataNote);

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
                cdaSaveBtn = document.getElementById("cda-btn-note"); // Get the button by its ID

                cdaSaveBtn.disabled = true; // Disable button while checking login state

                // Update button text based on login status
                if (await isLoggedIn()) {
                    cdaSaveBtn.innerText = "Save";
                } else {
                    cdaSaveBtn.innerText = "Login";
                }

                cdaSaveBtn.disabled = false; // Re-enable button
            }

            if (timeSeriesDataNote && timeSeriesDataNote['regular-text-values'] && timeSeriesDataNote['regular-text-values'].length > 0) {
                console.log("Calling createTable ...");
                createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidNote, timeSeriesDataNote);

                loginStateController()
                // Setup timers
                setInterval(async () => {
                    loginStateController()
                }, 10000) // time is in millis
            } else {
                console.log("Calling createTable ...");
                createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidNote, timeSeriesDataNote);

                loginStateController()
                // Setup timers
                setInterval(async () => {
                    loginStateController()
                }, 10000) // time is in millis
            }

            function createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidNote, timeSeriesDataNote) {
                console.log("timeSeriesDataNote:", timeSeriesDataNote);

                // Convert timestamps in "regular-text-values" array
                timeSeriesDataNote["regular-text-values"].forEach(item => {
                    // Check if "date-time" exists and is a valid Unix timestamp (number)
                    if (item["date-time"] && typeof item["date-time"] === "number") {
                        item["date-time-iso"] = convertUnixTimestampToISO(item["date-time"]);
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

                console.log("Formatted timeSeriesDataNote:", timeSeriesDataNote);

                const formattedData = timeSeriesDataNote;
                console.log("formattedData:", formattedData);

                const table = document.createElement("table");
                table.id = "gate-settings";

                const headerRow = document.createElement("tr");
                const dateHeader = document.createElement("th");
                dateHeader.textContent = "Date";
                headerRow.appendChild(dateHeader);

                const textValueHeader = document.createElement("th");
                textValueHeader.textContent = "Text Value";
                headerRow.appendChild(textValueHeader);

                table.appendChild(headerRow);

                // Check if "regular-text-values" exists and is an array
                if (Array.isArray(formattedData["regular-text-values"]) && formattedData["regular-text-values"].length > 0) {
                    // Render rows from "regular-text-values"
                    formattedData["regular-text-values"].forEach((entry) => {
                        const row = document.createElement("tr");

                        // Use "date-time-iso" for the date
                        const dateCell = document.createElement("td");
                        dateCell.textContent = entry["date-time-iso"] || "No Date"; // Fallback if "date-time-iso" is not available
                        row.appendChild(dateCell);

                        // Make the "text-value" editable
                        const textValueCell = document.createElement("td");
                        const textValueInput = document.createElement("input");
                        textValueInput.type = "text";
                        textValueInput.value = entry["text-value"] || "No Text"; // Fallback if "text-value" is not available
                        textValueInput.className = "text-value-input"; // Add a class for styling (optional)
                        textValueInput.id = `textValueInput-${entry["date-time-iso"]}`; // Add ID for easier access
                        textValueCell.appendChild(textValueInput);
                        row.appendChild(textValueCell);

                        table.appendChild(row);
                    });
                } else {
                    // If no data or "regular-text-values" is not an array, display a message
                    const row = document.createElement("tr");

                    // Use "isoDateToday" as a fallback for the date
                    const dateCell = document.createElement("td");
                    dateCell.textContent = isoDateToday; // Fallback if "date-time-iso" is not available
                    row.appendChild(dateCell);

                    // Make the "text-value" editable
                    const textValueCell = document.createElement("td");
                    const textValueInput = document.createElement("input");
                    textValueInput.type = "text";
                    textValueInput.value = "--"; // Fallback if "text-value" is not available
                    textValueInput.className = "text-value-input"; // Add a class for styling (optional)
                    textValueInput.id = `textValueInput-${isoDateToday}`; // Use today's date as ID
                    textValueCell.appendChild(textValueInput);
                    row.appendChild(textValueCell);

                    table.appendChild(row);
                }

                const output11Div = document.getElementById("output11");
                output11Div.innerHTML = "";
                output11Div.appendChild(table);

                const cdaSaveBtn = document.createElement("button");
                cdaSaveBtn.textContent = "Submit";
                cdaSaveBtn.id = "cda-btn-note";
                cdaSaveBtn.disabled = false;
                output11Div.appendChild(cdaSaveBtn);

                const statusDiv = document.createElement("div");
                statusDiv.className = "status";
                const cdaStatusBtn = document.createElement("button");
                cdaStatusBtn.textContent = "";
                cdaStatusBtn.id = "cda-btn-note";
                cdaStatusBtn.disabled = false;
                statusDiv.appendChild(cdaStatusBtn);
                output11Div.appendChild(statusDiv);

                cdaSaveBtn.addEventListener("click", async () => {
                    let textValues = [];

                    // If data exists in "regular-text-values", grab values from the inputs
                    if (Array.isArray(formattedData["regular-text-values"]) && formattedData["regular-text-values"].length > 0) {
                        // Loop through each entry and get the input values
                        formattedData["regular-text-values"].forEach((entry) => {
                            const textValueInput = document.getElementById(`textValueInput-${entry["date-time-iso"]}`);
                            if (textValueInput) {
                                textValues.push({
                                    "date-time-iso": entry["date-time-iso"],
                                    "text-value": textValueInput.value
                                });
                            }
                        });
                    } else {
                        // If no data exists, get the value from the input for today's date
                        const textValueInput = document.getElementById(`textValueInput-${isoDateToday}`);
                        if (textValueInput) {
                            textValues.push({
                                "date-time-iso": isoDateToday,
                                "text-value": textValueInput.value
                            });
                        }
                    }

                    console.log("Updated Text Values:", textValues);
                    console.log("Value: ", textValues[0]['text-value']);


                    const payload = {
                        "office-id": "MVS",
                        "name": tsidNote,
                        "interval-offset": 0,
                        "time-zone": "GMT",
                        "date-version-type": "MAX_AGGREGATE",
                        "version-date": isoDateToday,
                        "regular-text-values": [
                            {
                                "date-time": isoDateToday,
                                "data-entry-date": isoDateToday,
                                "text-value": textValues[0]['date-time-iso'],
                                "filename": "test.txt",
                                "media-type": "text/plain",
                                "quality-code": 0,
                                "dest-flag": 0,
                                "value-url": "https://cwms-data.usace.army.mil/cwms-data/timeseries/text/ignored?text-id=someId&office-id=MVS&value=true"
                            }
                        ]
                    }

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

                    async function fetchUpdatedData(tsidNote, isoDateDay5, isoDateToday, isoDateMinus1Day) {
                        let response = null;

                        response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries/text?office=MVS&name=${tsidNote}&begin=${isoDateToday}&end=${isoDateToday}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json;version=2",
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
                            await writeTSText(payload);
                            cdaStatusBtn.innerText = "Write successful!";

                            // Fetch updated data and refresh the table
                            const updatedData = await fetchUpdatedData(tsidNote, isoDateDay5, isoDateToday, isoDateMinus1Day);
                            createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidNote, updatedData);
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
        const date = new Date(isoDateMinus1Day);

        // Add 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
        date.setTime(date.getTime() + (1 * 60 * 60 * 1000));

        // Convert back to ISO string (preserve UTC format)
        const isoDateMinus1DayPlus1Hour = date.toISOString();

        console.log("isoDateMinus1DayPlus1Hour: ", isoDateMinus1DayPlus1Hour);

        const tsidData = `${setBaseUrl}timeseries/text?name=${tsid}&begin=${isoDateMinus1Day}&end=${isoDateToday}&office=${office}`;
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

    function getIsoDateWithOffset(year, month, day, offset) {
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
});


// Lk Shelbyville-Kaskaskia.Precip.Total.~1Day.1Day.lakerep-rev-test
// Carlyle Lk-Kaskaskia.Precip.Total.~1Day.1Day.lakerep-rev-test
// Mark Twain Lk-Salt.Precip.Total.~1Day.1Day.lakerep-rev-test
// Wappapello Lk-St Francis.Precip.Total.~1Day.1Day.lakerep-rev-test
// Rend Lk-Big Muddy.Precip.Total.~1Day.1Day.lakerep-rev-test