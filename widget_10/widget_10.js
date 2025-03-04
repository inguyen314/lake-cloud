document.addEventListener('DOMContentLoaded', async function () {
    console.log("****************** Widget 10: Crest Forecast ******************");
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

    const urltsid = `${setBaseUrl}timeseries/group/Forecast-Lake?office=${office}&category-id=${lake}`;
    console.log("urltsid:", urltsid);

    const fetchTsidData = async () => {
        try {
            const response = await fetch(urltsid);

            const tsidData = await response.json();
            console.log("tsidData:", tsidData);

            // Extract the timeseries-id from the response
            const tsidCrest = tsidData['assigned-time-series'][0]['timeseries-id'];
            console.log("tsidCrest:", tsidCrest);

            // Fetch time series data using tsidCrest values
            const timeSeriesDataCrest = await fetchTimeSeriesData(tsidCrest);
            console.log("timeSeriesDataCrest:", timeSeriesDataCrest);

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

            if (timeSeriesDataCrest && timeSeriesDataCrest.values && timeSeriesDataCrest.values.length > 0) {
                console.log("Calling createTable ...");

                createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidCrest, timeSeriesDataCrest);

                loginStateController()
                // Setup timers
                setInterval(async () => {
                    loginStateController()
                }, 10000) // time is in millis
            } else {
                console.log("Calling createDataEntryTable ...");
                createDataEntryTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidCrest);

                loginStateController()
                // Setup timers
                setInterval(async () => {
                    loginStateController()
                }, 10000) // time is in millis
            }


        } catch (error) {
            console.error("Error fetching tsidCrest data:", error);

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

        function createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidCrest, timeSeriesDataCrest) {
            console.log("timeSeriesDataCrest:", timeSeriesDataCrest);

            formattedData = timeSeriesDataCrest.values.map(entry => {
                const timestamp = entry[0]; // Timestamp is in milliseconds in the array
                // const formattedTimestampCST = formatISODateToUTCString(Number(timestamp)); // Ensure timestamp is a number
                const formattedTimestampCST = formatISODateToCSTString(Number(timestamp)); // Ensure timestamp is a number

                return {
                    ...entry, // Retain other data
                    formattedTimestampCST // Add formatted timestamp
                };
            });

            // Now you have formatted data for both datasets
            console.log("Formatted timeSeriesDataCrest:", formattedData);

            const table = document.createElement("table");
            table.id = "gate-settings";

            const headerRow = document.createElement("tr");
            const dateHeader = document.createElement("th");
            dateHeader.textContent = "Date";
            headerRow.appendChild(dateHeader);

            const crestHeader = document.createElement("th");
            crestHeader.textContent = "Forecast Crest (ft)";
            headerRow.appendChild(crestHeader);

            table.appendChild(headerRow);

            formattedData.forEach((entry, index) => {
                const row = document.createElement("tr");

                const dateCell = document.createElement("td");
                dateCell.textContent = entry.formattedTimestampCST ? entry.formattedTimestampCST : entry[0];
                row.appendChild(dateCell);

                // Crest cell (editable)
                const crestCell = document.createElement("td");
                const crestInput = document.createElement("input");
                crestInput.type = "number";
                crestInput.value = entry[1].toFixed(0); // Crest uses formattedData
                crestInput.className = "crest-input";
                crestInput.id = `crestInput-${entry[0]}`;
                crestCell.appendChild(crestInput);
                row.appendChild(crestCell);

                table.appendChild(row);
            });

            const output10Div = document.getElementById("output10");
            output10Div.innerHTML = "";
            output10Div.appendChild(table);

            const cdaSaveBtn = document.createElement("button");
            cdaSaveBtn.textContent = "Submit";
            cdaSaveBtn.id = "cda-btn";
            cdaSaveBtn.disabled = true;
            output10Div.appendChild(cdaSaveBtn);

            const statusDiv = document.createElement("div");
            statusDiv.className = "status";
            const cdaStatusBtn = document.createElement("button");
            cdaStatusBtn.textContent = "";
            cdaStatusBtn.id = "cda-btn";
            cdaStatusBtn.disabled = false;
            statusDiv.appendChild(cdaStatusBtn);
            output10Div.appendChild(statusDiv);

            cdaSaveBtn.addEventListener("click", async () => {
                const payload = {
                    "date-version-type": "MAX_AGGREGATE",
                    "name": tsidCrest,
                    "office-id": "MVS",
                    "units": "ft",
                    "values": formattedData.map(entry => {
                        const crestValue = document.getElementById(`crestInput-${entry[0]}`).value;
                        // console.log("crestValue:", crestValue);

                        const timestampUnix = new Date(entry[0]).getTime();
                        // console.log("timestampUnix:", timestampUnix);

                        return [
                            timestampUnix,
                            parseFloat(crestValue),
                            0
                        ];
                    }),
                    "version-date": isoDateToday,
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
                    response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?name=${name}&begin=${isoDateToday}&end=${isoDateDay5}&office=MVS&version-date=${isoDateToday}`, {
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
                        await createVersionTS(payload);
                        cdaStatusBtn.innerText = "Write successful!";

                        // Log the waiting message before the 2-second wait
                        console.log("Waiting for 2 seconds before fetching updated data...");

                        // Fetch updated data and refresh the table
                        const updatedData = await fetchUpdatedData(tsidCrest, isoDateDay5, isoDateToday, isoDateMinus1Day);
                        createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidCrest, updatedData);
                    } catch (error) {
                        hideSpinner(); // Hide the spinner if an error occurs
                        cdaStatusBtn.innerText = "Failed to write data!";
                        console.error(error);
                    }

                    hideSpinner(); // Hide the spinner after the operation completes
                }
            });

        }

        function createDataEntryTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidCrest) {
            // Create the empty table element
            const table = document.createElement("table");

            // Apply the ID "gate-settings" to the table
            table.id = "gate-settings";

            // Create the table header row
            const headerRow = document.createElement("tr");

            const dateHeader = document.createElement("th");
            dateHeader.textContent = "Day";
            headerRow.appendChild(dateHeader);

            const crestHeader = document.createElement("th");
            crestHeader.textContent = "Forecast Crest (ft)";
            headerRow.appendChild(crestHeader);

            table.appendChild(headerRow);

            dates = [isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5];
            console.log("dates (UTC):", dates);

            // Convert each date from UTC to CST and format it
            const options = { timeZone: 'America/Chicago', hour12: false };

            const formattedDates = dates.map(date => {
                const d = new Date(date);
                const cstDate = d.toLocaleString('en-US', options);

                // Extract the date and time parts and format as MM-DD-YYYY HH:mm
                const [month, day, year, hour, minute] = cstDate.match(/(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}):(\d{2})/).slice(1);

                return `${month.padStart(2, '0')}-${day.padStart(2, '0')}-${year} ${hour}:${minute}`;
            });

            console.log("formattedDates (CST):", formattedDates);

            dates.forEach((date, index) => {
                const row = document.createElement("tr");

                // Date cell
                const dateCell = document.createElement("td");
                dateCell.textContent = dates[index];  // Use the corresponding formatted date
                row.appendChild(dateCell);

                // Crest cell (editable)
                const crestCell = document.createElement("td");
                const crestInput = document.createElement("input");
                crestInput.type = "text";
                crestInput.value = "";
                crestInput.id = `crestInput-${date}`;
                crestInput.style.backgroundColor = "pink";  // Set pink background
                crestCell.appendChild(crestInput);
                row.appendChild(crestCell);

                table.appendChild(row);
            });

            // Append the table to the specific container (id="output10")
            const output10Div = document.getElementById("output10");
            output10Div.innerHTML = ""; // Clear any existing content
            output10Div.appendChild(table);

            const cdaSaveBtn = document.createElement("button");
            cdaSaveBtn.textContent = "Submit";
            cdaSaveBtn.id = "cda-btn";
            cdaSaveBtn.disabled = true;
            output10Div.appendChild(cdaSaveBtn);

            const statusDiv = document.createElement("div");
            statusDiv.className = "status";
            const cdaStatusBtn = document.createElement("button");
            cdaStatusBtn.textContent = "";
            cdaStatusBtn.id = "cda-btn";
            cdaStatusBtn.disabled = false;
            statusDiv.appendChild(cdaStatusBtn);
            output10Div.appendChild(statusDiv);

            // Add event listener to the submit button
            cdaSaveBtn.addEventListener("click", async () => {
                const payload = {
                    "date-version-type": "MAX_AGGREGATE",
                    "name": tsidCrest,
                    "office-id": "MVS",
                    "units": "ft",
                    "values": dates.map((date, index) => {
                        let crestValue = document.getElementById(`crestInput-${date}`).value; // Get value from input field
                        // console.log("crestValue:", crestValue);

                        // If crestValue is empty or null, set it to 909
                        if (!crestValue) {
                            crestValue = "909"; // Default value when empty or null
                        }

                        // Convert ISO date string to timestamp
                        const timestampUnix = new Date(date).getTime(); // Correct timestamp conversion
                        // console.log("timestampUnix:", timestampUnix);

                        return [
                            timestampUnix,  // Timestamp for the day at 6 AM
                            parseInt(crestValue), // Stage value (forecast crest) as number
                            0 // Placeholder for the third value (set to 0 for now)
                        ];
                    }),
                    "version-date": isoDateToday, // Ensure this is the correct ISO formatted date
                };

                console.log("payload: ", payload);

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

                async function fetchUpdatedData(name, isoDateDay5, isoDateToday) {
                    let response = null;
                    response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?name=${name}&begin=${isoDateToday}&end=${isoDateDay5}&office=MVS&version-date=${isoDateToday}`, {
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
                        await createVersionTS(payload);
                        cdaStatusBtn.innerText = "Write successful!";

                        // Log the waiting message before the 2-second wait
                        console.log("Waiting for 2 seconds before fetching updated data...");

                        // Wait 2 seconds before fetching the updated data
                        // await new Promise(resolve => setTimeout(resolve, 500));

                        // Fetch updated data and refresh the table
                        const updatedData = await fetchUpdatedData(tsidCrest, isoDateDay5, isoDateToday, isoDateMinus1Day);
                        createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidCrest, updatedData);
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

    const fetchTimeSeriesData = async (tsidCrest) => {
        let tsidData = null;
        tsidData = `${setBaseUrl}timeseries?name=${tsidCrest}&begin=${isoDateToday}&end=${isoDateDay5}&office=${office}&version-date=${isoDateToday}`;
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

    function getIsoDateWithOffset(year, month, day, offset) {
        // Create a date object in UTC (midnight UTC)
        const date = new Date(Date.UTC(year, month - 1, day, 6, 0, 0, 0)); // Set the initial time at 6 AM UTC

        // Convert the date to CST (UTC -6)
        const cstOffset = 6 * 60; // CST is UTC -6 hours, in minutes
        date.setMinutes(date.getMinutes() + cstOffset); // Adjust to CST

        // Add the offset in days (if positive, it moves forward, if negative, backward)
        date.setUTCDate(date.getUTCDate() + offset);

        // Return the ISO string
        return date.toISOString();
    }

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