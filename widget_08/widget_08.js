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

    const urlPrecipTsid = `${setBaseUrl}timeseries/group/Stage?office=${office}&category-id=${lake}`;

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

    const fetchTsidData = async () => {
        try {
            const response1 = await fetch(urlPrecipTsid);

            const tsidDataPrecip = await response1.json();

            // Extract the timeseries-id from the response
            const tsidPrecip = tsidDataPrecip['assigned-time-series'][0]['timeseries-id']; // Grab the first timeseries-id

            console.log("tsidPrecip:", tsidPrecip);

            // Fetch time series data using tsid values
            const timeSeriesDataPrecip = await fetchTimeSeriesData(tsidPrecip);

            // Call getHourlyDataOnTopOfHour for both time series data
            const midnightDataPrecip = getMidnightData(timeSeriesDataPrecip, tsidPrecip);

            console.log("midnightDataPrecip:", midnightDataPrecip);

            const midnightDataPrecipFormatted = midnightDataPrecip.map(entry => {
                const formattedTimestamp = formatISODate2ReadableDate(Number(entry.timestamp)); // Ensure timestamp is a number
                // console.log("Original (midnightDataPrecip):", entry.timestamp, "Formatted:", formattedTimestamp);
                return {
                    ...entry,
                    formattedTimestamp
                };
            });

            // Now you have formatted data for both datasets
            console.log("Formatted Data for midnightDataPrecip:", midnightDataPrecipFormatted);

            function createTable(formattedData1) {
                // Create the table element
                const table = document.createElement("table");
            
                // Apply the ID "gate-settings" to the table
                table.id = "gate-settings";
            
                // Create the table header row
                const headerRow = document.createElement("tr");
            
                const dateHeader = document.createElement("th");
                dateHeader.textContent = "Date";
                headerRow.appendChild(dateHeader);
            
                const stageHeader = document.createElement("th");
                stageHeader.textContent = "Stage";
                headerRow.appendChild(stageHeader);
            
                table.appendChild(headerRow);
            
                // Loop through formattedData1 to create rows
                formattedData1.forEach(dataPoint => {
                    const row = document.createElement("tr");
            
                    // Date column
                    const dateCell = document.createElement("td");
                    dateCell.textContent = dataPoint.formattedTimestamp;
                    row.appendChild(dateCell);
            
                    // Stage column - make editable
                    const stageCell = document.createElement("td");
                    stageCell.contentEditable = "true";  // Make the cell editable
                    stageCell.textContent = dataPoint.value.toFixed(2);
                    row.appendChild(stageCell);
            
                    table.appendChild(row);
                });
            
                // Append the table to the specific container (id="output8")
                const output4Div = document.getElementById("output8");
                output4Div.innerHTML = ""; // Clear any existing content
                output4Div.appendChild(table);
            }
            

            // Call the function with midnightDataPrecipFormatted and formattedData2
            createTable(midnightDataPrecipFormatted);
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
        const cstOffset = 6 * 60; // CST is UTC -6 hours, in minutes
        date.setMinutes(date.getMinutes() + cstOffset); // Adjust to CST

        // Add the offset in days (if positive, it moves forward, if negative, backward)
        date.setUTCDate(date.getUTCDate() + offset);

        // Return the ISO string
        return date.toISOString();
    }
});


// Lk Shelbyville-Kaskaskia.Precip.Total.~1Day.1Day.lakerep-rev-test
// Carlyle Lk-Kaskaskia.Precip.Total.~1Day.1Day.lakerep-rev-test
// Mark Twain Lk-Salt.Precip.Total.~1Day.1Day.lakerep-rev-test
// Wappapello Lk-St Francis.Precip.Total.~1Day.1Day.lakerep-rev-test
// Rend Lk-Big Muddy.Precip.Total.~1Day.1Day.lakerep-rev-test