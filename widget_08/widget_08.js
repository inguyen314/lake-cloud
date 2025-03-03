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

    const urltsid1 = `${setBaseUrl}timeseries/group/Stage?office=${office}&category-id=${lake}`;
    const urltsid2 = `${setBaseUrl}timeseries/group/Flow?office=${office}&category-id=${lake}`;

    const fetchTimeSeriesData = async (tsid) => {
        const tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateMinus8Days}&end=${isoDateToday}&office=${office}`;
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
            const response1 = await fetch(urltsid1);
            const response2 = await fetch(urltsid2);

            const tsidData1 = await response1.json();
            const tsidData2 = await response2.json();

            // Extract the timeseries-id from the response
            const tsid1 = tsidData1['assigned-time-series'][0]['timeseries-id']; // Grab the first timeseries-id
            const tsid2 = tsidData2['assigned-time-series'][0]['timeseries-id']; // Grab the first timeseries-id

            console.log("tsid1:", tsid1);
            console.log("tsid2:", tsid2);

            // Fetch time series data using tsid values
            const timeSeriesData1 = await fetchTimeSeriesData(tsid1);
            const timeSeriesData2 = await fetchTimeSeriesData(tsid2);

            // Call getHourlyDataOnTopOfHour for both time series data
            const hourlyData1 = getMidnightData(timeSeriesData1, tsid1);
            const hourlyData2 = getMidnightData(timeSeriesData2, tsid2);

            console.log("hourlyData1:", hourlyData1);
            console.log("hourlyData2:", hourlyData2);

            const formattedData1 = hourlyData1.map(entry => {
                const formattedTimestamp = formatISODate2ReadableDate(Number(entry.timestamp)); // Ensure timestamp is a number
                // console.log("Original (hourlyData1):", entry.timestamp, "Formatted:", formattedTimestamp);
                return {
                    ...entry,
                    formattedTimestamp
                };
            });

            const formattedData2 = hourlyData2.map(entry => {
                const formattedTimestamp = formatISODate2ReadableDate(Number(entry.timestamp)); // Ensure timestamp is a number
                // console.log("Original (hourlyData2):", entry.timestamp, "Formatted:", formattedTimestamp);
                return {
                    ...entry,
                    formattedTimestamp
                };
            });

            // Now you have formatted data for both datasets
            console.log("Formatted Data for HourlyData1:", formattedData1);
            console.log("Formatted Data for HourlyData2:", formattedData2);

            function createTable(formattedData1, formattedData2) {
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

                const outflowHeader = document.createElement("th");
                outflowHeader.textContent = "Outflow";
                headerRow.appendChild(outflowHeader);

                table.appendChild(headerRow);

                // Combine the data based on matching timestamps
                let i = 0;
                let j = 0;

                while (i < formattedData1.length && j < formattedData2.length) {
                    // Find matching formattedTimestamps
                    if (formattedData1[i].formattedTimestamp === formattedData2[j].formattedTimestamp) {
                        const row = document.createElement("tr");

                        // Date column (from formattedData1)
                        const dateCell = document.createElement("td");
                        dateCell.textContent = formattedData1[i].formattedTimestamp; // Display formattedTimestamp as Date
                        row.appendChild(dateCell);

                        // Stage column (from formattedData1)
                        const stageCell = document.createElement("td");
                        stageCell.textContent = formattedData1[i].value.toFixed(2); // Assuming stage is from formattedData1
                        row.appendChild(stageCell);

                        // Outflow column (from formattedData2)
                        const outflowCell = document.createElement("td");
                        outflowCell.textContent = formattedData2[j].value.toFixed(0); // Assuming outflow is from formattedData2
                        row.appendChild(outflowCell);

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

                // Append the table to the specific container (id="output8")
                const output4Div = document.getElementById("output8");
                output4Div.innerHTML = ""; // Clear any existing content
                output4Div.appendChild(table);
            }

            function createTableAvg(formattedData2) {
                // Extract the last two values
                const lastValue = formattedData2[formattedData2.length - 1].value;
                const secondLastValue = formattedData2[formattedData2.length - 2].value;

                // Calculate the average of the last two values
                const averageValue = (lastValue + secondLastValue) / 2;

                // Create the table structure
                const table = document.createElement("table");

                // Apply the ID "gate-settings" to the table
                table.id = "gate-settings";

                // Create the header row
                const headerRow = table.insertRow();
                const col1 = headerRow.insertCell();
                const col2 = headerRow.insertCell();

                col1.textContent = "Average Outflow for Yesterday:";
                col2.textContent = averageValue.toFixed(0);  // Format the average value to 0 decimal places
                col2.style.fontWeight = "bold";

                // Set column widths: 2/3 for col1 and 1/3 for col2
                col1.style.width = "66%";  // 2/3 width
                col2.style.width = "33%";  // 1/3 width

                // Add a title for the tooltip when hovering over col2
                col2.title = `The average outflow value for yesterday is: ${lastValue.toFixed(0)}/${secondLastValue.toFixed(0)} =  ${averageValue.toFixed(0)}`;

                // Insert the table into the "output8" div
                const outputDiv = document.getElementById("output8");
                outputDiv.appendChild(table);
            }

            // Call the function with formattedData1 and formattedData2
            createTable(formattedData1, formattedData2);

            // Call the function
            createTableAvg(formattedData2);

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