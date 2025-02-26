document.addEventListener('DOMContentLoaded', async function () {
    if (lake === "Rend Lk-Big Muddy" || lake === "Rend Lk" || lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk" || lake === "Carlyle Lk-Kaskaskia" || lake === "Rend Lk") {
        console.log("****************** Rend Lk-Big Muddy ******************");
        console.log('lake: ', lake);
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

        const beginDateTime = new Date(year, month - 1, day);
        beginDateTime.setHours(6, 0, 0, 0);
        console.log('beginDateTime:', beginDateTime);

        const endDateTime = addHoursFromDate(beginDateTime, 5 * 24);
        console.log('endDateTime:', endDateTime);

        // Initialize the date object correctly
        const isoDateToday = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)).toISOString();

        // Function to generate ISO string for a given day offset
        function getIsoDateWithOffset(year, month, day, offset) {
            const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)); // Set the initial date
            date.setUTCDate(date.getUTCDate() + offset); // Add the offset (day)
            return date.toISOString();
        }

        // Generate ISO strings for Day 1 to Day 7
        const isoDateDay1 = getIsoDateWithOffset(year, month, day, 1);
        const isoDateDay2 = getIsoDateWithOffset(year, month, day, 2);
        const isoDateDay3 = getIsoDateWithOffset(year, month, day, 3);
        const isoDateDay4 = getIsoDateWithOffset(year, month, day, 4);
        const isoDateDay5 = getIsoDateWithOffset(year, month, day, 5);
        const isoDateDay6 = getIsoDateWithOffset(year, month, day, 6);
        const isoDateDay7 = getIsoDateWithOffset(year, month, day, 7);

        console.log("isoDateToday:", isoDateToday);
        console.log("isoDateDay1:", isoDateDay1);
        console.log("isoDateDay2:", isoDateDay2);
        console.log("isoDateDay3:", isoDateDay3);
        console.log("isoDateDay4:", isoDateDay4);
        console.log("isoDateDay5:", isoDateDay5);
        console.log("isoDateDay6:", isoDateDay6);
        console.log("isoDateDay7:", isoDateDay7);



        const urltsid1 = `${setBaseUrl}timeseries/group/Forecast-Lake?office=${office}&category-id=${lake}`;

        const fetchTimeSeriesData = async (tsid) => {
            const tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${beginDateTime.toISOString()}&end=${endDateTime.toISOString()}&office=${office}&version-date=${isoDateToday}`;
            console.log('tsidData:', tsidData);

            try {
                const response = await fetch(tsidData, {
                    headers: {
                        "Accept": "application/json;version=2" // Ensuring the correct version is used
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

        function subtractHoursFromDate(date, hoursToSubtract) {
            return new Date(date.getTime() - (hoursToSubtract * 60 * 60 * 1000));
        }

        function addHoursFromDate(date, hoursToSubtract) {
            return new Date(date.getTime() + (hoursToSubtract * 60 * 60 * 1000));
        }

        const fetchTsidData = async () => {
            try {
                const response1 = await fetch(urltsid1);

                const tsidData1 = await response1.json();

                console.log("tsidData1:", tsidData1);

                // Extract the timeseries-id from the response
                const tsid1 = tsidData1['assigned-time-series'][0]['timeseries-id']; // Grab the first timeseries-id

                console.log("tsid1:", tsid1);

                // Fetch time series data using tsid values
                const timeSeriesData1 = await fetchTimeSeriesData(tsid1);
                console.log("timeSeriesData1:", timeSeriesData1);

                if (timeSeriesData1 && timeSeriesData1.values && timeSeriesData1.values.length > 0) {
                    const formattedData1 = timeSeriesData1.values.map(entry => {
                        const timestamp = entry[0]; // Timestamp is in milliseconds in the array
                        const formattedTimestamp = formatISODate2ReadableDate(Number(timestamp)); // Ensure timestamp is a number

                        return {
                            ...entry, // Retain other data
                            formattedTimestamp // Add formatted timestamp
                        };
                    });

                    // Now you have formatted data for both datasets
                    console.log("Formatted Data for formattedData1:", formattedData1);

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

                        // Iterate through formattedData1 and populate the table
                        formattedData1.forEach(entry => {
                            const row = document.createElement("tr");

                            // Date column
                            const dateCell = document.createElement("td");
                            dateCell.textContent = entry.formattedTimestamp;
                            row.appendChild(dateCell);

                            // Stage column
                            const stageCell = document.createElement("td");
                            stageCell.textContent = entry[1].toFixed(2); // Access the stage value from entry[1]
                            row.appendChild(stageCell);

                            table.appendChild(row);
                        });

                        // Append the table to the specific container (id="output6")
                        const output6Div = document.getElementById("output6");
                        output6Div.innerHTML = ""; // Clear any existing content
                        output6Div.appendChild(table);
                    }

                    // Call the function with formattedData1
                    createTable(formattedData1);
                } else {
                    // If no data, create an empty table
                    createEmptyTable(isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsid1);
                }
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

            function createEmptyTable(isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, name) {
                // Create the empty table element
                const table = document.createElement("table");

                // Apply the ID "gate-settings" to the table
                table.id = "gate-settings";

                // Create the table header row
                const headerRow = document.createElement("tr");

                const dateHeader = document.createElement("th");
                dateHeader.textContent = "Day";
                headerRow.appendChild(dateHeader);

                const stageHeader = document.createElement("th");
                stageHeader.textContent = "Forecast Outflow (cfs)";
                headerRow.appendChild(stageHeader);

                table.appendChild(headerRow);

                // Create the data rows with the given dates and empty "Stage" fields
                const dates = [isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7];

                dates.forEach(date => {
                    const row = document.createElement("tr");

                    // Date cell
                    const dateCell = document.createElement("td");
                    dateCell.textContent = date;
                    row.appendChild(dateCell);

                    // Stage cell (editable)
                    const stageCell = document.createElement("td");
                    const stageInput = document.createElement("input");
                    stageInput.type = "text"; // Make the input editable
                    stageInput.value = ""; // Initially empty
                    stageInput.id = `stageInput-${date}`; // Assign a unique ID for each input
                    stageCell.appendChild(stageInput);
                    row.appendChild(stageCell);

                    table.appendChild(row);
                });

                // Append the table to the specific container (id="output6")
                const output6Div = document.getElementById("output6");
                output6Div.innerHTML = ""; // Clear any existing content
                output6Div.appendChild(table);

                // Create and append the submit button below the table
                const submitButton = document.createElement("button");
                submitButton.textContent = "Submit";
                submitButton.id = "cda-btn"; // Use the cda-btn ID for the button
                submitButton.disabled = false; // Initially disable the button
                output6Div.appendChild(submitButton);

                // Add event listener to the submit button
                submitButton.addEventListener("click", async () => {
                    // Prepare the new payload format
                    // const name = "Mark Twain Lk-Salt.Flow-Out.Inst.~1Day.0.lakerep-rev-forecast";
                    const units = "cfs";
                    const office = "MVS";

                    const payload = {
                        "date-version-type": "MAX_AGGREGATE",
                        "name": name,
                        "office-id": office,
                        "units": units,
                        "values": dates.map((date, index) => {
                            let stageValue = document.getElementById(`stageInput-${date}`).value; // Get value from input field

                            // If stageValue is empty or null, set it to 909
                            if (!stageValue) {
                                stageValue = "909"; // Default value when empty or null
                            }

                            // Determine the corresponding day timestamp (replace with actual dates)
                            const day = new Date();
                            day.setDate(day.getDate() + index); // Add index to get the correct day (Day 0, Day 1, ...)
                            const timestamp = day.getTime(); // Timestamp for the corresponding day

                            return [
                                timestamp,  // Timestamp for the day at 6 AM
                                parseInt(stageValue), // Stage value (forecast outflow) as number
                                0 // Placeholder for the third value (set to 0 for now)
                            ];
                        }),
                        "version-date": isoDateToday, // Ensure this is the correct ISO formatted date
                    };

                    console.log("payload: ", payload);
                });

            }

            async function createVersionTS(payload) {
                if (!payload) throw new Error("You must specify a payload!");
                try {
                    const response = await fetch("https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?store-rule=REPLACE%20ALL", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json;version=2",
                        },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                    }

                    return true;
                } catch (error) {
                    console.error('Error writing timeseries:', error);
                    throw error;
                }
            }

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

            async function loginCDA() {
                if (await isLoggedIn()) return true;

                // Redirect to login page
                window.location.href = `https://wm.mvs.ds.usace.army.mil:8243/CWMSLogin/login?OriginalLocation=${encodeURIComponent(window.location.href)}`;
            }

            const cdaSaveBtn = document.getElementById("cda-btn");

            async function loginStateController() {
                cdaSaveBtn.disabled = true; // Disable button while checking login state

                // Update button text based on login status
                if (await isLoggedIn()) {
                    cdaSaveBtn.innerText = "Save";
                    cdaSaveBtn.disabled = false; // Enable button if logged in
                } else {
                    cdaSaveBtn.innerText = "Login";
                    cdaSaveBtn.disabled = true; // Keep the button disabled if not logged in
                }
            }

            document.addEventListener("DOMContentLoaded", () => {
                loginStateController(); // Call login state check when the page is loaded
            });

        };

        fetchTsidData();
    } else if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
        console.log("****************** Mark Twain Lk-Salt");
        console.log('datetime: ', datetime);

    }
});