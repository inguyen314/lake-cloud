document.addEventListener("DOMContentLoaded", function () {
    if (lake === "Mark Twain Lk-Salt") {
        document.getElementById("widget3").style.display = "block";
        document.getElementById("widget12").style.display = "block";
        document.getElementById("widget13").style.display = "block";
    } else {
        document.getElementById("widget3").style.display = "none";
        document.getElementById("widget12").style.display = "none";
        document.getElementById("widget13").style.display = "none";
    }

    if (lake !== null && datetime !== null) {
        const titleSpan = document.querySelector('.titleLabel.title');

        if (titleSpan) {
            // titleSpan.textContent = `${lake.split("-")[0].trim()}: ${datetime}`;
            titleSpan.textContent = `${lake.split("-")[0].trim()}`;
        }

        // Set the title in the header
        document.title = `${lake}`;
        // document.title = `${lake.split("-")[0].trim()}: ${datetime}`;
    }

    let setBaseUrl = null;
    if (cda === "internal") {
        setBaseUrl = `https://wm.${office.toLowerCase()}.ds.usace.army.mil:8243/${office.toLowerCase()}-data/`;
    } else if (cda === "internal-coop") {
        setBaseUrl = `https://wm-${office.toLowerCase()}coop.mvk.ds.usace.army.mil:8243/${office.toLowerCase()}-data/`;
    } else if (cda === "public") {
        setBaseUrl = `https://cwms-data.usace.army.mil/cwms-data/`;
    }
    console.log("setBaseUrl: ", setBaseUrl);

    const loadingIndicator = document.getElementById(`loading`);
    loadingIndicator.style.display = 'block';

    let setLocationCategory = "Lakes";

    const basinCategoryApiUrl = setBaseUrl + `location/group?office=${office}&group-office-id=${office}&category-office-id=${office}&category-id=${setLocationCategory}`;
    console.log("basinCategoryApiUrl: ", basinCategoryApiUrl);

    let apiPromises = [];
    let combinedData = [];

    // Initial category fetch
    fetch(basinCategoryApiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                console.warn('No data available from the initial fetch.');
                return;
            }

            const targetCategory = { "office-id": office, "id": setLocationCategory };
            const filteredArray = filterByLocationCategory(data, targetCategory);
            let basins = filteredArray.map(item => item.id);

            if (basins.length === 0) {
                console.warn('No basins found for the given category.');
                return;
            }

            console.log('Basins:', basins);

            // Loop through each basin and fetch assigned locations
            basins.forEach(basin => {
                const basinGroupLocationApiUrl = `${setBaseUrl}location/group/${basin}?office=${office}&category-id=${setLocationCategory}`;
                console.log("basinGroupLocationApiUrl: ", basinGroupLocationApiUrl);

                apiPromises.push(
                    fetch(basinGroupLocationApiUrl)
                        .then(response => {
                            if (!response.ok) throw new Error(`Network response was not ok for basin ${basin}`);
                            return response.json();
                        })
                        .then(getBasin => {
                            if (!getBasin || !getBasin['assigned-locations']) {
                                console.warn(`No assigned locations for basin ${basin}`);
                                return;
                            }

                            // Filter locations with attribute <= 900
                            getBasin['assigned-locations'] = getBasin['assigned-locations'].filter(
                                location => location.attribute <= 900
                            );

                            // Sort the locations by their attribute
                            getBasin['assigned-locations'].sort((a, b) => a.attribute - b.attribute);

                            combinedData.push(getBasin);

                            console.log('getBasin:', getBasin);
                        })
                        .catch(error => console.error(`Problem with the fetch operation for basin ${basin}:`, error))
                );
            });

            return Promise.all(apiPromises);
        })
        .then(() => {
            console.log('All combinedData fetched and filtered successfully:', combinedData);
            loadingIndicator.style.display = 'none';

            // Call createTable once all data is processed
            createTable(combinedData);
        })
        .catch(error => {
            console.error('There was a problem with the initial fetch operation:', error);
            loadingIndicator.style.display = 'none';
        });

    createTableDatePicker(datetime, lake);

    function createTable(data) {
        if (!Array.isArray(data)) {
            console.error("combinedData is not an array!", data);
            return;
        }

        const container = document.getElementById("container");
        if (!container) return;

        const table = document.createElement("table");

        const row = document.createElement("tr");

        const locationOrder = [
            "Lk Shelbyville-Kaskaskia",
            "Carlyle Lk-Kaskaskia",
            "Wappapello Lk-St Francis",
            "Mark Twain Lk-Salt",
            "Rend Lk-Big Muddy"
        ];

        // Loop through each location in locationOrder and add it as a column in the single row
        locationOrder.forEach(locationId => {
            const cell = document.createElement("td");
            cell.style.width = "20%";

            // Find the location in the data
            let locationFound = false;
            data.forEach(item => {
                const location = item["assigned-locations"].find(loc => loc["location-id"] === locationId);

                if (location) {
                    locationFound = true;
                    const link = document.createElement("a");
                    link.href = `https://wm.mvs.ds.usace.army.mil/mvs/lake/index.html?office=MVS&lake=${encodeURIComponent(location["location-id"])}`;
                    link.textContent = location["location-id"].split("-")[0];  // Location name before the dash
                    link.style.fontWeight = "bold";
                    cell.appendChild(link);
                }
            });

            // If location is not found, show "N/A"
            if (!locationFound) {
                cell.textContent = "N/A";
            }

            row.appendChild(cell);
        });

        // Append the single row to the table
        table.appendChild(row);

        // Append the table to the container
        container.appendChild(table);
    }

    function filterByLocationCategory(array, setLocationCategory) {
        return array.filter(item =>
            item['location-category'] &&
            item['location-category']['office-id'] === setLocationCategory['office-id'] &&
            item['location-category']['id'] === setLocationCategory['id']
        );
    }

    function createTableDatePicker(datetime, lake) {
        // Create the table row
        const tableRow = document.createElement('tr');

        // Create and append the combined cell (DATE label, input field, and calendar button)
        const dateCell = document.createElement('td');
        dateCell.setAttribute('width', '20%');
        dateCell.setAttribute('align', 'center');
        dateCell.classList.add('date-cell'); // Apply flex layout

        const dateLabel = document.createElement('span');
        dateLabel.innerText = 'Date: ';

        const dateInput = document.createElement('input');
        dateInput.setAttribute('name', 'p_dt');
        dateInput.setAttribute('type', 'text');
        dateInput.setAttribute('value', datetime);
        dateInput.setAttribute('size', '10');
        dateInput.setAttribute('maxlength', '10');

        const calendarLink = document.createElement('a');
        calendarLink.setAttribute('href', '##');
        calendarLink.setAttribute('onclick', "openCalendar(event)");

        // Append the label, input, and calendar link to the same cell
        dateCell.appendChild(dateLabel);
        dateCell.appendChild(dateInput);
        dateCell.appendChild(calendarLink);

        // Append the combined dateCell to the table row
        tableRow.appendChild(dateCell);

        // Function to adjust the date by one day (forward or backward)
        function adjustDate(byDays) {
            // Get the current date from dateInput value
            const currentDate = new Date(dateInput.value);

            // Adjust the date by the specified number of days (byDays can be positive or negative)
            currentDate.setDate(currentDate.getDate() + byDays);

            // Format the new date as MM-DD-YYYY
            const newDate = formatDate(currentDate);

            // Update the dateInput value with the new date
            dateInput.value = newDate;
        }

        // Function to format the date as MM-DD-YYYY
        function formatDate(date) {
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if necessary
            const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if necessary
            const year = date.getFullYear();
            return `${month}-${day}-${year}`;
        }

        // Create and append the submit link cell (instead of button)
        const submitCell = document.createElement('td');
        submitCell.setAttribute('width', '20%');
        submitCell.setAttribute('align', 'center');

        const submitLink = document.createElement('a');
        submitLink.setAttribute('href', '#'); // Placeholder link (will be updated dynamically)
        submitLink.setAttribute('class', 'modern-link'); // Apply modern link style
        submitLink.innerText = 'Submit';

        // Set the click event for the link to redirect dynamically
        submitLink.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent the default link behavior

            // Get dynamic datetime value from input field
            const datetime = dateInput.value;

            // Create the URL with the dynamic lake and datetime values
            const url = `https://wm.mvs.ds.usace.army.mil/mvs/lake/index.html?office=MVS&lake=${lake}&datetime=${datetime}`;

            // Redirect to the URL
            window.location.href = url;
        });

        submitCell.appendChild(submitLink);
        tableRow.appendChild(submitCell);

        // Create and append the "previous day" button cell
        const previousDayCell = document.createElement('td');
        previousDayCell.setAttribute('width', '20%');
        previousDayCell.setAttribute('align', 'center');
        const previousDayButton = document.createElement('input');
        previousDayButton.setAttribute('name', 'op');
        previousDayButton.setAttribute('type', 'submit');
        previousDayButton.setAttribute('value', 'Previous day');
        previousDayButton.classList.add('modern-button');

        // Event listener for the "Previous day" button
        previousDayButton.addEventListener('click', function (event) {
            adjustDate(-1); // Decrease the date by 1 day
        });
        previousDayCell.appendChild(previousDayButton);
        tableRow.appendChild(previousDayCell);

        // Create and append the "next day" button cell
        const nextDayCell = document.createElement('td');
        nextDayCell.setAttribute('width', '20%');
        nextDayCell.setAttribute('align', 'center');
        const nextDayButton = document.createElement('input');
        nextDayButton.setAttribute('name', 'op');
        nextDayButton.setAttribute('type', 'submit');
        nextDayButton.setAttribute('value', 'Next day');
        nextDayButton.classList.add('modern-button');

        // Event listener for the "Next day" button
        nextDayButton.addEventListener('click', function (event) {
            adjustDate(1); // Increase the date by 1 day
        });
        nextDayCell.appendChild(nextDayButton);
        tableRow.appendChild(nextDayCell);

        // Create and append the "print page large" button cell
        const printCell = document.createElement('td');
        printCell.setAttribute('width', '20%');
        printCell.setAttribute('align', 'center');
        const printButton = document.createElement('input');
        printButton.setAttribute('name', 'op');
        printButton.setAttribute('type', 'submit');
        printButton.setAttribute('value', 'Print Page');
        printButton.classList.add('modern-button');
        printCell.appendChild(printButton);
        tableRow.appendChild(printCell);

        // Create the table and append the row to it
        const table = document.createElement('table');
        table.appendChild(tableRow);

        // Append the table inside the container
        document.getElementById('container_date_selection').appendChild(table);

        // Function to initialize the calendar date picker
        function openCalendar(event) {
            event.preventDefault(); // Prevent link from following the URL
            flatpickr(dateInput, {
                dateFormat: 'm-d-Y',
                defaultDate: dateInput.value, // Set the default date as the current value
            }).open(); // Open the calendar popup
        }
    }
});

