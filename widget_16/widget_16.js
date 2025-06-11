document.addEventListener('DOMContentLoaded', async function () {
    console.log("lake: ", lake);
    console.log('datetime: ', datetime);

    const loadingIndicator = document.getElementById('loading_cwms_model');
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
    const isoDateDay14 = getIsoDateWithOffsetDynamic(year, month, day, 14);

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

    let urlTsidStageNoQpf = null;
    let urlTsidStageQpf = null;
    let urlTsidInflowQpf = null;
    let urlTsidInflowNoQpf = null;
    let urlTsidOutflowQpf = null;
    let urlTsidOutflowNoQpf = null;
    let urlTsidPrecipForecast = null;

    urlTsidStageQpf = `${setBaseUrl}timeseries/group/CWMS-Forecast-Stage-QPF?office=${office}&category-id=${lake}`;
    urlTsidStageNoQpf = `${setBaseUrl}timeseries/group/CWMS-Forecast-Stage-NoQPF?office=${office}&category-id=${lake}`;
    console.log("urlTsidStageNoQpf:", urlTsidStageNoQpf);
    console.log("urlTsidStageQpf:", urlTsidStageQpf);

    urlTsidInflowQpf = `${setBaseUrl}timeseries/group/CWMS-Forecast-Flow-In-QPF?office=${office}&category-id=${lake}`;
    urlTsidInflowNoQpf = `${setBaseUrl}timeseries/group/CWMS-Forecast-Flow-In-NoQPF?office=${office}&category-id=${lake}`;
    console.log("urlTsidInflowQpf:", urlTsidInflowQpf);
    console.log("urlTsidInflowNoQpf:", urlTsidInflowNoQpf);

    urlTsidOutflowQpf = `${setBaseUrl}timeseries/group/CWMS-Forecast-Flow-Out-QPF?office=${office}&category-id=${lake}`;
    urlTsidOutflowNoQpf = `${setBaseUrl}timeseries/group/CWMS-Forecast-Flow-Out-NoQPF?office=${office}&category-id=${lake}`;
    console.log("urlTsidOutflowQpf:", urlTsidOutflowQpf);
    console.log("urlTsidOutflowNoQpf:", urlTsidOutflowNoQpf);

    urlTsidPrecipForecast = `${setBaseUrl}timeseries/group/CWMS-Forecast-Precip-Forecast?office=${office}&category-id=${lake}`;
    console.log("urlTsidPrecipForecast:", urlTsidPrecipForecast);

    const levelIdUrl = `${setBaseUrl}levels/${lake}.Evap.Inst.0.Evaporation?office=MVS&effective-date=${isoDateToday}&unit=ft`;
    console.log("levelIdUrl:", levelIdUrl);

    const fetchTimeSeriesData = async (tsid) => {
        const tsidData = `${setBaseUrl}timeseries?page-size=1000000&name=${tsid}&begin=${isoDateToday}&end=${isoDateDay14}&office=${office}`;
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
            const response1 = await fetch(urlTsidStageQpf);
            const response2 = await fetch(urlTsidStageNoQpf);
            const response3 = await fetch(urlTsidInflowQpf);
            const response4 = await fetch(urlTsidInflowNoQpf);
            const response5 = await fetch(urlTsidOutflowQpf);
            const response6 = await fetch(urlTsidOutflowNoQpf);
            const response7 = await fetch(levelIdUrl);

            const tsidStageQpfData = await response1.json();
            const tsidStageNoQpfData = await response2.json();
            const tsidInflowQpfData = await response3.json();
            const tsidInflowNoQpfData = await response4.json();
            const tsidOutflowQpfData = await response5.json();
            const tsidOutflowNoQpfData = await response6.json();
            const tsidEvapLevelData = await response7.json();

            const tsidStageQpf = tsidStageQpfData['assigned-time-series'][0]['timeseries-id'];
            const tsidStageNoQpf = tsidStageNoQpfData['assigned-time-series'][0]['timeseries-id'];
            const tsidInflowQpf = tsidInflowQpfData['assigned-time-series'][0]['timeseries-id'];
            const tsidInflowNoQpf = tsidInflowNoQpfData['assigned-time-series'][0]['timeseries-id'];
            const tsidOutflowQpf = tsidOutflowQpfData['assigned-time-series'][0]['timeseries-id'];
            const tsidOutflowNoQpf = tsidOutflowNoQpfData['assigned-time-series'][0]['timeseries-id'];
            const tsidEvaporation = tsidEvapLevelData['location-level-id'];

            const curentMonthEvapValue = getEvapValueForMonth(tsidEvapLevelData, month);
            console.log("curentMonthEvapValue:", curentMonthEvapValue);

            console.log("tsidStageQpf:", tsidStageQpf);
            console.log("tsidStageNoQpf:", tsidStageNoQpf);
            console.log("tsidInflowQpf:", tsidInflowQpf);
            console.log("tsidInflowNoQpf:", tsidInflowNoQpf);
            console.log("tsidOutflowQpf:", tsidOutflowQpf);
            console.log("tsidOutflowNoQpf:", tsidOutflowNoQpf);
            console.log("tsidEvaporation:", tsidEvaporation);

            const timeSeriesStageQpfData = await fetchTimeSeriesData(tsidStageQpf);
            const timeSeriesStageNoQpfData = await fetchTimeSeriesData(tsidStageNoQpf);
            const timeSeriesInflowQpfData = await fetchTimeSeriesData(tsidInflowQpf);
            const timeSeriesInflowNoQpfData = await fetchTimeSeriesData(tsidInflowNoQpf);
            const timeSeriesOutflowQpfData = await fetchTimeSeriesData(tsidOutflowQpf);
            const timeSeriesOutflowNoQpfData = await fetchTimeSeriesData(tsidOutflowNoQpf);

            console.log("timeSeriesStageQpfData:", timeSeriesStageQpfData);
            console.log("timeSeriesStageNoQpfData:", timeSeriesStageNoQpfData);
            console.log("timeSeriesInflowQpfData:", timeSeriesInflowQpfData);
            console.log("timeSeriesInflowNoQpfData:", timeSeriesInflowNoQpfData);
            console.log("timeSeriesOutflowQpfData:", timeSeriesOutflowQpfData);
            console.log("timeSeriesOutflowNoQpfData:", timeSeriesOutflowNoQpfData);

            createTable(timeSeriesStageQpfData, timeSeriesStageNoQpfData, timeSeriesInflowQpfData, timeSeriesInflowNoQpfData, timeSeriesOutflowQpfData, timeSeriesOutflowNoQpfData);

            function createTable(timeSeriesStageQpfData, timeSeriesStageNoQpfData, timeSeriesInflowQpfData, timeSeriesInflowNoQpfData, timeSeriesOutflowQpfData, timeSeriesOutflowNoQpfData) {
                const amStageQpf = get6amData(timeSeriesStageQpfData, tsidStageQpf);
                const amStageNoQpf = get6amData(timeSeriesStageNoQpfData, tsidStageNoQpf);
                const amInflowQpf = get6amData(timeSeriesInflowQpfData, tsidInflowQpf);
                const amInflowNoQpf = get6amData(timeSeriesInflowNoQpfData, tsidInflowNoQpf);
                const amOutflowQpf = get6amData(timeSeriesOutflowQpfData, tsidOutflowQpf);
                const amOutflowNoQpf = get6amData(timeSeriesOutflowNoQpfData, tsidOutflowNoQpf);

                // Helper to format any 6AM data array
                const formatTimeSeries = (dataArray) => {
                    return dataArray.map(entry => {
                        const formattedTimestamp = formatISODate2ReadableDate(Number(entry.timestamp));
                        return {
                            ...entry,
                            formattedTimestamp
                        };
                    });
                };

                const timeSeriesStageQpfDataFormatted = formatTimeSeries(amStageQpf);
                const timeSeriesStageNoQpfDataFormatted = formatTimeSeries(amStageNoQpf);
                const timeSeriesInflowQpfDataFormatted = formatTimeSeries(amInflowQpf);
                const timeSeriesInflowNoQpfDataFormatted = formatTimeSeries(amInflowNoQpf);
                const timeSeriesOutflowQpfDataFormatted = formatTimeSeries(amOutflowQpf);
                const timeSeriesOutflowNoQpfDataFormatted = formatTimeSeries(amOutflowNoQpf);

                console.log("Stage QPF:", timeSeriesStageQpfDataFormatted);
                console.log("Stage No QPF:", timeSeriesStageNoQpfDataFormatted);
                console.log("Inflow QPF:", timeSeriesInflowQpfDataFormatted);
                console.log("Inflow No QPF:", timeSeriesInflowNoQpfDataFormatted);
                console.log("Outflow QPF:", timeSeriesOutflowQpfDataFormatted);
                console.log("Outflow No QPF:", timeSeriesOutflowNoQpfDataFormatted);


                const output166Div = document.getElementById("output166");
                output166Div.innerHTML = "";

                const forecastDateTitle = document.createElement("h2");
                forecastDateTitle.textContent = `Forecast Date: ${datetime}`;
                forecastDateTitle.style.marginBottom = "10px";
                forecastDateTitle.style.color = "red";
                output166Div.appendChild(forecastDateTitle);

                const forecastEvapTitle = document.createElement("h3");
                forecastEvapTitle.textContent = `OBS 24hr Precip ~ 0.1" // OBS 7-Day Precip ~ 1.5" // Total QPF ~ 1.8"`;
                forecastEvapTitle.style.marginBottom = "20px";
                forecastEvapTitle.style.color = "red";
                output166Div.appendChild(forecastEvapTitle);

                // Create the table
                const table = document.createElement("table");
                table.id = "inflow";

                // First header row
                const headerRow1 = document.createElement("tr");

                const dateHeader = document.createElement("th");
                dateHeader.textContent = "Date";
                dateHeader.rowSpan = 2;
                headerRow1.appendChild(dateHeader);

                const poolStageHeader = document.createElement("th");
                poolStageHeader.textContent = "Pool Stage (ft)";
                poolStageHeader.colSpan = 2;
                headerRow1.appendChild(poolStageHeader);

                const inflowHeader = document.createElement("th");
                inflowHeader.textContent = "Inflow (DSF)";
                inflowHeader.colSpan = 2;
                headerRow1.appendChild(inflowHeader);

                const outflowHeader = document.createElement("th");
                outflowHeader.textContent = "Outflow (DSF)";
                outflowHeader.colSpan = 2;
                headerRow1.appendChild(outflowHeader);

                const precipHeader = document.createElement("th");
                precipHeader.textContent = "Precip (in)";
                precipHeader.rowSpan = 2;
                headerRow1.appendChild(precipHeader);

                table.appendChild(headerRow1);

                // Second header row
                const headerRow2 = document.createElement("tr");
                ["No QPF", "QPF", "No QPF", "QPF", "No QPF", "QPF"].forEach(label => {
                    const th = document.createElement("th");
                    th.textContent = label;
                    headerRow2.appendChild(th);
                });

                table.appendChild(headerRow2);

                // Append the complete table to the container div
                output166Div.appendChild(table);

                if (timeSeriesStageQpfDataFormatted.length === 14) {
                    timeSeriesStageQpfDataFormatted.forEach((dataPoint, index) => {
                        const row = document.createElement("tr");

                        console.log("index: ", index);

                        // Date
                        const dateCell = document.createElement("td");
                        dateCell.textContent = dataPoint.formattedTimestamp;
                        row.appendChild(dateCell);

                        // Pool No QPF
                        const poolNoQpfCell = document.createElement("td");
                        poolNoQpfCell.innerHTML = timeSeriesStageNoQpfDataFormatted?.[index]?.value != null
                            ? "<span title='" + timeSeriesStageNoQpfDataFormatted[index]['tsid'] + "'>" + doubleRoundToOneDecimal(timeSeriesStageNoQpfDataFormatted[index].value) + "</span>"
                            : "";
                        row.appendChild(poolNoQpfCell);

                        // Pool QPF
                        const poolQpfCell = document.createElement("td");
                        poolQpfCell.textContent = doubleRoundToOneDecimal(dataPoint.value); // from QPF array
                        row.appendChild(poolQpfCell);

                        // Inflow No QPF
                        const inflowNoQpfCell = document.createElement("td");
                        inflowNoQpfCell.textContent = timeSeriesInflowNoQpfDataFormatted?.[index]?.value != null
                            ? Math.round((timeSeriesInflowNoQpfDataFormatted[index].value) / 10) * 10
                            : "";
                        row.appendChild(inflowNoQpfCell);

                        // Inflow QPF
                        const inflowQpfCell = document.createElement("td");
                        inflowQpfCell.textContent = timeSeriesInflowQpfDataFormatted?.[index]?.value != null
                            ? Math.round((timeSeriesInflowQpfDataFormatted[index].value) / 10) * 10
                            : "";
                        row.appendChild(inflowQpfCell);

                        // Outflow No QPF
                        const outflowNoQpfCell = document.createElement("td");
                        outflowNoQpfCell.textContent = timeSeriesOutflowNoQpfDataFormatted?.[index]?.value != null
                            ? Math.round((timeSeriesOutflowNoQpfDataFormatted[index].value) / 10) * 10
                            : "";
                        row.appendChild(outflowNoQpfCell);

                        // Outflow QPF
                        const outflowQpfCell = document.createElement("td");
                        outflowQpfCell.textContent = timeSeriesOutflowQpfDataFormatted?.[index]?.value != null
                            ? Math.round((timeSeriesOutflowQpfDataFormatted[index].value) / 10) * 10
                            : "";
                        row.appendChild(outflowQpfCell);

                        // Precip
                        const precipCell = document.createElement("td");
                        precipCell.textContent = "--"; // Placeholder
                        precipCell.style.color = "red";
                        row.appendChild(precipCell);

                        // Append row
                        table.appendChild(row);
                    });
                } else {
                    const titleSpan = document.createElement("h2");
                    titleSpan.textContent = "No Forecast Run Today";
                    output166Div.appendChild(titleSpan);
                }
            }

            loadingIndicator.style.display = 'none';
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

    function get6amData(data, tsid) {
        const sixAmData = [];

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

            // Check if the time is exactly 6:00:00 AM
            if (date.getHours() === 6 && date.getMinutes() === 0 && date.getSeconds() === 0) {
                sixAmData.push({ timestamp, value, qualityCode, tsid });
            }
        });

        return sixAmData;
    }

    function doubleRoundToOneDecimal(value) {
        const roundedToTwo = Number(value.toFixed(2)); // e.g., 600.146 → 600.15
        const roundedToOne = Number(roundedToTwo.toFixed(1)); // e.g., 600.15 → 600.2
        return roundedToOne.toFixed(1); // ensure one decimal, returns as string (e.g., "10.0")
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

    // Precip images
    if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
        // Reformat MM-DD-YYYY to YYYY-MM-DD for safe Date parsing
        const [month, day, year] = datetime.split('-');
        const isoDate = `${year}-${month}-${day}`; // '2025-05-17'
        const baseDate = new Date(`${isoDate}T00:00:00`); // safe for Date object

        // Format date like "Fri 17-May"
        function formatDate(dateObj) {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${days[dateObj.getDay()]} ${String(dateObj.getDate()).padStart(2, '0')}-${months[dateObj.getMonth()]}`;
        }

        // Offset helper
        function offsetDate(base, daysOffset) {
            const copy = new Date(base);
            copy.setDate(copy.getDate() + daysOffset);
            return copy;
        }

        // Generate ranges
        const observedStart = formatDate(baseDate);
        const observedEnd = formatDate(offsetDate(baseDate, 7));
        const qpf7Start = observedStart;
        const qpf7End = observedEnd;
        const qpf16Start = observedStart;
        const qpf16End = formatDate(offsetDate(baseDate, 15));

        // Construct HTML with responsive images
        const htmlContent = `
        <style>
            #output16 img {
            width: 100%;
            max-width: 1000px;
            height: auto;
            border: 2px solid #000;
            }
        </style>
        <p><center><strong><font size="+2">
            7-day Observed<br>
            <img src="https://mrcc.purdue.edu/files/cliwatch/GIS_plots/prcp_mpe/prcp_mpe_007_tot-0.png" alt="7-Day Observed Multi-sensor Precipitation"><br>
        </font></strong></center></p>
        <p><center><strong><font size="+2">
            7-day QPF<br>
            <img src="https://www.wpc.ncep.noaa.gov/qpf/p168i.gif?1512662281" alt="7-Day QPF"><br>
        </font></strong></center></p>
        <p><center><strong><font size="+2">
            16-day QPF<br>
            <img src="https://www.weather.gov/images/ohrfc/dynamic/NAEFS16.apcp.mean.total.png" alt="16-Day QPF"><br>
        </font></strong></center></p>
        `;

        document.getElementById('output16').innerHTML = htmlContent;

    } else if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
        const [month, day, year] = datetime.split('-');
        const baseDate = new Date(`${year}-${month}-${day}T00:00:00`);

        // Format helpers
        const formatMMDD = d => {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return `${days[d.getDay()]} ${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
        };
        const formatDayMonth = d => {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${days[d.getDay()]} ${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}`;
        };

        // Offsets
        const offset = (d, days) => new Date(d.getTime() + days * 86400000);

        // Dates
        const observedStart = formatMMDD(baseDate);
        const observedEnd = formatMMDD(offset(baseDate, 7));
        const qpf7Start = observedEnd;
        const qpf7End = formatMMDD(offset(baseDate, 14));
        const qpf16Start = formatDayMonth(offset(baseDate, 7));
        const qpf16End = formatDayMonth(offset(baseDate, 15));

        // Build HTML
        const html = `
        <style>
            #output16 img {
            max-width: 100%;
            height: auto;
            border: 2px solid black;
            }
        </style>

        <p><center><strong><font size="+2">
            7-day Observed<br>
            <img src="https://mrcc.purdue.edu/files/cliwatch/GIS_plots/prcp_mpe/prcp_mpe_007_tot-0.png" alt="7-Day Observed Multi-sensor Precipitation"><br>
        </font></strong></center></p>

        <p><center><strong><font size="+2">
            7-day QPF<br>
            <img src="https://www.wpc.ncep.noaa.gov/qpf/p168i.gif?1512662281" alt="7-Day QPF"><br>
        </font></strong></center></p>

        <p><center><strong><font size="+2">
            16-day QPF<br>
            <img src="https://www.weather.gov/images/ohrfc/dynamic/NAEFS16.apcp.mean.total.png" alt="16-Day QPF"><br>
        </font></strong></center></p>
        `;

        document.getElementById('output16').innerHTML = html;

    } else if (lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
        // Convert MM-DD-YYYY to safe format for Date
        const [month, day, year] = datetime.split('-');
        const isoDate = `${year}-${month}-${day}`;
        const baseDate = new Date(`${isoDate}T00:00:00`);

        // Date formatting
        function formatDate(dateObj) {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${days[dateObj.getDay()]} ${String(dateObj.getDate()).padStart(2, '0')}-${months[dateObj.getMonth()]}`;
        }

        // Add days to base date
        function offsetDate(date, daysOffset) {
            const result = new Date(date);
            result.setDate(result.getDate() + daysOffset);
            return result;
        }

        // Compute date ranges
        const observedStart = formatDate(baseDate);                  // today
        const observedEnd = formatDate(offsetDate(baseDate, 7));     // today + 7
        const qpf7Start = formatDate(offsetDate(baseDate, 7));       // today + 7
        const qpf7End = formatDate(offsetDate(baseDate, 14));        // today + 14
        const qpf16Start = qpf7Start;
        const qpf16End = formatDate(offsetDate(baseDate, 15));       // today + 15

        // Construct HTML
        const htmlContent = `
        <style>
            #output16 img {
            width: 100%;
            max-width: 1000px;
            height: auto;
            border: 2px solid #000;
            }
        </style>

        <p><center><strong><font size="+2">
            7-day Observed<br>
            <img src="https://mrcc.purdue.edu/files/cliwatch/GIS_plots/prcp_mpe/prcp_mpe_007_tot-0.png" alt="7-Day Observed Multi-sensor Precipitation"><br>
        </font></strong></center></p>

        <p><center><strong><font size="+2">
            7-day QPF<br>
            <img src="https://www.wpc.ncep.noaa.gov/qpf/p168i.gif?1512662281" alt="7-Day QPF"><br>
        </font></strong></center></p>

        <p><center><strong><font size="+2">
            16-day QPF<br>
            <img src="https://www.weather.gov/images/ohrfc/dynamic/NAEFS16.apcp.mean.total.png" alt="16-Day QPF"><br>
        </font></strong></center></p>
        `;

        document.getElementById('output16').innerHTML = htmlContent;

    } else if (lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
        // Convert to a format JS Date understands
        const [month, day, year] = datetime.split('-');
        const baseDate = new Date(`${year}-${month}-${day}T00:00:00`);

        // Format: Fri 05/09
        function formatDateMMDD(dateObj) {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
            const dd = String(dateObj.getDate()).padStart(2, '0');
            return `${days[dateObj.getDay()]} ${mm}/${dd}`;
        }

        // Format: 01-Jun
        function formatDateDayMonth(dateObj) {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const day = String(dateObj.getDate()).padStart(2, '0');
            return `${days[dateObj.getDay()]} ${day}-${months[dateObj.getMonth()]}`;
        }

        // Offset helper
        function offsetDate(date, days) {
            const copy = new Date(date);
            copy.setDate(copy.getDate() + days);
            return copy;
        }

        // Calculate date ranges
        const observedStart = formatDateMMDD(baseDate);                  // today
        const observedEnd = formatDateMMDD(offsetDate(baseDate, 7));     // today + 7
        const qpf7Start = formatDateMMDD(offsetDate(baseDate, 7));       // today + 7
        const qpf7End = formatDateMMDD(offsetDate(baseDate, 14));        // today + 14
        const qpf16Start = qpf7Start;
        const qpf16End = formatDateDayMonth(offsetDate(baseDate, 15));   // today + 15

        // Build the HTML
        const htmlContent = `
        <style>
            #output16 img {
            width: 100%;
            max-width: 1000px;
            height: auto;
            border: 2px solid #000;
            }
        </style>

        <p><center><strong><font size="+2">
            7-day Observed<br>
            <img src="https://mrcc.purdue.edu/files/cliwatch/GIS_plots/prcp_mpe/prcp_mpe_007_tot-0.png" alt="7-Day Observed Multi-sensor Precipitation"><br>
        </font></strong></center></p>

        <p><center><strong><font size="+2">
            7-day QPF<br>
            <img src="https://www.wpc.ncep.noaa.gov/qpf/p168i.gif?1512662281" alt="7-Day QPF"><br>
        </font></strong></center></p>

        <p><center><strong><font size="+2">
            16-day QPF<br>
            <img src="https://www.weather.gov/images/ohrfc/dynamic/NAEFS16.apcp.mean.total.png" alt="16-Day QPF"><br>
        </font></strong></center></p>
        `;

        document.getElementById('output16').innerHTML = htmlContent;

    } else if (lake === "Rend Lk-Big Muddy" || lake === "Rend Lk") {
        const datetime = '05-17-2025'; // MM-DD-YYYY

        const [month, day, year] = datetime.split('-');
        const baseDate = new Date(`${year}-${month}-${day}T00:00:00`);

        function offsetDate(base, offset) {
            const d = new Date(base);
            d.setDate(d.getDate() + offset);
            return d;
        }

        function formatShortDate(date) {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return `${days[date.getDay()]} ${mm}/${dd}`;
        }

        function formatLongDate(date) {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const dd = String(date.getDate()).padStart(2, '0');
            return `${days[date.getDay()]} ${dd}-${months[date.getMonth()]}`;
        }

        // Dates
        const observedStart = formatShortDate(offsetDate(baseDate, -8));
        const observedEnd = formatShortDate(offsetDate(baseDate, -1));
        const qpf7Start = formatShortDate(offsetDate(baseDate, -1));
        const qpf7End = formatShortDate(offsetDate(baseDate, 6));
        const qpf16Start = formatLongDate(offsetDate(baseDate, -1));
        const qpf16End = formatLongDate(offsetDate(baseDate, 15));

        // HTML
        const html = `
        <style>
            #output16 img {
            max-width: 100%;
            height: auto;
            border: 2px solid black;
            }
        </style>

        <p>
            <strong><font size="+2"><center>
            7-day Observed<b><br>
            <img src="https://mrcc.purdue.edu/files/cliwatch/GIS_plots/prcp_mpe/prcp_mpe_007_tot-0.png" alt="7-Day Observed Multi-sensor Precipitation"><br>
            </font></center></strong>
        </p>

        <p>
            <font size="+2"><center><strong>
            7-day QPF<br>
            <img src="https://www.wpc.ncep.noaa.gov/qpf/p168i.gif?1512662281" alt="7-Day QPF"><br>
            </font></center></strong>
        </p>

        <p>
            <font size="+2"><center><strong>
            16-day QPF<br>
            <img src="https://www.weather.gov/images/ohrfc/dynamic/NAEFS16.apcp.mean.total.png" alt="16-Day QPF"><br>
            </font></center></strong>
        </p>
        `;

        document.getElementById('output16').innerHTML = html;

    }
});


