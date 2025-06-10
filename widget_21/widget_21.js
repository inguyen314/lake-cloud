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
        "Rend Lk-Big Muddy",
        "Wappapello Lk-St Francis",
        "Mark Twain Lk-Salt"
    ];

    async function fetchTsidDataForAllLakes() {
        const outputLines = [];

        // Add header lines once
        outputLines.push(...createTableHeader());

        for (const lake of lakeLocs) {
            const urltsid = `${setBaseUrl}timeseries/group/Forecast-Lake?office=${office}&category-id=${lake}`;
            const urltsid2 = `${setBaseUrl}timeseries/group/Outflow-Average-Lake-Test?office=${office}&category-id=${lake}`;
            const levelId = `${lake}.Code.Inst.0.NWS HB5`;
            const urltsid3 = `${setBaseUrl}levels/${levelId}?office=MVS&effective-date=${isoDateToday}&unit=n/a`;

            // Only define/fetch urltsid4 if lake is "Mark Twain Lk-Salt"
            const isMarkTwain = lake === "Mark Twain Lk-Salt";
            const urltsid4 = isMarkTwain
                ? `${setBaseUrl}timeseries/group/Lake-Shef-Flow?office=${office}&category-id=${lake}`
                : null;

            console.log("Lake:", lake);
            console.log("urltsid:", urltsid);
            console.log("urltsid2:", urltsid2);
            console.log("urltsid3:", urltsid3);
            if (isMarkTwain) {
                console.log("urltsid4:", urltsid4);
            }

            try {
                // Conditionally fetch urltsid4
                const fetchPromises = [
                    fetch(urltsid),
                    fetch(urltsid2),
                    fetch(urltsid3),
                    isMarkTwain ? fetch(urltsid4) : Promise.resolve({ json: () => ({}) })
                ];

                const [response, response2, response3, response4] = await Promise.all(fetchPromises);

                const tsidData = await response.json();
                const tsidData2 = await response2.json();
                const tsidData3 = await response3.json();
                const tsidData4 = isMarkTwain ? await response4.json() : null;

                const tsidOutflow = tsidData['assigned-time-series']?.[0]?.['timeseries-id'];
                const tsidOutflowAverage = tsidData2['assigned-time-series']?.[0]?.['timeseries-id'];
                const tsidNortonBridge = isMarkTwain
                    ? tsidData4?.['assigned-time-series']?.[0]?.['timeseries-id']
                    : null;

                console.log("tsidOutflow:", tsidOutflow);
                console.log("tsidOutflowAverage:", tsidOutflowAverage);
                if (isMarkTwain) {
                    console.log("tsidNortonBridge:", tsidNortonBridge);
                }

                if (!tsidOutflow || !tsidOutflowAverage) {
                    console.log("Missing timeseries-id data for lake:", lake);
                    continue;
                }

                const timeSeriesFetchPromises = [
                    fetchTimeSeriesData(tsidOutflow),
                    fetchTimeSeriesDataYesterday(tsidOutflowAverage),
                    isMarkTwain ? fetchTimeSeriesDataNortonBridge(tsidNortonBridge) : Promise.resolve(null)
                ];

                const [timeSeriesDataOutflow, timeSeriesDataOutflowAverage, timeSeriesDataNortonBridge] = await Promise.all(timeSeriesFetchPromises);

                console.log("timeSeriesDataOutflow:", timeSeriesDataOutflow);
                console.log("timeSeriesDataOutflowAverage:", timeSeriesDataOutflowAverage);
                if (isMarkTwain) {
                    console.log("timeSeriesDataNortonBridge:", timeSeriesDataNortonBridge);
                }

                if (
                    timeSeriesDataOutflow?.values?.length > 0 &&
                    timeSeriesDataOutflowAverage?.values?.length > 0
                ) {
                    console.log("Calling createTable for lake:", lake);
                    const lakeLines = createTable(
                        isoDateMinus1Day, isoDateToday,
                        isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4,
                        isoDateDay5, isoDateDay6, isoDateDay7,
                        tsidOutflow, timeSeriesDataOutflow,
                        tsidOutflowAverage, timeSeriesDataOutflowAverage,
                        tsidData3, lake, timeSeriesDataNortonBridge
                    );

                    outputLines.push(...lakeLines);
                } else {
                    console.log("No Forecast Data for lake:", lake);
                }
            } catch (error) {
                console.error("Error fetching data for lake:", lake, error);
            }
        }

        // Output all lines at once
        const output21Div = document.getElementById("output21");
        if (output21Div) {
            output21Div.innerText = outputLines.join('\n');
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
        timeSeriesDataNortonBridge
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

        const formattedOutflowAverageData = timeSeriesDataOutflowAverage.values.map(entry => {
            const timestamp = Number(entry[0]); // Ensure timestamp is a number
            return {
                ...entry,
                formattedTimestampUTC: convertUnixTimestamp(timestamp, true),
                formattedTimestampCST: convertUnixTimestamp(timestamp, false),
            };
        });
        console.log("formattedOutflowAverageData:", formattedOutflowAverageData);

        const lines = [];

        // Line 1: formattedOutflowAverageData (single value)
        if (formattedOutflowAverageData.length > 0 && formattedOutflowData.length > 0) {
            const avg = formattedOutflowAverageData[0]["1"];
            const dateStr = getDateString(formattedOutflowData[0].formattedTimestampUTC);
            const avgValue = (avg / 1000).toFixed(2).replace(/^0+([.])/, '$1');

            if (lake === "Mark Twain Lk-Salt") {
                lines.push(`.ER ${id} ${dateStr} Z DH${hour}/QT/DID1/${avgValue} ------------- replace with Norton Bridge Flow`);
            } else {
                lines.push(`.ER ${id} ${dateStr} Z DH${hour}/QT/DID1/${avgValue}`);
            }
        }

        // Line 2: formattedOutflowData (5 values)
        if (formattedOutflowData.length > 1) {
            const startDate = getDateString(formattedOutflowData[1].formattedTimestampUTC);
            const values = [];

            for (let i = 0; i < 5 && i < formattedOutflowData.length; i++) {
                const v = formattedOutflowData[i]["1"];
                const val = (v / 1000).toFixed(2).replace(/^0+([.])/, '$1');
                values.push(val);
            }

            if (lake === "Mark Twain Lk-Salt") {
                lines.push(`.ER ${id} ${startDate} Z DH${hour}/QTIF/DID1/${values.join('/')} ------------- replace with Total Generation and Release Flow`);
                lines.push(`.ER ${id} ${startDate} Z DH${hour}/QTIF/DID1/${values.join('/')}`);
            } else {
                lines.push(`.ER ${id} ${startDate} Z DH${hour}/QTIF/DID1/${values.join('/')}`);
            }
        }


        return lines;
    }

    const fetchTimeSeriesData = async (tsid) => {
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

    const fetchTimeSeriesDataYesterday = async (tsid) => {
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