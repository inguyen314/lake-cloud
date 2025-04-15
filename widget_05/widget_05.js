document.addEventListener('DOMContentLoaded', async function () {
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

    const urltsid1 = `${setBaseUrl}timeseries/group/Storage?office=${office}&category-id=${lake}`;
    const urltsid2 = `${setBaseUrl}timeseries/group/Outflow-Average-Lake-Test?office=${office}&category-id=${lake}`;
    const urltsid3 = `${setBaseUrl}timeseries/group/Consensus-Test?office=${office}&category-id=${lake}`;

    const levelId = `${lake}.Evap.Inst.0.Evaporation`;
    console.log("levelId:", levelId);

    const levelIdUrl = `${setBaseUrl}levels/${levelId}?office=MVS&effective-date=${isoDateToday}&unit=ft`;
    console.log("levelIdUrl:", levelIdUrl);

    const fetchTimeSeriesData = async (tsid) => {
        const tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateMinus6Days}&end=${isoDateToday}&office=${office}`;
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
            const response3 = await fetch(levelIdUrl);
            const response4 = await fetch(urltsid3);

            const tsidData1 = await response1.json();
            const tsidData2 = await response2.json();
            const evapLevelData = await response3.json();
            const tsidData3 = await response4.json();

            console.log("evapLevelData:", evapLevelData);

            // Extract the timeseries-id from the response
            const tsid1 = tsidData1['assigned-time-series'][0]['timeseries-id']; // Grab the first timeseries-id
            const tsid2 = tsidData2['assigned-time-series'][0]['timeseries-id']; // Grab the first timeseries-id
            const tsid3 = evapLevelData['location-level-id'] // Grab the first timeseries-id
            const tsid4 = tsidData3['assigned-time-series'][0]['timeseries-id']; // Grab the first timeseries-id

            const curentMonthEvapValue = getEvapValueForMonth(evapLevelData, month);
            console.log("curentMonthEvapValue:", curentMonthEvapValue);

            console.log("tsid1:", tsid1);
            console.log("tsid2:", tsid2);
            console.log("tsid3:", tsid3);
            console.log("tsid4:", tsid4);

            // Fetch time series data using tsid values
            const timeSeriesData1 = await fetchTimeSeriesData(tsid1);
            const timeSeriesData2 = await fetchTimeSeriesData(tsid2);
            const timeSeriesData3 = await fetchTimeSeriesData(tsid4);

            console.log("timeSeriesData1:", timeSeriesData1);
            console.log("timeSeriesData2:", timeSeriesData2);
            console.log("timeSeriesData3:", timeSeriesData3);

            // Call getHourlyDataOnTopOfHour for both time series data
            const hourlyData1 = getMidnightData(timeSeriesData1, tsid1);
            const hourlyData2 = getMidnightData(timeSeriesData2, tsid2);
            const hourlyData3 = getMidnightData(timeSeriesData3, tsid4);

            console.log("hourlyData1:", hourlyData1);
            console.log("hourlyData2:", hourlyData2);
            console.log("hourlyData3:", hourlyData3);

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
                cdaSaveBtn = document.getElementById("cda-btn-inflow"); // Get the button by its ID

                cdaSaveBtn.disabled = true; // Disable button while checking login state

                // Update button text based on login status
                if (await isLoggedIn()) {
                    cdaSaveBtn.innerText = "Save";
                } else {
                    cdaSaveBtn.innerText = "Login";
                }

                cdaSaveBtn.disabled = false; // Re-enable button
            }

            let formattedData1 = hourlyData1.map(entry => {
                const formattedTimestamp = formatISODate2ReadableDate(Number(entry.timestamp)); // Ensure timestamp is a number
                // console.log("Original (hourlyData1):", entry.timestamp, "Formatted:", formattedTimestamp);
                return {
                    ...entry,
                    formattedTimestamp
                };
            });

            let formattedData2 = hourlyData2.map(entry => {
                const formattedTimestamp = formatISODate2ReadableDate(Number(entry.timestamp)); // Ensure timestamp is a number
                // console.log("Original (hourlyData2):", entry.timestamp, "Formatted:", formattedTimestamp);
                return {
                    ...entry,
                    formattedTimestamp
                };
            });

            formattedData1 = addDeltaAsDsfToData(formattedData1);
            formattedData1 = shiftDeltaUp(formattedData1);

            // Now you have formatted data for both datasets
            console.log("Formatted Data for HourlyData1:", formattedData1);
            console.log("Formatted Data for HourlyData2:", formattedData2);


            // Calculate the delta storage

            function createTable(formattedData1, formattedData2, curentMonthEvapValue, hourlyData3) {
                // Create the table element
                const table = document.createElement("table");

                // Apply the ID "gate-settings" to the table
                table.id = "gate-settings";

                // Create the table header row
                const headerRow = document.createElement("tr");

                const chgStorageHeader = document.createElement("th");
                chgStorageHeader.textContent = "Date";
                headerRow.appendChild(chgStorageHeader);

                const stageHeader = document.createElement("th");
                stageHeader.textContent = "Chg Storage (dsf)";
                headerRow.appendChild(stageHeader);

                const averageOutflowHeader = document.createElement("th");
                averageOutflowHeader.textContent = "Average Outflow (dsf)";
                headerRow.appendChild(averageOutflowHeader);

                const storageOutflowEvapHeader = document.createElement("th");
                storageOutflowEvapHeader.textContent = "Inflow Storage w/ Evap (dsf)";
                headerRow.appendChild(storageOutflowEvapHeader);

                const consensusHeader = document.createElement("th");
                consensusHeader.textContent = "Consensus(dsf)";
                headerRow.appendChild(consensusHeader);

                const balanceFlagHeader = document.createElement("th");
                balanceFlagHeader.textContent = "Balance Flag";
                headerRow.appendChild(balanceFlagHeader);

                table.appendChild(headerRow);

                // Combine the data based on matching timestamps
                let i = 0;
                let j = 0;

                while (i < formattedData1.length - 1 && j < formattedData2.length - 1) {
                    if (formattedData1[i].formattedTimestamp === formattedData2[j].formattedTimestamp) {
                        const row = document.createElement("tr");

                        // Date Time
                        const dateCell = document.createElement("td");
                        dateCell.textContent = formattedData1[i].formattedTimestamp; // Display formattedTimestamp as Date
                        row.appendChild(dateCell);

                        // Change in Storage
                        const chgStorageCell = document.createElement("td");
                        const delta = formattedData1[i].delta;

                        if (delta == null) {
                            chgStorageCell.textContent = '—'; // or 'N/A'
                        } else if (delta < 0) {
                            chgStorageCell.textContent = `- ${Math.abs(delta).toFixed(0)}`;
                        } else {
                            chgStorageCell.textContent = `+ ${(delta).toFixed(0)}`;
                        }

                        row.appendChild(chgStorageCell);

                        // Average Outflow
                        const averageOutflowCell = document.createElement("td");
                        averageOutflowCell.textContent = formattedData2[j].value.toFixed(0);
                        row.appendChild(averageOutflowCell);

                        // Storage + Average Outflow + Evaporation
                        const storageOutflowEvapCell = document.createElement("td");
                        storageOutflowEvapCell.textContent = ((parseFloat(formattedData2[j].value) + parseFloat(delta)) + parseFloat(curentMonthEvapValue)).toFixed(0);
                        row.appendChild(storageOutflowEvapCell);

                        // Consensus
                        const consensusCell = document.createElement("td");
                        const input = document.createElement("input");
                        input.type = "number";
                        input.value = (hourlyData3[i].value).toFixed(0);
                        input.style.width = "60px"; // Optional: set a width for better appearance
                        consensusCell.appendChild(input);
                        row.appendChild(consensusCell);

                        // Quality Code
                        const qualityCodeCell = document.createElement("td");
                        const qualityInput = document.createElement("input");
                        qualityInput.type = "text";
                        qualityInput.value = hourlyData3[i].qualityCode;
                        qualityInput.style.width = "60px"; // Optional styling
                        qualityCodeCell.appendChild(qualityInput);
                        row.appendChild(qualityCodeCell);

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

                // Append the table to the specific container (id="output5")
                const output4Div = document.getElementById("output5");
                output4Div.innerHTML = ""; // Clear any existing content
                output4Div.appendChild(table);

                const output8Div = document.getElementById("output5");
                output8Div.innerHTML = "";
                output8Div.appendChild(table);

                const cdaSaveBtn = document.createElement("button");
                cdaSaveBtn.textContent = "Submit";
                cdaSaveBtn.id = "cda-btn-inflow";
                cdaSaveBtn.disabled = true;
                output8Div.appendChild(cdaSaveBtn);

                const statusDiv = document.createElement("div");
                statusDiv.className = "status";
                const cdaStatusBtn = document.createElement("button");
                cdaStatusBtn.textContent = "";
                cdaStatusBtn.id = "cda-btn-inflow";
                cdaStatusBtn.disabled = false;
                statusDiv.appendChild(cdaStatusBtn);
                output8Div.appendChild(statusDiv);

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

            function createTableAvg(formattedData2, evapLevelData) {
                // Extract the last two values
                const lastValue = formattedData2[formattedData2.length - 1].value;
                const secondLastValue = formattedData2[formattedData2.length - 2].value;

                // Calculate the average of the last two values
                const averageValue = (lastValue + secondLastValue) / 2;

                // Create the table structure
                const table = document.createElement("table");

                // Apply the ID "gate-settings" to the table
                table.id = "gate-settings";
                // table.style.width = "75%";
                table.style.marginTop = "10px";
                table.style.marginBottom = "10px";

                // Create the header row
                const headerRow = table.insertRow();
                const col1 = headerRow.insertCell();
                const col2 = headerRow.insertCell();
                const col3 = headerRow.insertCell();

                col1.textContent = "Date of Last Balance";
                col1.style.fontWeight = "bold";
                col2.textContent = "Sum of Computed Inflow";
                col2.style.fontWeight = "bold";
                col3.textContent = "Sum of Computed Inflow";
                col3.style.fontWeight = "bold";

                // Create the header row
                const headerRow2 = table.insertRow();
                const col4 = headerRow2.insertCell();
                const col5 = headerRow2.insertCell();
                const col6 = headerRow2.insertCell();

                col4.textContent = "01-01-1990";
                col5.textContent = 999;
                col6.textContent = 999;



                // Insert the table into the "output5" div
                const outputDiv = document.getElementById("output5");
                outputDiv.appendChild(table);
            }

            // Call the function with formattedData1 and formattedData2
            createTable(formattedData1, formattedData2, curentMonthEvapValue, hourlyData3);

            // Call the function
            createTableAvg(formattedData2);

            loginStateController()
            // Setup timers
            setInterval(async () => {
                loginStateController()
            }, 10000) // time is in millis

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

    function addDeltaAsDsfToData(data) {
        return data.map((entry, index) => {
            if (index === 0) {
                return { ...entry, delta: null };
            }
            const delta = (entry.value - data[index - 1].value) / 1.9834591996927;
            return { ...entry, delta };
        });
    }

    function shiftDeltaUp(data) {
        for (let i = 0; i < data.length - 1; i++) {
            data[i].delta = data[i + 1].delta;
        }
        // Optional: set the last delta to null since there's no next value
        data[data.length - 1].delta = null;
        return data;
    }

    function getEvapValueForMonth(data, month) {
        // Convert string or number month to integer and adjust for 0-based offset
        const offset = parseInt(month, 10) - 1;
        console.log("offset: ", offset)

        const matchingValue = data[`seasonal-values`].find(
            (entry) => entry[`offset-months`] === offset
        );
        console.log("matchingValue: ", matchingValue)

        return matchingValue ? matchingValue.value : null;
    }
});

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