// Lk Shelbyville-Kaskaskia
// Lk Shelbyville-Kaskaskia.Elev.Inst.1Hour.0.CWMS-Forecast-NoQPF
// Lk Shelbyville-Kaskaskia.Elev.Inst.1Hour.0.CWMS-Forecast-QPF

// Lk Shelbyville-Kaskaskia.Flow-In.Inst.1Hour.0.CWMS-Forecast-NoQPF
// Lk Shelbyville-Kaskaskia.Flow-In.Inst.1Hour.0.CWMS-Forecast-QPF

// Lk Shelbyville-Kaskaskia.Flow-Out.Inst.1Hour.0.CWMS-Forecast-NoQPF
// Lk Shelbyville-Kaskaskia.Flow-Out.Inst.1Hour.0.CWMS-Forecast-QPF

// Mark Twain Lk-Salt
// Mark Twain Lk-Salt.Elev.Inst.1Hour.0.CWMS-Forecast-NoQPF
// Mark Twain Lk-Salt.Elev.Inst.1Hour.0.CWMS-Forecast-QPF

// Mark Twain Lk-Salt.Flow-In.Inst.1Hour.0.CWMS-Forecast-NoQPF
// Mark Twain Lk-Salt.Flow-In.Inst.1Hour.0.CWMS-Forecast-QPF

