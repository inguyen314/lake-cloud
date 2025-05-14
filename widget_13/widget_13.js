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

    const tsid = `${setBaseUrl}timeseries/group/Schedule?office=${office}&category-id=${lake}`;
    console.log("tsid:", tsid);

    const tsid2 = `${setBaseUrl}timeseries/group/Instruction?office=${office}&category-id=${lake}`;
    console.log("tsid2:", tsid2);

    const fetchTsidData = async () => {
        try {
            const response1 = await fetch(tsid);
            const response2 = await fetch(tsid2);

            const tsidDataNote = await response1.json();
            const tsidDataInstruction = await response2.json();

            // Extract the timeseries-id from the response
            const tsidSchedule = tsidDataNote['assigned-time-series'][0]['timeseries-id'];
            console.log("tsidSchedule:", tsidSchedule);
            const tsidInstruction = tsidDataInstruction['assigned-time-series'][0]['timeseries-id'];
            console.log("tsidInstruction:", tsidInstruction);

            // Fetch time series data using tsid values
            const timeSeriesDataSchedule = await fetchTimeSeriesData(tsidSchedule);
            console.log("timeSeriesDataSchedule:", timeSeriesDataSchedule);
            const timeSeriesDataScheduleYesterday = await fetchTimeSeriesDataYesterday(tsidSchedule);
            console.log("timeSeriesDataScheduleYesterday:", timeSeriesDataScheduleYesterday);

            // Fetch time series data using tsid values
            const timeSeriesDataInstruction = await fetchTimeSeriesData(tsidInstruction);
            console.log("timeSeriesDataInstruction:", timeSeriesDataInstruction);
            const timeSeriesDataInstructionYesterday = await fetchTimeSeriesDataYesterday(tsidInstruction);
            console.log("timeSeriesDataInstructionYesterday:", timeSeriesDataInstructionYesterday);

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
                cdaSaveBtn = document.getElementById("cda-btn-schedule-instruction "); // Get the button by its ID

                cdaSaveBtn.disabled = true; // Disable button while checking login state

                // Update button text based on login status
                if (await isLoggedIn()) {
                    cdaSaveBtn.innerText = "Save";
                } else {
                    cdaSaveBtn.innerText = "Login";
                }

                cdaSaveBtn.disabled = false; // Re-enable button
            }

            if (timeSeriesDataSchedule && timeSeriesDataSchedule['regular-text-values'] && timeSeriesDataSchedule['regular-text-values'].length > 0) {
                console.log("Calling createTable ...");
                createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidSchedule, timeSeriesDataSchedule, timeSeriesDataScheduleYesterday, tsidInstruction, timeSeriesDataInstruction, timeSeriesDataInstructionYesterday);

                loginStateController()
                setInterval(async () => {
                    loginStateController()
                }, 10000)
            } else {
                console.log("Calling createDataEntryTable ...");
                createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidSchedule, timeSeriesDataSchedule, timeSeriesDataScheduleYesterday, tsidInstruction, timeSeriesDataInstruction, timeSeriesDataInstructionYesterday);

                loginStateController()
                setInterval(async () => {
                    loginStateController()
                }, 10000)
            }

            function createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidSchedule, timeSeriesDataSchedule, timeSeriesDataScheduleYesterday, tsidInstruction, timeSeriesDataInstruction, timeSeriesDataInstructionYesterday) {
                timeSeriesDataSchedule["regular-text-values"].forEach(item => {
                    // Check if "date-time" exists and is a valid Unix timestamp (number)
                    if (item["date-time"] && typeof item["date-time"] === "number") {
                        item["date-time-iso"] = convertUnixTimestampToISO(item["date-time"]);
                    } else {
                        console.error("Invalid timestamp for date-time:", item["date-time"]);
                    }

                    // Check if "data-entry-date" exists and is a valid Unix timestamp (number)
                    if (item["data-entry-date"] && typeof item["data-entry-date"] === "number") {
                        // Add the ISO format for "data-entry-date" without overwriting the existing "data-entry-date-iso" field
                        if (!item["data-entry-date-iso"]) {
                            item["data-entry-date-iso"] = convertUnixTimestampToISO(item["data-entry-date"]);
                        }
                    } else if (item["data-entry-date"] && typeof item["data-entry-date"] === "string" && !isNaN(Date.parse(item["data-entry-date"]))) {
                        // If "data-entry-date" is already an ISO string, just add a new field with the same value
                        item["data-entry-date-iso"] = item["data-entry-date"];
                    } else {
                        console.error("Invalid date format for data-entry-date:", item["data-entry-date"]);
                    }
                });

                const formattedScheduleData = timeSeriesDataSchedule;
                console.log("formattedScheduleData:", formattedScheduleData);

                timeSeriesDataScheduleYesterday["regular-text-values"].forEach(item => {
                    // Check if "date-time" exists and is a valid Unix timestamp (number)
                    if (item["date-time"] && typeof item["date-time"] === "number") {
                        item["date-time-iso"] = convertUnixTimestampToISO(item["date-time"]);
                    } else {
                        console.error("Invalid timestamp for date-time:", item["date-time"]);
                    }

                    // Check if "data-entry-date" exists and is a valid Unix timestamp (number)
                    if (item["data-entry-date"] && typeof item["data-entry-date"] === "number") {
                        // Add the ISO format for "data-entry-date" without overwriting the existing "data-entry-date-iso" field
                        if (!item["data-entry-date-iso"]) {
                            item["data-entry-date-iso"] = convertUnixTimestampToISO(item["data-entry-date"]);
                        }
                    } else if (item["data-entry-date"] && typeof item["data-entry-date"] === "string" && !isNaN(Date.parse(item["data-entry-date"]))) {
                        // If "data-entry-date" is already an ISO string, just add a new field with the same value
                        item["data-entry-date-iso"] = item["data-entry-date"];
                    } else {
                        console.error("Invalid date format for data-entry-date:", item["data-entry-date"]);
                    }
                });

                const formattedDataScheduleYesterday = timeSeriesDataScheduleYesterday;
                console.log("formattedDataScheduleYesterday:", formattedDataScheduleYesterday);

                timeSeriesDataInstruction["regular-text-values"].forEach(item => {
                    // Check if "date-time" exists and is a valid Unix timestamp (number)
                    if (item["date-time"] && typeof item["date-time"] === "number") {
                        item["date-time-iso"] = convertUnixTimestampToISO(item["date-time"]);
                    } else {
                        console.error("Invalid timestamp for date-time:", item["date-time"]);
                    }

                    // Check if "data-entry-date" exists and is a valid Unix timestamp (number)
                    if (item["data-entry-date"] && typeof item["data-entry-date"] === "number") {
                        // Add the ISO format for "data-entry-date" without overwriting the existing "data-entry-date-iso" field
                        if (!item["data-entry-date-iso"]) {
                            item["data-entry-date-iso"] = convertUnixTimestampToISO(item["data-entry-date"]);
                        }
                    } else if (item["data-entry-date"] && typeof item["data-entry-date"] === "string" && !isNaN(Date.parse(item["data-entry-date"]))) {
                        // If "data-entry-date" is already an ISO string, just add a new field with the same value
                        item["data-entry-date-iso"] = item["data-entry-date"];
                    } else {
                        console.error("Invalid date format for data-entry-date:", item["data-entry-date"]);
                    }
                });

                const formattedDataInstruction = timeSeriesDataInstruction;
                console.log("formattedDataInstruction:", formattedDataInstruction);

                timeSeriesDataInstructionYesterday["regular-text-values"].forEach(item => {
                    // Check if "date-time" exists and is a valid Unix timestamp (number)
                    if (item["date-time"] && typeof item["date-time"] === "number") {
                        item["date-time-iso"] = convertUnixTimestampToISO(item["date-time"]);
                    } else {
                        console.error("Invalid timestamp for date-time:", item["date-time"]);
                    }

                    // Check if "data-entry-date" exists and is a valid Unix timestamp (number)
                    if (item["data-entry-date"] && typeof item["data-entry-date"] === "number") {
                        // Add the ISO format for "data-entry-date" without overwriting the existing "data-entry-date-iso" field
                        if (!item["data-entry-date-iso"]) {
                            item["data-entry-date-iso"] = convertUnixTimestampToISO(item["data-entry-date"]);
                        }
                    } else if (item["data-entry-date"] && typeof item["data-entry-date"] === "string" && !isNaN(Date.parse(item["data-entry-date"]))) {
                        // If "data-entry-date" is already an ISO string, just add a new field with the same value
                        item["data-entry-date-iso"] = item["data-entry-date"];
                    } else {
                        console.error("Invalid date format for data-entry-date:", item["data-entry-date"]);
                    }
                });

                const formattedDataInstructionYesterday = timeSeriesDataInstructionYesterday;
                console.log("formattedDataInstructionYesterday:", formattedDataInstructionYesterday);

                const table = document.createElement("table");
                table.id = "release-schedule-instruction";

                const headerRow = document.createElement("tr");
                const dateHeader = document.createElement("th");
                dateHeader.textContent = "Date";
                headerRow.appendChild(dateHeader);

                const textValueHeader = document.createElement("th");
                textValueHeader.textContent = "Release Schedule and Instruction";
                headerRow.appendChild(textValueHeader);

                table.appendChild(headerRow);

                // Check if "regular-text-values" exists and is an array
                if (Array.isArray(formattedScheduleData["regular-text-values"]) && formattedScheduleData["regular-text-values"].length > 0) {
                    // Render rows from "regular-text-values"
                    formattedScheduleData["regular-text-values"].forEach((entry) => {
                        const row = document.createElement("tr");

                        // Use "date-time-iso" for the date
                        const dateCell = document.createElement("td");
                        // dateCell.textContent = entry["date-time-iso"] || "No Date";
                        dateCell.textContent = new Date(entry["date-time-iso"]).toISOString().slice(5, 7) + '-' + new Date(entry["date-time-iso"]).toISOString().slice(8, 10) + '-' + new Date(entry["date-time-iso"]).toISOString().slice(0, 4);
                        row.appendChild(dateCell);

                        // Make the "text-value" editable
                        const textValueCell = document.createElement("td");
                        const textValueScheduleInput = document.createElement("input");
                        textValueScheduleInput.type = "text";
                        textValueScheduleInput.value = entry["text-value"] || "No Text";
                        textValueScheduleInput.className = "text-value-input";
                        textValueScheduleInput.id = `textValueScheduleInput-${entry["date-time-iso"]}`;
                        textValueScheduleInput.style.textAlign = "center";
                        textValueScheduleInput.style.verticalAlign = "middle";
                        textValueCell.appendChild(textValueScheduleInput);
                        row.appendChild(textValueCell);

                        table.appendChild(row);
                    });
                } else {
                    const fallbackTextValue =
                        formattedDataScheduleYesterday?.["regular-text-values"]?.[0]?.["text-value"];

                    const row = document.createElement("tr");

                    // Use "isoDateToday" as a fallback for the date
                    const dateCell = document.createElement("td");
                    // dateCell.textContent = isoDateToday;
                    dateCell.textContent = new Date(isoDateToday).toISOString().slice(5, 7) + '-' + new Date(isoDateToday).toISOString().slice(8, 10) + '-' + new Date(isoDateToday).toISOString().slice(0, 4);
                    row.appendChild(dateCell);

                    // Editable "text-value" with fallback from yesterday's data
                    const textValueCell = document.createElement("td");
                    const textValueScheduleInput = document.createElement("input");
                    textValueScheduleInput.type = "text";
                    textValueScheduleInput.value = fallbackTextValue;
                    textValueScheduleInput.style.backgroundColor = "pink";
                    textValueScheduleInput.className = "text-value-input";
                    textValueScheduleInput.id = `textValueScheduleInput-${isoDateToday}`;
                    textValueScheduleInput.style.textAlign = "center";
                    textValueScheduleInput.style.verticalAlign = "middle";
                    textValueCell.appendChild(textValueScheduleInput);
                    row.appendChild(textValueCell);

                    table.appendChild(row);
                }

                const output13Div = document.getElementById("output13");
                output13Div.innerHTML = "";
                output13Div.appendChild(table);

                if (Array.isArray(formattedDataInstruction["regular-text-values"]) && formattedDataInstruction["regular-text-values"].length > 0) {
                    formattedDataInstruction["regular-text-values"].forEach((entry) => {
                        const instructionDiv = document.createElement("div");
                        instructionDiv.className = "status";

                        const instructionInput = document.createElement("textarea");
                        instructionInput.type = "text";
                        instructionInput.value = entry["text-value"] || "No Text";
                        instructionInput.id = "instruction-input";
                        instructionInput.placeholder = "Type your note...";
                        instructionInput.className = "editable-input";
                        // Styling
                        instructionInput.style.textAlign = "center";
                        instructionInput.style.verticalAlign = "middle";
                        instructionInput.style.padding = "8px";
                        instructionInput.style.border = "1px solid #ccc";
                        instructionInput.style.borderRadius = "6px";
                        instructionInput.style.fontSize = "14px";
                        instructionInput.style.width = "50%";
                        instructionInput.style.boxSizing = "border-box";
                        instructionInput.style.height = "auto";
                        instructionInput.style.minHeight = "100px";
                        instructionInput.style.resize = "vertical";
                        instructionDiv.appendChild(instructionInput);
                        output13Div.appendChild(instructionDiv);
                    });
                } else {
                    const fallbackInstructionTextValue = formattedDataInstructionYesterday?.["regular-text-values"]?.[0]?.["text-value"];
                    const instructionDiv = document.createElement("div");
                    instructionDiv.className = "status";

                    const instructionInput = document.createElement("textarea");
                    instructionInput.type = "text";
                    instructionInput.style.backgroundColor = "pink";
                    instructionInput.value = fallbackInstructionTextValue;
                    instructionInput.id = "instruction-input";
                    instructionInput.placeholder = "Type your note...";
                    instructionInput.className = "editable-input";
                     // Styling
                     instructionInput.style.textAlign = "center";
                     instructionInput.style.verticalAlign = "middle";
                     instructionInput.style.padding = "8px";
                     instructionInput.style.border = "1px solid #ccc";
                     instructionInput.style.borderRadius = "6px";
                     instructionInput.style.fontSize = "14px";
                     instructionInput.style.width = "50%";
                     instructionInput.style.boxSizing = "border-box";
                     instructionInput.style.height = "auto";
                     instructionInput.style.minHeight = "100px";
                     instructionInput.style.resize = "vertical";
                    instructionDiv.appendChild(instructionInput);
                    output13Div.appendChild(instructionDiv);
                }

                const cdaSaveBtn = document.createElement("button");
                cdaSaveBtn.textContent = "Submit";
                cdaSaveBtn.id = "cda-btn-schedule-instruction ";
                cdaSaveBtn.disabled = false;
                output13Div.appendChild(cdaSaveBtn);

                const statusDiv = document.createElement("div");
                statusDiv.className = "status-schedule-instruction";
                output13Div.appendChild(statusDiv);

                const sendCannonBtn = document.createElement("button");
                sendCannonBtn.textContent = "Send Cannon Requirements";
                sendCannonBtn.id = "send-cannon";
                sendCannonBtn.disabled = false;
                sendCannonBtn.className = "fetch-btn";
                // Set the URL you want to open
                const cannonUrl = "https://wm.mvs.ds.usace.army.mil/mvs/cannon_requirements/index.html";

                sendCannonBtn.addEventListener("click", () => {
                    window.open(cannonUrl, "_blank");
                });
                output13Div.appendChild(sendCannonBtn);

                const sendMvkBtn = document.createElement("button");
                sendMvkBtn.textContent = "Send MVK Instructions";
                sendMvkBtn.id = "send-mvk";
                sendMvkBtn.disabled = false;
                sendMvkBtn.className = "fetch-btn";
                output13Div.appendChild(sendMvkBtn);

                const sendSwpaBtn = document.createElement("button");
                sendSwpaBtn.textContent = "Send SWPA Message";
                sendSwpaBtn.id = "send-swpa";
                sendSwpaBtn.disabled = false;
                sendSwpaBtn.className = "fetch-btn";
                output13Div.appendChild(sendSwpaBtn);

                // Create the buttonRefresh button
                const buttonRefresh = document.createElement('button');
                buttonRefresh.textContent = 'Refresh';
                buttonRefresh.id = 'refresh-schedule-instruction';
                buttonRefresh.className = 'fetch-btn';
                output13Div.appendChild(buttonRefresh);

                buttonRefresh.addEventListener('click', () => {
                    // Remove existing table
                    const existingTable = document.getElementById('release-schedule-instruction');
                    if (existingTable) {
                        existingTable.remove();
                    }

                    // Remove both buttons
                    const existingInput = document.getElementById('instruction-input');
                    if (existingInput) {
                        existingInput.remove();
                    }

                    // Remove both buttons
                    const existingSaveButton = document.getElementById('cda-btn-schedule-instruction ');
                    if (existingSaveButton) {
                        existingSaveButton.remove();
                    }

                    // Remove both buttons
                    const existingMvkButton = document.getElementById('send-mvk');
                    if (existingMvkButton) {
                        existingMvkButton.remove();
                    }

                    const existingSwpaButton = document.getElementById('send-swpa');
                    if (existingSwpaButton) {
                        existingSwpaButton.remove();
                    }

                    // Fetch and create new table
                    fetchTsidData();
                });

                sendMvkBtn.addEventListener("click", async () => {
                    const recipient = "cemvs-cwms@usace.army.mil; brian.k.bean@usace.army.mil; Bryan.E.Bennett@usace.army.mil; Gregory.S.Kimery@usace.army.mil; Rocky.L.Reed@usace.army.mil; Larry.J.Hurt@usace.army.mil; Michael.D.Tate@usace.army.mil; James.A.McKeon@usace.army.mil; DLL-CEMVS-OD-JP@usace.army.mil";
                    const cc = "DLL-CEMVS-WATER-MANAGERS@usace.army.mil; Allen.Phillips@usace.army.mil; Edward.J.Brauer@usace.army.mil; David.R.Busse@usace.army.mil; Bradley.J.Krischel@usace.army.mil; Kevin.P.Slattery@usace.army.mil";
                    // const bcc = "chn262@gmail.com";

                    const today = new Date();
                    const dateStr = today.toISOString().split('T')[0];
                    const timeStr = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    const scheduleValue = formattedScheduleData?.["regular-text-values"]?.[0]?.["text-value"];
                    const instructionValue = formattedDataInstruction?.["regular-text-values"]?.[0]?.["text-value"];

                    const subject = encodeURIComponent("Mark Twain Lake Instructions");

                    const body = encodeURIComponent(
                        `Below is today's Mark Twain Lake Re-Regulation Dam schedule and instructions.\n` +
                        `For internal use only. Not for public distribution.\n\n` +

                        `------------------------------------------------------------\n` +
                        ` Mark Twain Lake Instructions (Sent ${dateStr} ${timeStr})\n` +
                        `------------------------------------------------------------\n` +
                        `Schedule Date: ${dateStr}\n` +
                        `Schedule:      ${scheduleValue}\n\n` +

                        `Special Instructions:\n` +
                        `${instructionValue}\n\n` +

                        `Questions? Call the Water Control Office at 314-331-8342.`
                    );


                    const mailtoUrl = `mailto:${recipient}?cc=${cc}&subject=${subject}&body=${body}`;

                    console.log("mailto URL length:", mailtoUrl.length);
                    console.log("mailto URL:", mailtoUrl);

                    window.location.href = mailtoUrl;
                });

                sendSwpaBtn.addEventListener("click", async () => {
                    const recipient = "cemvs-cwms@usace.army.mil; ResourcesData@swpa.gov; brian.k.bean@usace.army.mil; Bryan.E.Bennett@usace.army.mil; Gregory.S.Kimery@usace.army.mil; Rocky.L.Reed@usace.army.mil; Larry.J.Hurt@usace.army.mil; Michael.D.Tate@usace.army.mil; James.A.McKeon@usace.army.mil; Joseph.P.Gibbs@usace.army.mil; Deric.K.Bishop@usace.army.mil; Joshua.W.Lewis@usace.army.mil; DLL-CEMVS-OD-JP@usace.army.mil";
                    const cc = "DLL-CEMVS-WATER-MANAGERS@usace.army.mil; Allen.Phillips@usace.army.mil; Edward.J.Brauer@usace.army.mil; David.R.Busse@usace.army.mil; Bradley.J.Krischel@usace.army.mil; Kevin.P.Slattery@usace.army.mil";

                    // const recipient = "cemvs-cwms@usace.army.mil";
                    // const cc = "DLL-CEMVS-WATER-MANAGERS@usace.army.mil";

                    const today = new Date();
                    const yesterday = new Date(today);
                    yesterday.setDate(today.getDate() - 1);
                    const day1 = new Date(today);
                    day1.setDate(day1.getDate() + 1);
                    const day2 = new Date(today);
                    day2.setDate(day2.getDate() + 2);
                    const day3 = new Date(today);
                    day3.setDate(day3.getDate() + 3);
                    const timeStr = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    // Format the date as MM-DD-YY
                    const formattedDateToday = today.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    }).replace(/\//g, '-');
                    const formattedDateYesterday = yesterday.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    }).replace(/\//g, '-');
                    const formattedDateDay1 = day1.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    }).replace(/\//g, '-');
                    const formattedDateDay2 = day2.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    }).replace(/\//g, '-');
                    const formattedDateDay3 = day3.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    }).replace(/\//g, '-');


                    const subject = encodeURIComponent("Mark Twain Lake Data");

                    const getEmailBody = async () => {
                        // your existing logic
                        let valueTurbEmail = '--';
                        let valueSpillwayEmail = '--';
                        let valueTotalEmail = '--';
                        let valueInflowEmail = '--';
                        let valueForecastDay1Email = '--';
                        let valueForecastDay2Email = '--';
                        let valueForecastDay3Email = '--';
                        let valueForecastDay4Email = '--';
                        let valueMidNightPoolEmail = '--';
                        let valueMidNightReRegEmail = '--';

                        const urltsid = `${setBaseUrl}timeseries/group/Turbines-Lake-Test?office=${office}&category-id=${lake}`;
                        const urltsid2 = `${setBaseUrl}timeseries/group/Outflow-Average-Lake-Test?office=${office}&category-id=${lake}`;
                        const urltsid3 = `${setBaseUrl}timeseries/group/Generation-Release-Lake-Test?office=${office}&category-id=${lake}`;
                        const urltsid4 = `${setBaseUrl}timeseries/group/Forecast-Lake?office=${office}&category-id=${lake}`;
                        const urltsid5 = `${setBaseUrl}timeseries/group/Stage?office=${office}&category-id=${lake}`;
                        const urltsid6 = `${setBaseUrl}timeseries/group/Stage?office=${office}&category-id=ReReg Pool-Salt`;

                        const fetchTsidDataGenerationRelease = async () => {
                            try {
                                const [response, response2, response3, response4, response5, response6] = await Promise.all([
                                    fetch(urltsid),
                                    fetch(urltsid2),
                                    fetch(urltsid3),
                                    fetch(urltsid4),
                                    fetch(urltsid5),
                                    fetch(urltsid6),
                                ]);
                                const [tsidData, tsidData2, tsidData3, tsidData4, tsidData5, tsidData6] = await Promise.all([
                                    response.json(),
                                    response2.json(),
                                    response3.json(),
                                    response4.json(),
                                    response5.json(),
                                    response6.json(),
                                ]);

                                if (tsidData?.['assigned-time-series']?.[0]) {
                                    const tsidTurb = tsidData['assigned-time-series'][0]['timeseries-id'];
                                    const timeSeriesDataTurb = await fetchTimeSeriesDataGenerationRelease(tsidTurb);
                                    valueTurbEmail = (parseFloat(timeSeriesDataTurb?.['values']?.[0]?.[1])).toFixed(0) || '--';
                                }

                                if (tsidData2?.['assigned-time-series']?.[0]) {
                                    const tsidSpillway = tsidData2['assigned-time-series'][0]['timeseries-id'];
                                    const timeSeriesDataSpillway = await fetchTimeSeriesDataGenerationRelease(tsidSpillway);
                                    valueSpillwayEmail = (parseFloat(timeSeriesDataSpillway?.['values']?.[0]?.[1])).toFixed(0) || '--';
                                }

                                if (tsidData3?.['assigned-time-series']?.[0]) {
                                    const tsidTotal = tsidData3['assigned-time-series'][0]['timeseries-id'];
                                    const timeSeriesDataTotal = await fetchTimeSeriesDataGenerationRelease(tsidTotal);
                                    valueTotalEmail = (parseFloat(timeSeriesDataTotal?.['values']?.[0]?.[1])).toFixed(0) || '--';
                                }

                                if (tsidData4?.['assigned-time-series']?.[1]) {
                                    const tsidInflow = tsidData4['assigned-time-series'][1]['timeseries-id'];
                                    const timeSeriesDataInflow = await fetchTimeSeriesDataInflow(tsidInflow);
                                    valueInflowEmail = (parseFloat(timeSeriesDataInflow?.['values']?.[0]?.[1])).toFixed(0) || '--';
                                    valueForecastDay1Email = (parseFloat(timeSeriesDataInflow?.['values']?.[1]?.[1])).toFixed(0) || '--';
                                    valueForecastDay2Email = (parseFloat(timeSeriesDataInflow?.['values']?.[2]?.[1])).toFixed(0) || '--';
                                    valueForecastDay3Email = (parseFloat(timeSeriesDataInflow?.['values']?.[3]?.[1])).toFixed(0) || '--';
                                    valueForecastDay4Email = (parseFloat(timeSeriesDataInflow?.['values']?.[4]?.[1])).toFixed(0) || '--';
                                }

                                if (tsidData5?.['assigned-time-series']?.[0]) {
                                    const tsidMidNightPool = tsidData5['assigned-time-series'][0]['timeseries-id'];
                                    const timeSeriesDataMidNightPool = await fetchTimeSeriesDataMidNightPool(tsidMidNightPool);
                                    valueMidNightPoolEmail = (parseFloat(timeSeriesDataMidNightPool?.['values']?.[0]?.[1])).toFixed(2) || '--';
                                }

                                if (tsidData6?.['assigned-time-series']?.[0]) {
                                    const tsidMidNightReReg = tsidData6['assigned-time-series'][0]['timeseries-id'];
                                    const timeSeriesDataMidNightReReg = await fetchTimeSeriesDataMidNightPool(tsidMidNightReReg);
                                    valueMidNightReRegEmail = (parseFloat(timeSeriesDataMidNightReReg?.['values']?.[0]?.[1])).toFixed(2) || '--';
                                }
                            } catch (error) {
                                console.error("Error fetching tsidOutflow data:", error);
                            }
                        };

                        await fetchTsidDataGenerationRelease();

                        return encodeURIComponent(
                            `Mark Twain Lake Data (${formattedDateToday})\n` +
                            `Internal use only. Do not distribute.\n\n` +

                            `Sent: ${formattedDateToday} ${timeStr}\n\n` +

                            `Pool:\n` +
                            `DATE${' '.repeat(18 - 'DATE'.length)}| LEVEL\n` +
                            `${formattedDateToday} | ${valueMidNightPoolEmail} ft\n\n` +

                            `Outflow:\n` +
                            `DATE${' '.repeat(18 - 'DATE'.length)}| TURBINE${' '.repeat(3)}| SPILL${' '.repeat(5)}| TOTAL\n` +
                            `${formattedDateYesterday} | ${valueTurbEmail.padEnd(8)}| ${valueSpillwayEmail.padEnd(8)}| ${valueTotalEmail}\n\n` +

                            `Inflow:\n` +
                            `DATE${' '.repeat(18 - 'DATE'.length)}| INFLOW\n` +
                            `${formattedDateYesterday} | ${valueInflowEmail}\n\n` +

                            `Forecast:\n` +
                            `${formattedDateToday.padEnd(12)}| ${formattedDateDay1.padEnd(12)}| ${formattedDateDay2.padEnd(12)}| ${formattedDateDay3.padEnd(12)}\n` +
                            `${valueForecastDay1Email.padEnd(18)}| ${valueForecastDay2Email.padEnd(12)}| ${valueForecastDay3Email.padEnd(12)}| ${valueForecastDay4Email.padEnd(12)}\n\n` +

                            `Rereg Pool:\n` +
                            `DATE${' '.repeat(18 - 'DATE'.length)}| LEVEL\n` +
                            `${formattedDateToday} | ${valueMidNightReRegEmail} ft\n\n` +

                            `Questions? Call (314)331-8342.`
                        );
                    };

                    const body = await getEmailBody();
                    // Use body for your email send logic





                    const mailtoUrl = `mailto:${recipient}?cc=${cc}&subject=${subject}&body=${body}`;

                    console.log("mailto URL length:", mailtoUrl.length);
                    console.log("mailto URL:", mailtoUrl);

                    window.location.href = mailtoUrl;
                });

                cdaSaveBtn.addEventListener("click", async () => {
                    let textScheduleValues = [];

                    // If data exists in "regular-text-values", grab values from the inputs
                    if (Array.isArray(formattedScheduleData["regular-text-values"]) && formattedScheduleData["regular-text-values"].length > 0) {
                        // Loop through each entry and get the input values
                        formattedScheduleData["regular-text-values"].forEach((entry) => {
                            const textValueScheduleInput = document.getElementById(`textValueScheduleInput-${entry["date-time-iso"]}`);
                            if (textValueScheduleInput) {
                                textScheduleValues.push({
                                    "date-time-iso": entry["date-time-iso"],
                                    "text-value": textValueScheduleInput.value
                                });
                            }
                        });
                    } else {
                        // If no data exists, get the value from the input for today's date
                        const textValueScheduleInput = document.getElementById(`textValueScheduleInput-${isoDateToday}`);
                        if (textValueScheduleInput) {
                            textScheduleValues.push({
                                "date-time-iso": isoDateToday,
                                "text-value": textValueScheduleInput.value
                            });
                        }
                    }

                    console.log("Updated Schedule Text Values:", textScheduleValues);
                    console.log("Value Schedule: ", textScheduleValues[0]['text-value']);

                    const fallbackTextValue = (textScheduleValues[0]?.['text-value']?.trim() || "909");

                    const payloadSchedule = {
                        "office-id": "MVS",
                        "name": tsidSchedule,
                        "interval-offset": 0,
                        "time-zone": "GMT",
                        "regular-text-values": [
                            {
                                "date-time": isoDateToday,
                                "data-entry-date": isoDateToday,
                                "text-value": fallbackTextValue,
                                "filename": "test.txt",
                                "media-type": "text/plain",
                                "quality-code": 0,
                                "dest-flag": 0,
                                "value-url": "https://cwms-data.usace.army.mil/cwms-data/timeseries/text/ignored?text-id=someId&office-id=MVS&value=true"
                            }
                        ]
                    }
                    console.log("payloadSchedule:", payloadSchedule);

                    let textInstructionValues = [];

                    // If data exists in "regular-text-values", grab values from the inputs
                    if (Array.isArray(formattedDataInstruction["regular-text-values"]) && formattedDataInstruction["regular-text-values"].length > 0) {
                        // Loop through each entry and get the input values
                        formattedDataInstruction["regular-text-values"].forEach((entry) => {
                            const textInstructionValueInput = document.getElementById(`instruction-input`);
                            if (textInstructionValueInput) {
                                const value = textInstructionValueInput.value.trim() || "NA"; // Default to NA if empty
                                textInstructionValues.push({
                                    "date-time-iso": entry["date-time-iso"],
                                    "text-value": value
                                });
                            }
                        });
                    } else {
                        // If no data exists, get the value from the input for today's date
                        const textInstructionValueInput = document.getElementById(`instruction-input`);
                        if (textInstructionValueInput) {
                            const value = textInstructionValueInput.value.trim() || "NA"; // Default to NA if empty
                            textInstructionValues.push({
                                "date-time-iso": isoDateToday,
                                "text-value": value
                            });
                        }
                    }

                    console.log("Updated Instruction Text Values:", textInstructionValues);
                    console.log("Value Instruction: ", textInstructionValues[0]['text-value']);

                    const payloadInstruction = {
                        "office-id": "MVS",
                        "name": tsidInstruction,
                        "interval-offset": 0,
                        "time-zone": "GMT",
                        "regular-text-values": [
                            {
                                "date-time": isoDateToday,
                                "data-entry-date": isoDateToday,
                                "text-value": textInstructionValues[0]['text-value'],
                                "filename": "test.txt",
                                "media-type": "text/plain",
                                "quality-code": 0,
                                "dest-flag": 0,
                                "value-url": "https://cwms-data.usace.army.mil/cwms-data/timeseries/text/ignored?text-id=someId&office-id=MVS&value=true"
                            }
                        ]
                    }
                    console.log("payloadInstruction:", payloadInstruction);

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

                    async function writeTSText(payload) {
                        // Ensure payload is provided
                        if (!payload) throw new Error("You must specify a payload!");

                        try {
                            // Send a POST request to write time series data
                            const response = await fetch("https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries/text?replace-all=true", {
                                method: "POST",
                                headers: {
                                    // "accept": "*/*",
                                    "Content-Type": "application/json;version=2",
                                },
                                // Convert payload to JSON and include in request body
                                body: JSON.stringify(payload)
                            });

                            // Handle non-OK responses
                            if (!response.ok) {
                                const errorText = await response.text();
                                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                            }

                            // Return true to indicate success
                            return true;

                        } catch (error) {
                            // Log any errors that occur during the write operation
                            console.error('Error writing timeseries:', error);
                            throw error;
                        }

                    }

                    async function fetchUpdatedData(tsidSchedule, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1) {
                        // Convert to Date object
                        const date = new Date(isoDateDay1);

                        // Add 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
                        date.setTime(date.getTime() - (1 * 60 * 60 * 1000));

                        // Convert back to ISO string (preserve UTC format)
                        const end = date.toISOString();

                        let response = null;

                        response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries/text?office=MVS&name=${tsidSchedule}&begin=${isoDateToday}&end=${end}`, {
                            method: "GET",
                            headers: {
                                "Accept": "application/json;version=2",
                                "cache-control": "no-cache"
                            }
                        });

                        if (!response.ok) {
                            throw new Error(`Failed to fetch updated data: ${response.status}`);
                        }

                        const data = await response.json();

                        // Log the raw data received
                        console.log('Fetched Today Data:', data);
                        console.log('Fetched Today Data:', data[`regular-text-values`][0][`text-value`]);

                        return data;
                    }

                    async function fetchUpdatedDataYesterday(tsidSchedule, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1) {
                        // Convert to Date object
                        const date = new Date(isoDateToday);

                        // Add 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
                        date.setTime(date.getTime() - (1 * 60 * 60 * 1000));

                        // Convert back to ISO string (preserve UTC format)
                        const end = date.toISOString();

                        let response = null;

                        response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries/text?office=MVS&name=${tsidSchedule}&begin=${isoDateMinus1Day}&end=${end}`, {
                            method: "GET",
                            headers: {
                                "Accept": "application/json;version=2",
                                "cache-control": "no-cache"
                            }
                        });

                        if (!response.ok) {
                            throw new Error(`Failed to fetch updated data: ${response.status}`);
                        }

                        const data = await response.json();

                        // Log the raw data received
                        console.log('Fetched Yesterday Data:', data);
                        console.log('Fetched Yesterday Data:', data[`regular-text-values`][0][`text-value`]);

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
                            await writeTSText(payloadSchedule);
                            statusDiv.innerText = "Write payloadSchedule successful!";
                            await writeTSText(payloadInstruction);
                            statusDiv.innerText = "Write payloadInstruction successful!";

                            // Optional: small delay to allow backend to process the new data
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            // Fetch updated data and refresh the table
                            const updatedData = await fetchUpdatedData(tsidSchedule, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1);
                            const updatedDataYesterday = await fetchUpdatedDataYesterday(tsidSchedule, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1);
                            const updatedDataInstruction = await fetchUpdatedData(tsidInstruction, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1);
                            const updatedDataYesterdayInstruction = await fetchUpdatedDataYesterday(tsidInstruction, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1);
                            createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7, tsidSchedule, updatedData, updatedDataYesterday, tsidInstruction, updatedDataInstruction, updatedDataYesterdayInstruction);
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

    const fetchTimeSeriesData = async (tsid) => {
        // Convert to Date object
        const date = new Date(isoDateDay1);

        // Add 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
        date.setTime(date.getTime() - (1 * 60 * 60 * 1000));

        // Convert back to ISO string (preserve UTC format)
        const end = date.toISOString();

        const tsidData = `${setBaseUrl}timeseries/text?name=${tsid}&begin=${isoDateToday}&end=${end}&office=${office}`;
        console.log('tsidData:', tsidData);
        try {
            const response = await fetch(tsidData, {
                headers: {
                    "Accept": "application/json;version=2", // Ensuring the correct version is used
                    "cache-control": "no-cache"
                }
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching time series data:", error);
        }
    };

    const fetchTimeSeriesDataYesterday = async (tsid) => {
        // Convert to Date object
        const date = new Date(isoDateToday);

        // Add 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
        date.setTime(date.getTime() - (1 * 60 * 60 * 1000));

        // Convert back to ISO string (preserve UTC format)
        const end = date.toISOString();

        const tsidData = `${setBaseUrl}timeseries/text?name=${tsid}&begin=${isoDateMinus1Day}&end=${end}&office=${office}`;
        console.log('tsidData:', tsidData);
        try {
            const response = await fetch(tsidData, {
                headers: {
                    "Accept": "application/json;version=2", // Ensuring the correct version is used
                    "cache-control": "no-cache"
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching time series data:", error);
        }
    };

    const fetchTimeSeriesDataMidNightPool = async (tsid) => {
        // Convert to Date object
        const date = new Date(isoDateDay1);

        // Add 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
        date.setTime(date.getTime() - (1 * 60 * 60 * 1000));

        // Convert back to ISO string (preserve UTC format)
        const end = date.toISOString();

        const tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateToday}&end=${end}&office=${office}`;
        console.log('tsidData:', tsidData);
        try {
            const response = await fetch(tsidData, {
                headers: {
                    "Accept": "application/json;version=2", // Ensuring the correct version is used
                    "cache-control": "no-cache"
                }
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching time series data:", error);
        }
    };

    const fetchTimeSeriesDataGenerationRelease = async (tsid) => {
        let tsidData = null;
        tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateMinus1Day}&end=${isoDateToday}&office=${office}`;
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

    const fetchTimeSeriesDataInflow = async (tsid) => {
        let tsidData = null;
        if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
            tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateMinus1Day}&end=${isoDateDay6}&office=${office}&version-date=${convertTo6AMCST(isoDateToday)}`;
        } else {
            tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateToday}&end=${isoDateDay6}&office=${office}&version-date=${convertTo6AMCST(isoDateToday)}`;
        }
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

    fetchTsidData();

    function convertUnixTimestampToISO(timestamp) {
        if (typeof timestamp !== "number") {
            console.error("Invalid timestamp:", timestamp);
            return "Invalid Date";
        }

        const date = new Date(timestamp); // Convert milliseconds to Date object

        if (isNaN(date.getTime())) {
            console.error("Invalid date conversion:", timestamp);
            return "Invalid Date";
        }

        return date.toISOString(); // Convert to "YYYY-MM-DDTHH:mm:ssZ" format
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

    function getDSTOffsetInHours() {
        // Get the current date
        const now = new Date();

        // Get the current time zone offset in minutes (with DST, if applicable)
        const currentOffset = now.getTimezoneOffset();

        // Convert the offset from minutes to hours
        const dstOffsetHours = currentOffset / 60;

        return dstOffsetHours; // Returns the offset in hours (e.g., -5 or -6)
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


// Mark Twain Lk-Salt.Stage.Inst.~1Day.0.lakerep-rev-schedule
// Mark Twain Lk-Salt.Stage.Inst.~1Day.0.lakerep-rev-instruction