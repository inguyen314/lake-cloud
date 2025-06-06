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
    const isoDateMinus27Days = getIsoDateWithOffsetDynamic(year, month, day, -27);
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

    console.log("isoDateMinus27Days:", isoDateMinus27Days);
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

    const levelIdNgvd29 = `${lake}.Height.Inst.0.NGVD29`;
    console.log("levelIdNgvd29:", levelIdNgvd29);

    const levelIdTopOfConservationUrl = `${setBaseUrl}levels/${levelIdTopOfConservation}?office=${office}&effective-date=${isoDateToday}&unit=ac-ft`;
    console.log("levelIdTopOfConservationUrl:", levelIdTopOfConservationUrl);

    const levelIdTopOfFloodUrl = `${setBaseUrl}levels/${levelIdTopOfFlood}?office=${office}&effective-date=${isoDateToday}&unit=ac-ft`;
    console.log("levelIdTopOfFloodUrl:", levelIdTopOfFloodUrl);

    const levelIdBottomOfConservationUrl = `${setBaseUrl}levels/${levelIdBottomOfConservation}?office=${office}&effective-date=${isoDateToday}&unit=ac-ft`;
    console.log("levelIdBottomOfConservationUrl:", levelIdBottomOfConservationUrl);

    const levelIdBottomOfFloodUrl = `${setBaseUrl}levels/${levelIdBottomOfFlood}?office=${office}&effective-date=${isoDateToday}&unit=ac-ft`;
    console.log("levelIdBottomOfFloodUrl:", levelIdBottomOfFloodUrl);

    const levelIdNgvd29Url = `${setBaseUrl}levels/${levelIdNgvd29}?office=${office}&effective-date=${isoDateToday}&unit=ft`;
    console.log("levelIdNgvd29Url:", levelIdNgvd29Url);

    const metadataUrl = `${setBaseUrl}locations/${lake}?office=${office}`;
    console.log("metadataUrl:", metadataUrl);

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

    const fetchTimeSeriesData4Weeks = async (tsid) => {
        const beginDate = lookback !== null ? lookback : isoDateMinus27Days;
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
            const response7 = await fetch(levelIdNgvd29Url);
            const response8 = await fetch(metadataUrl);

            const topOfConservationData = await response1.json();
            const topOfFloodData = await response2.json();
            const bottomOfConservationData = await response3.json();
            const bottomOfFloodData = await response4.json();
            const tsidStageData = await response5.json();
            const tsidStorageData = await response6.json();
            const ngvd29Data = await response7.json();
            const metaData = await response8.json();

            console.log("topOfConservationData:", topOfConservationData);
            console.log("topOfFloodData:", topOfFloodData);
            console.log("bottomOfConservationData:", bottomOfConservationData);
            console.log("bottomOfFloodData:", bottomOfFloodData);
            console.log("tsidStageData:", tsidStageData);
            console.log("tsidStorageData:", tsidStorageData);
            console.log("ngvd29Data:", ngvd29Data);
            console.log("metaData:", metaData);

            const tsidStage = tsidStageData['assigned-time-series'][0]['timeseries-id'];
            const tsidStorage = tsidStorageData['assigned-time-series'][0]['timeseries-id'];

            console.log("tsidStage:", tsidStage);
            console.log("tsidStorage:", tsidStorage);

            const timeSeriesData1 = await fetchTimeSeriesData(tsidStage);
            const timeSeriesData4Weeks = await fetchTimeSeriesData4Weeks(tsidStage);
            const timeSeriesData2 = await fetchTimeSeriesData(tsidStorage);

            console.log("timeSeriesData1:", timeSeriesData1);
            console.log("timeSeriesData4Weeks:", timeSeriesData4Weeks);
            console.log("timeSeriesData2:", timeSeriesData2);

            const hourlyStageData = getSpecificTimesData(timeSeriesData1, tsidStage);
            const midnightData = getMidnightData(timeSeriesData4Weeks, tsidStage);
            const hourlyStorageData = getSpecificTimesData(timeSeriesData2, tsidStorage);

            console.log("hourlyStageData:", hourlyStageData);
            console.log("midnightData:", midnightData);
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
                createTable(formattedStageData, formattedStorageData, topOfConservationData, topOfFloodData, bottomOfConservationData, bottomOfFloodData, tsidStage, tsidStorage, ngvd29Data, metaData, midnightData);

                loadingIndicator.style.display = 'none';

                loginStateController()
                setInterval(async () => {
                    loginStateController()
                }, 10000);
            }

            function createTable(formattedStageData, formattedStorageData, topOfConservationData, topOfFloodData, bottomOfConservationData, bottomOfFloodData, tsidStage, tsidStorage, ngvd29Data, metaData, midnightData) {
                // Create the table element
                const columnWidth = "12.5%"; // 100% / 8 columns

                const setHeaderStyle = (header) => {
                    header.style.width = columnWidth;
                    header.style.textAlign = "center";
                };

                // Create the table
                const table = document.createElement("table");
                table.id = "pool";
                table.style.width = "100%"; // Ensure table stretches full width

                // Create the table header row
                const headerRow = document.createElement("tr");

                const stationHeader = document.createElement("th");
                stationHeader.textContent = "Station";
                setHeaderStyle(stationHeader);
                headerRow.appendChild(stationHeader);

                const parameterHeader = document.createElement("th");
                parameterHeader.textContent = "Parameter";
                setHeaderStyle(parameterHeader);
                headerRow.appendChild(parameterHeader);

                const hrs06Header = document.createElement("th");
                hrs06Header.textContent = "06:00 hrs";
                setHeaderStyle(hrs06Header);
                headerRow.appendChild(hrs06Header);

                const hrs12Header = document.createElement("th");
                hrs12Header.textContent = "12:00 hrs";
                setHeaderStyle(hrs12Header);
                headerRow.appendChild(hrs12Header);

                const hrs18Header = document.createElement("th");
                hrs18Header.textContent = "18:00 hrs";
                setHeaderStyle(hrs18Header);
                headerRow.appendChild(hrs18Header);

                const hrs24Header = document.createElement("th");
                hrs24Header.textContent = "24:00 hrs";
                setHeaderStyle(hrs24Header);
                headerRow.appendChild(hrs24Header);

                const hrs06TodayHeader = document.createElement("th");
                hrs06TodayHeader.textContent = "06:00 hrs today";
                setHeaderStyle(hrs06TodayHeader);
                headerRow.appendChild(hrs06TodayHeader);

                const deltaHeader = document.createElement("th");
                deltaHeader.textContent = "24 hours change";
                setHeaderStyle(deltaHeader);
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
                parameterRow.textContent = (formattedStageData[0]['tsid']).split(".")[1] + " (ft)";
                row.appendChild(parameterRow);

                const hrs06Row = document.createElement("td");
                hrs06Row.textContent = (formattedStageData[1]['value']).toFixed(2);
                hrs06Row.title = `06 AM Stage: ${(formattedStageData[1]['value'])} ft`; // Add a tooltip
                row.appendChild(hrs06Row);

                const hrs12Row = document.createElement("td");
                hrs12Row.textContent = (formattedStageData[2]['value']).toFixed(2);
                hrs12Row.title = `12 PM Stage: ${(formattedStageData[2]['value'])} ft`; // Add a tooltip
                row.appendChild(hrs12Row);

                const hrs18Row = document.createElement("td");
                hrs18Row.textContent = (formattedStageData[3]['value']).toFixed(2);
                hrs18Row.title = `18 PM Stage: ${(formattedStageData[3]['value'])} ft`; // Add a tooltip
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
                hrs06TodayRow.title = `06 AM Stage Today: ${(formattedStageData[5]['value'])} ft`; // Add a tooltip
                row.appendChild(hrs06TodayRow);

                const deltaRow = document.createElement("td");
                deltaRow.textContent = ((formattedStageData[4]['value']) - (formattedStageData[0]['value'])).toFixed(2);
                row.appendChild(deltaRow);

                // Append the data row to the table
                table.appendChild(row);

                const row2 = document.createElement("tr");

                const stationRow2 = document.createElement("td");
                stationRow2.textContent = "";
                row2.appendChild(stationRow2);

                const parameterRow2 = document.createElement("td");
                parameterRow2.textContent = (formattedStorageData[0]?.tsid || "").split(".")[1] + " (dsf)";
                row2.appendChild(parameterRow2);

                // Helper to format values with commas, handling nulls
                const formatValue = (v) => {
                    if (v == null || isNaN(v)) return "N/A";
                    return (v / 1.9834591996927).toLocaleString(undefined, { maximumFractionDigits: 0 });
                };

                const hrs06Row2 = document.createElement("td");
                hrs06Row2.textContent = formatValue(formattedStorageData[1]?.value);
                hrs06Row2.title = `06 AM Storage: ${(((formattedStorageData[1]?.value) / 1.9834591996927) || "N/A")} dsf`; // Add a tooltip
                row2.appendChild(hrs06Row2);

                const hrs12Row2 = document.createElement("td");
                hrs12Row2.textContent = formatValue(formattedStorageData[2]?.value);
                hrs12Row2.title = `12 PM Storage: ${(((formattedStorageData[2]?.value) / 1.9834591996927) || "N/A")} dsf`; // Add a tooltip
                row2.appendChild(hrs12Row2);

                const hrs18Row2 = document.createElement("td");
                hrs18Row2.textContent = formatValue(formattedStorageData[3]?.value);
                hrs18Row2.title = `18 PM Storage: ${(((formattedStorageData[3]?.value) / 1.9834591996927) || "N/A")} dsf`; // Add a tooltip
                row2.appendChild(hrs18Row2);

                const hrs24Row2 = document.createElement("td");
                hrs24Row2.textContent = formatValue(formattedStorageData[4]?.value);
                hrs24Row2.title = `24 PM Storage: ${(((formattedStorageData[4]?.value) / 1.9834591996927) || "N/A")} dsf`; // Add a tooltip
                row2.appendChild(hrs24Row2);

                const hrs06TodayRow2 = document.createElement("td");
                hrs06TodayRow2.textContent = formatValue(formattedStorageData[5]?.value);
                hrs06TodayRow2.title = `06 AM Storage Today: ${(((formattedStorageData[5]?.value) / 1.9834591996927) || "N/A")} dsf`; // Add a tooltip
                row2.appendChild(hrs06TodayRow2);

                // Delta calculation with null check
                const deltaVal = (formattedStorageData[4]?.value ?? null) - (formattedStorageData[0]?.value ?? null);
                const deltaRow2 = document.createElement("td");
                deltaRow2.textContent = isNaN(deltaVal) ? "N/A" : formatValue(deltaVal);
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
                buttonRefresh.id = 'refresh-pool-button';
                buttonRefresh.className = 'fetch-btn';
                output2Div.appendChild(buttonRefresh);

                const divData = document.createElement('div');
                divData.id = 'utilization-value';
                divData.style.backgroundColor = '#ffffff';
                divData.style.padding = '8px';
                divData.style.marginTop = '10px';
                divData.style.width = '100%';

                // Create first span (e.g., Conservation Pool Utilization)
                const conservationSpan = document.createElement('span');
                conservationSpan.id = 'conservation-span';
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

                conservationSpan.innerHTML = `Conservation Pool Utilization = <b>${conservationUtilization}</b>`;
                conservationSpan.style.paddingRight = '12px';

                // Create second span (e.g., Flood Pool Utilization)
                const floodSpan = document.createElement('span');
                floodSpan.id = 'flood-span';
                floodSpan.innerHTML = `Flood Pool Utilization = <b>${floodUtilization}</b>`;
                floodSpan.style.paddingRight = '12px';

                console.log("month", month);

                // Create third span (e.g., 1 Week Change)
                const oneWeekChangeSpan = document.createElement('span');
                oneWeekChangeSpan.id = 'flood-span';

                const value20 = midnightData?.[20]?.value;
                const value27 = midnightData?.[27]?.value;

                let oneWeekChangeValue = 'N/A';

                if (
                    value20 !== null && value20 !== undefined &&
                    value27 !== null && value27 !== undefined &&
                    !isNaN(value20) && !isNaN(value27)
                ) {
                    const change = (value27 - value20).toFixed(2);
                    const numericChange = parseFloat(change);

                    if (numericChange >= 2.00) {
                        oneWeekChangeValue = `<span style="color:red"><b>${change}</b></span>`;
                    } else {
                        oneWeekChangeValue = `<b>${change}</b>`;
                    }
                }

                oneWeekChangeSpan.innerHTML = `1 Week Change = ${oneWeekChangeValue}`;
                oneWeekChangeSpan.style.paddingRight = '12px';

                // Create fourWeekChangeSpan (e.g., "4 Week Change")
                const fourWeekChangeSpan = document.createElement('span');
                fourWeekChangeSpan.id = 'flood-span';

                // Safely extract values
                const startValue = midnightData?.[0]?.value;
                const endValue = midnightData?.[27]?.value;

                let fourWeekChangeText = 'N/A';

                if (
                    startValue !== null && startValue !== undefined &&
                    endValue !== null && endValue !== undefined &&
                    !isNaN(startValue) && !isNaN(endValue)
                ) {
                    const change = (endValue - startValue).toFixed(2);
                    const numericChange = parseFloat(change);

                    // Check if month is May (5) through October (10)
                    if (month >= 5 && month <= 10 && numericChange >= 4) {
                        fourWeekChangeText = `<span style="color:red"><b>${change}</b></span>`;
                    } else {
                        fourWeekChangeText = `<b>${change}</b>`;
                    }
                }

                fourWeekChangeSpan.innerHTML = `4 Week Change = ${fourWeekChangeText} ft`;
                fourWeekChangeSpan.style.paddingRight = '12px';

                // Append both spans to the div
                divData.appendChild(conservationSpan);
                divData.appendChild(floodSpan);
                // Append the oneWeekChangeSpan and fourWeekChangeSpan only if the lake is "Mark Twain Lk-Salt"
                if (lake === "Mark Twain Lk-Salt") {
                    divData.appendChild(oneWeekChangeSpan);
                    divData.appendChild(fourWeekChangeSpan);
                }

                // Append the final div to your container
                output2Div.appendChild(divData);

                buttonRefresh.addEventListener('click', () => {
                    // Remove existing table
                    const existingTable = document.getElementById('pool');
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

                    let tsidStage = formattedStageData?.[4]?.tsid;

                    let tsidElev = tsidStage
                        .replace('.Stage.', '.Elev.')
                        .replace('.29', '.lrgsShef-rev');

                    console.log("tsidElev:", tsidElev);

                    const payload = {
                        "name": formattedStageData?.[4]?.tsid,
                        "office-id": "MVS",
                        "units": "ft",
                        "values": values
                    };

                    console.log("payload:", payload);

                    // Get the datum delta
                    const gageZeroNavd88 = metaData['elevation'];
                    const gageZeroNgvd29 = ngvd29Data['constant-value'];
                    console.log("gageZeroNavd88:", gageZeroNavd88);
                    console.log("gageZeroNgvd29:", gageZeroNgvd29);

                    const gageZeroDelta = gageZeroNgvd29 - gageZeroNavd88;
                    console.log("gageZeroDelta:", gageZeroDelta);

                    // Create a new array with the adjusted value
                    const adjustedValues = values.map(entry => [
                        entry[0],
                        +(entry[1] - gageZeroDelta).toFixed(2), // keep two decimal places like original
                        entry[2]
                    ]);
                    console.log("adjustedValues:", adjustedValues);

                    const payloadElev = {
                        "name": tsidElev,
                        "office-id": "MVS",
                        "units": "ft",
                        "values": adjustedValues
                    };

                    console.log("payloadElev:", payloadElev);

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
                            await createTS(payloadElev);
                            statusDiv.innerText = "Write successful!";

                            // Optional: small delay to allow backend to process the new data
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const existingTable = document.getElementById('pool');
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

    function getMidnightData(data, tsid) {
        const midnightData = [];

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

            // Only get midnight data (00:00:00)
            if (localHour === 0 && localMinute === 0 && localSecond === 0) {
                const localDate = new Date(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`);
                const offsetMinutes = -localDate.getTimezoneOffset();
                const offsetHours = Math.floor(offsetMinutes / 60);
                const offsetMins = Math.abs(offsetMinutes % 60);
                const offsetSign = offsetHours >= 0 ? '+' : '-';
                const pad = n => n.toString().padStart(2, '0');
                const timezoneOffset = `${offsetSign}${pad(Math.abs(offsetHours))}:${pad(offsetMins)}`;

                const timestampCst = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}${timezoneOffset}`;

                midnightData.push({
                    timestamp,
                    value,
                    qualityCode,
                    tsid,
                    timestampCst
                });
            }
        });

        return midnightData;
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