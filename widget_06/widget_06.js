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

        const now = new Date();

        const isoDateToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
        const isoDateDay1 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)).toISOString();
        const isoDateDay2 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 2)).toISOString();
        const isoDateDay3 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 3)).toISOString();
        const isoDateDay4 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 4)).toISOString();
        const isoDateDay5 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 5)).toISOString();
        const isoDateDay6 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 6)).toISOString();
        const isoDateDay7 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 7)).toISOString();

        console.log("isoDateToday: ", isoDateToday);
        console.log("isoDateDay1: ", isoDateDay1);
        console.log("isoDateDay2: ", isoDateDay2);
        console.log("isoDateDay3: ", isoDateDay3);
        console.log("isoDateDay4: ", isoDateDay4);
        console.log("isoDateDay5: ", isoDateDay5);
        console.log("isoDateDay6: ", isoDateDay6);
        console.log("isoDateDay7: ", isoDateDay7);

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
                    createEmptyTable();
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

            function createEmptyTable() {
                // Create the empty table element
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
            
                // Create an empty row
                const row = document.createElement("tr");
            
                const emptyCell = document.createElement("td");
                emptyCell.colSpan = 2; // Span across both columns
                emptyCell.textContent = "No data available";
                row.appendChild(emptyCell);
            
                table.appendChild(row);
            
                // Append the table to the specific container (id="output6")
                const output6Div = document.getElementById("output6");
                output6Div.innerHTML = ""; // Clear any existing content
                output6Div.appendChild(table);
            }
        };

        fetchTsidData();
    } else if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
        console.log("****************** Mark Twain Lk-Salt");
        console.log('datetime: ', datetime);

    }
});