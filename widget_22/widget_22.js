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

    const genDate = `${year}${month}${day}`;

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


    async function fetchTsidDataForAllLakes() {
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
            cdaSaveBtn = document.getElementById("cda-btn-lake-shef"); // Get the button by its ID

            cdaSaveBtn.disabled = true; // Disable button while checking login state

            // Update button text based on login status
            if (await isLoggedIn()) {
                cdaSaveBtn.innerText = "Save";
            } else {
                cdaSaveBtn.innerText = "Login";
            }

            cdaSaveBtn.disabled = false; // Re-enable button
        }

        let setCategory = "Netmiss";

        const apiUrl = setBaseUrl + `location/group?office=${office}&group-office-id=${office}&category-office-id=${office}&category-id=${setCategory}`;
        console.log("apiUrl: ", apiUrl);

        const stageTsidMap = new Map();
        const metadataMap = new Map();
        const netmissTsidMap = new Map();

        const stageTsidPromises = [];
        const metadataPromises = [];
        const netmissTsidPromises = [];

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) {
                    console.warn('No data available from the initial fetch.');
                    return;
                }

                const targetCategory = { "office-id": office, "id": setCategory };
                const filteredArray = filterByLocationCategory(data, targetCategory);
                const basins = filteredArray.map(item => item.id);
                if (basins.length === 0) {
                    console.warn('No basins found for the given setCategory.');
                    return;
                }

                const apiPromises = [];
                const combinedData = [];

                basins.forEach(basin => {
                    const basinApiUrl = setBaseUrl + `location/group/${basin}?office=${office}&category-id=${setCategory}`;
                    console.log('basinApiUrl:', basinApiUrl);

                    apiPromises.push(
                        fetch(basinApiUrl)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`Network response was not ok for basin ${basin}: ${response.statusText}`);
                                }
                                return response.json();
                            })
                            .then(basinData => {
                                console.log('basinData:', basinData);

                                if (!basinData) {
                                    console.log(`No data for basin: ${basin}`);
                                    return;
                                }

                                basinData[`assigned-locations`] = basinData[`assigned-locations`].filter(location => location.attribute <= 900);
                                basinData[`assigned-locations`].sort((a, b) => a.attribute - b.attribute);
                                combinedData.push(basinData);

                                if (basinData['assigned-locations']) {
                                    basinData['assigned-locations'].forEach(loc => {

                                        let stageTsidApiUrl = setBaseUrl + `timeseries/group/Stage?office=${office}&category-id=${loc['location-id']}`;
                                        if (stageTsidApiUrl) {
                                            stageTsidPromises.push(
                                                fetch(stageTsidApiUrl)
                                                    .then(response => {
                                                        if (response.status === 404) {
                                                            return null;
                                                        }
                                                        if (!response.ok) {
                                                            throw new Error(`Network response was not ok: ${response.statusText}`);
                                                        }
                                                        return response.json();
                                                    })
                                                    .then(stageTsidData => {
                                                        if (stageTsidData) {
                                                            stageTsidMap.set(loc['location-id'], stageTsidData);
                                                        }
                                                    })
                                                    .catch(error => {
                                                        console.error(`Problem with the fetch operation for stage TSID data.`, error);
                                                    })
                                            );
                                        }

                                        let netmissTsidApiUrl = setBaseUrl + `timeseries/group/Netmiss-Forecast?office=${office}&category-id=${loc['location-id']}`;
                                        if (netmissTsidApiUrl) {
                                            netmissTsidPromises.push(
                                                fetch(netmissTsidApiUrl)
                                                    .then(response => {
                                                        if (response.status === 404) {
                                                            return null;
                                                        }
                                                        if (!response.ok) {
                                                            throw new Error(`Network response was not ok: ${response.statusText}`);
                                                        }
                                                        return response.json();
                                                    })
                                                    .then(netmissTsidData => {
                                                        if (netmissTsidData) {
                                                            netmissTsidMap.set(loc['location-id'], netmissTsidData);
                                                        }
                                                    })
                                                    .catch(error => {
                                                        console.error(`Problem with the fetch operation for stage TSID data.`, error);
                                                    })
                                            );
                                        }

                                        // Construct the URL for the location metadata request
                                        let metaApiUrl = setBaseUrl + `locations/${loc['location-id']}?office=${office}`;
                                        if (metaApiUrl) {
                                            metadataPromises.push(
                                                fetch(metaApiUrl)
                                                    .then(response => {
                                                        if (response.status === 404) {
                                                            console.warn(`Location metadata not found for location: ${loc['location-id']}`);
                                                            return null;
                                                        }
                                                        if (!response.ok) {
                                                            throw new Error(`Network response was not ok: ${response.statusText}`);
                                                        }
                                                        return response.json();
                                                    })
                                                    .then(metaData => {
                                                        if (metaData) {
                                                            metadataMap.set(loc['location-id'], metaData);
                                                        }
                                                    })
                                                    .catch(error => {
                                                        console.error(`Problem with the fetch operation for location ${loc['location-id']}:`, error);
                                                    })
                                            );
                                        }

                                    });
                                }
                            })
                            .catch(error => {
                                console.error(`Problem with the fetch operation for basin ${basin}:`, error);
                            })
                    );
                });

                Promise.all(apiPromises)
                    .then(() => Promise.all(stageTsidPromises))
                    .then(() => Promise.all(metadataPromises))
                    .then(() => Promise.all(netmissTsidPromises))
                    .then(() => {
                        combinedData.forEach(basinData => {
                            if (basinData['assigned-locations']) {
                                basinData['assigned-locations'].forEach(loc => {

                                    console.log("loc: ", loc['location-id']);

                                    const stageTsidMapData = stageTsidMap.get(loc['location-id']);
                                    if (stageTsidMapData) {
                                        loc['tsid-stage'] = stageTsidMapData;
                                    }
                                    console.log('stageTsidMapData:', stageTsidMapData);

                                    const metadataMapData = metadataMap.get(loc['location-id']);
                                    if (metadataMapData) {
                                        loc['metadata'] = metadataMapData;
                                    }
                                    console.log('metadataMapData:', metadataMapData);

                                    const netmissTsidMapData = netmissTsidMap.get(loc['location-id']);
                                    if (netmissTsidMapData) {
                                        loc['tsid-netmiss'] = netmissTsidMapData;
                                    }
                                    console.log('netmissTsidMapData:', netmissTsidMapData);
                                });
                            }
                        });

                        console.log('combinedData:', combinedData);

                        // Fetch additional data using stageTsid, netmissTsid, nwsTsid
                        const additionalPromises = [];

                        for (const data of combinedData[0][`assigned-locations`]) {

                            const stageTsid = data[`tsid-stage`][`assigned-time-series`][0][`timeseries-id`];
                            const netmissTsid = data[`tsid-netmiss`][`assigned-time-series`][0][`timeseries-id`];
                            const location = data[`location-id`];

                            // Example API calls for additional data (customize these URLs)
                            const stageApiUrl = setBaseUrl + `timeseries?name=${stageTsid}&begin=${isoDateToday}&end=${isoDateDay1}&office=${office}`;
                            const netmissApiUrl = setBaseUrl + `timeseries?name=${netmissTsid}&begin=${isoDateDay1}&end=${isoDateDay6}&office=${office}`;
                            const levelId = `${location}.Code.Inst.0.NWS HB5`;
                            const nwsApiUrl = `${setBaseUrl}levels/${levelId}?office=MVS&effective-date=${isoDateToday}&unit=n/a`;

                            // Fetch additional data
                            additionalPromises.push(
                                Promise.all([
                                    fetch(stageApiUrl, {
                                        method: 'GET',
                                        headers: {
                                            'Accept': 'application/json;version=2'
                                        }
                                    }).then(res => res.json()),
                                    fetch(nwsApiUrl, {
                                        method: 'GET',
                                        headers: {
                                            'Accept': 'application/json;version=2'
                                        }
                                    }).then(res => res.json()),
                                    fetch(netmissApiUrl, {
                                        method: 'GET',
                                        headers: {
                                            'Accept': 'application/json;version=2'
                                        }
                                    }).then(res => res.json())
                                ])
                                    .then(([stageData, nwsHB5, netmissData]) => {
                                        console.log('stageData:', stageData);
                                        console.log('nwsHB5:', nwsHB5);
                                        console.log('netmissData:', netmissData);

                                        // Append the fetched data to the data
                                        data['stageData'] = stageData;
                                        data['netmissData'] = netmissData;



                                        // Formatting timestamps in stageData
                                        let formattedStageData = stageData.values.map(entry => {
                                            const timestamp = Number(entry[0]);

                                            return {
                                                ...entry, // Retain other data
                                                formattedTimestampUTC: convertUnixTimestamp(timestamp, false),
                                                formattedTimestampCST: convertUnixTimestamp(timestamp, true),
                                            };
                                        });
                                        console.log("formattedStageData:", formattedStageData);

                                        // Filter formattedStageData for the specific datetime and time 6am CST
                                        formattedStageData = formattedStageData.filter(item => {
                                            const date = new Date(item.formattedTimestampCST);

                                            const formattedDate = date.toISOString().slice(5, 10) + '-' + date.getFullYear(); // MM-DD-YYYY
                                            const hour = date.getUTCHours();     // CST hour (since string ends in Z but represents CST)
                                            const minute = date.getUTCMinutes(); // CST minute

                                            return formattedDate === datetime && hour === 6 && minute === 0;
                                        });

                                        console.log("formattedStageData:", formattedStageData);

                                        // Formatting timestamps in netmissData
                                        let formattedNetmissData = netmissData.values.map(entry => {
                                            const timestamp = Number(entry[0]);

                                            return {
                                                ...entry, // Retain other data
                                                formattedTimestampUTC: convertUnixTimestamp(timestamp, false),
                                                formattedTimestampCST: convertUnixTimestamp(timestamp, true),
                                            };
                                        });
                                        console.log("formattedNetmissData:", formattedNetmissData);




                                        data['formattedStageData'] = formattedStageData;
                                        data['nwsHB5'] = nwsHB5;
                                        data['formattedNetmissData'] = formattedNetmissData;
                                    })
                                    .catch(error => {
                                        console.error(`Error fetching additional data for location:`, error);
                                    })
                            );
                        }

                        // Wait for all additional data fetches to complete
                        return Promise.all(additionalPromises);
                    })
                    .then(() => {
                        console.log('All time series data fetched successfully:', combinedData);

                        // Append the table to the specified container
                        const table = createTable(combinedData);

                        // loadingIndicator.style.display = 'none';
                    })
                    .catch(error => {
                        console.error('There was a problem with one or more fetch operations:', error);
                        // loadingIndicator.style.display = 'none';
                    });
            })
            .catch(error => {
                console.error('There was a problem with the initial fetch operation:', error);
                // loadingIndicator.style.display = 'none';
            });
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
        timeSeriesDataNortonBridge,
        timeSeriesDataGateTotal,
        timeSeriesDataOutflowTotal,
        timeSeriesDataGenerationRelease
    ) {
        const lines = [];

        return lines;
    }

    const fetchVersionedTimeSeriesData = async (tsid) => {
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

    const fetchTimeSeriesDataToday = async (tsid) => {
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

    const fetchTimeSeriesDataYesterday = async (tsid) => {
        let tsidData = null;
        tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${isoDateMinus1Day}&end=${isoDateMinus1Day}&office=${office}`;

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

    function filterByLocationCategory(array, setCategory) {
        return array.filter(item =>
            item['location-category'] &&
            item['location-category']['office-id'] === setCategory['office-id'] &&
            item['location-category']['id'] === setCategory['id']
        );
    }

    const reorderByAttribute = (data) => {
        data['assigned-time-series'].sort((a, b) => a.attribute - b.attribute);
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
});