// Mark Twain Lk-Salt.Flow-Out.Inst.1Hour.0.CWMS-Forecast-NoQPF
// Mark Twain Lk-Salt.Flow-Out.Inst.1Hour.0.CWMS-Forecast-QPF


// Carlyle Lk-Kaskaskia
// Carlyle Lk-Kaskaskia.Elev.Inst.1Hour.0.CWMS-Forecast-NoQPF
// Carlyle Lk-Kaskaskia.Elev.Inst.1Hour.0.CWMS-Forecast-QPF

// Carlyle Lk-Kaskaskia.Flow-In.Inst.1Hour.0.CWMS-Forecast-NoQPF
// Carlyle Lk-Kaskaskia.Flow-In.Inst.1Hour.0.CWMS-Forecast-QPF

// Carlyle Lk-Kaskaskia.Flow-Out.Inst.1Hour.0.CWMS-Forecast-NoQPF
// Carlyle Lk-Kaskaskia.Flow-Out.Inst.1Hour.0.CWMS-Forecast-QPF


// Rend Lk-Big Muddy
// Rend Lk-Big Muddy.Elev.Inst.1Hour.0.CWMS-Forecast-NoQPF
// Rend Lk-Big Muddy.Elev.Inst.1Hour.0.CWMS-Forecast-QPF

// Rend Lk-Big Muddy.Flow-In.Inst.1Hour.0.CWMS-Forecast-NoQPF
// Rend Lk-Big Muddy.Flow-In.Inst.1Hour.0.CWMS-Forecast-QPF

// Rend Lk-Big Muddy.Flow-Out.Inst.1Hour.0.CWMS-Forecast-NoQPF
// Rend Lk-Big Muddy.Flow-Out.Inst.1Hour.0.CWMS-Forecast-QPF


// Wappapello Lk-St Francis
// Wappapello Lk-St Francis.Elev.Inst.1Hour.0.CWMS-Forecast-NoQPF
// Wappapello Lk-St Francis.Elev.Inst.1Hour.0.CWMS-Forecast-QPF

// Wappapello Lk-St Francis.Flow-In.Inst.1Hour.0.CWMS-Forecast-NoQPF
// Wappapello Lk-St Francis.Flow-In.Inst.1Hour.0.CWMS-Forecast-QPF

// Wappapello Lk-St Francis.Flow-Out.Inst.1Hour.0.CWMS-Forecast-NoQPF
// Wappapello Lk-St Francis.Flow-Out.Inst.1Hour.0.CWMS-Forecast-QPF

// Remvove Percent Runoff ~ 16% from the title