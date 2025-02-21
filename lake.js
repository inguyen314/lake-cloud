document.addEventListener("DOMContentLoaded", function () {
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
    let setLocationGroupOwner = "Project";

    const basinCategoryApiUrl = `${setBaseUrl}location/group?office=${office}&include-assigned=false&location-category-like=${setLocationCategory}`;
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

    function createTable(data) {
        if (!Array.isArray(data)) {
            console.error("combinedData is not an array!", data);
            return;
        }

        const container = document.getElementById("container");
        if (!container) return;

        const table = document.createElement("table");
        table.border = "1";

        const row = document.createElement("tr");

        data.forEach(item => {
            item["assigned-locations"].forEach(location => {
                const cell = document.createElement("td");

                // Extract part before the dash
                const locationName = location["location-id"].split("-")[0].trim();
                const locationId = location["location-id"];

                // Create link
                const link = document.createElement("a");
                link.href = `https://wm.mvs.ds.usace.army.mil/mvs/lake/index.html?office=MVS&lake=${encodeURIComponent(locationId)}`;
                link.textContent = locationName;
                // link.target = "_blank"; // Opens in a new tab

                cell.appendChild(link);
                row.appendChild(cell);
            });
        });

        table.appendChild(row);
        container.appendChild(table);
    }

    function filterByLocationCategory(array, setLocationCategory) {
        return array.filter(item =>
            item['location-category'] &&
            item['location-category']['office-id'] === setLocationCategory['office-id'] &&
            item['location-category']['id'] === setLocationCategory['id']
        );
    }

    if (lake !== null && datetime !== null) {
        const titleSpan = document.querySelector('.titleLabel.title');

        if (titleSpan) {
            titleSpan.textContent = `${lake.split("-")[0].trim()}: ${datetime}`;
        }

        // Set the title in the header
        document.title = `${lake.split("-")[0].trim()}: ${datetime}`;
    }

    // Check if the lake is not "Mark Twain Lk"
    if (lake !== "Mark Twain Lk-Salt") {
        // Hide widgets 3, 12, and 13
        document.getElementById("widget3").style.display = "none";
        document.getElementById("widget12").style.display = "none";
        document.getElementById("widget13").style.display = "none";
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
