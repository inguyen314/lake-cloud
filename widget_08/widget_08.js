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

    const tsid = `${setBaseUrl}timeseries/group/Precip-Lake-Test?office=${office}&category-id=${lake}`;
    console.log("tsid:", tsid);

    const fetchTsidData = async () => {
        try {
            const response1 = await fetch(tsid);

            const tsidDataPrecip = await response1.json();

            // Extract the timeseries-id from the response
            const tsidPrecip = tsidDataPrecip['assigned-time-series'][0]['timeseries-id']; // Grab the first timeseries-id
            console.log("tsidPrecip:", tsidPrecip);

            // Fetch time series data using tsid values
            const timeSeriesDataPrecip = await fetchTimeSeriesData(tsidPrecip);
            const timeSeriesDataPrecipYesterday = await fetchTimeSeriesDataYesterday(tsidPrecip);

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
                cdaSaveBtn = document.getElementById("cda-btn-precip"); // Get the button by its ID

                cdaSaveBtn.disabled = true; // Disable button while checking login state

                // Update button text based on login status
                if (await isLoggedIn()) {
                    cdaSaveBtn.innerText = "Save";
                } else {
                    cdaSaveBtn.innerText = "Login";
                }

                cdaSaveBtn.disabled = false; // Re-enable button
            }

            if (timeSeriesDataPrecip && timeSeriesDataPrecip.values && timeSeriesDataPrecip.values.length > 0) {
                console.log("Calling createTable ...");
                createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidPrecip, timeSeriesDataPrecip, timeSeriesDataPrecipYesterday);

                loginStateController()
                // Setup timers
                setInterval(async () => {
                    loginStateController()
                }, 10000) // time is in millis
            } else {
                console.log("Calling createTable ...");
                createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidPrecip, timeSeriesDataPrecip, timeSeriesDataPrecipYesterday);

                loginStateController()
                // Setup timers
                setInterval(async () => {
                    loginStateController()
                }, 10000) // time is in millis
            }

            function createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidPrecip, timeSeriesDataPrecip, timeSeriesDataPrecipYesterday) {
                console.log("timeSeriesDataPrecip:", timeSeriesDataPrecip);
                console.log("timeSeriesDataPrecipYesterday:", timeSeriesDataPrecipYesterday);

                const formattedData = timeSeriesDataPrecip.values.map(entry => {
                    const timestamp = Number(entry[0]); // Ensure timestamp is a number

                    return {
                        ...entry, // Retain other data
                        formattedTimestampUTC: convertUnixTimestamp(timestamp, false),  // UTC time
                        formattedTimestampCST: convertUnixTimestamp(timestamp, true),    // CST/CDT adjusted time
                    };
                });
                console.log("Formatted timeSeriesDataPrecip:", formattedData);

                let formattedDataYesterday = null;
                if (timeSeriesDataPrecipYesterday && timeSeriesDataPrecipYesterday.values) {
                    formattedDataYesterday = timeSeriesDataPrecipYesterday.values.map(entry => {
                        const timestamp = entry[0]; // First element is the timestamp

                        return {
                            ...entry, // Retain other data
                            formattedTimestampUTC: convertUnixTimestamp(timestamp, false),  // UTC time
                            formattedTimestampCST: convertUnixTimestamp(timestamp, true),    // CST/CDT adjusted time
                        };
                    });
                    console.log("Formatted timeSeriesDataPrecipYesterday:", formattedDataYesterday);
                }

                const table = document.createElement("table");
                table.id = "lake-office-precipitation";

                const headerRow = document.createElement("tr");
                const dateHeader = document.createElement("th");
                dateHeader.textContent = "Date";
                headerRow.appendChild(dateHeader);

                const outflowHeader = document.createElement("th");
                outflowHeader.textContent = "Forecast Outflow (cfs)";
                headerRow.appendChild(outflowHeader);

                table.appendChild(headerRow);

                // Dont have existing data, so create a new row with today's date and default value
                if (formattedData.length === 0) {
                    const row = document.createElement("tr");
                    const dateCell = document.createElement("td");
                    dateCell.textContent = convertTo6AMCST(isoDateToday);
                    row.appendChild(dateCell);
                    const precipCell = document.createElement("td");
                    const precipInput = document.createElement("input");
                    precipInput.type = "number";
                    precipInput.value = 0.00.toFixed(2);
                    precipInput.step = "0.01";
                    precipInput.className = "outflow-input";
                    precipInput.id = `precipInput-${isoDateToday}`;
                    precipInput.style.backgroundColor = "pink";
                    precipInput.style.textAlign = "center";
                    precipInput.style.verticalAlign = "middle";
                    precipCell.appendChild(precipInput);
                    row.appendChild(precipCell);

                    table.appendChild(row);
                } else {
                    formattedData.forEach((entry) => {
                        const row = document.createElement("tr");
                        const dateCell = document.createElement("td");
                        dateCell.textContent = entry.formattedTimestampCST ? entry.formattedTimestampCST : entry.timestamp;
                        row.appendChild(dateCell);
                        const precipCell = document.createElement("td");
                        const precipInput = document.createElement("input");
                        precipInput.type = "number";
                        precipInput.value = parseFloat(entry[1]).toFixed(2);
                        precipInput.step = "0.01";
                        precipInput.className = "outflow-input";
                        precipInput.id = `precipInput-${isoDateToday}`;
                        precipInput.style.textAlign = "center";
                        precipInput.style.verticalAlign = "middle";
                        precipCell.appendChild(precipInput);
                        row.appendChild(precipCell);
                        table.appendChild(row);
                    });
                }

                const output8Div = document.getElementById("output8");
                output8Div.innerHTML = "";
                output8Div.appendChild(table);

                const cdaSaveBtn = document.createElement("button");
                cdaSaveBtn.textContent = "Submit";
                cdaSaveBtn.id = "cda-btn-precip";
                cdaSaveBtn.disabled = true;
                output8Div.appendChild(cdaSaveBtn);

                const statusDiv = document.createElement("div");
                statusDiv.className = "status";
                const cdaStatusBtn = document.createElement("button");
                cdaStatusBtn.textContent = "";
                cdaStatusBtn.id = "cda-btn-precip";
                cdaStatusBtn.disabled = false;
                statusDiv.appendChild(cdaStatusBtn);
                output8Div.appendChild(statusDiv);

                // Create the buttonRefresh button
                const buttonRefresh = document.createElement('button');
                buttonRefresh.textContent = 'Refresh';
                buttonRefresh.id = 'refresh-lake-office-precipitation-button';
                buttonRefresh.className = 'fetch-btn';
                output8Div.appendChild(buttonRefresh);

                buttonRefresh.addEventListener('click', () => {
                    // Remove existing table
                    const existingTable = document.getElementById('lake-office-precipitation');
                    if (existingTable) {
                        existingTable.remove();
                    }

                    const existingRefresh = document.getElementById('cda-btn-precip');
                    if (existingRefresh) {
                        existingRefresh.remove();
                    }

                    // Fetch and create new table
                    fetchTsidData();
                });

                cdaSaveBtn.addEventListener("click", async () => {
                    const values = [];

                    if (formattedData.length === 0) {
                        // No data, only today's input (single row scenario)
                        const precipInput = document.getElementById(`precipInput-${isoDateToday}`).value;
                        let precipValue = precipInput ? parseFloat(parseFloat(precipInput).toFixed(2)) : 909;
                        const timestampUnix = new Date(new Date(isoDateToday).getTime() + 6 * 3600000).toISOString(); // Adjust to 6 AM CST

                        values.push([timestampUnix, precipValue, 0]);
                    } else {
                        // Use existing formattedData entries
                        formattedData.forEach(entry => {
                            const precipInput = document.getElementById(`precipInput-${isoDateToday}`).value;
                            let precipValue = precipInput ? parseFloat(parseFloat(precipInput).toFixed(2)) : 909;
                            const timestampUnix = new Date(new Date(isoDateToday).getTime() + 6 * 3600000).toISOString(); // Adjust to 6 AM CST

                            values.push([timestampUnix, precipValue, 0]);
                        });
                    }

                    const payload = {
                        "name": tsidPrecip,
                        "office-id": "MVS",
                        "units": "in",
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

                    async function fetchUpdatedData(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidPrecip) {
                        // Convert to Date object
                        const date = new Date(isoDateDay1);

                        // Add 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
                        date.setTime(date.getTime() - (1 * 60 * 60 * 1000));

                        // Convert back to ISO string (preserve UTC format)
                        const isoDateDay1Minus1Hour = date.toISOString();

                        let response = null;
                        response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?name=${tsidPrecip}&begin=${isoDateToday}&end=${isoDateDay1Minus1Hour}&office=MVS`, {
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

                            // Optional: small delay to allow backend to process the new data
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            // Fetch updated data and refresh the table
                            const updatedData = await fetchUpdatedData(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidPrecip);
                            createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidPrecip, updatedData);
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
        const date = new Date(isoDateDay1);

        // Add 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
        date.setTime(date.getTime() - (1 * 60 * 60 * 1000));

        // Convert back to ISO string (preserve UTC format)
        const isoDateDay1Minus1Hour = date.toISOString();

        const tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateToday}&end=${isoDateDay1Minus1Hour}&office=${office}`;
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
        const tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateMinus2Days}&end=${isoDateMinus1Day}&office=${office}`;
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

    function getDSTOffsetInHours() {
        // Get the current date
        const now = new Date();

        // Get the current time zone offset in minutes (with DST, if applicable)
        const currentOffset = now.getTimezoneOffset();

        // Convert the offset from minutes to hours
        const dstOffsetHours = currentOffset / 60;

        return dstOffsetHours; // Returns the offset in hours (e.g., -5 or -6)
    }

    function convertTo6AMCST(isoDateToday) {
        // Parse the UTC date
        let utcDate = new Date(isoDateToday);

        // Convert to CST (America/Chicago)
        let cstDate = new Date(utcDate.toLocaleString("en-US", { timeZone: "America/Chicago" }));

        // Set the time to 6 AM CST
        cstDate.setHours(6, 0, 0, 0);

        // Convert back to ISO format
        return new Date(cstDate.getTime() - (cstDate.getTimezoneOffset() * 60000)).toISOString();
    }
});


// Lk Shelbyville-Kaskaskia.Precip.Total.~1Day.1Day.lakerep-rev-test
// Carlyle Lk-Kaskaskia.Precip.Total.~1Day.1Day.lakerep-rev-test
// Mark Twain Lk-Salt.Precip.Total.~1Day.1Day.lakerep-rev-test
// Wappapello Lk-St Francis.Precip.Total.~1Day.1Day.lakerep-rev-test
// Rend Lk-Big Muddy.Precip.Total.~1Day.1Day.lakerep-rev-test