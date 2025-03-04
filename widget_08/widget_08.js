document.addEventListener('DOMContentLoaded', async function () {
    console.log("lake: ", lake);
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

    const urlPrecipTsid = `${setBaseUrl}timeseries/group/Precip-Lake-Test?office=${office}&category-id=${lake}`;
    console.log("urlPrecipTsid:", urlPrecipTsid);

    const fetchTimeSeriesData = async (tsid) => {
        const tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateMinus1Day}&end=${isoDateToday}&office=${office}`;
        console.log('tsidData:', tsidData);
        try {
            const response = await fetch(tsidData);
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
            const response = await fetch(tsidData);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching time series data:", error);
        }
    };

    const fetchTsidData = async () => {
        try {
            const response1 = await fetch(urlPrecipTsid);

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
                console.log("timeSeriesDataPrecipYesterday:", timeSeriesDataPrecipYesterday)

                const formattedData = timeSeriesDataPrecip.values.map(entry => {
                    const timestamp = entry[0]; // First element is the timestamp
                    const formattedTimestampCST = formatISODateToCSTString(Number(timestamp));

                    return {
                        timestamp,
                        formattedTimestampCST,
                        value: parseFloat(entry[1]).toFixed(2),  // Format value to 2 decimal places
                        qualityCode: entry[2]    // Third element is the quality code
                    };
                });

                console.log("Formatted timeSeriesDataPrecip:", formattedData);

                const formattedDataYesterday = timeSeriesDataPrecipYesterday.values.map(entry => {
                    const timestamp = entry[0]; // First element is the timestamp
                    const formattedTimestampCST = formatISODateToCSTString(Number(timestamp));

                    return {
                        timestamp,
                        formattedTimestampCST,
                        value: parseFloat(entry[1]).toFixed(2),  // Format value to 2 decimal places
                        qualityCode: entry[2]    // Third element is the quality code
                    };
                });

                console.log("Formatted timeSeriesDataPrecipYesterday:", formattedDataYesterday);

                const table = document.createElement("table");
                table.id = "gate-settings";

                const headerRow = document.createElement("tr");
                const dateHeader = document.createElement("th");
                dateHeader.textContent = "Date";
                headerRow.appendChild(dateHeader);

                const outflowHeader = document.createElement("th");
                outflowHeader.textContent = "Forecast Outflow (cfs)";
                headerRow.appendChild(outflowHeader);

                table.appendChild(headerRow);

                if (formattedData.length === 0) {
                    // No data, create a single row using isoDateToday and a blank outflow cell
                    const row = document.createElement("tr");

                    const dateCell = document.createElement("td");
                    dateCell.textContent = isoDateToday;
                    row.appendChild(dateCell);

                    const precipCell = document.createElement("td");
                    const precipInput = document.createElement("input");
                    precipInput.type = "number";
                    precipInput.value = "";  // Blank entry box
                    precipInput.className = "outflow-input";
                    precipInput.id = `precipInput-${isoDateToday}`;
                    precipCell.appendChild(precipInput);
                    row.appendChild(precipCell);

                    table.appendChild(row);
                } else {
                    // Render rows from formattedData
                    formattedData.forEach((entry) => {
                        const row = document.createElement("tr");

                        const dateCell = document.createElement("td");
                        dateCell.textContent = entry.formattedTimestampCST ? entry.formattedTimestampCST : entry.timestamp;
                        row.appendChild(dateCell);

                        const precipCell = document.createElement("td");
                        const precipInput = document.createElement("input");
                        precipInput.type = "number";
                        precipInput.value = entry.value;  // Use formatted value
                        precipInput.className = "outflow-input";
                        precipInput.id = `precipInput-${entry.timestamp}`;
                        precipCell.appendChild(precipInput);
                        row.appendChild(precipCell);

                        table.appendChild(row);
                    });
                }

                const output6Div = document.getElementById("output8");
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
                    const values = [];

                    if (formattedData.length === 0) {
                        // No data, only today's input (single row scenario)
                        const precipInput = document.getElementById(`precipInput-${isoDateToday}`).value;

                        let precipValue = precipInput ? parseFloat(precipInput) : 909; // Default to 909 if empty
                        const timestampUnix = new Date(isoDateToday).getTime();

                        values.push([timestampUnix, precipValue, 0]);
                    } else {
                        // Use existing formattedData entries
                        formattedData.forEach(entry => {
                            const precipInput = document.getElementById(`precipInput-${entry.timestamp}`).value;

                            let precipValue = precipInput ? parseFloat(precipInput) : 909; // Default to 909 if empty
                            const timestampUnix = new Date(entry.timestamp).getTime();

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
                            // await createVersionTS(payload);
                            // cdaStatusBtn.innerText = "Write successful!";

                            // // Fetch updated data and refresh the table
                            // const updatedData = await fetchUpdatedData(tsidPrecip, isoDateDay5, isoDateToday, isoDateMinus1Day);
                            // createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidPrecip, updatedData);
                        } catch (error) {
                            hideSpinner(); // Hide the spinner if an error occurs
                            cdaStatusBtn.innerText = "Failed to write data!";
                            console.error(error);
                        }

                        hideSpinner(); // Hide the spinner after the operation completes
                    }
                });
            }

            // Call the function with midnightDataPrecipFormatted and formattedData2
            createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidPrecip, timeSeriesDataPrecip, timeSeriesDataPrecipYesterday);
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
});


// Lk Shelbyville-Kaskaskia.Precip.Total.~1Day.1Day.lakerep-rev-test
// Carlyle Lk-Kaskaskia.Precip.Total.~1Day.1Day.lakerep-rev-test
// Mark Twain Lk-Salt.Precip.Total.~1Day.1Day.lakerep-rev-test
// Wappapello Lk-St Francis.Precip.Total.~1Day.1Day.lakerep-rev-test
// Rend Lk-Big Muddy.Precip.Total.~1Day.1Day.lakerep-rev-test