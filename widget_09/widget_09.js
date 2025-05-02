document.addEventListener('DOMContentLoaded', async function () {
    console.log("lake: ", lake);
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

    const levelId = `${lake}.Elev.Inst.0.Seasonal Rule Curve`;
    console.log("levelId:", levelId);

    const levelId2 = `${lake}.Elev.Inst.0.Seasonal Rule Curve Production`;
    console.log("levelId:", levelId);

    const url = `${setBaseUrl}levels/${levelId}?office=MVS&effective-date=${isoDateToday}&unit=ft`;
    console.log("url:", url);

    const url2 = `${setBaseUrl}levels/${levelId2}?office=MVS&effective-date=${isoDateToday}&unit=ft`;
    console.log("url2:", url2);

    // Setup data to check for Seasonal Rule Curve
    let offsetMonths = month === 0 ? 11 : month - 1; // One month behind
    console.log("offsetMonths: ", offsetMonths);

    let offsetMinutes = day * 24 * 60;
    console.log("offsetMinutes: ", offsetMinutes);

    const fetchTsidData = async () => {
        try {
            const response1 = await fetch(url);
            const response2 = await fetch(url2);

            const data1 = await response1.json();
            console.log("data1:", data1);

            const data2 = await response2.json();
            console.log("data2:", data2);

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
                cdaSaveBtn = document.getElementById("cda-btn-rule-curve"); // Get the button by its ID

                cdaSaveBtn.disabled = true; // Disable button while checking login state

                // Update button text based on login status
                if (await isLoggedIn()) {
                    cdaSaveBtn.innerText = "Save";
                } else {
                    cdaSaveBtn.innerText = "Login";
                }

                cdaSaveBtn.disabled = false; // Re-enable button
            }

            console.log("Calling createTable ...");
            createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, levelId2, data2);

            loginStateController()
            setInterval(async () => {
                loginStateController()
            }, 10000)


            function createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, levelId2, data2) {
                console.log("levelId2:", levelId2);
                console.log("data2:", data2);

                console.log("constant-value: ", data2['constant-value']);

                const table = document.createElement("table");
                table.id = "rule-curve";

                const headerRow = document.createElement("tr");
                const dateHeader = document.createElement("th");
                dateHeader.textContent = "Date";
                headerRow.appendChild(dateHeader);

                const ruleCurveHeader = document.createElement("th");
                ruleCurveHeader.textContent = "Rule Curve";
                headerRow.appendChild(ruleCurveHeader);

                table.appendChild(headerRow);

                // No data, create a single row using isoDateToday and a blank outflow cell
                const row = document.createElement("tr");

                const dateCell = document.createElement("td");
                dateCell.textContent = isoDateToday;
                row.appendChild(dateCell);

                const ruleCurveCell = document.createElement("td");
                const ruleCurveInput = document.createElement("input");
                ruleCurveInput.type = "number";
                ruleCurveInput.value = data2['constant-value'].toFixed(2);  // Blank entry box
                ruleCurveInput.step = "0.01";  // Ensure the step increment is 0.01
                ruleCurveInput.className = "outflow-input";
                ruleCurveInput.id = `ruleCurveInput`;
                ruleCurveInput.style.textAlign = "center";
                ruleCurveInput.style.verticalAlign = "middle";

                if (!checkSeasonalValueMatch(data1, data2['constant-value'], offsetMonths, offsetMinutes)) {
                    console.log(checkSeasonalValueMatch(data1, data2['constant-value'], offsetMonths, offsetMinutes));  // true - all match

                    // Add styles to make text bold and red
                    ruleCurveInput.style.fontWeight = "bold";
                    ruleCurveInput.style.color = "red";
                }

                ruleCurveCell.appendChild(ruleCurveInput);
                row.appendChild(ruleCurveCell);

                table.appendChild(row);

                const output9Div = document.getElementById("output9");
                output9Div.innerHTML = "";
                output9Div.appendChild(table);

                const cdaSaveBtn = document.createElement("button");
                cdaSaveBtn.textContent = "Submit";
                cdaSaveBtn.id = "cda-btn-rule-curve";
                cdaSaveBtn.disabled = true;
                output9Div.appendChild(cdaSaveBtn);

                const statusDiv = document.createElement("div");
                statusDiv.className = "status-rule-curve";
                output9Div.appendChild(statusDiv);

                // Create the buttonRefresh button
                const buttonRefresh = document.createElement('button');
                buttonRefresh.textContent = 'Refresh';
                buttonRefresh.id = 'refresh-rule-curve-button';
                buttonRefresh.className = 'fetch-btn';
                output9Div.appendChild(buttonRefresh);

                buttonRefresh.addEventListener('click', () => {
                    // Remove existing table
                    const existingTable = document.getElementById('rule-curve');
                    if (existingTable) {
                        existingTable.remove();
                    }

                    const existingRefresh = document.getElementById('cda-btn-rule-curve');
                    if (existingRefresh) {
                        existingRefresh.remove();
                    }

                    // Fetch and create new table
                    fetchTsidData();
                });

                cdaSaveBtn.addEventListener("click", async () => {
                    const ruleCurveInput = document.getElementById(`ruleCurveInput`).value;
                    console.log("ruleCurveInput:", ruleCurveInput);

                    const payload = {
                        "office-id": "MVS",
                        "location-level-id": levelId2,
                        "specified-level-id": "Seasonal Rule Curve Production",
                        "parameter-type-id": "Inst",
                        "parameter-id": "Stage",
                        "constant-value": ruleCurveInput,
                        "level-units-id": "ft",
                        "level-date": "2025-02-25T00:00:00Z",
                        "level-comment": "",
                    }
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

                    async function writeLocationLevel(payload) {
                        if (!payload) throw new Error("You must specify a payload!");

                        try {
                            const response = await fetch("https://wm.mvs.ds.usace.army.mil/mvs-data/levels", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
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

                    async function fetchUpdatedData(levelId2, isoDateDay5, isoDateToday, isoDateMinus1Day) {
                        let response = null;

                        response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/levels/${levelId2}?office=MVS&effective-date=${isoDateToday}&unit=ft`, {
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
                        statusDiv.innerText = loginResult ? "" : "Failed to Login!";
                    } else {
                        try {
                            showSpinner(); // Show the spinner before creating the version
                            await writeLocationLevel(payload);
                            statusDiv.innerText = "Write successful!";

                            // Optional: small delay to allow backend to process the new data
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            // Fetch updated data and refresh the table
                            const updatedData = await fetchUpdatedData(levelId2, isoDateDay5, isoDateToday, isoDateMinus1Day);
                            createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, levelId2, updatedData);
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

    function getIsoDateWithOffset(year, month, day, offset) {
        // Create a date object in UTC (midnight UTC)
        const date = new Date(Date.UTC(year, month - 1, day, 6, 0, 0, 0)); // Set the initial time at 6 AM UTC

        // Convert the date to CST (UTC -6)
        const cstOffset = 0 * 60; // CST is UTC -6 hours, in minutes
        date.setMinutes(date.getMinutes() + cstOffset); // Adjust to CST

        // Add the offset in days (if positive, it moves forward, if negative, backward)
        date.setUTCDate(date.getUTCDate() + offset);

        // Return the ISO string
        return date.toISOString();
    }

    function checkSeasonalValueMatch(data, value, offsetMonths, offsetMinutes) {
        const seasonalValues = data["seasonal-values"];

        console.log(`Checking for value: ${value}, offsetMonths: ${offsetMonths}, offsetMinutes: ${offsetMinutes}`);

        let bestMatch = null;

        for (const seasonalValue of seasonalValues) {
            console.log(`Checking seasonal value:`, seasonalValue);

            if (seasonalValue["offset-months"] > offsetMonths) {
                console.log(`Skipping ${JSON.stringify(seasonalValue)} - offset-months too high`);
                continue; // Skip months greater than target
            }

            if (bestMatch === null) {
                console.log(`First candidate:`, seasonalValue);
                bestMatch = seasonalValue;
            } else {
                const isBetterMonth = seasonalValue["offset-months"] > bestMatch["offset-months"];
                const isSameMonthBetterMinutes = seasonalValue["offset-months"] === bestMatch["offset-months"] &&
                    seasonalValue["offset-minutes"] <= offsetMinutes &&
                    seasonalValue["offset-minutes"] > bestMatch["offset-minutes"];

                if (isBetterMonth || isSameMonthBetterMinutes) {
                    console.log(`Updating best match to:`, seasonalValue);
                    bestMatch = seasonalValue;
                }
            }
        }

        if (bestMatch) {
            console.log(`Best match found:`, bestMatch);
            if (bestMatch.value === value) {
                console.log(`Value matches! Returning true.`);
                return true;
            } else {
                console.log(`Value does not match. Expected: ${value}, Found: ${bestMatch.value}`);
            }
        } else {
            console.log(`No suitable match found.`);
        }

        return false;
    }
});