document.addEventListener('DOMContentLoaded', async function () {
    if (lake === "Rend Lk-Big Muddy" || lake === "Rend Lk") {
        console.log("****************** Rend Lk-Big Muddy");
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

        // Get current date and time
        const currentDateTime = new Date();
        console.log('currentDateTime:', currentDateTime);

        // Subtract thirty hours from current date and time
        const currentDateTimeMinus30Hours = subtractHoursFromDate(currentDateTime, 20);
        console.log('currentDateTimeMinus30Hours :', currentDateTimeMinus30Hours);

        const urltsid1 = `${setBaseUrl}timeseries/group/Stage?office=${office}&category-id=${lake}`;
        const urltsid2 = `${setBaseUrl}timeseries/group/Flow?office=${office}&category-id=${lake}`;

        // Function to fetch time series data for a given tsid
        const fetchTimeSeriesData = async (tsid) => {
            const tsidData = `${setBaseUrl}timeseries?name=${tsid}&begin=${currentDateTimeMinus30Hours.toISOString()}&end=${currentDateTime.toISOString()}&office=${office}`;
            // console.log('tsidData:', tsidData);
            try {
                const response = await fetch(tsidData);
                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Error fetching time series data:", error);
            }
        };

        // Function to fetch tsid from the URLs
        const fetchTsidData = async () => {
            try {
                const response1 = await fetch(urltsid1);
                const response2 = await fetch(urltsid2);

                const tsidData1 = await response1.json();
                const tsidData2 = await response2.json();

                // Extract the timeseries-id from the response
                const tsid1 = tsidData1['assigned-time-series'][0]['timeseries-id']; // Grab the first timeseries-id
                const tsid2 = tsidData2['assigned-time-series'][0]['timeseries-id']; // Grab the first timeseries-id

                // Fetch time series data using tsid values
                const timeSeriesData1 = await fetchTimeSeriesData(tsid1);
                const timeSeriesData2 = await fetchTimeSeriesData(tsid2);

                // Call getHourlyDataOnTopOfHour for both time series data
                const hourlyData1 = getHourlyDataOnTopOfHour(timeSeriesData1, tsid1);
                const hourlyData2 = getHourlyDataOnTopOfHour(timeSeriesData2, tsid2);

                const formattedData = hourlyData1.map(entry => {
                    return {
                        ...entry,
                        formattedTimestamp: formatISODate2ReadableDate(entry.timestamp)
                    };
                });

                // Now you have the hourly data for both time series
                console.log("Hourly Data for Time Series 1:", hourlyData1);
                console.log("Hourly Data for Time Series 2:", hourlyData2);

            } catch (error) {
                console.error("Error fetching tsid data:", error);
            }
        };

        function getHourlyDataOnTopOfHour(data, tsid) {
            const hourlyData = [];

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

                // Check if the time is exactly at the top of the hour
                if (date.getMinutes() === 0 && date.getSeconds() === 0) {
                    hourlyData.push({ timestamp, value, qualityCode, tsid });
                }
            });

            return hourlyData;
        };

        function formatISODate2ReadableDate(timestamp) {
            const date = new Date(timestamp);
            const mm = String(date.getMonth() + 1).padStart(2, '0'); // Month
            const dd = String(date.getDate()).padStart(2, '0'); // Day
            const yyyy = date.getFullYear(); // Year
            const hh = String(date.getHours()).padStart(2, '0'); // Hours
            const min = String(date.getMinutes()).padStart(2, '0'); // Minutes
            return `${mm}-${dd}-${yyyy} ${hh}:${min}`;
        }

        // Call the function to fetch the data
        fetchTsidData();

        function subtractHoursFromDate(date, hoursToSubtract) {
            return new Date(date.getTime() - (hoursToSubtract * 60 * 60 * 1000));
        }

    } else if (lake === "Carlyle Lk-Kaskaskia" || lake === "Rend Lk") {
        console.log("****************** Carlyle Lk-Kaskaskia");
        console.log('datetime: ', datetime);

    } else if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
        console.log("****************** Lk Shelbyville-Kaskaskia");
        console.log('datetime: ', datetime);

    } else if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
        console.log("****************** Mark Twain Lk-Salt");
        console.log('datetime: ', datetime);

    } else if (lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
        console.log("****************** Wappapello Lk-St Francis");
        console.log('datetime: ', datetime);

    }

});