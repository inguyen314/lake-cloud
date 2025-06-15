document.addEventListener('DOMContentLoaded', async function () {
    console.log('datetime: ', datetime);

    const loading5 = document.getElementById('loading5');
        loading5.style.display = 'block';

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

    let urlTsidStorage = null;
    let urlTsidAverageOutflow = null;
    let urlTsidConsensus = null;
    let urlTsidComputedInflow = null;

    urlTsidStorage = `${setBaseUrl}timeseries/group/Storage?office=${office}&category-id=${lake}`;
    if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
        urlTsidAverageOutflow = `${setBaseUrl}timeseries/group/Outflow-Generation-Release-Lake-Test?office=${office}&category-id=${lake}`;
    } else {
        urlTsidAverageOutflow = `${setBaseUrl}timeseries/group/Outflow-Average-Lake-Test?office=${office}&category-id=${lake}`;
    }
    urlTsidConsensus = `${setBaseUrl}timeseries/group/Consensus-Test?office=${office}&category-id=${lake}`;
    urlTsidComputedInflow = `${setBaseUrl}timeseries/group/Computed-Inflow?office=${office}&category-id=${lake}`;

    const levelId = `${lake}.Evap.Inst.0.Evaporation`;
    console.log("levelId:", levelId);

    const levelIdUrl = `${setBaseUrl}levels/${levelId}?office=MVS&effective-date=${isoDateToday}&unit=ft`;
    console.log("levelIdUrl:", levelIdUrl);

    const fetchTimeSeriesData = async (tsid) => {
        const beginDate = lookback !== null ? lookback : isoDateMinus6Days;
        const tsidData = `${setBaseUrl}timeseries?page-size=1000000&name=${tsid}&begin=${beginDate}&end=${isoDateToday}&office=${office}`;
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
            const response1 = await fetch(urlTsidStorage);
            const response2 = await fetch(urlTsidAverageOutflow);
            const response3 = await fetch(levelIdUrl);
            const response4 = await fetch(urlTsidConsensus);
            const response5 = await fetch(urlTsidComputedInflow);

            const tsidStorageData = await response1.json();
            const tsidAverageOutflowData = await response2.json();
            const tsidEvapLevelData = await response3.json();
            const tsidConsensusData = await response4.json();
            const tsidComputedInflowData = await response5.json();

            console.log("tsidEvapLevelData:", tsidEvapLevelData);

            const tsidStorage = tsidStorageData['assigned-time-series'][0]['timeseries-id'];
            const tsidAverageOutflow = tsidAverageOutflowData['assigned-time-series'][0]['timeseries-id'];
            const tsidEvaporation = tsidEvapLevelData['location-level-id'];
            const tsidConsensus = tsidConsensusData['assigned-time-series'][0]['timeseries-id'];
            const tsidComputedInflow = tsidComputedInflowData['assigned-time-series'][0]['timeseries-id'];

            const curentMonthEvapValue = getEvapValueForMonth(tsidEvapLevelData, month);
            console.log("curentMonthEvapValue:", curentMonthEvapValue);

            console.log("tsidStorage:", tsidStorage);
            console.log("tsidAverageOutflow:", tsidAverageOutflow);
            console.log("tsidEvaporation:", tsidEvaporation);
            console.log("tsidConsensus:", tsidConsensus);
            console.log("tsidComputedInflow:", tsidComputedInflow);

            const timeSeriesData1 = await fetchTimeSeriesData(tsidStorage);
            const timeSeriesData2 = await fetchTimeSeriesData(tsidAverageOutflow);
            const timeSeriesData3 = await fetchTimeSeriesData(tsidConsensus);
            const timeSeriesData4 = await fetchTimeSeriesData(tsidComputedInflow);

            console.log("timeSeriesData1:", timeSeriesData1);
            console.log("timeSeriesData2:", timeSeriesData2);
            console.log("timeSeriesData3:", timeSeriesData3);
            console.log("timeSeriesData4:", timeSeriesData4);

            const hourlyData1 = getMidnightData(timeSeriesData1, tsidStorage);
            const hourlyData2 = getMidnightData(timeSeriesData2, tsidAverageOutflow);
            const hourlyConsensusData = getMidnightData(timeSeriesData3, tsidConsensus);
            const hourlyComputedInflowData = getMidnightData(timeSeriesData4, tsidComputedInflow);

            console.log("hourlyData1:", hourlyData1);
            console.log("hourlyData2:", hourlyData2);
            console.log("hourlyConsensusData:", hourlyConsensusData);
            console.log("hourlyComputedInflowData:", hourlyComputedInflowData);

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

            let formattedStorageData = hourlyData1.map(entry => {
                const formattedTimestamp = formatISODate2ReadableDate(Number(entry.timestamp)); // Ensure timestamp is a number
                // console.log("Original (hourlyData1):", entry.timestamp, "Formatted:", formattedTimestamp);
                return {
                    ...entry,
                    formattedTimestamp
                };
            });

            let formattedAverageOutflowData = hourlyData2.map(entry => {
                const formattedTimestamp = formatISODate2ReadableDate(Number(entry.timestamp)); // Ensure timestamp is a number
                // console.log("Original (hourlyData2):", entry.timestamp, "Formatted:", formattedTimestamp);
                return {
                    ...entry,
                    formattedTimestamp
                };
            });

            formattedStorageData = addDeltaAsDsfToData(formattedStorageData);
            formattedStorageData = shiftDeltaUp(formattedStorageData);

            console.log("formattedStorageData:", formattedStorageData);
            console.log("formattedAverageOutflowData:", formattedAverageOutflowData);

            createTable(formattedStorageData, formattedAverageOutflowData, curentMonthEvapValue, hourlyConsensusData);

            loading5.style.display = 'none';

            loginStateController()
            setInterval(async () => {
                loginStateController()
            }, 10000);

            function createTable(formattedStorageData, formattedAverageOutflowData, curentMonthEvapValue, hourlyConsensusData) {
                // Create the table element
                const table = document.createElement("table");

                // Apply the ID "inflow" to the table
                table.id = "inflow";

                // Create the table header row
                const headerRow = document.createElement("tr");

                const chgStorageHeader = document.createElement("th");
                chgStorageHeader.textContent = "Date";
                headerRow.appendChild(chgStorageHeader);

                const stageHeader = document.createElement("th");
                stageHeader.textContent = "Change Storage (dsf)";
                headerRow.appendChild(stageHeader);

                const averageOutflowHeader = document.createElement("th");
                averageOutflowHeader.textContent = "Average Outflow (dsf)";
                headerRow.appendChild(averageOutflowHeader);

                const storageOutflowEvapHeader = document.createElement("th");
                storageOutflowEvapHeader.textContent = "Inflow Storage w/ Evap (dsf)";
                headerRow.appendChild(storageOutflowEvapHeader);

                const consensusHeader = document.createElement("th");
                consensusHeader.textContent = "Consensus (dsf)";
                headerRow.appendChild(consensusHeader);

                const balanceFlagHeader = document.createElement("th");
                balanceFlagHeader.textContent = "Balance Flag";
                headerRow.appendChild(balanceFlagHeader);

                table.appendChild(headerRow);

                if (formattedAverageOutflowData.length <= 6) {
                    const messageRow = document.createElement("tr");
                    const messageCell = document.createElement("td");
                    messageCell.colSpan = 6; // adjust depending on how many columns your table has
                    messageCell.style.textAlign = "center";
                    messageCell.style.padding = "10px";
                    messageCell.style.fontWeight = "bold";
                    messageCell.style.color = "red";
                    if (lake === "Mark Twain Lk-Salt") {
                        messageCell.textContent = `Please complete both the "Gate Settings" and "Generation and Release" widgets, then click the refresh button.`;
                    } else {
                        messageCell.textContent = `Please complete the "Gate Settings" widget, then click the refresh button.`;
                    }

                    messageRow.appendChild(messageCell);
                    table.appendChild(messageRow);
                } else {
                    let i = 0;
                    let j = 0;

                    while (i < formattedStorageData.length - 1 && j < formattedAverageOutflowData.length - 1) {
                        if (formattedStorageData[i].formattedTimestamp === formattedAverageOutflowData[j].formattedTimestamp) {
                            const row = document.createElement("tr");

                            // Date Time
                            const dateCell = document.createElement("td");
                            dateCell.textContent = formattedStorageData[i].formattedTimestamp.split(' ')[0]; // Display formattedTimestamp as Date
                            row.appendChild(dateCell);

                            // Change in Storage
                            const chgStorageCell = document.createElement("td");
                            const delta = formattedStorageData[i].delta;

                            if (delta == null) {
                                chgStorageCell.textContent = '—'; // or 'N/A'
                            } else {
                                // Round to 2 decimal places first, then to whole number
                                const roundedToTwo = Math.round(delta * 100) / 100;
                                const deltaFinalRounded = Math.round(roundedToTwo);

                                // Add sign accordingly
                                chgStorageCell.textContent =
                                    deltaFinalRounded > 0 ? `+${deltaFinalRounded}` :
                                        deltaFinalRounded < 0 ? `${deltaFinalRounded}` : '0';
                            }

                            row.appendChild(chgStorageCell);

                            // Average Outflow
                            const averageOutflowCell = document.createElement("td");
                            if (formattedAverageOutflowData[j].value !== null && formattedAverageOutflowData[j].value !== undefined) {
                                averageOutflowCell.textContent = formattedAverageOutflowData[j].value.toFixed(0);
                            } else {
                                // Handle the case where the value is null or undefined
                                averageOutflowCell.textContent = 'N/A'; // Or any default value you'd prefer
                            }

                            row.appendChild(averageOutflowCell);

                            // Storage + Average Outflow + Evaporation
                            const datePart = formattedStorageData[i].formattedTimestamp.split(' ')[0]; // "04-30-2025"
                            const currentMonth = datePart.split('-')[0]; // "04"

                            // You can now use `currentMonth` inside your loop
                            // console.log("currentMonth: ", currentMonth);

                            const curentDayEvapValue = getEvapValueForMonth(tsidEvapLevelData, currentMonth);
                            // console.log("curentDayEvapValue:", curentDayEvapValue);

                            const val = Math.round((parseFloat(formattedAverageOutflowData[j]?.value)) / 10) * 10;
                            const deltaVal = Math.round(Math.round(delta * 100) / 100);
                            const evapVal = Math.round(parseFloat(curentDayEvapValue));
                            console.log("Storage + Average Outflow + Evaporation: ", deltaVal, val, evapVal, " = ", (deltaVal + val + evapVal));
                            let storageOutflowEvapCell = document.createElement("td");
                            let total = null;

                            // Check if any of the values are NaN (which means they were null, undefined, or not numeric)
                            if (isNaN(val) || isNaN(deltaVal) || isNaN(evapVal)) {
                                storageOutflowEvapCell.textContent = 'N/A';
                                storageOutflowEvapCell.type = "text";
                                storageOutflowEvapCell.value = 'N/A';
                                storageOutflowEvapCell.title = ''; // Clear title when not applicable
                            } else {
                                total = (val + deltaVal + evapVal).toFixed(0);
                                storageOutflowEvapCell.textContent = total;
                                storageOutflowEvapCell.type = "number";
                                storageOutflowEvapCell.value = total;
                                storageOutflowEvapCell.title = `Val: ${val}, ΔVal: ${deltaVal}, Evap: ${evapVal}`;
                            }

                            storageOutflowEvapCell.id = `storage-outflow-evap-${formattedStorageData[i].formattedTimestamp}`;
                            row.appendChild(storageOutflowEvapCell);

                            // Consensus
                            const consensusCell = document.createElement("td");
                            consensusCell.style.textAlign = "center"; // Horizontally center the cell content
                            consensusCell.style.verticalAlign = "middle"; // Vertically center the content

                            const input = document.createElement("input");
                            input.type = "number";

                            const consensusEntry = hourlyConsensusData[i];
                            const isMissingValue = !consensusEntry || consensusEntry.value == null;

                            const consensusValue = isMissingValue ? Math.round(total / 10) * 10 : consensusEntry.value;
                            input.value = Number(consensusValue).toFixed(0);

                            // Set background color to pink if original value was null/undefined
                            if (isMissingValue) {
                                input.style.backgroundColor = '#e6ccff';
                            }

                            input.style.width = "60px";
                            input.style.textAlign = "center"; // Horizontally center text inside the input

                            input.id = `consensus-${formattedStorageData[i].formattedTimestamp}`;
                            consensusCell.appendChild(input);
                            row.appendChild(consensusCell);

                            // Quality Code
                            const qualityCodeCell = document.createElement("td");
                            qualityCodeCell.style.textAlign = "center"; // Horizontally center the cell content
                            qualityCodeCell.style.verticalAlign = "middle"; // Vertically center the content

                            const qualityInput = document.createElement("input");
                            qualityInput.type = "text";
                            qualityInput.value = consensusEntry && consensusEntry.qualityCode != null ? consensusEntry.qualityCode : '';

                            qualityInput.style.width = "60px";
                            qualityInput.style.textAlign = "center"; // Center text inside input
                            qualityInput.id = `quality-code-${formattedStorageData[i].formattedTimestamp}`;

                            qualityCodeCell.appendChild(qualityInput);
                            row.appendChild(qualityCodeCell);

                            table.appendChild(row);

                            // Move to next entry in both datasets
                            i++;
                            j++;
                        } else if (formattedStorageData[i].formattedTimestamp < formattedAverageOutflowData[j].formattedTimestamp) {
                            // If the timestamp in formattedStorageData is earlier, just move to the next entry in formattedStorageData
                            i++;
                        } else {
                            // If the timestamp in formattedAverageOutflowData is earlier, just move to the next entry in formattedAverageOutflowData
                            j++;
                        }
                    }
                }

                // Append the table to the specific container
                const output5Div = document.getElementById("output5");
                output5Div.innerHTML = "";
                output5Div.appendChild(table);

                // Save Button
                const cdaSaveBtn = document.createElement("button");
                cdaSaveBtn.textContent = "Submit";
                cdaSaveBtn.id = "cda-btn-inflow";
                cdaSaveBtn.disabled = true;
                output5Div.appendChild(cdaSaveBtn);

                // Status Button
                const statusDiv = document.createElement("div");
                statusDiv.className = "status-inflow";
                output5Div.appendChild(statusDiv);

                // Estimated Value Div
                const buttonEstimatedValue = document.createElement('div');
                buttonEstimatedValue.textContent = 'Signifies estimated value';
                buttonEstimatedValue.id = 'estimated-value';
                buttonEstimatedValue.style.backgroundColor = '#e6ccff';
                output5Div.appendChild(buttonEstimatedValue);

                // Refresh Button
                const buttonRefresh = document.createElement('button');
                buttonRefresh.textContent = 'Refresh';
                buttonRefresh.id = 'refresh-inflow-button';
                buttonRefresh.className = 'fetch-btn';
                output5Div.appendChild(buttonRefresh);

                buttonRefresh.addEventListener('click', () => {
                    // Remove existing table
                    const existingTable = document.getElementById('inflow');
                    if (existingTable) {
                        existingTable.remove();
                    }

                    // Remove existing save button
                    const existingButton = document.getElementById('cda-btn-inflow');
                    if (existingButton) {
                        existingButton.remove();
                    }

                    const estimatedValueRefresh = document.getElementById('estimated-value');
                    if (estimatedValueRefresh) {
                        estimatedValueRefresh.remove();
                    }

                    // Fetch and create new table
                    fetchTsidData();
                });

                cdaSaveBtn.addEventListener("click", async () => {
                    const payloadStorageOutflowEvap = {
                        "name": tsidComputedInflow,
                        "office-id": "MVS",
                        "units": "cfs",
                        "values": formattedStorageData.map(entry => {
                            const timestamp = entry.formattedTimestamp;
                            const outflowInput = document.getElementById(`storage-outflow-evap-${timestamp}`);

                            if (!outflowInput) {
                                console.warn(`Missing input for timestamp: ${timestamp}`);
                                return null; // Or handle this more gracefully
                            }

                            const outflowValue = outflowInput.value;

                            const timestampUnix = new Date(timestamp).getTime();

                            return [
                                timestampUnix,
                                parseFloat(outflowValue),
                                0
                            ];
                        }).filter(Boolean) // remove any null entries
                    };
                    console.log("payloadStorageOutflowEvap:", payloadStorageOutflowEvap);

                    const payloadConsensus = {
                        "name": tsidConsensus,
                        "office-id": "MVS",
                        "units": "cfs",
                        "values": formattedStorageData.map(entry => {
                            const timestamp = entry.formattedTimestamp;
                            const outflowInput = document.getElementById(`consensus-${timestamp}`);
                            const qualityInput = document.getElementById(`quality-code-${timestamp}`);

                            if (!outflowInput || !qualityInput) {
                                console.warn(`Missing input for timestamp: ${timestamp}`);
                                return null; // Or handle this more gracefully
                            }

                            const outflowValue = outflowInput.value;
                            const qualityCodeValue = qualityInput.value;

                            const timestampUnix = new Date(timestamp).getTime();

                            return [
                                timestampUnix,
                                parseFloat(outflowValue),
                                parseFloat(qualityCodeValue)
                            ];
                        }).filter(Boolean) // remove any null entries
                    };
                    console.log("payloadConsensus:", payloadConsensus);

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

                    async function fetchUpdatedData(isoDateMinus6Days, isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidConsensus) {
                        let response = null;
                        const beginDate = lookback !== null ? lookback : isoDateMinus6Days;
                        response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?name=${tsidConsensus}&begin=${beginDate}&end=${isoDateToday}&office=MVS`, {
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
                            await createTS(payloadConsensus);
                            await createTS(payloadStorageOutflowEvap);
                            statusDiv.innerText = "Write successful!";

                            // Optional: small delay to allow backend to process the new data
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            // // Fetch updated data and refresh the table
                            const updatedData = await fetchUpdatedData(isoDateMinus6Days, isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidConsensus);
                            const hourlyConsensusData = getMidnightData(updatedData, tsidConsensus);
                            createTable(formattedStorageData, formattedAverageOutflowData, curentMonthEvapValue, hourlyConsensusData);
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
        // console.log("offset: ", offset)

        const matchingValue = data[`seasonal-values`].find(
            (entry) => entry[`offset-months`] === offset
        );
        // console.log("matchingValue: ", matchingValue)

        return matchingValue ? matchingValue.value : null;
    }
});

// Lk Shelbyville-Kaskaskia
// tsidStorage: Lk Shelbyville-Kaskaskia.Stor.Inst.30Minutes.0.RatingCOE (Storage)
// tsidAverageOutflow: Lk Shelbyville-Kaskaskia.Flow-Out.Ave.~1Day.1Day.lakerep-rev-test (Outflow-Average-Lake-Test)
// tsidEvaporation: Lk Shelbyville-Kaskaskia.Evap.Inst.0.Evaporation
// tsidConsensus: Lk Shelbyville-Kaskaskia.Flow-In.Ave.~1Day.1Day.lakerep-rev-test (Consensus-Test)
// tsidComputedInflow: Lk Shelbyville-Kaskaskia.Flow-Out.Ave.~1Day.1Day.lakerep-rev-computed (Computed-Inflow)

//*******************************************************************************************************************************/

// Rend Lk-Big Muddy
// tsidStorage: Rend Lk-Big Muddy.Stor.Inst.30Minutes.0.RatingCOE (Storage)
// tsidAverageOutflow: Rend Lk-Big Muddy.Flow-Out.Ave.~1Day.1Day.lakerep-rev-test (Outflow-Average-Lake-Test)
// tsidEvaporation: Rend Lk-Big Muddy.Evap.Inst.0.Evaporation
// tsidConsensus: Rend Lk-Big Muddy.Flow-In.Ave.~1Day.1Day.lakerep-rev-test (Consensus-Test)
// tsidComputedInflow: Rend Lk-Big Muddy.Flow-Out.Ave.~1Day.1Day.lakerep-rev-computed (Computed-Inflow)

//*******************************************************************************************************************************/

// Mark Twain Lk-Salt
// tsidStorage: Mark Twain Lk-Salt.Stor.Inst.30Minutes.0.RatingCOE (Storage)
// tsidAverageOutflow: Mark Twain Lk-Salt.Flow.Ave.~1Day.1Day.lakerep-rev-test (Outflow-Average-Lake-Test)
// tsidEvaporation: Mark Twain Lk-Salt.Evap.Inst.0.Evaporation
// tsidConsensus: Mark Twain Lk-Salt.Flow-In.Ave.~1Day.1Day.lakerep-rev-test (Consensus-Test)
// tsidComputedInflow: Mark Twain Lk-Salt.Flow-Out.Ave.~1Day.1Day.lakerep-rev-computed (Computed-Inflow)

//*******************************************************************************************************************************/

// Carlyle Lk-Kaskaskia
// tsidStorage: Carlyle Lk-Kaskaskia.Stor.Inst.30Minutes.0.RatingCOE (Storage)
// tsidAverageOutflow: Carlyle Lk-Kaskaskia.Flow-Out.Ave.~1Day.1Day.lakerep-rev-test (Outflow-Average-Lake-Test)
// tsidEvaporation: Carlyle Lk-Kaskaskia.Evap.Inst.0.Evaporation
// tsidConsensus: Carlyle Lk-Kaskaskia.Flow-In.Ave.~1Day.1Day.lakerep-rev-test (Consensus-Test)
// tsidComputedInflow: Carlyle Lk-Kaskaskia.Flow-Out.Ave.~1Day.1Day.lakerep-rev-computed (Computed-Inflow)

//*******************************************************************************************************************************/

// Wappapello Lk-St Francis
// tsidStorage: Wappapello Lk-St Francis.Stor.Inst.30Minutes.0.RatingCOE (Storage)
// tsidAverageOutflow: Wappapello Lk-St Francis.Flow-Out.Ave.~1Day.1Day.lakerep-rev-test (Outflow-Average-Lake-Test)
// tsidEvaporation: Wappapello Lk-St Francis.Evap.Inst.0.Evaporation
// tsidConsensus: Wappapello Lk-St Francis.Flow-In.Ave.~1Day.1Day.lakerep-rev-test (Consensus-Test)
// tsidComputedInflow: Wappapello Lk-St Francis.Flow-Out.Ave.~1Day.1Day.lakerep-rev-computed (Computed-Inflow)


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
//               p_cwms_ts_id => 'Mark Twain Lk-Salt.Flow-In.Ave.~1Day.1Day.lakerep-rev-test',
//               p_units => 'cfs',
//               p_timeseries_data => l_svt,
//               p_store_rule => CWMS_20.Cwms_Util.Replace_All,
//               p_override_prot => CWMS_20.Cwms_Util.False_Num,
//               p_versiondate => CWMS_20.Cwms_Util.Non_Versioned
//               );
//         commit;
// end;

// SELECT *
//     FROM(
//         SELECT *
//         FROM wm_mvs_lake.carlyle_q
//     ORDER BY date_time DESC
//     FETCH FIRST 150 ROWS ONLY
//     )
// ORDER BY date_time ASC;

// 1	5	WAPPAPELLO
// 2	8	WAPPAPELLO
// 3	14	WAPPAPELLO
// 4	32	WAPPAPELLO
// 5	51	WAPPAPELLO
// 6	57	WAPPAPELLO
// 7	53	WAPPAPELLO
// 8	51	WAPPAPELLO
// 9	41	WAPPAPELLO
// 10	25	WAPPAPELLO
// 11	10	WAPPAPELLO
// 12	8	WAPPAPELLO
// 2	37	REND
// 3	59	REND
// 4	89	REND
// 5	110	REND
// 6	136	REND
// 7	141	REND
// 8	125	REND
// 9	103	REND
// 10	73	REND
// 11	48	REND
// 12	24	REND
// 1	17	REND
// 1	19	MT
// 2	36	MT
// 3	62	MT
// 4	101	MT
// 5	116	MT
// 6	140	MT
// 7	151	MT
// 8	132	MT
// 9	110	MT
// 10	71	MT
// 11	49	MT
// 12	27	MT
// 1	20	CARLYLE
// 2	27	CARLYLE
// 3	68	CARLYLE
// 4	115	CARLYLE
// 5	159	CARLYLE
// 6	186	CARLYLE
// 7	195	CARLYLE
// 8	171	CARLYLE
// 9	144	CARLYLE
// 10	92	CARLYLE
// 11	59	CARLYLE
// 12	29	CARLYLE
// 1	9	SHELBYVILLE
// 2	12	SHELBYVILLE
// 3	28	SHELBYVILLE
// 4	52	SHELBYVILLE
// 5	75	SHELBYVILLE
// 6	88	SHELBYVILLE
// 7	90	SHELBYVILLE
// 8	80	SHELBYVILLE
// 9	68	SHELBYVILLE
// 10	39	SHELBYVILLE
// 11	25	SHELBYVILLE
// 12	15	SHELBYVILLE