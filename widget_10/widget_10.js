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

    const urltsid = `${setBaseUrl}timeseries/group/Crest-Forecast-Lake?office=${office}&category-id=${lake}`;
    console.log("urltsid:", urltsid);

    const fetchTsidData = async () => {
        try {
            const response = await fetch(urltsid);

            const tsidData = await response.json();
            console.log("tsidData:", tsidData);

            // Extract the timeseries-id from the response
            const tsid = tsidData['assigned-time-series'][0]['timeseries-id'];
            console.log("tsid:", tsid);

            // Fetch time series data using tsid values
            const timeSeriesDataCrest = await fetchTimeSeriesData(tsid);
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
                cdaSaveBtn = document.getElementById("cda-btn-crest"); // Get the button by its ID

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

            createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsid, timeSeriesDataCrest);

            loginStateController()
            // Setup timers
            setInterval(async () => {
                loginStateController()
            }, 10000) // time is in millis



        } catch (error) {
            console.error("Error fetching tsid data:", error);
        }

        function createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsid, timeSeriesDataCrest) {
            console.log("timeSeriesDataCrest:", timeSeriesDataCrest);

            const formattedData = timeSeriesDataCrest.values.map(entry => {
                const timestamp = Number(entry[0]); // Ensure timestamp is a number

                return {
                    ...entry, // Retain other data
                    formattedTimestampUTC: convertUnixTimestamp(timestamp, false),  // UTC time
                    formattedTimestampCST: convertUnixTimestamp(timestamp, true)    // CST/CDT adjusted time
                };
            });

            // Now you have formatted data for both datasets
            console.log("Formatted timeSeriesDataCrest:", formattedData);

            const table = document.createElement("table");
            table.id = "crest-forecast";

            // Create the table header row
            const headerRow = document.createElement("tr");

            const dateHeader = document.createElement("th");
            dateHeader.textContent = "Date";
            headerRow.appendChild(dateHeader);

            const crestHeader = document.createElement("th");
            crestHeader.textContent = "Forecast Crest (ft)";
            headerRow.appendChild(crestHeader);

            const optionHeader = document.createElement("th");
            optionHeader.textContent = "Option";
            headerRow.appendChild(optionHeader);

            table.appendChild(headerRow);

            // Create a single data row
            const row = document.createElement("tr");

            // Editable "Day" cell using dropdown
            const dateCell = document.createElement("td");
            const dateSelect = document.createElement("select");
            dateSelect.id = "dateInput";
            dateSelect.style.textAlign = "center";
            dateSelect.style.verticalAlign = "middle";
            dateSelect.style.width = "100%";

            // Build the list of date options
            const dateOptions = [
                isoDateToday,
                isoDateDay1,
                isoDateDay2,
                isoDateDay3,
                isoDateDay4,
                isoDateDay5,
                isoDateDay6
            ];

            // Add options to the dropdown
            dateOptions.forEach(dateStr => {
                const option = document.createElement("option");
                option.value = dateStr;

                // Extract and reformat date to MM-DD-YYYY
                const [year, month, day] = dateStr.split("T")[0].split("-");
                const displayDate = `${month}-${day}-${year}`;
                option.textContent = displayDate;

                dateSelect.appendChild(option);
            });

            // Set the default selected value from formattedData or fallback
            const defaultDate = formattedData.at(-1)?.formattedTimestampCST || isoDateDay1;
            dateSelect.value = dateOptions.includes(defaultDate) ? defaultDate : isoDateDay1;

            dateCell.appendChild(dateSelect);
            row.appendChild(dateCell);

            // Forecast Crest cell (editable)
            const crestCell = document.createElement("td");
            const crestInput = document.createElement("input");
            crestInput.type = "number";
            crestInput.value = formattedData.at(-1)?.[1]?.toFixed(2) || '';
            crestInput.step = "0.01";  // Ensure the step increment is 0.01
            crestInput.style.textAlign = "center";
            crestInput.style.verticalAlign = "middle";
            crestCell.appendChild(crestInput);
            row.appendChild(crestCell);

            // Option cell (dropdown editable)
            const optionCell = document.createElement("td");
            const optionInput = document.createElement("select");
            optionInput.style.textAlign = "center";
            optionInput.style.verticalAlign = "middle";
            optionInput.style.width = "100%";

            // Define the quality code options
            const qualityOptions = [
                { value: 0, label: 'No Crest' },
                { value: 1, label: '=' },
                { value: 3, label: '<' },
                { value: 5, label: 'Cresting' },
                { value: 9, label: 'Crested' }
            ];

            // Populate the dropdown
            qualityOptions.forEach(opt => {
                const option = document.createElement("option");
                option.value = opt.value.toString(); // Ensure string for dropdown
                option.textContent = opt.label;
                optionInput.appendChild(option);
            });

            // Get the last quality code and ensure it's a whole number string
            const lastQuality = Math.round(Number(formattedData.at(-1)?.[2] ?? 0)).toString();
            if (['0', '1', '3', '5', '9'].includes(lastQuality)) {
                optionInput.value = lastQuality;
            } else {
                optionInput.value = '0'; // Default to "No Crest"
            }

            // Set crestInput to 909 if "No Crest" is selected initially
            if (parseInt(optionInput.value) === 0) {
                crestInput.value = '909';
            }

            // If optionInput is 0, override the dateSelect to isoDateToday
            if (optionInput.value === '0') {
                dateSelect.value = isoDateToday;
            }

            // Add event listener to update crestInput if "No Crest" is selected
            optionInput.addEventListener('change', () => {
                if (parseInt(optionInput.value) === 0) {
                    crestInput.value = '909';
                }
            });

            optionCell.appendChild(optionInput);
            row.appendChild(optionCell);

            // Append the single row to the table
            table.appendChild(row);

            const output10Div = document.getElementById("output10");
            output10Div.innerHTML = "";
            output10Div.appendChild(table);

            const cdaSaveBtn = document.createElement("button");
            cdaSaveBtn.textContent = "Submit";
            cdaSaveBtn.id = "cda-btn-crest";
            cdaSaveBtn.disabled = true;
            output10Div.appendChild(cdaSaveBtn);

            const statusDiv = document.createElement("div");
            statusDiv.id = "status-crest";
            output10Div.appendChild(statusDiv);

            // Create the buttonRefresh button
            const buttonRefresh = document.createElement('button');
            buttonRefresh.textContent = 'Refresh';
            buttonRefresh.id = 'refresh-crest-forecast-button';
            buttonRefresh.className = 'fetch-btn';
            output10Div.appendChild(buttonRefresh);

            buttonRefresh.addEventListener('click', () => {
                // Remove existing table
                const existingTable = document.getElementById('crest-forecast');
                if (existingTable) {
                    existingTable.remove();
                }

                const existingRefresh = document.getElementById('cda-btn-crest');
                if (existingRefresh) {
                    existingRefresh.remove();
                }

                // Fetch and create new table
                fetchTsidData();
            });

            cdaSaveBtn.addEventListener("click", async () => {
                const crestRaw = parseFloat(crestInput.value);
                const optionRaw = parseInt(optionInput.value);

                const crestValue = isNaN(crestRaw) ? 909 : crestRaw;
                const optionValue = isNaN(optionRaw) ? 0 : optionRaw;

                console.log("Crest Input: ", crestValue);
                console.log("Option/QualityCode Input: ", optionValue);
                console.log("DateTime Input: ", dateInput.value);
                console.log(addDSTOffsetToUTC(dateInput.value, dstOffsetHours));

                // const timestampUnix = new Date(formattedData.at(-1).formattedTimestampUTC).getTime();
                // console.log("timestampUnix: ", timestampUnix);

                let timestampUTC = null;
                if (crestValue === 909 || crestValue === '') {
                    timestampUTC = addDSTOffsetToUTC(convertTo6AMCST(isoDateToday), dstOffsetHours);
                } else {
                    timestampUTC = addDSTOffsetToUTC(dateInput.value, dstOffsetHours);
                }
                console.log("timestampUTC: ", timestampUTC);

                const payload = {
                    "date-version-type": "MAX_AGGREGATE",
                    "name": tsid,
                    "office-id": "MVS",
                    "units": "ft",
                    "values": [[timestampUTC, crestValue, optionValue]],
                    "version-date": convertTo6AMCST(isoDateToday),
                };

                console.log("payload: ", payload);

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

                async function deleteVersionTS(payload) {
                    const begin = convertTo6AMCST(isoDateToday);
                    const end = convertTo6AMCST(isoDateDay7);

                    if (!payload) throw new Error("You must specify a payload!");
                    const response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries/${tsid}?office=${office}&begin=${begin}&end=${end}&version-date=${convertTo6AMCST(isoDateToday)}&start-time-inclusive=true&end-time-inclusive=true&override-protection=true`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json;version=2" },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                    }
                }

                async function fetchUpdatedData(tsid, isoDateDay7, isoDateToday, isoDateMinus1Day) {
                    let response = null;
                    response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?name=${tsid}&begin=${isoDateMinus1Day}&end=${isoDateDay7}&office=${office}&version-date=${convertTo6AMCST(isoDateToday)}`, {
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
                    statusDiv.innerText = loginResult ? "" : "Failed to Login!";
                } else {
                    try {
                        showSpinner();

                        // TODO: Dont have data entry date yet, so need to delete.
                        await deleteVersionTS(payload);
                        console.log("Delete successful!");
                        statusDiv.innerText = "Delete successful!";

                        // Optional: small delay to allow backend to process the new data
                        await new Promise(resolve => setTimeout(resolve, 1000));

                        await createVersionTS(payload);
                        console.log("Write successful!");
                        statusDiv.innerText = "Write successful!";

                        // Optional: small delay to allow backend to process the new data
                        await new Promise(resolve => setTimeout(resolve, 1000));

                        // Fetch updated data and refresh the table
                        console.log("Calling updatedData!");
                        statusDiv.innerText = "Calling createTable!";
                        const updatedData = await fetchUpdatedData(tsid, isoDateDay7, isoDateToday, isoDateMinus1Day);

                        console.log("Calling createTable!");
                        createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsid, updatedData);
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
        tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateMinus1Day}&end=${isoDateDay7}&office=${office}&version-date=${convertTo6AMCST(isoDateToday)}`;
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

    function addDSTOffsetToUTC(isoDate, dstOffsetHours) {
        // Parse the input UTC time into a Date object
        const utcDate = new Date(isoDate);

        // Add the DST offset (in hours) to the UTC date
        utcDate.setHours(utcDate.getHours() + dstOffsetHours);

        // Return the updated time as an ISO string
        return utcDate.toISOString();
    }

    function validateDateInput(inputValue) {
        // Check if the input is in ISO format (matches the pattern)
        const isoFormatRegex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z)$/;
        if (!isoFormatRegex.test(inputValue)) {
            return {
                isValid: false,
                message: "The date must be in ISO format (e.g., 2025-05-03T06:00:00.000Z)."
            };
        }

        const inputDate = new Date(inputValue);
        const now = new Date();
        const fourteenDaysFromNow = new Date(now);
        fourteenDaysFromNow.setDate(now.getDate() + 14);

        // Check if the date is in the future
        if (inputDate <= now) {
            return {
                isValid: false,
                message: "The date must be in the future."
            };
        }

        // Check if the date is within the next 14 days
        if (inputDate > fourteenDaysFromNow) {
            return {
                isValid: false,
                message: "The date must be within the next 14 days."
            };
        }

        // If valid
        return {
            isValid: true,
            message: ""
        };
    }
});

// [
//     {
//         "0": 1741348800000,
//         "1": 899.9999999999999,
//         "2": 0,
//         "formattedTimestampCST": "2025-03-07T12:00:00.000Z"
//     },
//     {
//         "0": 1741435200000,
//         "1": 899.9999999999999,
//         "2": 0,
//         "formattedTimestampCST": "2025-03-08T12:00:00.000Z"
//     },
//     {
//         "0": 1741521600000,
//         "1": 899.9999999999999,
//         "2": 1,
//         "formattedTimestampCST": "2025-03-09T12:00:00.000Z"
//     }
// ]

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
// Carlyle Lk-Kaskaskia.Stage.Inst.~1Day.0.lakerep-rev-crest-forecast	MVS	Carlyle Lk-Kaskaskia	Stage	Inst	~1Day	0	lakerep-rev-crest-forecast	N/A	Aggregate	2025-03-05 06:16	1111-11-17 18:09	2025-03-11 06:00	38.61805	-89.351083
// Lk Shelbyville-Kaskaskia.Stage.Inst.~1Day.0.lakerep-rev-crest-forecast	MVS	Lk Shelbyville-Kaskaskia	Stage	Inst	~1Day	0	lakerep-rev-crest-forecast	N/A	Aggregate	2025-03-05 06:16	1111-11-17 18:09	2025-03-11 06:00	39.408958	-88.780114
// Mark Twain Lk-Salt.Stage.Inst.~1Day.0.lakerep-rev-crest-forecast	MVS	Mark Twain Lk-Salt	Stage	Inst	~1Day	0	lakerep-rev-crest-forecast	N/A	Aggregate	2025-03-05 06:16	1111-11-17 18:09	2025-03-11 06:00	39.5248701	-91.6443126
// Rend Lk-Big Muddy.Stage.Inst.~1Day.0.lakerep-rev-crest-forecast	MVS	Rend Lk-Big Muddy	Stage	Inst	~1Day	0	lakerep-rev-crest-forecast	N/A	Aggregate	2025-03-05 06:16	1111-11-17 18:09	2025-03-11 06:00	38.037619	-88.961594
// Wappapello Lk-St Francis.Stage.Inst.~1Day.0.lakerep-rev-crest-forecast	MVS	Wappapello Lk-St Francis	Stage	Inst	~1Day	0	lakerep-rev-crest-forecast	N/A	Aggregate	2025-03-05 06:16	1111-11-17 18:09	2025-03-11 06:00	36.9277	-90.284361


// 0 = No Crest
// 1 = "="
// 3 = "<"
// 5 = "Cresting"
// 9 = "Crested"