function saveData(widgetId) {
    const output = document.getElementById(`output${widgetId}`);
    output.textContent = `Data for Widget ${widgetId} saved!`;
}

function fetchData(widgetId) {
    const output = document.getElementById(`output${widgetId}`);
    // Simulate fetching data
    setTimeout(() => {
        output.textContent = `Fetched data for Widget ${widgetId}: [Sample Data]`;
    }, 1000);
}

function testData(widgetId, lake, datetime) {
    // Define the URL to open in a new tab
    const url = `https://wm.mvs.ds.usace.army.mil/mvs/lake/widget_${widgetId}_test.html?office=MVS&lake=${lake}&datetime=${datetime}`;
    // Open the URL in a new tab
    window.open(url, '_blank');
}

function morningShef(datetime) {
    // Define the URL to open in a new tab
    const url = `https://wm.mvs.ds.usace.army.mil/mvs/morning_shef/index.html?office=MVS&datetime=${datetime}`;
    // Open the URL in a new tab
    window.open(url, '_blank');
}

function morningShefExisting(datetime) {
    // Define the URL to open in a new tab
    const url = `https://wm.mvs.ds.usace.army.mil/mvs/morning_shef/index.php`;
    // Open the URL in a new tab
    window.open(url, '_blank');
}

function plotMacro(lake, datetime) {
    // Define the URL to open in a new tab
    let url = null;
    if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
        url = `https://wm.mvs.ds.usace.army.mil/mvs/chart/index.html?basin=Shelbyville&office=MVS&cwms_ts_id=Shelbyville+TW-Kaskaskia.Flow.Inst.30Minutes.0.RatingUSGS&cda=internal`;
    } else if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
        url = `https://wm.mvs.ds.usace.army.mil/mvs/chart/index.html?office=MVS&basin=Mark%20Twain&cwms_ts_id=Norton%20Bridge-Salt.Flow.Inst.15Minutes.0.RatingUSGS`;
    } else if (lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
        url = `https://wm.mvs.ds.usace.army.mil/mvs/chart/index.html?office=MVS&basin=Carlyle&cwms_ts_id=Carlyle-Kaskaskia.Flow.Inst.15Minutes.0.RatingUSGS`;
    } else if (lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
        url = `https://wm.mvs.ds.usace.army.mil/mvs/chart/index.html?office=MVS&basin=Wappapello&cwms_ts_id=Iron%20Bridge-St%20Francis.Flow.Inst.30Minutes.0.RatingUSGS`;
    } else if (lake === "Rend Lk-Big Muddy" || lake === "Rend Lk") {
        url = `https://wm.mvs.ds.usace.army.mil/mvs/chart/index.html?office=MVS&basin=Rend&cwms_ts_id=Rend%20Lk-Big%20Muddy.Flow.Inst.30Minutes.0.RatingCOE`;
    }

    // Open the URL in a new tab
    window.open(url, '_blank');
}

function netmissShef(datetime) {
    // Define the URL to open in a new tab
    const url = `https://wm.mvs.ds.usace.army.mil/mvs/netmiss_shef/index.html?office=MVS&datetime=${datetime}`;
    // Open the URL in a new tab
    window.open(url, '_blank');
}

function melPriceDrawdown(datetime) {
    // Define the URL to open in a new tab
    const url = `https://wm.mvs.ds.usace.army.mil/mvs/mel_price_drawdown/index.html?office=MVS&datetime=${datetime}`;
    // Open the URL in a new tab
    window.open(url, '_blank');
}