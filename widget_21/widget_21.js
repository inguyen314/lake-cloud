document.addEventListener('DOMContentLoaded', async function () {
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

    const lakeLocs = [
        "Lk Shelbyville-Kaskaskia",
        "Carlyle Lk-Kaskaskia",
        "Wappapello Lk-St Francis",
        "Mark Twain Lk-Salt",
        "Rend Lk-Big Muddy"
    ];

    async function fetchTsidDataForAllLakes() {
        const outputLines = [];

        // Add header lines once
        outputLines.push(...createTableHeader());

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
            cdaSaveBtn = document.getElementById("cda-btn-lake-shef"); // Get the button by its ID

            cdaSaveBtn.disabled = true; // Disable button while checking login state

            // Update button text based on login status
            if (await isLoggedIn()) {
                cdaSaveBtn.innerText = "Save";
            } else {
                cdaSaveBtn.innerText = "Login";
            }

            cdaSaveBtn.disabled = false; // Re-enable button
        }

        allLines = [];

        for (const lake of lakeLocs) {
            const isMarkTwain = lake === "Mark Twain Lk-Salt";
            const isRend = lake === "Rend Lk-Big Muddy";
            const isWappapello = lake === "Wappapello Lk-St Francis";
            const isShelbyville = lake === "Lk Shelbyville-Kaskaskia";
            const isCarlyle = lake === "Carlyle Lk-Kaskaskia";

            const urltsid = `${setBaseUrl}timeseries/group/Forecast-Lake?office=${office}&category-id=${lake}`;
            const urltsid2 = isRend
                ? `${setBaseUrl}timeseries/group/Outflow-Average-Lake-Test?office=${office}&category-id=${lake}`
                : null;
            const levelId = `${lake}.Code.Inst.0.NWS HB5`;
            const urltsid3 = `${setBaseUrl}levels/${levelId}?office=MVS&effective-date=${isoDateToday}&unit=n/a`;

            const urltsid4 = isMarkTwain
                ? `${setBaseUrl}timeseries/group/Lake-Shef-Flow?office=${office}&category-id=${lake}`
                : null;

            const urltsid5 = isWappapello
                ? `${setBaseUrl}timeseries/group/Gate-Total-Lake-Test?office=${office}&category-id=${lake}`
                : null;

            const urltsid6 = isShelbyville || isCarlyle
                ? `${setBaseUrl}timeseries/group/Outflow-Total-Lake-Test?office=${office}&category-id=${lake}`
                : null;

            const urltsid7 = isMarkTwain
                ? `${setBaseUrl}timeseries/group/Generation-Release-Lake-Test?office=${office}&category-id=${lake}`
                : null;

            console.log("Lake:", lake);
            console.log("urltsid:", urltsid);
            if (isRend) console.log("urltsid2:", urltsid2);
            console.log("urltsid3:", urltsid3);
            if (isMarkTwain) console.log("urltsid4:", urltsid4);
            if (isWappapello) console.log("urltsid5:", urltsid5);
            if (isShelbyville || isCarlyle) console.log("urltsid6:", urltsid6);
            if (isMarkTwain) console.log("urltsid7:", urltsid7);

            try {
                const fetchPromises = [
                    fetch(urltsid),
                    isRend ? fetch(urltsid2) : Promise.resolve(null),
                    fetch(urltsid3),
                    isMarkTwain ? fetch(urltsid4) : Promise.resolve(null),
                    isWappapello ? fetch(urltsid5) : Promise.resolve(null),
                    isMarkTwain ? fetch(urltsid7) : Promise.resolve(null),
                ];

                const [response, response2, response3, response4, response5, response6] = await Promise.all(fetchPromises);

                const tsidData = await response.json();
                const tsidData2 = isRend && response2 ? await response2.json() : null;
                const tsidData3 = await response3.json();
                const tsidData4 = isMarkTwain && response4 ? await response4.json() : null;
                const tsidData5 = isWappapello && response5 ? await response5.json() : null;
                const tsidData7 = isMarkTwain && response6 ? await response6.json() : null;

                let tsidData6 = null;
                if (urltsid6) {
                    const res6 = await fetch(urltsid6);
                    tsidData6 = await res6.json();
                }

                const tsidOutflow = tsidData['assigned-time-series']?.[0]?.['timeseries-id'];
                const tsidOutflowAverage = isRend ? tsidData2?.['assigned-time-series']?.[0]?.['timeseries-id'] : null;
                const tsidNortonBridge = isMarkTwain ? tsidData4?.['assigned-time-series']?.[0]?.['timeseries-id'] : null;
                const tsidGateTotal = isWappapello ? tsidData5?.['assigned-time-series']?.[0]?.['timeseries-id'] : null;
                const tsidOutflowTotal = isShelbyville || isCarlyle
                    ? tsidData6?.['assigned-time-series']?.[0]?.['timeseries-id']
                    : null;
                const tsidGenerationRelease = isMarkTwain ? tsidData7?.['assigned-time-series']?.[0]?.['timeseries-id'] : null;

                console.log("tsidOutflow:", tsidOutflow);
                if (isRend) console.log("tsidOutflowAverage:", tsidOutflowAverage);
                if (isMarkTwain) console.log("tsidNortonBridge:", tsidNortonBridge);
                if (isWappapello) console.log("tsidGateTotal:", tsidGateTotal);
                if (isShelbyville || isCarlyle) console.log("tsidOutflowTotal:", tsidOutflowTotal);
                if (isMarkTwain) console.log("tsidGenerationRelease:", tsidGenerationRelease);

                const timeSeriesFetchPromises = [
                    fetchVersionedTimeSeriesData(tsidOutflow),
                    isRend ? fetchTimeSeriesDataToday(tsidOutflowAverage) : Promise.resolve(null),
                    isMarkTwain ? fetchTimeSeriesDataNortonBridge(tsidNortonBridge) : Promise.resolve(null),
                    isWappapello ? fetchTimeSeriesDataToday(tsidGateTotal) : Promise.resolve(null),
                    isCarlyle || isShelbyville ? fetchTimeSeriesDataYesterday(tsidOutflowTotal) : Promise.resolve(null),
                    isMarkTwain ? fetchTimeSeriesDataYesterday(tsidGenerationRelease) : Promise.resolve(null),
                ];

                const [
                    timeSeriesDataOutflow,
                    timeSeriesDataOutflowAverage,
                    timeSeriesDataNortonBridge,
                    timeSeriesDataGateTotal,
                    timeSeriesDataOutflowTotal,
                    timeSeriesDataGenerationRelease
                ] = await Promise.all(timeSeriesFetchPromises);

                console.log("timeSeriesDataOutflow:", timeSeriesDataOutflow);
                if (isRend) console.log("timeSeriesDataOutflowAverage:", timeSeriesDataOutflowAverage);
                if (isMarkTwain) console.log("timeSeriesDataNortonBridge:", timeSeriesDataNortonBridge);
                if (isWappapello) console.log("timeSeriesDataGateTotal:", timeSeriesDataGateTotal);
                if (isCarlyle || isShelbyville) console.log("timeSeriesDataOutflowTotal:", timeSeriesDataOutflowTotal);
                if (isMarkTwain) console.log("timeSeriesDataGenerationRelease:", timeSeriesDataGenerationRelease);

                if (timeSeriesDataOutflow?.values?.length > 0) {
                    console.log("Calling createTable for lake:", lake);
                    const lakeLines = createTable(
                        isoDateMinus1Day, isoDateToday,
                        isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4,
                        isoDateDay5, isoDateDay6, isoDateDay7,
                        tsidOutflow, timeSeriesDataOutflow,
                        tsidOutflowAverage, timeSeriesDataOutflowAverage,
                        tsidData3, lake, timeSeriesDataNortonBridge,
                        timeSeriesDataGateTotal, timeSeriesDataOutflowTotal,
                        timeSeriesDataGenerationRelease
                    );

                    allLines.push(lakeLines);

                    outputLines.push(...lakeLines);
                } else {
                    console.log("No Forecast Data for lake:", lake);
                }
            } catch (error) {
                console.error("Error fetching data for lake:", lake, error);
            }
        }

        console.log("allLines:", allLines);

        // Build the output string
        let output = [
            ": GENERATION DATE YYYYMMDD",
            ": TODAYS LAKE FLOW 6AM INSTANTANEOUS VALUE",
            ": 5 DAYS LAKE FORECAST 6AM INSTANTANEOUS FORECAST VALUE"
        ].join('\n') + '\n\n';

        allLines.forEach(group => {
            group.forEach(line => {
                output += line + '\n';
            });
        });

        // Add final blank line
        output += '\n';

        console.log("output:", output);

        // Display in output21 with formatting and a button
        const output21Div = document.getElementById("output21");
        output21Div.innerHTML = "";

        if (output21Div) {
            // Preserve line breaks using <pre>
            const pre = document.createElement("pre");
            pre.innerText = output;
            output21Div.appendChild(pre);

            // Add visual gap between text and button
            const spacer = document.createElement("div");
            spacer.style.height = "16px";
            output21Div.appendChild(spacer);

            // Create the button
            const cdaSaveBtn = document.createElement("button");
            cdaSaveBtn.textContent = "Submit";
            cdaSaveBtn.id = "cda-btn-lake-shef";
            cdaSaveBtn.disabled = true;
            output21Div.appendChild(cdaSaveBtn);

            // Optional login logic
            loginStateController();
            setInterval(loginStateController, 10000);

            cdaSaveBtn.addEventListener("click", async () => {
                // Your submit logic here
                alert("Submit clicked.");
            });
        }

    }

    function createTableHeader() {
        return [
            ": GENERATION DATE YYYYMMDD",
            ": TODAYS LAKE FLOW 6AM INSTANTANEOUS VALUE",
            ": 5 DAYS LAKE FORECAST 6AM INSTANTANEOUS FORECAST VALUE"
        ];
    }

    function createTable(
        isoDateMinus1Day,
        isoDateToday,
        isoDateDay1,
        isoDateDay2,
        isoDateDay3,
        isoDateDay4,
        isoDateDay5,
        isoDateDay6,
        isoDateDay7,
        tsidOutflow,
        timeSeriesDataOutflow,
        tsidOutflowAverage,
        timeSeriesDataOutflowAverage,
        tsidData3,
        lake,
        timeSeriesDataNortonBridge,
        timeSeriesDataGateTotal,
        timeSeriesDataOutflowTotal,
        timeSeriesDataGenerationRelease
    ) {
        console.log("timeSeriesDataOutflow:", timeSeriesDataOutflow);
        console.log("timeSeriesDataOutflowAverage:", timeSeriesDataOutflowAverage);

        const id = tsidData3['level-comment'];
        const hour = "1200";

        const getDateString = (timestampStr) => {
            const date = new Date(timestampStr);
            const y = date.getUTCFullYear();
            const m = String(date.getUTCMonth() + 1).padStart(2, '0');
            const d = String(date.getUTCDate()).padStart(2, '0');
            return `${y}${m}${d}`;
        };

        const formattedOutflowData = timeSeriesDataOutflow.values.map(entry => {
            const timestamp = Number(entry[0]); // Ensure timestamp is a number
            return {
                ...entry,
                formattedTimestampUTC: convertUnixTimestamp(timestamp, true),
                formattedTimestampCST: convertUnixTimestamp(timestamp, false),
            };
        });
        console.log("formattedOutflowData:", formattedOutflowData);

        let formattedOutflowAverageData = null;
        if (lake === "Rend Lk-Big Muddy") {
            formattedOutflowAverageData = timeSeriesDataOutflowAverage.values.map(entry => {
                const timestamp = Number(entry[0]); // Ensure timestamp is a number
                return {
                    ...entry,
                    formattedTimestampUTC: convertUnixTimestamp(timestamp, true),
                    formattedTimestampCST: convertUnixTimestamp(timestamp, false),
                };
            });
            console.log("formattedOutflowAverageData:", formattedOutflowAverageData);
        }

        let formattedGateTotalData = null;
        if (lake === "Wappapello Lk-St Francis") {
            formattedGateTotalData = timeSeriesDataGateTotal.values.map(entry => {
                const timestamp = Number(entry[0]); // Ensure timestamp is a number
                return {
                    ...entry,
                    formattedTimestampUTC: convertUnixTimestamp(timestamp, true),
                    formattedTimestampCST: convertUnixTimestamp(timestamp, false),
                };
            });
            console.log("formattedGateTotalData:", formattedGateTotalData);
        }

        let formattedOutflowTotal = null;
        if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Carlyle Lk-Kaskaskia") {
            formattedOutflowTotal = timeSeriesDataOutflowTotal.values.map(entry => {
                const timestamp = Number(entry[0]); // Ensure timestamp is a number
                return {
                    ...entry,
                    formattedTimestampUTC: convertUnixTimestamp(timestamp, true),
                    formattedTimestampCST: convertUnixTimestamp(timestamp, false),
                };
            });
            console.log("formattedOutflowTotal:", formattedOutflowTotal);
        }

        let formattedNortonBridge = null;
        if (lake === "Mark Twain Lk-Salt") {
            formattedNortonBridge = timeSeriesDataNortonBridge.values.map(entry => {
                const timestamp = Number(entry[0]); // Ensure timestamp is a number
                return {
                    ...entry,
                    formattedTimestampUTC: convertUnixTimestamp(timestamp, true),
                    formattedTimestampCST: convertUnixTimestamp(timestamp, false),
                };
            });
            console.log("formattedNortonBridge:", formattedNortonBridge);
        }

        let formattedGateTotal = null;
        if (lake === "Wappapello Lk-St Francis") {
            formattedGateTotal = timeSeriesDataGateTotal.values.map(entry => {
                const timestamp = Number(entry[0]); // Ensure timestamp is a number
                return {
                    ...entry,
                    formattedTimestampUTC: convertUnixTimestamp(timestamp, true),
                    formattedTimestampCST: convertUnixTimestamp(timestamp, false),
                };
            });
            console.log("formattedGateTotal:", formattedGateTotal);
        }

        let formattedGenerationRelease = null;
        if (lake === "Mark Twain Lk-Salt") {
            formattedGenerationRelease = timeSeriesDataGenerationRelease.values.map(entry => {
                const timestamp = Number(entry[0]); // Ensure timestamp is a number
                return {
                    ...entry,
                    formattedTimestampUTC: convertUnixTimestamp(timestamp, true),
                    formattedTimestampCST: convertUnixTimestamp(timestamp, false),
                };
            });
            console.log("formattedGenerationRelease:", formattedGenerationRelease);
        }

        const lines = [];

        if (formattedOutflowData.length > 0) {
            let avg = null;
            let dateStr = null;
            let avgValue = null;
            if (lake === "Rend Lk-Big Muddy") {
                avg = formattedOutflowAverageData[0]["1"];
                dateStr = getDateString(formattedOutflowData[0].formattedTimestampUTC);
                avgValue = (avg / 1000).toFixed(2).replace(/^0+([.])/, '$1');
            } else if (lake === "Mark Twain Lk-Salt") {
                avg = formattedNortonBridge[0]["1"];
                dateStr = getDateString(formattedNortonBridge[0].formattedTimestampUTC);
                avgValue = (avg / 1000).toFixed(2).replace(/^0+([.])/, '$1');
            } else if (lake === "Wappapello Lk-St Francis") {
                avg = formattedGateTotal[0]["1"];
                dateStr = getDateString(formattedGateTotal[0].formattedTimestampUTC);
                avgValue = (avg / 1000).toFixed(2).replace(/^0+([.])/, '$1');
            } else if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Carlyle Lk-Kaskaskia") {
                avg = formattedOutflowTotal[0]["1"];
                dateStr = getDateString(formattedOutflowData[0].formattedTimestampUTC);
                avgValue = (avg / 1000).toFixed(2).replace(/^0+([.])/, '$1');
            }

            if (lake === "Lk Shelbyville-Kaskaskia") {
                lines.push(`.ER ${id} ${dateStr} Z DH${hour}/QT/DID1/${avgValue} ------------- (Outflow Total) ${lake} ✓`);
            } else if (lake === "Carlyle Lk-Kaskaskia") {
                lines.push(`.ER ${id} ${dateStr} Z DH${hour}/QT/DID1/${avgValue} ------------- (Outflow Total) ${lake} ✓`);
            } else if (lake === "Wappapello Lk-St Francis") {
                lines.push(`.ER ${id} ${dateStr} Z DH${hour}/QT/DID1/${avgValue} ------------- (Gate Total) ${lake} ✓`);
            } else if (lake === "Mark Twain Lk-Salt") {
                lines.push(`.ER ${id} ${dateStr} Z DH${hour}/QT/DID1/${avgValue} ------------- (Norton Bridge Flow) ${lake} ✓`);
            } else if (lake === "Rend Lk-Big Muddy") {
                lines.push(`.ER ${id} ${dateStr} Z DH${hour}/QT/DID1/${avgValue} ------------- (Yesterday Average Outflow) ${lake} ✓`);
            } else {
                lines.push(`.ER ${id} ${dateStr} Z DH${hour}/QT/DID1/${avgValue}`);
            }
        }

        if (formattedOutflowData.length > 1) {
            const startDate = getDateString(formattedOutflowData[1].formattedTimestampUTC);
            const values = [];

            for (let i = 0; i < 5 && i < formattedOutflowData.length; i++) {
                const v = formattedOutflowData[i]["1"];
                const val = (v / 1000).toFixed(2).replace(/^0+([.])/, '$1');
                values.push(val);
            }

            let avg2 = null;
            let dateStr2 = null;
            let avgValue2 = null;
            if (lake === "Mark Twain Lk-Salt") {
                avg2 = formattedGenerationRelease[0]["1"];
                dateStr2 = getDateString(formattedGenerationRelease[0].formattedTimestampUTC);
                avgValue2 = (avg2 / 1000).toFixed(2).replace(/^0+([.])/, '$1');
            }

            if (lake === "Mark Twain Lk-Salt") {
                lines.push(`.ER ${id} ${dateStr2} Z DH${hour}/QTD/DID1/${avgValue2} ------------- (Total Flow - Generation and Release) ${lake} ✓`);
                lines.push(`.ER ${id} ${startDate} Z DH${hour}/QTIF/DID1/${values.join('/')} ------------- (Lake Forecast) ${lake} ✓`);
            } else {
                lines.push(`.ER ${id} ${startDate} Z DH${hour}/QTIF/DID1/${values.join('/')} ------------- (Lake Forecast) ${lake} ✓`);
            }
        }

        return lines;
    }

    const fetchVersionedTimeSeriesData = async (tsid) => {
        let tsidData = null;
        tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateToday}&end=${isoDateDay6}&office=${office}&version-date=${convertTo6AMCST(isoDateToday)}`;

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

    const fetchTimeSeriesDataToday = async (tsid) => {
        let tsidData = null;
        tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateToday}&end=${isoDateToday}&office=${office}`;

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

    const fetchTimeSeriesDataYesterday = async (tsid) => {
        let tsidData = null;
        tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateMinus1Day}&end=${isoDateMinus1Day}&office=${office}`;

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

    const fetchTimeSeriesDataNortonBridge = async (tsid) => {
        let tsidData = null;

        // Parse isoDateToday and add 6 hours, considering local time and DST
        const baseDate = new Date(isoDateToday);
        const adjustedDate = new Date(baseDate.getTime() + 6 * 60 * 60 * 1000); // Add 6 hours

        const begin = adjustedDate.toISOString().split('.')[0]; // Trim milliseconds
        const end = adjustedDate.toISOString().split('.')[0]; // Trim milliseconds

        tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${begin}&end=${end}&office=${office}`;

        console.log('tsidData:', tsidData);

        try {
            const response = await fetch(tsidData, {
                headers: {
                    "Accept": "application/json;version=2",
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

    fetchTsidDataForAllLakes();

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

        // Add 6 hours or make it 6 AM if needed
        // date.setUTCHours(6);  // Ensure it's 6 AM UTC

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

    function convertTo6AMCST(isoDateToday) {
        // Parse the input date
        let date = new Date(isoDateToday);

        // Add 6 hours (6 * 60 * 60 * 1000 ms)
        date = new Date(date.getTime() + 6 * 60 * 60 * 1000);

        // Return the new ISO string
        return date.toISOString();
    }
});

// TODO: needs to grab midnight outflow for (shelbyville, carlyle, wapppapello) lakes.
// for mark twain lake, grab the Generation-Release-Lake-Test for the midnight outflow value
// Append the nortn bridge flow for mark twain lake