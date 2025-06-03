document.addEventListener('DOMContentLoaded', async function () {
    console.log("lake: ", lake);
    console.log('datetime: ', datetime);

    const loadingIndicator = document.getElementById('loading_02');
    loadingIndicator.style.display = 'block';

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

    let urlTsidStage = null;
    let urlTsidStorage = null;

    urlTsidStage = `${setBaseUrl}timeseries/group/Stage?office=${office}&category-id=${lake}`;
    urlTsidStorage = `${setBaseUrl}timeseries/group/Storage?office=${office}&category-id=${lake}`;

    const levelIdTopOfConservation = `${lake.split('-')[0]}.Stor.Inst.0.Top of Conservation`;
    console.log("levelIdTopOfConservation:", levelIdTopOfConservation);

    const levelIdTopOfFlood = `${lake.split('-')[0]}.Stor.Inst.0.Top of Flood`;
    console.log("levelIdTopOfFlood:", levelIdTopOfFlood);

    const levelIdBottomOfConservation = `${lake.split('-')[0]}.Stor.Inst.0.Bottom of Conservation`;
    console.log("levelIdBottomOfConservation:", levelIdBottomOfConservation);

    const levelIdBottomOfFlood = `${lake.split('-')[0]}.Stor.Inst.0.Bottom of Flood`;
    console.log("levelIdBottomOfFlood:", levelIdBottomOfFlood);

    const levelIdTopOfConservationUrl = `${setBaseUrl}levels/${levelIdTopOfConservation}?office=${office}&effective-date=${isoDateToday}&unit=ac-ft`;
    console.log("levelIdTopOfConservationUrl:", levelIdTopOfConservationUrl);

    const levelIdTopOfFloodUrl = `${setBaseUrl}levels/${levelIdTopOfFlood}?office=${office}&effective-date=${isoDateToday}&unit=ac-ft`;
    console.log("levelIdTopOfFloodUrl:", levelIdTopOfFloodUrl);

    const levelIdBottomOfConservationUrl = `${setBaseUrl}levels/${levelIdBottomOfConservation}?office=${office}&effective-date=${isoDateToday}&unit=ac-ft`;
    console.log("levelIdBottomOfConservationUrl:", levelIdBottomOfConservationUrl);

    const levelIdBottomOfFloodUrl = `${setBaseUrl}levels/${levelIdBottomOfFlood}?office=${office}&effective-date=${isoDateToday}&unit=ac-ft`;
    console.log("levelIdBottomOfFloodUrl:", levelIdBottomOfFloodUrl);

    const fetchTimeSeriesData = async (tsid) => {
        const beginDate = lookback !== null ? lookback : isoDateMinus1Day;
        const tsidData = `${setBaseUrl}timeseries?page-size=1000000&name=${tsid}&begin=${beginDate}&end=${isoDateDay1}&office=${office}`;
        console.log('tsidData:', tsidData);
        try {
            const response = await fetch(tsidData, {
                headers: {
                    "Accept": "application/json;version=2",
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
            const response1 = await fetch(levelIdTopOfConservationUrl);
            const response2 = await fetch(levelIdTopOfFloodUrl);
            const response3 = await fetch(levelIdBottomOfConservationUrl);
            const response4 = await fetch(levelIdBottomOfFloodUrl);
            const response5 = await fetch(urlTsidStage);
            const response6 = await fetch(urlTsidStorage);

            const topOfConservationData = await response1.json();
            const topOfFloodData = await response2.json();
            const bottomOfConservationData = await response3.json();
            const bottomOfFloodData = await response4.json();
            const tsidStageData = await response5.json();
            const tsidStorageData = await response6.json();

            console.log("topOfConservationData:", topOfConservationData);
            console.log("topOfFloodData:", topOfFloodData);
            console.log("bottomOfConservationData:", bottomOfConservationData);
            console.log("bottomOfFloodData:", bottomOfFloodData);
            console.log("tsidStageData:", tsidStageData);
            console.log("tsidStorageData:", tsidStorageData);

            const tsidStage = tsidStageData['assigned-time-series'][0]['timeseries-id'];
            const tsidStorage = tsidStorageData['assigned-time-series'][0]['timeseries-id'];

            console.log("tsidStage:", tsidStage);
            console.log("tsidStorage:", tsidStorage);

            const timeSeriesData1 = await fetchTimeSeriesData(tsidStage);
            const timeSeriesData2 = await fetchTimeSeriesData(tsidStorage);

            console.log("timeSeriesData1:", timeSeriesData1);
            console.log("timeSeriesData2:", timeSeriesData2);

            const hourlyStageData = getSpecificTimesData(timeSeriesData1, tsidStage);
            const hourlyStorageData = getSpecificTimesData(timeSeriesData2, tsidStorage);

            console.log("hourlyStageData:", hourlyStageData);
            console.log("hourlyStorageData:", hourlyStorageData);

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
                cdaSaveBtn = document.getElementById("cda-btn-pool"); // Get the button by its ID

                cdaSaveBtn.disabled = true; // Disable button while checking login state

                // Update button text based on login status
                if (await isLoggedIn()) {
                    cdaSaveBtn.innerText = "Save";
                } else {
                    cdaSaveBtn.innerText = "Login";
                }

                cdaSaveBtn.disabled = false; // Re-enable button
            }

            let formattedStageData = hourlyStageData.map(entry => {
                const formattedTimestamp = formatISODate2ReadableDate(Number(entry.timestamp)); // Ensure timestamp is a number
                return {
                    ...entry,
                    formattedTimestamp
                };
            });

            let formattedStorageData = hourlyStorageData.map(entry => {
                const formattedTimestamp = formatISODate2ReadableDate(Number(entry.timestamp)); // Ensure timestamp is a number
                return {
                    ...entry,
                    formattedTimestamp
                };
            });

            console.log("formattedStageData:", formattedStageData);
            console.log("formattedStorageData:", formattedStorageData);

            if (formattedStageData.length > 0) {
                createTable(formattedStageData, formattedStorageData, topOfConservationData, topOfFloodData, bottomOfConservationData, bottomOfFloodData, tsidStage, tsidStorage);

                loadingIndicator.style.display = 'none';

                loginStateController()
                setInterval(async () => {
                    loginStateController()
                }, 10000);
            }

            function createTable(formattedStageData, formattedStorageData, topOfConservationData, topOfFloodData, bottomOfConservationData, bottomOfFloodData, tsidStage, tsidStorage) {
                // Create the table element
                const table = document.createElement("table");

                // Apply the ID "inflow" to the table
                table.id = "inflow";

                // Create the table header row
                const headerRow = document.createElement("tr");

                const stationHeader = document.createElement("th");
                stationHeader.textContent = "Station";
                headerRow.appendChild(stationHeader);

                const parameterHeader = document.createElement("th");
                parameterHeader.textContent = "Parameter";
                headerRow.appendChild(parameterHeader);

                const hrs06Header = document.createElement("th");
                hrs06Header.textContent = "06:00 hrs";
                headerRow.appendChild(hrs06Header);

                const hrs12Header = document.createElement("th");
                hrs12Header.textContent = "12:00 hrs";
                headerRow.appendChild(hrs12Header);

                const hrs18Header = document.createElement("th");
                hrs18Header.textContent = "18:00 hrs";
                headerRow.appendChild(hrs18Header);

                const hrs24Header = document.createElement("th");
                hrs24Header.textContent = "24:00 hrs";
                headerRow.appendChild(hrs24Header);

                const hrs06TodayHeader = document.createElement("th");
                hrs06TodayHeader.textContent = "06:00 hrs today";
                headerRow.appendChild(hrs06TodayHeader);

                const deltaHeader = document.createElement("th");
                deltaHeader.textContent = "24 hours change";
                headerRow.appendChild(deltaHeader);

                table.appendChild(headerRow);

                // Clear existing content and append the table
                const output2Div = document.getElementById("output2");
                output2Div.innerHTML = "";
                output2Div.appendChild(table);

                // Create the data row (was incorrectly using a <td> instead of <tr>)
                const row = document.createElement("tr");

                const stationRow = document.createElement("td");
                stationRow.textContent = (formattedStageData[0]['tsid']).split("-")[0];
                row.appendChild(stationRow);

                const parameterRow = document.createElement("td");
                parameterRow.textContent = (formattedStageData[0]['tsid']).split(".")[1];
                row.appendChild(parameterRow);

                const hrs06Row = document.createElement("td");
                hrs06Row.textContent = (formattedStageData[1]['value']).toFixed(2);
                row.appendChild(hrs06Row);

                const hrs12Row = document.createElement("td");
                hrs12Row.textContent = (formattedStageData[2]['value']).toFixed(2);
                row.appendChild(hrs12Row);

                const hrs18Row = document.createElement("td");
                hrs18Row.textContent = (formattedStageData[3]['value']).toFixed(2);
                row.appendChild(hrs18Row);

                const hrs24Row = document.createElement("td");
                const hrs24Value = formattedStageData?.[4]?.value;
                const input = document.createElement("input");
                input.type = "text";
                input.id = "hrs24Input"; // Unique ID for hrs24
                input.style.textAlign = "center"; // Center the text
                input.value = (hrs24Value == null || isNaN(hrs24Value))
                    ? "N/A"
                    : parseFloat(hrs24Value).toFixed(2);

                hrs24Row.appendChild(input);
                row.appendChild(hrs24Row);

                const hrs06TodayRow = document.createElement("td");
                hrs06TodayRow.textContent = (formattedStageData[5]['value']).toFixed(2);
                row.appendChild(hrs06TodayRow);

                const deltaRow = document.createElement("td");
                deltaRow.textContent = ((formattedStageData[5]['value']) - (formattedStageData[1]['value'])).toFixed(2);
                row.appendChild(deltaRow);

                // Append the data row to the table
                table.appendChild(row);

                // Create the data row (was incorrectly using a <td> instead of <tr>)
                const row2 = document.createElement("tr");

                const stationRow2 = document.createElement("td");
                stationRow2.textContent = "";
                row2.appendChild(stationRow2);

                const parameterRow2 = document.createElement("td");
                parameterRow2.textContent = (formattedStorageData[0]['tsid']).split(".")[1];
                row2.appendChild(parameterRow2);

                const hrs06Row2 = document.createElement("td");
                hrs06Row2.textContent = (formattedStorageData[1]['value']).toFixed(0);
                row2.appendChild(hrs06Row2);

                const hrs12Row2 = document.createElement("td");
                hrs12Row2.textContent = (formattedStorageData[2]['value']).toFixed(0);
                row2.appendChild(hrs12Row2);

                const hrs18Row2 = document.createElement("td");
                hrs18Row2.textContent = (formattedStorageData[3]['value']).toFixed(0);
                row2.appendChild(hrs18Row2);

                const hrs24Row2 = document.createElement("td");
                hrs24Row2.textContent = (formattedStorageData[4]['value']).toFixed(0);
                row2.appendChild(hrs24Row2);

                const hrs06TodayRow2 = document.createElement("td");
                hrs06TodayRow2.textContent = (formattedStorageData[5]['value']).toFixed(0);
                row2.appendChild(hrs06TodayRow2);

                const deltaRow2 = document.createElement("td");
                deltaRow2.textContent = ((formattedStorageData[5]['value']) - (formattedStorageData[1]['value'])).toFixed(0);
                row2.appendChild(deltaRow2);

                // Append the data row to the table
                table.appendChild(row2);

                // Save Button
                const cdaSaveBtn = document.createElement("button");
                cdaSaveBtn.textContent = "Submit";
                cdaSaveBtn.id = "cda-btn-pool";
                cdaSaveBtn.disabled = true;
                output2Div.appendChild(cdaSaveBtn);

                // Status Button
                const statusDiv = document.createElement("div");
                statusDiv.className = "status-pool";
                output2Div.appendChild(statusDiv);

                // Refresh Button
                const buttonRefresh = document.createElement('button');
                buttonRefresh.textContent = 'Refresh';
                buttonRefresh.id = 'refresh-inflow-button';
                buttonRefresh.className = 'fetch-btn';
                output2Div.appendChild(buttonRefresh);

                const buttonEstimatedValue = document.createElement('div');
                buttonEstimatedValue.id = 'utilization-value';
                buttonEstimatedValue.style.backgroundColor = '#ffffff';
                buttonEstimatedValue.style.padding = '8px';
                buttonEstimatedValue.style.marginTop = '10px';
                buttonEstimatedValue.style.width = '100%';

                // Create first span (e.g., icon or label)
                const iconSpan = document.createElement('span');
                iconSpan.id = 'conservation-span';
                const midnightStorageValue = (formattedStorageData[4]['value']).toFixed(0);
                console.log("midnightStorageValue:", midnightStorageValue);

                const topOfConservationValue = topOfConservationData['constant-value'];
                console.log("topOfConservationValue:", topOfConservationValue);

                const topOfFloodValue = topOfFloodData['constant-value'];
                console.log("topOfFloodValue:", topOfFloodValue);

                const bottomOfConservationValue = bottomOfConservationData['constant-value'];
                console.log("bottomOfConservationValue:", bottomOfConservationValue);

                const bottomOfFloodValue = bottomOfFloodData['constant-value'];
                console.log("bottomOfFloodValue:", bottomOfFloodValue);

                let conservationUtilization = "--";
                let floodUtilization = "--";
                if (midnightStorageValue > topOfConservationValue) {
                    conservationUtilization = "100%";
                } else {
                    conservationUtilization = (((midnightStorageValue - bottomOfConservationValue) / (topOfConservationValue - bottomOfConservationValue)) * 100).toFixed(2) + "%";
                }

                if (midnightStorageValue > topOfConservationValue && midnightStorageValue < topOfFloodValue) {
                    floodUtilization = (((midnightStorageValue - bottomOfFloodValue) / (topOfFloodValue - bottomOfFloodValue)) * 100).toFixed(2) + "%";
                } else {
                    floodUtilization = "--";
                }

                iconSpan.innerHTML = `Conservation Pool Utilization = <b>${conservationUtilization}</b>`;
                iconSpan.style.paddingRight = '12px';

                // Create second span (e.g., description)
                const textSpan = document.createElement('span');
                textSpan.id = 'flood-span';
                textSpan.innerHTML = `Flood Pool Utilization = <b>${floodUtilization}</b>`;

                // Append both spans to the div
                buttonEstimatedValue.appendChild(iconSpan);
                buttonEstimatedValue.appendChild(textSpan);

                // Append the final div to your container
                output2Div.appendChild(buttonEstimatedValue);

                buttonRefresh.addEventListener('click', () => {
                    // Remove existing table
                    const existingTable = document.getElementById('inflow');
                    if (existingTable) {
                        existingTable.remove();
                    }

                    // Remove existing save button
                    const existingButton = document.getElementById('cda-btn-pool');
                    if (existingButton) {
                        existingButton.remove();
                    }

                    // Remove existing spans
                    const existingConservationSpan = document.getElementById('conservation-span');
                    if (existingConservationSpan) {
                        existingConservationSpan.remove();
                    }

                    const existingFloodSpan = document.getElementById('flood-span');
                    if (existingFloodSpan) {
                        existingFloodSpan.remove();
                    }

                    // Fetch and create new table
                    fetchTsidData();
                });

                cdaSaveBtn.addEventListener("click", async () => {
                    const values = [];

                    // No data, only today's input (single row scenario)
                    const midnightInput = document.getElementById(`hrs24Input`).value;
                    let midnightValue = midnightInput ? parseFloat(parseFloat(midnightInput).toFixed(2)) : 909;
                    const timestampUnix = formattedStageData?.[4]?.timestamp;

                    values.push([timestampUnix, midnightValue, 0]);
                    console.log("values:", values);


                    const payload = {
                        "name": formattedStageData?.[4]?.tsid,
                        "office-id": "MVS",
                        "units": "ft",
                        "values": values
                    };

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
                            await createTS(payload);
                            statusDiv.innerText = "Write successful!";

                            // Optional: small delay to allow backend to process the new data
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const existingTable = document.getElementById('inflow');
                            if (existingTable) {
                                existingTable.remove();
                            }

                            // Remove existing save button
                            const existingButton = document.getElementById('cda-btn-pool');
                            if (existingButton) {
                                existingButton.remove();
                            }

                            // Remove existing spans
                            const existingConservationSpan = document.getElementById('conservation-span');
                            if (existingConservationSpan) {
                                existingConservationSpan.remove();
                            }

                            const existingFloodSpan = document.getElementById('flood-span');
                            if (existingFloodSpan) {
                                existingFloodSpan.remove();
                            }

                            // Fetch and create new table
                            fetchTsidData();
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

    function getSpecificTimesData(data, tsid) {
        const specificTimesData = [];
        const validHours = [0, 6, 12, 18]; // Local CST/CDT hours we care about

        data.values.forEach(entry => {
            const [timestamp, value, qualityCode] = entry;

            let date;
            if (typeof timestamp === "string") {
                date = new Date(timestamp.replace(/-/g, '/'));
            } else if (typeof timestamp === "number") {
                date = new Date(timestamp);
            } else {
                console.warn("Unrecognized timestamp format:", timestamp);
                return;
            }

            if (isNaN(date.getTime())) {
                console.warn("Invalid date:", timestamp);
                return;
            }

            // Convert to Central Time and extract components
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: 'America/Chicago',
                hour12: false,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            const parts = formatter.formatToParts(date).reduce((acc, part) => {
                acc[part.type] = part.value;
                return acc;
            }, {});

            const localHour = parseInt(parts.hour, 10);
            const localMinute = parseInt(parts.minute, 10);
            const localSecond = parseInt(parts.second, 10);

            if (validHours.includes(localHour) && localMinute === 0 && localSecond === 0) {
                // Reconstruct ISO 8601 timestamp with offset
                const localDate = new Date(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`);
                const offsetMinutes = -localDate.getTimezoneOffset(); // in minutes
                const offsetHours = Math.floor(offsetMinutes / 60);
                const offsetMins = Math.abs(offsetMinutes % 60);
                const offsetSign = offsetHours >= 0 ? '+' : '-';
                const pad = n => n.toString().padStart(2, '0');
                const timezoneOffset = `${offsetSign}${pad(Math.abs(offsetHours))}:${pad(offsetMins)}`;

                const timestampCst = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}${timezoneOffset}`;

                specificTimesData.push({
                    timestamp,
                    value,
                    qualityCode,
                    tsid,
                    timestampCst
                });
            }
        });

        return specificTimesData;
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