const fetchTsidData = async () => {
    try {
        let responseSluice = null;
        let tsidSluiceData = null;
        let responseSluiceTotal = null;
        let tsidSluiceTotalData = null;
        let responseOutflowTotal = null;
        let tsidOutflowTotalData = null;
        if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
            responseSluice = await fetch(urlTsidSluice);
            tsidSluiceData = await responseSluice.json();
            console.log("tsidSluiceData:", tsidSluiceData);
        }

        if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
            responseSluiceTotal = await fetch(urlTsidSluiceTotal);
            tsidSluiceTotalData = await responseSluiceTotal.json();
            console.log("tsidSluiceTotalData:", tsidSluiceTotalData);

            responseOutflowTotal = await fetch(urlTsidOutflowTotal);
            tsidOutflowTotalData = await responseOutflowTotal.json();
            console.log("tsidOutflowTotalData:", tsidOutflowTotalData);
        }

        const responseGate = await fetch(urlTsidGate);
        const tsidGateData = await responseGate.json();
        console.log("tsidGateData:", tsidGateData);

        const responseGateTotal = await fetch(urlTsidGateTotal);
        const tsidGateTotalData = await responseGateTotal.json();
        console.log("tsidGateTotalData:", tsidGateTotalData);

        const responseOutflowAverage = await fetch(urlTsidOutflowAverage);
        const tsidOutflowAverageData = await responseOutflowAverage.json();
        console.log("tsidOutflowAverageData:", tsidOutflowAverageData);

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
            cdaSaveBtn = document.getElementById("cda-btn-gate");

            cdaSaveBtn.disabled = true;

            if (await isLoggedIn()) {
                cdaSaveBtn.innerText = "Save";
            } else {
                cdaSaveBtn.innerText = "Login";
            }

            cdaSaveBtn.disabled = false;
        }

        let tsidSluice1 = null;
        let tsidSluice2 = null;
        let tsidSluiceTotal = null;
        let tsidGate1 = null;
        let tsidGate2 = null;
        let tsidGate3 = null;
        let tsidGate4 = null;
        let tsidGateTotal = null;
        let tsidOutflowTotal = null;
        let tsidOutflowAverage = null;

        let timeSeriesDataSluice1 = null;
        let timeSeriesDataSluice2 = null;
        let timeSeriesDataSluiceTotal = null;
        let timeSeriesDataGate1 = null;
        let timeSeriesDataGate2 = null;
        let timeSeriesDataGate3 = null;
        let timeSeriesDataGate4 = null;
        let timeSeriesDataGateTotal = null;
        let timeSeriesDataOutflowTotal = null;
        let timeSeriesDataOutflowAverage = null;

        let timeSeriesYesterdayDataSluice1 = null;
        let timeSeriesYesterdayDataSluice2 = null;
        let timeSeriesYesterdayDataSluiceTotal = null;
        let timeSeriesYesterdayDataGate1 = null;
        let timeSeriesYesterdayDataGate2 = null;
        let timeSeriesYesterdayDataGate3 = null;
        let timeSeriesYesterdayDataGate4 = null;
        let timeSeriesYesterdayDataGateTotal = null;
        let timeSeriesYesterdayDataOutflowTotal = null;
        let timeSeriesYesterdayDataOutflowAverage = null;

        let timeSeriesTomorrowDataOutflow = null;

        if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
            tsidSluice1 = tsidSluiceData['assigned-time-series'][0]['timeseries-id'];
            console.log("tsidSluice1:", tsidSluice1);

            tsidSluice2 = tsidSluiceData['assigned-time-series'][1]['timeseries-id'];
            console.log("tsidSluice2:", tsidSluice2);

            tsidSluiceTotal = tsidSluiceTotalData['assigned-time-series'][0]['timeseries-id'];
            console.log("tsidSluiceTotal:", tsidSluiceTotal);

            tsidGate1 = tsidGateData['assigned-time-series'][0]['timeseries-id'];
            console.log("tsidGate1:", tsidGate1);

            tsidGate2 = tsidGateData['assigned-time-series'][1]['timeseries-id'];
            console.log("tsidGate2:", tsidGate2);

            tsidGate3 = tsidGateData['assigned-time-series'][2]['timeseries-id'];
            console.log("tsidGate3:", tsidGate3);

            tsidGateTotal = tsidGateTotalData['assigned-time-series'][0]['timeseries-id'];
            console.log("tsidGateTotal:", tsidGateTotal);

            tsidOutflowTotal = tsidOutflowTotalData['assigned-time-series'][0]['timeseries-id'];
            console.log("tsidOutflowTotal:", tsidOutflowTotal);

            tsidOutflowAverage = tsidOutflowAverageData['assigned-time-series'][0]['timeseries-id'];
            console.log("tsidOutflowAverage:", tsidOutflowAverage);

            // Fetch time series data
            timeSeriesDataSluice1 = await fetchTimeSeriesData(tsidSluice1);
            console.log("timeSeriesDataSluice1:", timeSeriesDataSluice1);

            timeSeriesDataSluice2 = await fetchTimeSeriesData(tsidSluice2);
            console.log("timeSeriesDataSluice2:", timeSeriesDataSluice2);

            timeSeriesDataSluiceTotal = await fetchTimeSeriesData(tsidSluiceTotal);
            console.log("timeSeriesDataSluiceTotal:", timeSeriesDataSluiceTotal);

            timeSeriesDataGate1 = await fetchTimeSeriesData(tsidGate1);
            console.log("timeSeriesDataGate1:", timeSeriesDataGate1);

            timeSeriesDataGate2 = await fetchTimeSeriesData(tsidGate2);
            console.log("timeSeriesDataGate2:", timeSeriesDataGate2);

            timeSeriesDataGate3 = await fetchTimeSeriesData(tsidGate3);
            console.log("timeSeriesDataGate3:", timeSeriesDataGate3);

            timeSeriesDataGateTotal = await fetchTimeSeriesData(tsidGateTotal);
            console.log("timeSeriesDataGateTotal:", timeSeriesDataGateTotal);

            timeSeriesDataOutflowTotal = await fetchTimeSeriesData(tsidOutflowTotal);
            console.log("timeSeriesDataOutflowTotal:", timeSeriesDataOutflowTotal);

            timeSeriesDataOutflowAverage = await fetchTimeSeriesData(tsidOutflowAverage);
            console.log("timeSeriesDataOutflowAverage:", timeSeriesDataOutflowAverage);

            // Fetch yesterday time series data
            timeSeriesYesterdayDataSluice1 = await fetchTimeSeriesYesterdayData(tsidSluice1);
            console.log("timeSeriesYesterdayDataSluice1:", timeSeriesYesterdayDataSluice1);

            timeSeriesYesterdayDataSluice2 = await fetchTimeSeriesYesterdayData(tsidSluice2);
            console.log("timeSeriesYesterdayDataSluice2:", timeSeriesYesterdayDataSluice2);

            timeSeriesYesterdayDataSluiceTotal = await fetchTimeSeriesYesterdayData(tsidSluiceTotal);
            console.log("timeSeriesYesterdayDataSluiceTotal:", timeSeriesYesterdayDataSluiceTotal);

            timeSeriesYesterdayDataGate1 = await fetchTimeSeriesYesterdayData(tsidGate1);
            console.log("timeSeriesYesterdayDataGate1:", timeSeriesYesterdayDataGate1);

            timeSeriesYesterdayDataGate2 = await fetchTimeSeriesYesterdayData(tsidGate2);
            console.log("timeSeriesYesterdayDataGate2:", timeSeriesYesterdayDataGate2);

            timeSeriesYesterdayDataGate3 = await fetchTimeSeriesYesterdayData(tsidGate3);
            console.log("timeSeriesYesterdayDataGate3:", timeSeriesYesterdayDataGate3);

            timeSeriesYesterdayDataGateTotal = await fetchTimeSeriesYesterdayData(tsidGateTotal);
            console.log("timeSeriesYesterdayDataGateTotal:", timeSeriesYesterdayDataGateTotal);

            timeSeriesYesterdayDataOutflowTotal = await fetchTimeSeriesYesterdayData(tsidOutflowTotal);
            console.log("timeSeriesYesterdayDataOutflowTotal:", timeSeriesYesterdayDataOutflowTotal);

            timeSeriesYesterdayDataOutflowAverage = await fetchTimeSeriesYesterdayData(tsidOutflowAverage);
            console.log("timeSeriesYesterdayDataOutflowAverage:", timeSeriesYesterdayDataOutflowAverage);

            // Fetch tomorrow time series data
            timeSeriesTomorrowDataOutflow = await fetchTimeSeriesTomorrowData(tsidOutflowTotal);
            console.log("timeSeriesTomorrowDataOutflow:", timeSeriesTomorrowDataOutflow);

            if (timeSeriesDataSluice1 && timeSeriesDataSluice1.values && timeSeriesDataSluice1.values.length > 0) {
                console.log("Data for today found, Calling createTable ...");
                console.log("This is a multiple row save.");

                createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
                    tsidSluice1, timeSeriesDataSluice1, tsidSluice2, timeSeriesDataSluice2, tsidSluiceTotal, timeSeriesDataSluiceTotal,
                    tsidGate1, timeSeriesDataGate1, tsidGate2, timeSeriesDataGate2, tsidGate3, timeSeriesDataGate3, tsidGateTotal, timeSeriesDataGateTotal,
                    tsidOutflowTotal, timeSeriesDataOutflowTotal, tsidOutflowAverage, timeSeriesDataOutflowAverage,
                    timeSeriesYesterdayDataSluice1, timeSeriesYesterdayDataSluice2, timeSeriesYesterdayDataSluiceTotal, timeSeriesYesterdayDataGate1, timeSeriesYesterdayDataGate2,
                    timeSeriesYesterdayDataGate3, timeSeriesYesterdayDataGateTotal, timeSeriesYesterdayDataOutflowTotal, timeSeriesYesterdayDataOutflowAverage, tsidGate4, timeSeriesDataGate4, timeSeriesYesterdayDataGate4, timeSeriesTomorrowDataOutflow);

                loadingIndicator.style.display = 'none';

                loginStateController()
                setInterval(async () => {
                    loginStateController()
                }, 10000)
            } else if (timeSeriesYesterdayDataSluice1 && timeSeriesYesterdayDataSluice1.values && timeSeriesYesterdayDataSluice1.values.length > 0) {
                console.log("Data from previous day found, Calling createDataEntryTable ...");
                console.log("This is a single save row.");

                createDataEntryTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
                    tsidSluice1, timeSeriesDataSluice1, tsidSluice2, timeSeriesDataSluice2, tsidSluiceTotal, timeSeriesDataSluiceTotal,
                    tsidGate1, timeSeriesDataGate1, tsidGate2, timeSeriesDataGate2, tsidGate3, timeSeriesDataGate3, tsidGateTotal, timeSeriesDataGateTotal,
                    tsidOutflowTotal, timeSeriesDataOutflowTotal, tsidOutflowAverage, timeSeriesDataOutflowAverage,
                    timeSeriesYesterdayDataSluice1, timeSeriesYesterdayDataSluice2, timeSeriesYesterdayDataSluiceTotal, timeSeriesYesterdayDataGate1, timeSeriesYesterdayDataGate2,
                    timeSeriesYesterdayDataGate3, timeSeriesYesterdayDataGateTotal, timeSeriesYesterdayDataOutflowTotal, timeSeriesYesterdayDataOutflowAverage, tsidGate4, timeSeriesDataGate4, timeSeriesYesterdayDataGate4, timeSeriesTomorrowDataOutflow);

                loadingIndicator.style.display = 'none';

                loginStateController()
                setInterval(async () => {
                    loginStateController()
                }, 10000)
            } else {
                console.log("Calling createDataEntryTable ...");
                console.log("No data from today or previous day found, Creating Data Entry Table ...");
                console.log("Recomedation: Please enter data for the previous day.");
                alert("No data from today or previous day found, Please enter data for the previous day.");
            }
        } else if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
            tsidGate1 = tsidGateData['assigned-time-series'][0]['timeseries-id'];
            console.log("tsidGate1:", tsidGate1);

            tsidGate2 = tsidGateData['assigned-time-series'][1]['timeseries-id'];
            console.log("tsidGate2:", tsidGate2);

            tsidGate3 = tsidGateData['assigned-time-series'][2]['timeseries-id'];
            console.log("tsidGate3:", tsidGate3);

            tsidGate4 = tsidGateData['assigned-time-series'][3]['timeseries-id'];
            console.log("tsidGate4:", tsidGate4);

            tsidGateTotal = tsidGateTotalData['assigned-time-series'][0]['timeseries-id'];
            console.log("tsidGateTotal:", tsidGateTotal);

            tsidOutflowAverage = tsidOutflowAverageData['assigned-time-series'][0]['timeseries-id'];
            console.log("tsidOutflowAverage:", tsidOutflowAverage);

            // Fetch time series data
            timeSeriesDataGate1 = await fetchTimeSeriesData(tsidGate1);
            console.log("timeSeriesDataGate1:", timeSeriesDataGate1);

            timeSeriesDataGate2 = await fetchTimeSeriesData(tsidGate2);
            console.log("timeSeriesDataGate2:", timeSeriesDataGate2);

            timeSeriesDataGate3 = await fetchTimeSeriesData(tsidGate3);
            console.log("timeSeriesDataGate3:", timeSeriesDataGate3);

            timeSeriesDataGate4 = await fetchTimeSeriesData(tsidGate4);
            console.log("timeSeriesDataGate4:", timeSeriesDataGate4);

            timeSeriesDataGateTotal = await fetchTimeSeriesData(tsidGateTotal);
            console.log("timeSeriesDataGateTotal:", timeSeriesDataGateTotal);

            timeSeriesDataOutflowAverage = await fetchTimeSeriesData(tsidOutflowAverage);
            console.log("timeSeriesDataOutflowAverage:", timeSeriesDataOutflowAverage);

            // Fetch yesterday time series data
            timeSeriesYesterdayDataGate1 = await fetchTimeSeriesYesterdayData(tsidGate1);
            console.log("timeSeriesYesterdayDataGate1:", timeSeriesYesterdayDataGate1);

            timeSeriesYesterdayDataGate2 = await fetchTimeSeriesYesterdayData(tsidGate2);
            console.log("timeSeriesYesterdayDataGate2:", timeSeriesYesterdayDataGate2);

            timeSeriesYesterdayDataGate3 = await fetchTimeSeriesYesterdayData(tsidGate3);
            console.log("timeSeriesYesterdayDataGate3:", timeSeriesYesterdayDataGate3);

            timeSeriesYesterdayDataGate4 = await fetchTimeSeriesYesterdayData(tsidGate4);
            console.log("timeSeriesYesterdayDataGate4:", timeSeriesYesterdayDataGate4);

            timeSeriesYesterdayDataGateTotal = await fetchTimeSeriesYesterdayData(tsidGateTotal);
            console.log("timeSeriesYesterdayDataGateTotal:", timeSeriesYesterdayDataGateTotal);

            timeSeriesYesterdayDataOutflowAverage = await fetchTimeSeriesYesterdayData(tsidOutflowAverage);
            console.log("timeSeriesYesterdayDataOutflowAverage:", timeSeriesYesterdayDataOutflowAverage);

            // Fetch tomorrow time series data
            timeSeriesTomorrowDataOutflow = await fetchTimeSeriesTomorrowData(tsidOutflowTotal);
            console.log("timeSeriesTomorrowDataOutflow:", timeSeriesTomorrowDataOutflow);

            if (timeSeriesDataGate1 && timeSeriesDataGate1.values && timeSeriesDataGate1.values.length > 0) {
                console.log("Data for today found, Calling createTable ...");

                createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
                    tsidSluice1, timeSeriesDataSluice1, tsidSluice2, timeSeriesDataSluice2, tsidSluiceTotal, timeSeriesDataSluiceTotal,
                    tsidGate1, timeSeriesDataGate1, tsidGate2, timeSeriesDataGate2, tsidGate3, timeSeriesDataGate3, tsidGateTotal, timeSeriesDataGateTotal,
                    tsidOutflowTotal, timeSeriesDataOutflowTotal, tsidOutflowAverage, timeSeriesDataOutflowAverage,
                    timeSeriesYesterdayDataSluice1, timeSeriesYesterdayDataSluice2, timeSeriesYesterdayDataSluiceTotal, timeSeriesYesterdayDataGate1, timeSeriesYesterdayDataGate2,
                    timeSeriesYesterdayDataGate3, timeSeriesYesterdayDataGateTotal, timeSeriesYesterdayDataOutflowTotal, timeSeriesYesterdayDataOutflowAverage, tsidGate4, timeSeriesDataGate4, timeSeriesYesterdayDataGate4, timeSeriesTomorrowDataOutflow);

                loadingIndicator.style.display = 'none';

                loginStateController()
                setInterval(async () => {
                    loginStateController()
                }, 10000)
            } else if (timeSeriesYesterdayDataGate1 && timeSeriesYesterdayDataGate1.values && timeSeriesYesterdayDataGate1.values.length > 0) {
                console.log("Data from previous day found, Calling createDataEntryTable ...");

                createDataEntryTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
                    tsidSluice1, timeSeriesDataSluice1, tsidSluice2, timeSeriesDataSluice2, tsidSluiceTotal, timeSeriesDataSluiceTotal,
                    tsidGate1, timeSeriesDataGate1, tsidGate2, timeSeriesDataGate2, tsidGate3, timeSeriesDataGate3, tsidGateTotal, timeSeriesDataGateTotal,
                    tsidOutflowTotal, timeSeriesDataOutflowTotal, tsidOutflowAverage, timeSeriesDataOutflowAverage,
                    timeSeriesYesterdayDataSluice1, timeSeriesYesterdayDataSluice2, timeSeriesYesterdayDataSluiceTotal, timeSeriesYesterdayDataGate1, timeSeriesYesterdayDataGate2,
                    timeSeriesYesterdayDataGate3, timeSeriesYesterdayDataGateTotal, timeSeriesYesterdayDataOutflowTotal, timeSeriesYesterdayDataOutflowAverage, tsidGate4, timeSeriesDataGate4, timeSeriesYesterdayDataGate4, timeSeriesTomorrowDataOutflow);

                loadingIndicator.style.display = 'none';

                loginStateController()
                setInterval(async () => {
                    loginStateController()
                }, 10000)
            } else {
                console.log("Calling createDataEntryTable ...");
                console.log("No data from today or previous day found, Creating Data Entry Table ...");
                console.log("Recomedation: Please enter data for the previous day.");
                alert("No data from today or previous day found, Please enter data for the previous day.");
            }
        } else if (lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
            tsidGate1 = tsidGateData['assigned-time-series'][0]['timeseries-id'];
            console.log("tsidGate1:", tsidGate1);

            tsidGate2 = tsidGateData['assigned-time-series'][1]['timeseries-id'];
            console.log("tsidGate2:", tsidGate2);

            tsidGate3 = tsidGateData['assigned-time-series'][2]['timeseries-id'];
            console.log("tsidGate3:", tsidGate3);

            tsidGate4 = tsidGateData['assigned-time-series'][3]['timeseries-id'];
            console.log("tsidGate4:", tsidGate4);

            tsidSluiceTotal = tsidSluiceTotalData['assigned-time-series'][0]['timeseries-id'];
            console.log("tsidSluiceTotal:", tsidSluiceTotal);

            tsidGateTotal = tsidGateTotalData['assigned-time-series'][0]['timeseries-id'];
            console.log("tsidGateTotal:", tsidGateTotal);

            tsidOutflowTotal = tsidOutflowTotalData['assigned-time-series'][0]['timeseries-id'];
            console.log("tsidOutflowTotal:", tsidOutflowTotal);

            tsidOutflowAverage = tsidOutflowAverageData['assigned-time-series'][0]['timeseries-id'];
            console.log("tsidOutflowAverage:", tsidOutflowAverage);

            // Fetch time series data
            timeSeriesDataGate1 = await fetchTimeSeriesData(tsidGate1);
            console.log("timeSeriesDataGate1:", timeSeriesDataGate1);

            timeSeriesDataGate2 = await fetchTimeSeriesData(tsidGate2);
            console.log("timeSeriesDataGate2:", timeSeriesDataGate2);

            timeSeriesDataGate3 = await fetchTimeSeriesData(tsidGate3);
            console.log("timeSeriesDataGate3:", timeSeriesDataGate3);

            timeSeriesDataGate4 = await fetchTimeSeriesData(tsidGate4);
            console.log("timeSeriesDataGate4:", timeSeriesDataGate4);

            timeSeriesDataSluiceTotal = await fetchTimeSeriesData(tsidSluiceTotal);
            console.log("timeSeriesDataSluiceTotal:", timeSeriesDataSluiceTotal);

            timeSeriesDataGateTotal = await fetchTimeSeriesData(tsidGateTotal);
            console.log("timeSeriesDataGateTotal:", timeSeriesDataGateTotal);

            timeSeriesDataOutflowTotal = await fetchTimeSeriesData(tsidOutflowTotal);
            console.log("timeSeriesDataOutflowTotal:", timeSeriesDataOutflowTotal);

            timeSeriesDataOutflowAverage = await fetchTimeSeriesData(tsidOutflowAverage);
            console.log("timeSeriesDataOutflowAverage:", timeSeriesDataOutflowAverage);

            // Fetch yesterday time series data
            timeSeriesYesterdayDataGate1 = await fetchTimeSeriesYesterdayData(tsidGate1);
            console.log("timeSeriesYesterdayDataGate1:", timeSeriesYesterdayDataGate1);

            timeSeriesYesterdayDataGate2 = await fetchTimeSeriesYesterdayData(tsidGate2);
            console.log("timeSeriesYesterdayDataGate2:", timeSeriesYesterdayDataGate2);

            timeSeriesYesterdayDataGate3 = await fetchTimeSeriesYesterdayData(tsidGate3);
            console.log("timeSeriesYesterdayDataGate3:", timeSeriesYesterdayDataGate3);

            timeSeriesYesterdayDataGate4 = await fetchTimeSeriesYesterdayData(tsidGate4);
            console.log("timeSeriesYesterdayDataGate4:", timeSeriesYesterdayDataGate4);

            timeSeriesYesterdayDataSluiceTotal = await fetchTimeSeriesYesterdayData(tsidSluiceTotal);
            console.log("timeSeriesYesterdayDataSluiceTotal:", timeSeriesYesterdayDataSluiceTotal);

            timeSeriesYesterdayDataGateTotal = await fetchTimeSeriesYesterdayData(tsidGateTotal);
            console.log("timeSeriesYesterdayDataGateTotal:", timeSeriesYesterdayDataGateTotal);

            timeSeriesYesterdayDataOutflowTotal = await fetchTimeSeriesYesterdayData(tsidOutflowTotal);
            console.log("timeSeriesYesterdayDataOutflowTotal:", timeSeriesYesterdayDataOutflowTotal);

            timeSeriesYesterdayDataOutflowAverage = await fetchTimeSeriesYesterdayData(tsidOutflowAverage);
            console.log("timeSeriesYesterdayDataOutflowAverage:", timeSeriesYesterdayDataOutflowAverage);

            // Fetch tomorrow time series data
            timeSeriesTomorrowDataOutflow = await fetchTimeSeriesTomorrowData(tsidOutflowTotal);
            console.log("timeSeriesTomorrowDataOutflow:", timeSeriesTomorrowDataOutflow);

            if (timeSeriesDataGate1 && timeSeriesDataGate1.values && timeSeriesDataGate1.values.length > 0) {
                console.log("Data for today found, Calling createTable ...");

                createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
                    tsidSluice1, timeSeriesDataSluice1, tsidSluice2, timeSeriesDataSluice2, tsidSluiceTotal, timeSeriesDataSluiceTotal,
                    tsidGate1, timeSeriesDataGate1, tsidGate2, timeSeriesDataGate2, tsidGate3, timeSeriesDataGate3, tsidGateTotal, timeSeriesDataGateTotal,
                    tsidOutflowTotal, timeSeriesDataOutflowTotal, tsidOutflowAverage, timeSeriesDataOutflowAverage,
                    timeSeriesYesterdayDataSluice1, timeSeriesYesterdayDataSluice2, timeSeriesYesterdayDataSluiceTotal, timeSeriesYesterdayDataGate1, timeSeriesYesterdayDataGate2,
                    timeSeriesYesterdayDataGate3, timeSeriesYesterdayDataGateTotal, timeSeriesYesterdayDataOutflowTotal, timeSeriesYesterdayDataOutflowAverage, tsidGate4, timeSeriesDataGate4, timeSeriesYesterdayDataGate4, timeSeriesTomorrowDataOutflow);

                loadingIndicator.style.display = 'none';

                loginStateController()
                setInterval(async () => {
                    loginStateController()
                }, 10000)
            } else if (timeSeriesYesterdayDataGate1 && timeSeriesYesterdayDataGate1.values && timeSeriesYesterdayDataGate1.values.length > 0) {
                console.log("Data from previous day found, Calling createDataEntryTable ...");

                createDataEntryTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
                    tsidSluice1, timeSeriesDataSluice1, tsidSluice2, timeSeriesDataSluice2, tsidSluiceTotal, timeSeriesDataSluiceTotal,
                    tsidGate1, timeSeriesDataGate1, tsidGate2, timeSeriesDataGate2, tsidGate3, timeSeriesDataGate3, tsidGateTotal, timeSeriesDataGateTotal,
                    tsidOutflowTotal, timeSeriesDataOutflowTotal, tsidOutflowAverage, timeSeriesDataOutflowAverage,
                    timeSeriesYesterdayDataSluice1, timeSeriesYesterdayDataSluice2, timeSeriesYesterdayDataSluiceTotal, timeSeriesYesterdayDataGate1, timeSeriesYesterdayDataGate2,
                    timeSeriesYesterdayDataGate3, timeSeriesYesterdayDataGateTotal, timeSeriesYesterdayDataOutflowTotal, timeSeriesYesterdayDataOutflowAverage, tsidGate4, timeSeriesDataGate4, timeSeriesYesterdayDataGate4, timeSeriesTomorrowDataOutflow);

                loadingIndicator.style.display = 'none';

                loginStateController()
                setInterval(async () => {
                    loginStateController()
                }, 10000)
            } else {
                console.log("Calling createDataEntryTable ...");
                console.log("No data from today or previous day found, Creating Data Entry Table ...");
                console.log("Recomedation: Please enter data for the previous day.");
                alert("No data from today or previous day found, Please enter data for the previous day.");
            }
        } else if (lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
            tsidGate1 = tsidGateData['assigned-time-series'][0]['timeseries-id'];
            console.log("tsidGate1:", tsidGate1);

            tsidGate2 = tsidGateData['assigned-time-series'][1]['timeseries-id'];
            console.log("tsidGate2:", tsidGate2);

            tsidGate3 = tsidGateData['assigned-time-series'][2]['timeseries-id'];
            console.log("tsidGate3:", tsidGate3);

            tsidGateTotal = tsidGateTotalData['assigned-time-series'][0]['timeseries-id'];
            console.log("tsidGateTotal:", tsidGateTotal);

            tsidOutflowAverage = tsidOutflowAverageData['assigned-time-series'][0]['timeseries-id'];
            console.log("tsidOutflowAverage:", tsidOutflowAverage);

            // Fetch time series data
            timeSeriesDataGate1 = await fetchTimeSeriesData(tsidGate1);
            console.log("timeSeriesDataGate1:", timeSeriesDataGate1);

            timeSeriesDataGate2 = await fetchTimeSeriesData(tsidGate2);
            console.log("timeSeriesDataGate2:", timeSeriesDataGate2);

            timeSeriesDataGate3 = await fetchTimeSeriesData(tsidGate3);
            console.log("timeSeriesDataGate3:", timeSeriesDataGate3);

            timeSeriesDataGateTotal = await fetchTimeSeriesData(tsidGateTotal);
            console.log("timeSeriesDataGateTotal:", timeSeriesDataGateTotal);

            timeSeriesDataOutflowAverage = await fetchTimeSeriesData(tsidOutflowAverage);
            console.log("timeSeriesDataOutflowAverage:", timeSeriesDataOutflowAverage);

            // Fetch yesterday time series data
            timeSeriesYesterdayDataGate1 = await fetchTimeSeriesYesterdayData(tsidGate1);
            console.log("timeSeriesYesterdayDataGate1:", timeSeriesYesterdayDataGate1);

            timeSeriesYesterdayDataGate2 = await fetchTimeSeriesYesterdayData(tsidGate2);
            console.log("timeSeriesYesterdayDataGate2:", timeSeriesYesterdayDataGate2);

            timeSeriesYesterdayDataGate3 = await fetchTimeSeriesYesterdayData(tsidGate3);
            console.log("timeSeriesYesterdayDataGate3:", timeSeriesYesterdayDataGate3);

            timeSeriesYesterdayDataGateTotal = await fetchTimeSeriesYesterdayData(tsidGateTotal);
            console.log("timeSeriesYesterdayDataGateTotal:", timeSeriesYesterdayDataGateTotal);

            timeSeriesYesterdayDataOutflowAverage = await fetchTimeSeriesYesterdayData(tsidOutflowAverage);
            console.log("timeSeriesYesterdayDataOutflowAverage:", timeSeriesYesterdayDataOutflowAverage);

            // Fetch tomorrow time series data
            timeSeriesTomorrowDataOutflow = await fetchTimeSeriesTomorrowData(tsidOutflowAverage);
            console.log("timeSeriesTomorrowDataOutflow:", timeSeriesTomorrowDataOutflow);

            if (timeSeriesDataGate1 && timeSeriesDataGate1.values && timeSeriesDataGate1.values.length > 0) {
                console.log("Data for today found, Calling createTable ...");

                createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
                    tsidSluice1, timeSeriesDataSluice1, tsidSluice2, timeSeriesDataSluice2, tsidSluiceTotal, timeSeriesDataSluiceTotal,
                    tsidGate1, timeSeriesDataGate1, tsidGate2, timeSeriesDataGate2, tsidGate3, timeSeriesDataGate3, tsidGateTotal, timeSeriesDataGateTotal,
                    tsidOutflowTotal, timeSeriesDataOutflowTotal, tsidOutflowAverage, timeSeriesDataOutflowAverage,
                    timeSeriesYesterdayDataSluice1, timeSeriesYesterdayDataSluice2, timeSeriesYesterdayDataSluiceTotal, timeSeriesYesterdayDataGate1, timeSeriesYesterdayDataGate2,
                    timeSeriesYesterdayDataGate3, timeSeriesYesterdayDataGateTotal, timeSeriesYesterdayDataOutflowTotal, timeSeriesYesterdayDataOutflowAverage, tsidGate4, timeSeriesDataGate4, timeSeriesYesterdayDataGate4, timeSeriesTomorrowDataOutflow);

                loadingIndicator.style.display = 'none';

                loginStateController()
                setInterval(async () => {
                    loginStateController()
                }, 10000)
            } else if (timeSeriesYesterdayDataGate1 && timeSeriesYesterdayDataGate1.values && timeSeriesYesterdayDataGate1.values.length > 0) {
                console.log("Data from previous day found, Calling createDataEntryTable ...");

                createDataEntryTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
                    tsidSluice1, timeSeriesDataSluice1, tsidSluice2, timeSeriesDataSluice2, tsidSluiceTotal, timeSeriesDataSluiceTotal,
                    tsidGate1, timeSeriesDataGate1, tsidGate2, timeSeriesDataGate2, tsidGate3, timeSeriesDataGate3, tsidGateTotal, timeSeriesDataGateTotal,
                    tsidOutflowTotal, timeSeriesDataOutflowTotal, tsidOutflowAverage, timeSeriesDataOutflowAverage,
                    timeSeriesYesterdayDataSluice1, timeSeriesYesterdayDataSluice2, timeSeriesYesterdayDataSluiceTotal, timeSeriesYesterdayDataGate1, timeSeriesYesterdayDataGate2,
                    timeSeriesYesterdayDataGate3, timeSeriesYesterdayDataGateTotal, timeSeriesYesterdayDataOutflowTotal, timeSeriesYesterdayDataOutflowAverage, tsidGate4, timeSeriesDataGate4, timeSeriesYesterdayDataGate4, timeSeriesTomorrowDataOutflow);

                loadingIndicator.style.display = 'none';

                loginStateController()
                setInterval(async () => {
                    loginStateController()
                }, 10000)
            } else {
                console.log("Calling createDataEntryTable ...");
                console.log("No data from today or previous day found, Creating Data Entry Table ...");
                console.log("Recomedation: Please enter data for the previous day.");
                alert("No data from today or previous day found, Please enter data for the previous day.");
            }
        }
    } catch (error) {
        console.error("Error fetching tsidOutflow data:", error);

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

    function createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
        tsidSluice1, timeSeriesDataSluice1, tsidSluice2, timeSeriesDataSluice2, tsidSluiceTotal, timeSeriesDataSluiceTotal,
        tsidGate1, timeSeriesDataGate1, tsidGate2, timeSeriesDataGate2, tsidGate3, timeSeriesDataGate3, tsidGateTotal, timeSeriesDataGateTotal,
        tsidOutflowTotal, timeSeriesDataOutflowTotal, tsidOutflowAverage, timeSeriesDataOutflowAverage,
        timeSeriesYesterdayDataSluice1, timeSeriesYesterdayDataSluice2, timeSeriesYesterdayDataSluiceTotal, timeSeriesYesterdayDataGate1, timeSeriesYesterdayDataGate2,
        timeSeriesYesterdayDataGate3, timeSeriesYesterdayDataGateTotal, timeSeriesYesterdayDataOutflowTotal, timeSeriesYesterdayDataOutflowAverage, tsidGate4, timeSeriesDataGate4, timeSeriesYesterdayDataGate4, timeSeriesTomorrowDataOutflow) {

        const formatData = (data) => {
            if (!data || !Array.isArray(data.values)) return [];

            return data.values.map((entry) => {
                const timestamp = entry[0];
                const formattedTimestampCST = formatISODateToCSTString(Number(timestamp));
                return {
                    ...entry,
                    formattedTimestampCST
                };
            });
        };

        // Today's data
        let formattedDataSluice1 = null;
        let formattedDataSluice2 = null;
        let formattedDataSluiceTotal = null;
        let formattedDataGate1 = null;;
        let formattedDataGate2 = null;;
        let formattedDataGate3 = null;
        let formattedDataGate4 = null;
        let formattedDataGateTotal = null;
        let formattedDataOutflowTotal = null;;
        let formattedDataOutflowAverage = null;

        // Yesterday's data
        let formattedYesterdayDataSluice1 = null;
        let formattedYesterdayDataSluice2 = null;
        let formattedYesterdayDataSluiceTotal = null;
        let formattedYesterdayDataGate1 = null;
        let formattedYesterdayDataGate2 = null;
        let formattedYesterdayDataGate3 = null;
        let formattedYesterdayDataGate4 = null;
        let formattedYesterdayDataGateTotal = null;
        let formattedYesterdayDataOutflowTotal = null;
        let formattedYesterdayDataOutflowAverage = null;

        // Tomorrow's data
        let formattedTomorrowDataOutflowAverage = null;

        if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
            // Today's data
            formattedDataSluice1 = formatData(timeSeriesDataSluice1);
            formattedDataSluice2 = formatData(timeSeriesDataSluice2);
            formattedDataSluiceTotal = formatData(timeSeriesDataSluiceTotal);
            formattedDataGate1 = formatData(timeSeriesDataGate1);
            formattedDataGate2 = formatData(timeSeriesDataGate2);
            formattedDataGate3 = formatData(timeSeriesDataGate3);
            formattedDataGateTotal = formatData(timeSeriesDataGateTotal);
            formattedDataOutflowTotal = formatData(timeSeriesDataOutflowTotal);
            formattedDataOutflowAverage = formatData(timeSeriesDataOutflowAverage);

            console.log("formattedDataSluice1:", formattedDataSluice1);
            console.log("formattedDataSluice2:", formattedDataSluice2);
            console.log("formattedDataSluiceTotal:", formattedDataSluiceTotal);
            console.log("formattedDataGate1:", formattedDataGate1);
            console.log("formattedDataGate2:", formattedDataGate2);
            console.log("formattedDataGate3:", formattedDataGate3);
            console.log("formattedDataGateTotal:", formattedDataGateTotal);
            console.log("formattedDataOutflowTotal:", formattedDataOutflowTotal);
            console.log("formattedDataOutflowAverage:", formattedDataOutflowAverage);

            // Yesterday's data
            formattedYesterdayDataSluice1 = formatData(timeSeriesYesterdayDataSluice1);
            formattedYesterdayDataSluice2 = formatData(timeSeriesYesterdayDataSluice2);
            formattedYesterdayDataSluiceTotal = formatData(timeSeriesYesterdayDataSluiceTotal);
            formattedYesterdayDataGate1 = formatData(timeSeriesYesterdayDataGate1);
            formattedYesterdayDataGate2 = formatData(timeSeriesYesterdayDataGate2);
            formattedYesterdayDataGate3 = formatData(timeSeriesYesterdayDataGate3);
            formattedYesterdayDataGateTotal = formatData(timeSeriesYesterdayDataGateTotal);
            formattedYesterdayDataOutflowTotal = formatData(timeSeriesYesterdayDataOutflowTotal);
            formattedYesterdayDataOutflowAverage = formatData(timeSeriesYesterdayDataOutflowAverage);

            console.log("formattedYesterdayDataSluice1:", formattedYesterdayDataSluice1);
            console.log("formattedYesterdayDataSluice2:", formattedYesterdayDataSluice2);
            console.log("formattedYesterdayDataSluiceTotal:", formattedYesterdayDataSluiceTotal);
            console.log("formattedYesterdayDataGate1:", formattedYesterdayDataGate1);
            console.log("formattedYesterdayDataGate2:", formattedYesterdayDataGate2);
            console.log("formattedYesterdayDataGate3:", formattedYesterdayDataGate3);
            console.log("formattedYesterdayDataGateTotal:", formattedYesterdayDataGateTotal);
            console.log("formattedYesterdayDataOutflowTotal:", formattedYesterdayDataOutflowTotal);
            console.log("formattedYesterdayDataOutflowAverage:", formattedYesterdayDataOutflowAverage);

            // Tomorrow's data
            formattedTomorrowDataOutflowAverage = formatData(timeSeriesTomorrowDataOutflow);
            console.log("formattedTomorrowDataOutflowAverage:", formattedTomorrowDataOutflowAverage);
        } else if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
            // Today's data
            formattedDataGate1 = formatData(timeSeriesDataGate1);
            formattedDataGate2 = formatData(timeSeriesDataGate2);
            formattedDataGate3 = formatData(timeSeriesDataGate3);
            formattedDataGate4 = formatData(timeSeriesDataGate4);
            formattedDataGateTotal = formatData(timeSeriesDataGateTotal);
            formattedDataOutflowAverage = formatData(timeSeriesDataOutflowAverage);

            console.log("formattedDataGate1:", formattedDataGate1);
            console.log("formattedDataGate2:", formattedDataGate2);
            console.log("formattedDataGate3:", formattedDataGate3);
            console.log("formattedDataGate4:", formattedDataGate4);
            console.log("formattedDataGateTotal:", formattedDataGateTotal);
            console.log("formattedDataOutflowAverage:", formattedDataOutflowAverage);

            // Yesterday's data
            formattedYesterdayDataGate1 = formatData(timeSeriesYesterdayDataGate1);
            formattedYesterdayDataGate2 = formatData(timeSeriesYesterdayDataGate2);
            formattedYesterdayDataGate3 = formatData(timeSeriesYesterdayDataGate3);
            formattedYesterdayDataGate4 = formatData(timeSeriesYesterdayDataGate4);
            formattedYesterdayDataGateTotal = formatData(timeSeriesYesterdayDataGateTotal);
            formattedYesterdayDataOutflowAverage = formatData(timeSeriesYesterdayDataOutflowAverage);

            console.log("formattedYesterdayDataGate1:", formattedYesterdayDataGate1);
            console.log("formattedYesterdayDataGate2:", formattedYesterdayDataGate2);
            console.log("formattedYesterdayDataGate3:", formattedYesterdayDataGate3);
            console.log("formattedYesterdayDataGate4:", formattedYesterdayDataGate4);
            console.log("formattedYesterdayDataGateTotal:", formattedYesterdayDataGateTotal);
            console.log("formattedYesterdayDataOutflowAverage:", formattedYesterdayDataOutflowAverage);

            // Tomorrow's data
            formattedTomorrowDataOutflowAverage = formatData(timeSeriesTomorrowDataOutflow);
            console.log("formattedTomorrowDataOutflowAverage:", formattedTomorrowDataOutflowAverage);
        } else if (lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
            // Today's data
            formattedDataSluiceTotal = formatData(timeSeriesDataSluiceTotal);
            formattedDataGate1 = formatData(timeSeriesDataGate1);
            formattedDataGate2 = formatData(timeSeriesDataGate2);
            formattedDataGate3 = formatData(timeSeriesDataGate3);
            formattedDataGate4 = formatData(timeSeriesDataGate4);
            formattedDataGateTotal = formatData(timeSeriesDataGateTotal);
            formattedDataOutflowTotal = formatData(timeSeriesDataOutflowTotal);
            formattedDataOutflowAverage = formatData(timeSeriesDataOutflowAverage);

            console.log("formattedDataSluiceTotal:", formattedDataSluiceTotal);
            console.log("formattedDataGate1:", formattedDataGate1);
            console.log("formattedDataGate2:", formattedDataGate2);
            console.log("formattedDataGate3:", formattedDataGate3);
            console.log("formattedDataGate4:", formattedDataGate4);
            console.log("formattedDataGateTotal:", formattedDataGateTotal);
            console.log("formattedDataOutflowTotal:", formattedDataOutflowTotal);
            console.log("formattedDataOutflowAverage:", formattedDataOutflowAverage);

            // Yesterday's data
            formattedYesterdayDataSluiceTotal = formatData(timeSeriesYesterdayDataSluiceTotal);
            formattedYesterdayDataGate1 = formatData(timeSeriesYesterdayDataGate1);
            formattedYesterdayDataGate2 = formatData(timeSeriesYesterdayDataGate2);
            formattedYesterdayDataGate3 = formatData(timeSeriesYesterdayDataGate3);
            formattedYesterdayDataGate4 = formatData(timeSeriesYesterdayDataGate4);
            formattedYesterdayDataGateTotal = formatData(timeSeriesYesterdayDataGateTotal);
            formattedYesterdayDataOutflowTotal = formatData(timeSeriesYesterdayDataOutflowTotal);
            formattedYesterdayDataOutflowAverage = formatData(timeSeriesYesterdayDataOutflowAverage);

            console.log("formattedYesterdayDataSluiceTotal:", formattedYesterdayDataSluiceTotal);
            console.log("formattedYesterdayDataGate1:", formattedYesterdayDataGate1);
            console.log("formattedYesterdayDataGate2:", formattedYesterdayDataGate2);
            console.log("formattedYesterdayDataGate3:", formattedYesterdayDataGate3);
            console.log("formattedYesterdayDataGate4:", formattedYesterdayDataGate4);
            console.log("formattedYesterdayDataGateTotal:", formattedYesterdayDataGateTotal);
            console.log("formattedYesterdayDataOutflowTotal:", formattedYesterdayDataOutflowTotal);
            console.log("formattedYesterdayDataOutflowAverage:", formattedYesterdayDataOutflowAverage);

            // Tomorrow's data
            formattedTomorrowDataOutflowAverage = formatData(timeSeriesTomorrowDataOutflow);
            console.log("formattedTomorrowDataOutflowAverage:", formattedTomorrowDataOutflowAverage);
        } else if (lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
            // Today's data
            formattedDataGate1 = formatData(timeSeriesDataGate1);
            formattedDataGate2 = formatData(timeSeriesDataGate2);
            formattedDataGate3 = formatData(timeSeriesDataGate3);
            formattedDataGateTotal = formatData(timeSeriesDataGateTotal);
            formattedDataOutflowAverage = formatData(timeSeriesDataOutflowAverage);

            console.log("formattedDataGate1:", formattedDataGate1);
            console.log("formattedDataGate2:", formattedDataGate2);
            console.log("formattedDataGate3:", formattedDataGate3);
            console.log("formattedDataGateTotal:", formattedDataGateTotal);
            console.log("formattedDataOutflowAverage:", formattedDataOutflowAverage);

            // Yesterday's data
            formattedYesterdayDataGate1 = formatData(timeSeriesYesterdayDataGate1);
            formattedYesterdayDataGate2 = formatData(timeSeriesYesterdayDataGate2);
            formattedYesterdayDataGate3 = formatData(timeSeriesYesterdayDataGate3);
            formattedYesterdayDataGateTotal = formatData(timeSeriesYesterdayDataGateTotal);
            formattedYesterdayDataOutflowAverage = formatData(timeSeriesYesterdayDataOutflowAverage);

            console.log("formattedYesterdayDataGate1:", formattedYesterdayDataGate1);
            console.log("formattedYesterdayDataGate2:", formattedYesterdayDataGate2);
            console.log("formattedYesterdayDataGate3:", formattedYesterdayDataGate3);
            console.log("formattedYesterdayDataGateTotal:", formattedYesterdayDataGateTotal);
            console.log("formattedYesterdayDataOutflowAverage:", formattedYesterdayDataOutflowAverage);

            // Tomorrow's data
            formattedTomorrowDataOutflowAverage = formatData(timeSeriesTomorrowDataOutflow);
            console.log("formattedTomorrowDataOutflowAverage:", formattedTomorrowDataOutflowAverage);
        }

        const table = document.createElement("table");

        table.id = "gate-settings";

        const headerRow = document.createElement("tr");

        const dateHeader = document.createElement("th");
        dateHeader.textContent = "Time";
        headerRow.appendChild(dateHeader);

        if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
            const sluice1Header = document.createElement("th");
            sluice1Header.textContent = "Sluice 1 (ft)";
            headerRow.appendChild(sluice1Header);

            const sluice2Header = document.createElement("th");
            sluice2Header.textContent = "Sluice 2 (ft)";
            headerRow.appendChild(sluice2Header);

            const sluiceTotalHeader = document.createElement("th");
            sluiceTotalHeader.textContent = "Sluice Total (cfs)";
            headerRow.appendChild(sluiceTotalHeader);
        }

        if (lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
            const sluiceTotalHeader = document.createElement("th");
            sluiceTotalHeader.textContent = "Sluice Total (cfs)";
            headerRow.appendChild(sluiceTotalHeader);
        }

        const gate1Header = document.createElement("th");
        gate1Header.textContent = "Gate 1 (ft)";
        headerRow.appendChild(gate1Header);

        const gate2Header = document.createElement("th");
        gate2Header.textContent = "Gate 2 (ft)";
        headerRow.appendChild(gate2Header);

        const gate3Header = document.createElement("th");
        gate3Header.textContent = "Gate 3 (ft)";
        headerRow.appendChild(gate3Header);

        if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
            const gate4Header = document.createElement("th");
            gate4Header.textContent = "Gate 4 (ft)";
            headerRow.appendChild(gate4Header);
        }

        const gateTotalHeader = document.createElement("th");
        gateTotalHeader.textContent = "Gate Total (cfs)";
        headerRow.appendChild(gateTotalHeader);

        if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
            const outflowTotalHeader = document.createElement("th");
            outflowTotalHeader.textContent = "Outflow Total (cfs)";
            headerRow.appendChild(outflowTotalHeader);
        }

        table.appendChild(headerRow);

        let entryDates = [];

        // Generate options for dropdown (24-hour format)
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            const time = `${hour.toString().padStart(2, '0')}:00`;  // "00:00", "01:00", ..., "23:00"
            times.push(time);
        }

        console.log("times for dropdown:", times);

        // entryDates = [1]; // Blank entries for dropdown
        entryDates = [1, 2, 3, 4, 5, 6]; // Blank entries for dropdown

        const selectedHours = {};

        // Display existing data
        formattedDataGate1.forEach((date, index) => {
            const row = document.createElement("tr");

            const timeCell = document.createElement("td");
            const timeSelect = document.createElement("select");
            timeSelect.id = `timeSelect${index}`;

            // Extract only the time part (HH:mm) from formattedTimestampCST
            const formattedTime = date.formattedTimestampCST.split(" ")[1].slice(0, 5);

            // Add "NONE" as the first option
            const noneOption = document.createElement("option");
            noneOption.value = "23:59";
            noneOption.textContent = "NONE";
            timeSelect.appendChild(noneOption);

            // Create options for the dropdown (24 hours)
            times.forEach(time => {
                const option = document.createElement("option");
                option.value = time;
                option.textContent = time;
                if (time === formattedTime) {
                    option.selected = true; // Match the extracted time
                }
                timeSelect.appendChild(option);
            });

            // Disable selection for the first row
            if (index === 0) {
                timeSelect.disabled = true;
            }

            // Update the selected time when changed
            timeSelect.addEventListener("change", (event) => {
                console.log(`Row ${index + 1} selected time:`, event.target.value, "Type:", typeof event.target.value);
            });

            timeCell.appendChild(timeSelect);
            row.appendChild(timeCell);

            // Sluice1 cell (editable)
            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                const sluice1Cell = document.createElement("td");
                const sluice1Input = document.createElement("input");
                sluice1Input.type = "number";
                sluice1Input.step = "0.1";
                sluice1Input.value = formattedDataSluice1[index] ? formattedDataSluice1[index][1].toFixed(1) : 909; // (date[1]).toFixed(1);
                sluice1Input.id = `sluice1Input-${index}`;
                sluice1Cell.appendChild(sluice1Input);
                row.appendChild(sluice1Cell);
                // console.log("sluice1Input: ", `sluice1Input-${index}`)


                // Sluice2 cell (editable)
                const sluice2Cell = document.createElement("td");
                const sluice2Input = document.createElement("input");
                sluice2Input.type = "number";
                sluice2Input.step = "0.1";
                sluice2Input.value = formattedDataSluice2[index] ? formattedDataSluice2[index][1].toFixed(1) : 909;
                sluice2Input.id = `sluice2Input-${index}`;
                sluice2Cell.appendChild(sluice2Input);
                row.appendChild(sluice2Cell);
                // console.log("sluice2Input: ", `sluice2Input-${index}`)
            }

            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                // Sluice Total cell (editable)
                const sluiceTotalCell = document.createElement("td");
                const sluiceTotalInput = document.createElement("input");
                sluiceTotalInput.type = "number";
                sluiceTotalInput.step = "10.0";
                sluiceTotalInput.value = formattedDataSluiceTotal[index] ? formattedDataSluiceTotal[index][1].toFixed(0) : 909;
                sluiceTotalInput.id = `sluiceTotalInput-${index}`;
                sluiceTotalCell.appendChild(sluiceTotalInput);
                row.appendChild(sluiceTotalCell);
            }

            // Gate 1 (editable)
            const gate1Cell = document.createElement("td");
            const gate1Input = document.createElement("input");
            gate1Input.type = "number";
            gate1Input.step = "0.1";
            gate1Input.value = formattedDataGate1[index] ? formattedDataGate1[index][1].toFixed(1) : 909;
            gate1Input.id = `gate1Input-${index}`;
            gate1Cell.appendChild(gate1Input);
            row.appendChild(gate1Cell);

            // Gate 2 (editable)
            const gate2Cell = document.createElement("td");
            const gate2Input = document.createElement("input");
            gate2Input.type = "number";
            gate2Input.step = "0.1";
            gate2Input.value = formattedDataGate2[index] ? formattedDataGate2[index][1].toFixed(1) : 909;
            gate2Input.id = `gate2Input-${index}`;
            gate2Cell.appendChild(gate2Input);
            row.appendChild(gate2Cell);

            // Gate 3 (editable)
            const gate3Cell = document.createElement("td");
            const gate3Input = document.createElement("input");
            gate3Input.type = "number";
            gate3Input.step = "0.1";
            gate3Input.value = formattedDataGate3[index] ? formattedDataGate3[index][1].toFixed(1) : 909;
            gate3Input.id = `gate3Input-${index}`;
            gate3Cell.appendChild(gate3Input);
            row.appendChild(gate3Cell);

            // Gate 4 (editable)
            if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                const gate4Cell = document.createElement("td");
                const gate4Input = document.createElement("input");
                gate4Input.type = "number";
                gate4Input.step = "0.1";
                gate4Input.value = formattedDataGate4[index] ? formattedDataGate4[index][1].toFixed(1) : 909;
                gate4Input.id = `gate4Input-${index}`;
                gate4Cell.appendChild(gate4Input);
                row.appendChild(gate4Cell);
            }

            // Gate Total (calculated)
            const gateTotalCell = document.createElement("td");
            const gateTotalInput = document.createElement("input");
            gateTotalInput.type = "number";
            gateTotalInput.step = "10.0";
            gateTotalInput.value = formattedDataGateTotal[index][1].toFixed(0);
            gateTotalInput.id = `gateTotalInput-${index}`;
            gateTotalCell.appendChild(gateTotalInput);
            row.appendChild(gateTotalCell);


            // Outflow Total (calculated)
            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                const gateOutflowTotalCell = document.createElement("td");
                const gateOutflowTotalInput = document.createElement("input");
                gateOutflowTotalInput.type = "number";

                const gateValue = formattedDataGateTotal[index]?.[1] || 0;
                const sluiceValue = formattedDataSluiceTotal ? (formattedDataSluiceTotal[index]?.[1] || 0) : 0;

                gateOutflowTotalInput.value = (gateValue + sluiceValue).toFixed(0);
                gateOutflowTotalInput.id = `gateOutflowTotalInput-${index}`;
                gateOutflowTotalInput.readOnly = true;
                gateOutflowTotalInput.style.backgroundColor = "#f0f0f0";

                gateOutflowTotalCell.appendChild(gateOutflowTotalInput);
                row.appendChild(gateOutflowTotalCell);
            }

            table.appendChild(row);
        });

        // Display new data entry
        entryDates.forEach((date, index) => {
            const row = document.createElement("tr");

            // const selectedHours = {}; // Object to store each hour as hour1, hour2, etc.
            const timeCell = document.createElement("td");
            const timeSelect = document.createElement("select");
            timeSelect.id = `timeSelect`;

            // Create a dynamic key for each row (hour1, hour2, hour3, etc.)
            const hourKey = `hour${index + 1}`;
            selectedHours[hourKey] = "NONE";  // Set default hour value

            const noneOption = document.createElement("option");
            noneOption.value = "NONE";
            noneOption.textContent = "NONE";
            timeSelect.appendChild(noneOption);

            // Create options for the dropdown (24 hours)
            times.forEach(time => {
                const option = document.createElement("option");
                option.value = time;
                option.textContent = time;
                timeSelect.appendChild(option);
            });

            // Set the default value
            timeSelect.value = selectedHours[hourKey];

            // Update the corresponding hour when changed
            timeSelect.addEventListener("change", (event) => {
                selectedHours[hourKey] = event.target.value;
                console.log(`${hourKey} selected:`, selectedHours[hourKey]);
            });

            timeCell.appendChild(timeSelect);
            row.appendChild(timeCell);

            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                // Sluice1 cell (editable)
                const sluice1Cell = document.createElement("td");
                const sluice1Input = document.createElement("input");
                sluice1Input.type = "number";
                sluice1Input.value = null;
                sluice1Input.id = `sluice1AdditionalInput`;
                sluice1Input.style.backgroundColor = "lightgray";
                sluice1Cell.appendChild(sluice1Input);
                row.appendChild(sluice1Cell);

                // Sluice2 cell (editable)
                const sluice2Cell = document.createElement("td");
                const sluice2Input = document.createElement("input");
                sluice2Input.type = "number";
                sluice2Input.value = null;
                sluice2Input.id = `sluice2AdditionalInput`;
                sluice2Input.style.backgroundColor = "lightgray";
                sluice2Cell.appendChild(sluice2Input);
                row.appendChild(sluice2Cell);
            }

            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                // Sluice Total cell (editable)
                const sluiceTotalCell = document.createElement("td");
                const sluiceTotalInput = document.createElement("input");
                sluiceTotalInput.type = "number";
                sluiceTotalInput.value = null;
                sluiceTotalInput.id = `sluiceTotalAdditionalInput`;
                sluiceTotalInput.style.backgroundColor = "lightgray";
                sluiceTotalCell.appendChild(sluiceTotalInput);
                row.appendChild(sluiceTotalCell);
            }

            // Gate 1 (editable)
            const gate1Cell = document.createElement("td");
            const gate1Input = document.createElement("input");
            gate1Input.type = "number";
            gate1Input.value = null;
            gate1Input.id = `gate1AdditionalInput`;
            gate1Input.style.backgroundColor = "lightgray";
            gate1Cell.appendChild(gate1Input);
            row.appendChild(gate1Cell);

            // Gate 2 (editable)
            const gate2Cell = document.createElement("td");
            const gate2Input = document.createElement("input");
            gate2Input.type = "number";
            gate2Input.value = null;
            gate2Input.id = `gate2AdditionalInput`;
            gate2Input.style.backgroundColor = "lightgray";
            gate2Cell.appendChild(gate2Input);
            row.appendChild(gate2Cell);

            // Gate 3 (editable)
            const gate3Cell = document.createElement("td");
            const gate3Input = document.createElement("input");
            gate3Input.type = "number";
            gate3Input.value = null;
            gate3Input.id = `gate3AdditionalInput`;
            gate3Input.style.backgroundColor = "lightgray";
            gate3Cell.appendChild(gate3Input);
            row.appendChild(gate3Cell);

            if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                // Gate 4 (editable)
                const gate4Cell = document.createElement("td");
                const gate4Input = document.createElement("input");
                gate4Input.type = "number";
                gate4Input.value = null;
                gate4Input.id = `gate4AdditionalInput`;
                gate4Input.style.backgroundColor = "lightgray";
                gate4Cell.appendChild(gate4Input);
                row.appendChild(gate4Cell);
            }

            // Gate Total (calculated)
            const gateTotalCell = document.createElement("td");
            const gateTotalInput = document.createElement("input");
            gateTotalInput.type = "number";
            gateTotalInput.value = null;
            gateTotalInput.id = `gateTotalAdditionalInput`;
            gateTotalInput.style.backgroundColor = "lightgray";
            gateTotalCell.appendChild(gateTotalInput);
            row.appendChild(gateTotalCell);

            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                // Total Outflow (calculated)
                const gateOutflowTotalCell = document.createElement("td");
                const gateOutflowTotalInput = document.createElement("input");
                gateOutflowTotalInput.type = "number";
                gateOutflowTotalInput.value = null;
                gateOutflowTotalInput.id = `gateOutflowTotalAdditionalInput`;
                gateOutflowTotalInput.readOnly = true; // Make it read-only
                gateOutflowTotalInput.style.backgroundColor = "#f0f0f0";
                gateOutflowTotalCell.appendChild(gateOutflowTotalInput);
                row.appendChild(gateOutflowTotalCell);
            }

            table.appendChild(row);
        });

        // Append the table to the specific container (id="output4")
        const output6Div = document.getElementById("output4");
        output6Div.innerHTML = ""; // Clear any existing content
        output6Div.appendChild(table);

        const gateAverageDiv = document.createElement("div");
        gateAverageDiv.className = "status";

        // Create a tableOutflowAvg
        const tableOutflowAvg = document.createElement("table");
        const tableRow = document.createElement("tr");
        tableOutflowAvg.style.width = "50%";
        tableOutflowAvg.style.marginTop = "10px";

        // Create the first cell for "Average Outflow (cfs)"
        const firstCell = document.createElement("td");
        firstCell.textContent = "Average Outflow (cfs)";
        tableRow.appendChild(firstCell);

        // Create the second cell with "--"
        const secondCell = document.createElement("td");
        secondCell.id = `gateOutflowAverageInput`;
        // Check for valid value, default to 909
        let outflowValue = (formattedDataOutflowAverage?.[0]?.[1] ?? 909);
        secondCell.value = outflowValue;
        secondCell.innerHTML = outflowValue.toFixed(0);
        // Make background pink if defaulted to 909
        if (outflowValue === 909) {
            secondCell.style.backgroundColor = "pink";
        }
        tableRow.appendChild(secondCell);

        // Append the row to the tableOutflowAvg
        tableOutflowAvg.appendChild(tableRow);

        // Append the tableOutflowAvg to the div
        gateAverageDiv.appendChild(tableOutflowAvg);

        // Append the div to output6Div
        output6Div.appendChild(gateAverageDiv);

        const cdaSaveBtn = document.createElement("button");
        cdaSaveBtn.textContent = "Submit";
        cdaSaveBtn.id = "cda-btn-gate";
        cdaSaveBtn.disabled = true;
        output6Div.appendChild(cdaSaveBtn);

        const statusDiv = document.createElement("div");
        statusDiv.className = "status";
        const cdaStatusBtn = document.createElement("button");
        cdaStatusBtn.textContent = "";
        cdaStatusBtn.id = "cda-btn-gate";
        cdaStatusBtn.disabled = false;
        statusDiv.appendChild(cdaStatusBtn);
        output6Div.appendChild(statusDiv);

        // Create the buttonRefresh button
        const buttonRefresh = document.createElement('button');
        buttonRefresh.textContent = 'Refresh';
        buttonRefresh.id = 'refresh-gate-settings-button';
        buttonRefresh.className = 'fetch-btn';
        output6Div.appendChild(buttonRefresh);

        buttonRefresh.addEventListener('click', () => {
            // Remove existing table
            const existingTable = document.getElementById('gate-settings');
            if (existingTable) {
                existingTable.remove();
            }

            // Remove both buttons
            const existingButton = document.getElementById('gate-outflow-average-table');
            if (existingButton) {
                existingButton.remove();
            }

            const existingRefresh = document.getElementById('cda-btn-gate');
            if (existingRefresh) {
                existingRefresh.remove();
            }

            // Fetch and create new table
            fetchTsidData();
        });

        let hasValidNewEntryHour = null;
        let payloads = null;
        let payloadAverageOutflow = null;

        cdaSaveBtn.addEventListener("click", async () => {
            hasValidNewEntryHour = Object.keys(selectedHours).some(hour => selectedHours[hour] !== "NONE");
            console.log("hasValidNewEntryHour:", hasValidNewEntryHour);

            let payloadSluice1Additional = null;
            let payloadSluice2Additional = null;
            let payloadSluiceTotalAdditional = null;
            let payloadGate1Additional = null;
            let payloadGate2Additional = null;
            let payloadGate3Additional = null;
            let payloadGate4Additional = null;
            let payloadGateTotalAdditional = null;
            let payloadOutflowTotalAdditional = null;
            let payloadOutflowAverageAdditional = null;

            let sluice1AdditionalInput = null;
            let sluice2AdditionalInput = null;
            let sluiceTotalAdditionalInput = null;
            let gate1AdditionalInput = null;
            let gate2AdditionalInput = null;
            let gate3AdditionalInput = null;
            let gate4AdditionalInput = null;
            let gateTotalAdditionalInput = null;

            // Edit existing rows of data
            if (1 === 1) {
                Object.keys(selectedHours).forEach(hour => {
                    console.log(`${hour} selected:`, selectedHours[hour]);
                });

                if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                    // Get the sluice1 input element and check if it exists
                    sluice1AdditionalInput = document.getElementById(`sluice1AdditionalInput`);
                    if (!sluice1AdditionalInput) {
                        console.error("sluice1AdditionalInput element not found!");
                        return; // Exit if input is missing
                    }
                    if (!sluice1AdditionalInput.value) {
                        sluice1AdditionalInput.value = 909;
                    }

                    // Get the sluice2 input element and check if it exists
                    sluice2AdditionalInput = document.getElementById(`sluice2AdditionalInput`);
                    if (!sluice2AdditionalInput) {
                        console.error("sluice2AdditionalInput element not found!");
                        return; // Exit if input is missing
                    }
                    if (!sluice2AdditionalInput.value) {
                        sluice2AdditionalInput.value = 909;
                    }
                }

                if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                    // Get the sluiceTotal input element and check if it exists
                    sluiceTotalAdditionalInput = document.getElementById(`sluiceTotalAdditionalInput`);
                    if (!sluiceTotalAdditionalInput) {
                        console.error("sluiceTotalAdditionalInput element not found!");
                        return; // Exit if input is missing
                    }
                    if (!sluiceTotalAdditionalInput.value) {
                        sluiceTotalAdditionalInput.value = 909;
                    }
                }

                // Get the Gate1 input element and check if it exists
                gate1AdditionalInput = document.getElementById(`gate1AdditionalInput`);
                if (!gate1AdditionalInput) {
                    console.error("gate1AdditionalInput element not found!");
                    return; // Exit if input is missing
                }
                if (!gate1AdditionalInput.value) {
                    gate1AdditionalInput.value = 909;
                }

                // Get the Gate2 input element and check if it exists
                gate2AdditionalInput = document.getElementById(`gate2AdditionalInput`);
                if (!gate2AdditionalInput) {
                    console.error("gate2AdditionalInput element not found!");
                    return; // Exit if input is missing
                }
                if (!gate2AdditionalInput.value) {
                    gate2AdditionalInput.value = 909;
                }

                // Get the Gate3 input element and check if it exists
                gate3AdditionalInput = document.getElementById(`gate3AdditionalInput`);
                if (!gate3AdditionalInput) {
                    console.error("gate3AdditionalInput element not found!");
                    return; // Exit if input is missing
                }
                if (!gate3AdditionalInput.value) {
                    gate3AdditionalInput.value = 909;
                }

                if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                    // Get the Gate4 input element and check if it exists
                    gate4AdditionalInput = document.getElementById(`gate4AdditionalInput`);
                    if (!gate4AdditionalInput) {
                        console.error("gate4AdditionalInput element not found!");
                        return; // Exit if input is missing
                    }
                    if (!gate4AdditionalInput.value) {
                        gate4AdditionalInput.value = 909;
                    }
                }
                // Get the GateTotal input element and check if it exists
                gateTotalAdditionalInput = document.getElementById(`gateTotalAdditionalInput`);
                if (!gateTotalAdditionalInput) {
                    console.error("gateTotalAdditionalInput element not found!");
                    return; // Exit if input is missing
                }
                if (!gateTotalAdditionalInput.value) {
                    gateTotalAdditionalInput.value = 909;
                }

                if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                    // ========================== CALCULATE OUTFLOW TOTAL ==========================
                    // Get the gateOutflowTotal input element and check if it exists
                    gateOutflowTotalInput = document.getElementById('gateOutflowTotalAdditionalInput');
                    if (!gateOutflowTotalInput) {
                        console.error("gateOutflowTotalInput element not found!");
                        return; // Exit if input is missing
                    }
                    const gateTotal = gateTotalAdditionalInput ? Number(gateTotalAdditionalInput.value) || 0 : 0;
                    const sluiceTotal = sluiceTotalAdditionalInput ? Number(sluiceTotalAdditionalInput.value) || 0 : 0;
                    const calculatedValue = gateTotal + sluiceTotal;

                    gateOutflowTotalInput.value = calculatedValue > 0 ? calculatedValue : 909;
                }

                // ========================== CALCULATE OUTFLOW AVERAGE ==========================
                // Get the gateOutflowAverage input element and check if it exists
                gateOutflowAverageInput = document.getElementById(`gateOutflowAverageInput`);
                if (!gateOutflowAverageInput) {
                    console.error("gateOutflowAverageInput element not found!");
                    return; // Exit if input is missing
                }
                if (!gateOutflowAverageInput.value) {
                    gateOutflowAverageInput.value = 909;
                }

                console.log("selectedHours['hour1']: ", selectedHours['hour1']);
                console.log(typeof (selectedHours['hour1']));

                let time1 = null;
                if (selectedHours['hour1'] !== "NONE") {
                    // Extract hours and minutes
                    let [hour, minute] = selectedHours['hour1'].split(':').map(Number);

                    // Create a Date object (using an arbitrary date)
                    let date = new Date();
                    date.setUTCHours(hour + dstOffsetHours, minute, 0, 0); // Add offset

                    // Format back to "HH:mm"
                    let adjustedHour = String(date.getUTCHours()).padStart(2, '0');
                    let adjustedMinute = String(date.getUTCMinutes()).padStart(2, '0');
                    let adjustedTime = `${adjustedHour}:${adjustedMinute}`;

                    // Construct the final time string
                    time1 = `${isoDateToday.slice(0, 10)}T${adjustedTime}:00Z`;
                }
                console.log("Adjusted time1:", time1);

                let time2 = null;
                if (selectedHours['hour2'] !== "NONE") {
                    time2 = isoDateToday.slice(0, 10) + "T" + selectedHours['hour2'] + `:00Z`;
                }

                let time3 = null;
                if (selectedHours['hour3'] !== "NONE") {
                    time3 = isoDateToday.slice(0, 10) + "T" + selectedHours['hour3'] + `:00Z`;
                }

                let time4 = null;
                if (selectedHours['hour4'] !== "NONE") {
                    time4 = isoDateToday.slice(0, 10) + "T" + selectedHours['hour4'] + `:00Z`;
                }

                let time5 = null;
                if (selectedHours['hour5'] !== "NONE") {
                    time5 = isoDateToday.slice(0, 10) + "T" + selectedHours['hour5'] + `:00Z`;
                }

                let time6 = null;
                if (selectedHours['hour6'] !== "NONE") {
                    time6 = isoDateToday.slice(0, 10) + "T" + selectedHours['hour6'] + `:00Z`;
                }

                if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                    payloadSluice1Additional = {
                        "name": tsidSluice1,
                        "office-id": office,
                        "units": "ft",
                        "values": [
                            [
                                time1,
                                sluice1AdditionalInput.value,
                                0
                            ],
                            [
                                time2,
                                sluice1AdditionalInput.value,
                                0
                            ],
                            [
                                time3,
                                sluice1AdditionalInput.value,
                                0
                            ],
                            [
                                time4,
                                sluice1AdditionalInput.value,
                                0
                            ],
                            [
                                time5,
                                sluice1AdditionalInput.value,
                                0
                            ],
                            [
                                time6,
                                sluice1AdditionalInput.value,
                                0
                            ],
                        ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                    };
                    console.log("payloadSluice1Additional: ", payloadSluice1Additional);

                    payloadSluice2Additional = {
                        "name": tsidSluice2,
                        "office-id": office,
                        "units": "ft",
                        "values": [
                            [
                                time1,
                                sluice2AdditionalInput.value,
                                0
                            ],
                            [
                                time2,
                                sluice2AdditionalInput.value,
                                0
                            ],
                            [
                                time3,
                                sluice2AdditionalInput.value,
                                0
                            ],
                            [
                                time4,
                                sluice2AdditionalInput.value,
                                0
                            ],
                            [
                                time5,
                                sluice2AdditionalInput.value,
                                0
                            ],
                            [
                                time6,
                                sluice2AdditionalInput.value,
                                0
                            ],
                        ].filter(item => item[0] !== null),
                    };
                    console.log("payloadSluice2Additional: ", payloadSluice2Additional);
                }

                if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                    payloadSluiceTotalAdditional = {
                        "name": tsidSluiceTotal,
                        "office-id": office,
                        "units": "cfs",
                        "values": [
                            [
                                time1,
                                sluiceTotalAdditionalInput.value,
                                0
                            ],
                            [
                                time2,
                                sluiceTotalAdditionalInput.value,
                                0
                            ],
                            [
                                time3,
                                sluiceTotalAdditionalInput.value,
                                0
                            ],
                            [
                                time4,
                                sluiceTotalAdditionalInput.value,
                                0
                            ],
                            [
                                time5,
                                sluiceTotalAdditionalInput.value,
                                0
                            ],
                            [
                                time6,
                                sluiceTotalAdditionalInput.value,
                                0
                            ],
                        ].filter(item => item[0] !== null),
                    };
                    console.log("payloadSluiceTotalAdditional: ", payloadSluiceTotalAdditional);
                }
                payloadGate1Additional = {
                    "name": tsidGate1,
                    "office-id": office,
                    "units": "ft",
                    "values": [
                        [
                            time1,
                            gate1AdditionalInput.value,
                            0
                        ],
                        [
                            time2,
                            gate1AdditionalInput.value,
                            0
                        ],
                        [
                            time3,
                            gate1AdditionalInput.value,
                            0
                        ],
                        [
                            time4,
                            gate1AdditionalInput.value,
                            0
                        ],
                        [
                            time5,
                            gate1AdditionalInput.value,
                            0
                        ],
                        [
                            time6,
                            gate1AdditionalInput.value,
                            0
                        ],
                    ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                };
                console.log("payloadGate1Additional: ", payloadGate1Additional);

                payloadGate2Additional = {
                    "name": tsidGate2,
                    "office-id": office,
                    "units": "ft",
                    "values": [
                        [
                            time1,
                            gate2AdditionalInput.value,
                            0
                        ],
                        [
                            time2,
                            gate2AdditionalInput.value,
                            0
                        ],
                        [
                            time3,
                            gate2AdditionalInput.value,
                            0
                        ],
                        [
                            time4,
                            gate2AdditionalInput.value,
                            0
                        ],
                        [
                            time5,
                            gate2AdditionalInput.value,
                            0
                        ],
                        [
                            time6,
                            gate2AdditionalInput.value,
                            0
                        ],
                    ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                };
                console.log("payloadGate2Additional: ", payloadGate2Additional);

                payloadGate3Additional = {
                    "name": tsidGate3,
                    "office-id": office,
                    "units": "ft",
                    "values": [
                        [
                            time1,
                            gate3AdditionalInput.value,
                            0
                        ],
                        [
                            time2,
                            gate3AdditionalInput.value,
                            0
                        ],
                        [
                            time3,
                            gate3AdditionalInput.value,
                            0
                        ],
                        [
                            time4,
                            gate3AdditionalInput.value,
                            0
                        ],
                        [
                            time5,
                            gate3AdditionalInput.value,
                            0
                        ],
                        [
                            time6,
                            gate3AdditionalInput.value,
                            0
                        ],
                    ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                };
                console.log("payloadGate3Additional: ", payloadGate3Additional);

                if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                    payloadGate4Additional = {
                        "name": tsidGate4,
                        "office-id": office,
                        "units": "ft",
                        "values": [
                            [
                                time1,
                                gate4AdditionalInput.value,
                                0
                            ],
                            [
                                time2,
                                gate4AdditionalInput.value,
                                0
                            ],
                            [
                                time3,
                                gate4AdditionalInput.value,
                                0
                            ],
                            [
                                time4,
                                gate4AdditionalInput.value,
                                0
                            ],
                            [
                                time5,
                                gate4AdditionalInput.value,
                                0
                            ],
                            [
                                time6,
                                gate4AdditionalInput.value,
                                0
                            ],
                        ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                    };
                    console.log("payloadGate4Additional: ", payloadGate4Additional);
                }

                payloadGateTotalAdditional = {
                    "name": tsidGateTotal,
                    "office-id": office,
                    "units": "cfs",
                    "values": [
                        [
                            time1,
                            gateTotalAdditionalInput.value,
                            0
                        ],
                        [
                            time2,
                            gateTotalAdditionalInput.value,
                            0
                        ],
                        [
                            time3,
                            gateTotalAdditionalInput.value,
                            0
                        ],
                        [
                            time4,
                            gateTotalAdditionalInput.value,
                            0
                        ],
                        [
                            time5,
                            gateTotalAdditionalInput.value,
                            0
                        ],
                        [
                            time6,
                            gateTotalAdditionalInput.value,
                            0
                        ],
                    ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                };
                console.log("payloadGateTotalAdditional: ", payloadGateTotalAdditional);

                // Get existing data for the selected times
                if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                    console.log("getAllSelectedTimes: ", getAllSelectedTimes());
                    console.log("getAllSluice1Values: ", getAllSluice1Values());
                    console.log("getAllSluice2Values: ", getAllSluice2Values());
                    console.log("getAllSluiceTotalValues: ", getAllSluiceTotalValues());
                    console.log("getAllGate1Values: ", getAllGate1Values());
                    console.log("getAllGate2Values: ", getAllGate2Values());
                    console.log("getAllGate3Values: ", getAllGate3Values());
                    console.log("getAllGateTotalValues: ", getAllGateTotalValues());
                    console.log("getAllOutflowTotalValues: ", getAllOutflowTotalValues());
                    console.log("getAllOutflowAverageValues: ", getAllOutflowAverageValues());
                } else if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                    console.log("getAllSelectedTimes: ", getAllSelectedTimes());
                    console.log("getAllGate1Values: ", getAllGate1Values());
                    console.log("getAllGate2Values: ", getAllGate2Values());
                    console.log("getAllGate3Values: ", getAllGate3Values());
                    console.log("getAllGate4Values: ", getAllGate4Values());
                    console.log("getAllGateTotalValues: ", getAllGateTotalValues());
                    console.log("getAllOutflowAverageValues: ", getAllOutflowAverageValues());
                } else if (lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                    console.log("getAllSelectedTimes: ", getAllSelectedTimes());
                    console.log("getAllSluiceTotalValues: ", getAllSluiceTotalValues());
                    console.log("getAllGate1Values: ", getAllGate1Values());
                    console.log("getAllGate2Values: ", getAllGate2Values());
                    console.log("getAllGate3Values: ", getAllGate3Values());
                    console.log("getAllGate4Values: ", getAllGate4Values());
                    console.log("getAllGateTotalValues: ", getAllGateTotalValues());
                    console.log("getAllOutflowTotalValues: ", getAllOutflowTotalValues());
                    console.log("getAllOutflowAverageValues: ", getAllOutflowAverageValues());
                } else if (lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
                    console.log("getAllSelectedTimes: ", getAllSelectedTimes());
                    console.log("getAllGate1Values: ", getAllGate1Values());
                    console.log("getAllGate2Values: ", getAllGate2Values());
                    console.log("getAllGate3Values: ", getAllGate3Values());
                    console.log("getAllGateTotalValues: ", getAllGateTotalValues());
                    console.log("getAllOutflowAverageValues: ", getAllOutflowAverageValues());
                }

                const selectedTimes = getAllSelectedTimes();

                let tsidCategories = {};
                let dataCategories = {};

                if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                    tsidCategories = {
                        sluice1: tsidSluice1,
                        sluice2: tsidSluice2,
                        sluiceTotal: tsidSluiceTotal,
                        gate1: tsidGate1,
                        gate2: tsidGate2,
                        gate3: tsidGate3,
                        gateTotal: tsidGateTotal,
                        outflowTotal: tsidOutflowTotal,
                    };
                } else if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                    tsidCategories = {
                        gate1: tsidGate1,
                        gate2: tsidGate2,
                        gate3: tsidGate3,
                        gate4: tsidGate4,
                        gateTotal: tsidGateTotal,
                    };
                } else if (lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                    tsidCategories = {
                        sluiceTotal: tsidSluiceTotal,
                        gate1: tsidGate1,
                        gate2: tsidGate2,
                        gate3: tsidGate3,
                        gate4: tsidGate4,
                        gateTotal: tsidGateTotal,
                        outflowTotal: tsidOutflowTotal,
                    };
                } else if (lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
                    tsidCategories = {
                        gate1: tsidGate1,
                        gate2: tsidGate2,
                        gate3: tsidGate3,
                        gateTotal: tsidGateTotal,
                    };
                }

                if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                    dataCategories = {
                        sluice1: getAllSluice1Values(),
                        sluice2: getAllSluice2Values(),
                        sluiceTotal: getAllSluiceTotalValues(),
                        gate1: getAllGate1Values(),
                        gate2: getAllGate2Values(),
                        gate3: getAllGate3Values(),
                        gateTotal: getAllGateTotalValues(),
                        outflowTotal: getAllOutflowTotalValues(),
                    };
                } else if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                    dataCategories = {
                        gate1: getAllGate1Values(),
                        gate2: getAllGate2Values(),
                        gate3: getAllGate3Values(),
                        gate4: getAllGate4Values(),
                        gateTotal: getAllGateTotalValues(),
                    };
                } else if (lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                    dataCategories = {
                        sluiceTotal: getAllSluiceTotalValues(),
                        gate1: getAllGate1Values(),
                        gate2: getAllGate2Values(),
                        gate3: getAllGate3Values(),
                        gate4: getAllGate4Values(),
                        gateTotal: getAllGateTotalValues(),
                        outflowTotal: getAllOutflowTotalValues(),
                    };
                } else if (lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
                    dataCategories = {
                        gate1: getAllGate1Values(),
                        gate2: getAllGate2Values(),
                        gate3: getAllGate3Values(),
                        gateTotal: getAllGateTotalValues(),
                    };
                }

                console.log("dataCategories: ", dataCategories);
                console.log("tsidCategories: ", tsidCategories);

                if (Array.isArray(formattedTomorrowDataOutflowAverage)) {
                    formattedTomorrowDataOutflowAverage = formattedTomorrowDataOutflowAverage.map(entry => ({
                        ...entry,
                        "iso": new Date(entry["0"]).toISOString(),
                    }));
                } else {
                    console.error('formattedTomorrowDataOutflowAverage is not an array:', formattedTomorrowDataOutflowAverage);
                }

                payloads = {};
                if (Array.isArray(selectedTimes) && Object.values(dataCategories).every(Array.isArray)) {

                    Object.entries(dataCategories).forEach(([key, values]) => {
                        const updatedValues = selectedTimes.map((time, index) => [
                            convertToISO(time), // Convert time to ISO format // time,
                            values[index] ?? 0, // Default to 0 if undefined
                            0
                        ]);

                        // Determine the units based on the key
                        const units = key === "sluiceTotal" || key === "gateTotal" || key === "outflowTotal" ? "cfs" : "ft";

                        payloads[key] = {
                            "name": tsidCategories[key],
                            "office-id": office,
                            "units": units,
                            "values": updatedValues.filter(item => item[0] !== null),
                        };
                    });

                    console.log("Payloads: ", payloads);
                } else {
                    console.error("One or more arrays are not valid", selectedTimes, dataCategories);
                }

                // Append tomorrow average outflow to either payloads.gateTotal.values or payloads.outflowTotal.values
                if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                    const firstEntry = formattedTomorrowDataOutflowAverage[0];
                    if (firstEntry) {
                        payloads.outflowTotal.values.push([
                            firstEntry.iso,
                            firstEntry["1"],
                            firstEntry["2"]
                        ]);
                    }
                }

                if (lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
                    formattedTomorrowDataOutflowAverage.forEach(entry => {
                        payloads.gateTotal.values.push([
                            entry.iso,
                            entry["1"],
                            entry["2"]
                        ]);
                    });
                }

                console.log("payloads after append tomorrow data:", payloads);

                // Function to get all selected times
                function getAllSelectedTimes() {
                    let selectedTimes = [];
                    formattedDataGate1.forEach((_, index) => {
                        const selectedTime = document.getElementById(`timeSelect${index}`).value;
                        selectedTimes.push(selectedTime);
                    });

                    // Append selectedHours['hour1'] if it exists
                    if (selectedHours && selectedHours['hour1'] !== undefined) {
                        selectedTimes.push(selectedHours['hour1']);
                    }

                    console.log("Selected Times:", selectedTimes); // Log the selected times
                    return selectedTimes;
                }

                function getAllSluice1Values() {
                    return formattedDataSluice1.map((_, index) =>
                        parseFloat(document.getElementById(`sluice1Input-${index}`).value)
                    );
                }

                function getAllSluice2Values() {
                    return formattedDataSluice2.map((_, index) =>
                        parseFloat(document.getElementById(`sluice2Input-${index}`).value)
                    );
                }

                function getAllSluiceTotalValues() {
                    return formattedDataSluiceTotal.map((_, index) =>
                        parseFloat(document.getElementById(`sluiceTotalInput-${index}`).value)
                    );
                }

                function getAllGate1Values() {
                    let values = formattedDataGate1.map((_, index) =>
                        parseFloat(document.getElementById(`gate1Input-${index}`).value)
                    );

                    // Check if 'gate1AdditionalInput' exists and add its value if present
                    const additionalInput = document.getElementById('gate1AdditionalInput');
                    if (additionalInput) {
                        values.push(parseFloat(additionalInput.value));
                    }

                    return values;
                }

                function getAllGate2Values() {
                    let values = formattedDataGate2.map((_, index) =>
                        parseFloat(document.getElementById(`gate2Input-${index}`).value)
                    );

                    // Check if 'gate2AdditionalInput' exists and add its value if present
                    const additionalInput = document.getElementById('gate2AdditionalInput');
                    if (additionalInput) {
                        values.push(parseFloat(additionalInput.value));
                    }

                    return values;
                }

                function getAllGate3Values() {
                    let values = formattedDataGate3.map((_, index) =>
                        parseFloat(document.getElementById(`gate3Input-${index}`).value)
                    );

                    const additionalInput = document.getElementById('gate3AdditionalInput');
                    if (additionalInput) {
                        values.push(parseFloat(additionalInput.value));
                    }

                    return values;
                }

                function getAllGate4Values() {
                    let values = formattedDataGate4.map((_, index) =>
                        parseFloat(document.getElementById(`gate4Input-${index}`).value)
                    );

                    const additionalInput = document.getElementById('gate4AdditionalInput');
                    if (additionalInput) {
                        values.push(parseFloat(additionalInput.value));
                    }

                    return values;
                }

                function getAllGateTotalValues() {
                    let values = formattedDataGateTotal.map((_, index) =>
                        parseFloat(document.getElementById(`gateTotalInput-${index}`).value)
                    );

                    const additionalInput = document.getElementById('gateTotalAdditionalInput');
                    if (additionalInput) {
                        values.push(parseFloat(additionalInput.value));
                    }

                    return values;
                }

                function getAllOutflowTotalValues() {
                    return formattedDataSluiceTotal.map((_, index) =>
                        parseFloat(document.getElementById(`sluiceTotalInput-${index}`).value) +
                        parseFloat(document.getElementById(`gateTotalInput-${index}`).value)
                    );
                }

                function getAllOutflowAverageValues() {
                    return formattedDataOutflowAverage.map((_, index) =>
                        parseFloat(document.getElementById(`gateOutflowAverageInput`).value)
                    );
                }
            }

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

            async function createTS(payload) {
                if (!payload) throw new Error("You must specify a payload!");
                const response = await fetch("https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?store-rule=REPLACE%20ALL", {
                    method: "POST",
                    headers: { "Content-Type": "application/json;version=2" },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }
            }

            async function deleteTS(payload) {
                const begin = payload.values[0][0];
                const end = new Date(begin);
                end.setHours(end.getHours() + 23);
                const tsid = payload.name;

                if (!payload) throw new Error("You must specify a payload!");
                const response = await fetch(`https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries/${tsid}?office=${office}&begin=${begin}&end=${end.toISOString()}&start-time-inclusive=true&end-time-inclusive=true&override-protection=true`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json;version=2" },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }
            }

            async function fetchUpdatedData(name, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1) {
                // Convert to Date object
                const date = new Date(isoDateDay1);

                // Add 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
                date.setTime(date.getTime() - (1 * 60 * 60 * 1000));

                // Convert back to ISO string (preserve UTC format)
                const end = date.toISOString();

                const tsidData = `${setBaseUrl}timeseries?name=${name}&begin=${isoDateToday}&end=${end}&office=${office}`;
                // console.log('tsidData:', tsidData);
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
            }

            function showSpinner() {
                const spinner = document.createElement('img');
                spinner.src = 'images/loading4.gif';
                spinner.id = 'loadingSpinner';
                spinner.style.width = '40px';  // Set the width to 40px
                spinner.style.height = '40px'; // Set the height to 40px
                document.body.appendChild(spinner);
            }

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
                cdaStatusBtn.innerText = loginResult ? "" : "Failed to Login!";
            } else {
                try {
                    console.log("Payloads: ", payloads);
                    console.log("hasValidNewEntryHour:", hasValidNewEntryHour);

                    payloads = filterPayloads(payloads);
                    console.log("Payloads after filterPayloads: ", payloads);

                    let isTomorrowGateExist = null;
                    let isThereGateChangeToday = null;
                    isThereGateChangeToday = formattedDataGateTotal.length > 1 || hasValidNewEntryHour === true;

                    if (lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk" || lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                        isTomorrowGateExist = payloads.gateTotal.values.some(
                            value => value[0] === isoDateDay1
                        ) || false; // Set to false if tomorrow value null or undefined
                    };

                    if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                        isTomorrowGateExist = payloads.outflowTotal?.values?.some(
                            value => value[0] === isoDateDay1
                        ) || false; // Set to false if tomorrow value null or undefined
                    }

                    console.log("isTomorrowGateExist:", isTomorrowGateExist);
                    console.log("isThereGateChangeToday:", isThereGateChangeToday);

                    // Prepare payloadAverageOutflow
                    if (!payloads || !payloads.gateTotal || !Array.isArray(payloads.gateTotal.values)) {
                        console.log("No payloads or payloads.outflowTotal.values is null or invalid. This mean were adding new entries.");
                        payloadAverageOutflow = {
                            "name": tsidOutflowAverage,
                            "office-id": office,
                            "units": "cfs",
                            "values": [[isoDateToday, null, 0]]
                        };
                        console.log("payloadAverageOutflow: ", payloadAverageOutflow);
                    } else {
                        let payloadOutflowAverage = null;

                        // Look for outflowTotal because of sluice and gate
                        if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                            payloadOutflowAverage = payloads.outflowTotal.values;
                            console.log("payloadOutflowAverage: ", payloadOutflowAverage);
                        }

                        // Look for gateTotal because of no sluice
                        if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
                            payloadOutflowAverage = payloads.gateTotal.values;
                            console.log("payloadOutflowAverage: ", payloadOutflowAverage);
                        }

                        let totalHours = 24;
                        let weightedSum = 0;
                        let totalDuration = 0;
                        let averageOutflowPayload = null;

                        // Calculate today average outflow where tommorow gate value does exist and there is no gate change today.
                        if (isTomorrowGateExist === true && isThereGateChangeToday === false) {
                            console.log("Calculating weighted average outflow payload option 1...");
                            averageOutflowPayload = (payloadOutflowAverage[0][1] + payloadOutflowAverage[1][1]) / 2;
                            averageOutflowPayload = Math.round(averageOutflowPayload / 10) * 10;
                            console.log("averageOutflowPayload: ", averageOutflowPayload);
                        }

                        // Calculate today average outflow where tommorow gate value is exist and there is gate change today.
                        if (isTomorrowGateExist === true && isThereGateChangeToday === true) {
                            console.log("Calculating weighted average outflow payload option 2...");
                            if (payloadOutflowAverage.length === 0) {
                                console.error("Error: payloadOutflowAverage is empty.");
                            } else {
                                let lastTime = new Date(payloadOutflowAverage[0][0]);

                                // Process all but the final segment
                                for (let i = 1; i < payloadOutflowAverage.length - 1; i++) {
                                    const currentTime = new Date(payloadOutflowAverage[i][0]);
                                    const prevValue = payloadOutflowAverage[i - 1][1] ?? 0;

                                    let duration = (currentTime - lastTime) / (1000 * 60 * 60); // milliseconds to hours

                                    // Adjust for cross midnight scenario
                                    if (duration <= 0) {
                                        duration += 24; // cross midnight case
                                    }

                                    // Calculate the weighted sum for this segment
                                    weightedSum += prevValue * duration;
                                    totalDuration += duration;

                                    // Log intermediate values for debugging
                                    console.log(`Prev Time: ${lastTime}, Current Time: ${currentTime}`);
                                    console.log(`Prev Value: ${prevValue}, Duration: ${duration}`);
                                    console.log(`Current Weighted Sum: ${weightedSum}, Total Duration: ${totalDuration}`);

                                    lastTime = currentTime;
                                }

                                // Handle the final segment (between the last two time points)
                                const secondLastValue = payloadOutflowAverage[payloadOutflowAverage.length - 2][1] ?? 0;
                                const lastValue = payloadOutflowAverage[payloadOutflowAverage.length - 1][1] ?? 0;

                                const secondLastTimePoint = new Date(payloadOutflowAverage[payloadOutflowAverage.length - 2][0]);
                                const lastTimePoint = new Date(payloadOutflowAverage[payloadOutflowAverage.length - 1][0]);

                                // Calculate the duration between the last two entries (final segment)
                                let finalDuration = (lastTimePoint - secondLastTimePoint) / (1000 * 60 * 60); // in hours

                                if (finalDuration <= 0) {
                                    finalDuration += 24; // cross midnight case
                                }

                                // Log final segment values
                                console.log(`Second Last Value: ${secondLastValue}, Last Value: ${lastValue}`);
                                console.log(`Averaged Last Value: ${(secondLastValue + lastValue) / 2}, Final Duration: ${finalDuration}`);

                                // Calculate the weighted sum for the final segment (averaged value)
                                const averagedLastValue = (secondLastValue + lastValue) / 2;
                                weightedSum += averagedLastValue * finalDuration;

                                // Ensure totalDuration is exactly 24 hours
                                totalDuration = totalHours;

                                // Log final weighted sum and duration
                                console.log(`Final Weighted Sum: ${weightedSum}, Total Duration: ${totalDuration}`);

                                // Calculate the final average outflow payload
                                averageOutflowPayload = weightedSum / totalHours;
                                averageOutflowPayload = Math.round(averageOutflowPayload / 10) * 10; // Round to nearest 10

                                // Final output for debugging
                                console.log("Final averageOutflowPayload:", averageOutflowPayload);
                            }
                        }

                        // Calculate today average outflow where tommorow gate value is not exist.
                        if (isTomorrowGateExist === false && (isThereGateChangeToday === true || isThereGateChangeToday === false)) {
                            console.log("Calculating weighted average outflow payload option 3...");
                            if (payloadOutflowAverage.length === 0) {
                                console.error("Error: payloadOutflowAverage is empty.");
                            } else {
                                let lastHour = new Date(payloadOutflowAverage[0][0]).getHours() || 0;

                                if (payloadOutflowAverage.length === 1) {
                                    const value = payloadOutflowAverage[0][1] ?? 0;
                                    const duration = totalHours - lastHour;
                                    weightedSum = value * duration;
                                    console.log("weightedSum:", weightedSum);
                                    totalDuration = duration;
                                } else {
                                    for (let i = 1; i < payloadOutflowAverage.length; i++) {
                                        const currentHour = new Date(payloadOutflowAverage[i][0]).getHours() || 0;
                                        const prevValue = payloadOutflowAverage[i - 1][1] ?? 0;
                                        const duration = Math.max(currentHour - lastHour, 1); // Avoid zero duration

                                        weightedSum += prevValue * duration;
                                        console.log("weightedSum:", weightedSum);
                                        totalDuration += duration;

                                        lastHour = currentHour;
                                    }

                                    // Add the final chunk from lastHour to 24
                                    const lastValue = payloadOutflowAverage[payloadOutflowAverage.length - 1][1] ?? 0;
                                    const lastDuration = totalHours - lastHour;

                                    weightedSum += lastValue * lastDuration;
                                    console.log("weightedSum:", weightedSum);
                                    totalDuration += lastDuration;
                                }

                                averageOutflowPayload = weightedSum / totalHours;
                                averageOutflowPayload = Math.round(averageOutflowPayload / 10) * 10;

                                console.log("weightedSum:", weightedSum);
                                console.log("totalDuration (should be 24):", totalDuration);
                                console.log("averageOutflowPayload:", averageOutflowPayload);
                            }
                        }

                        payloadAverageOutflow = {
                            "name": tsidOutflowAverage,
                            "office-id": office,
                            "units": "cfs",
                            "values": [
                                [
                                    isoDateToday,
                                    averageOutflowPayload,
                                    0
                                ]
                            ].filter(item => item[0] !== null), // Filters out entries where time1 is null
                        };
                        console.log("payloadAverageOutflow: ", payloadAverageOutflow);
                    }

                    // Function to send the payload to createTS
                    function sendPayloadToCreateTS(payload) {
                        // Check if payload is an object
                        if (typeof payload === 'object' && payload !== null) {
                            // Create a function to send each individual data object with a delay
                            async function sendWithDelay() {
                                for (const [key, value] of Object.entries(payload)) {
                                    console.log("Sending value for key: ", key, value);

                                    // Add timeout with delay
                                    await new Promise(resolve => {
                                        setTimeout(() => {
                                            createTS(value);  // Send each individual data object (like "sluice1", "sluice2", etc.)

                                            // Update the status text after sending
                                            cdaStatusBtn.innerText = `Write payload${key.charAt(0).toUpperCase() + key.slice(1)} successful!`;

                                            resolve();  // Resolve after the timeout to proceed to the next item
                                        }, 250); // 1000ms delay (1 second)
                                    });
                                }
                            }

                            sendWithDelay();  // Call the function to start the process
                        } else {
                            console.error("Invalid payload format!");
                        }
                    }

                    // Function to send the payload to deleteTS
                    function sendPayloadToDeleteTS(payload) {
                        // Check if payload is an object
                        if (typeof payload === 'object' && payload !== null) {
                            // Create a function to send each individual data object with a delay
                            async function sendWithDelay() {
                                for (const [key, value] of Object.entries(payload)) {
                                    console.log("Sending value for key: ", key, value);

                                    // Add timeout with delay
                                    await new Promise(resolve => {
                                        setTimeout(() => {
                                            deleteTS(value);  // Send each individual data object (like "sluice1", "sluice2", etc.)

                                            // Update the status text after sending
                                            cdaStatusBtn.innerText = `Delete payload${key.charAt(0).toUpperCase() + key.slice(1)} successful!`;

                                            resolve();  // Resolve after the timeout to proceed to the next item
                                        }, 250); // 1000ms delay (1 second)
                                    });
                                }
                            }

                            sendWithDelay();  // Call the function to start the process
                        } else {
                            console.error("Invalid payload format!");
                        }
                    }

                    // // Saving existing entry data
                    // if (payloads && Object.keys(payloads).length > 0 && payloadAverageOutflow) {
                    //     console.log("Editing existing entries...");

                    //     console.log("Deleting today's entries...");
                    //     sendPayloadToDeleteTS(payloads);

                    //     await new Promise(resolve => setTimeout(resolve, 4000)); // Small delay for safety

                    //     console.log("Creating today's entries...");
                    //     await createTS(payloadAverageOutflow);
                    //     cdaStatusBtn.innerText = "Write payloadAverageOutflow successful!";
                    //     sendPayloadToCreateTS(payloads);
                    // }

                    // // Ensure data is saved before creating the table
                    // await new Promise(resolve => setTimeout(resolve, 4000)); // Small delay for safety

                    // // Initialize variables to prevent reference errors
                    // let updatedDataSluice1 = null;
                    // let updatedDataSluice2 = null;
                    // let updatedDataSluiceTotal = null;
                    // let updatedDataGate1 = null;
                    // let updatedDataGate2 = null;
                    // let updatedDataGate3 = null;
                    // let updatedDataGate4 = null;
                    // let updatedDataGateTotal = null;
                    // let updatedDataOutflowTotal = null;
                    // let updatedDataOutflowAverage = null;

                    // if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                    //     [
                    //         updatedDataSluice1,
                    //         updatedDataSluice2,
                    //         updatedDataSluiceTotal,
                    //         updatedDataGate1,
                    //         updatedDataGate2,
                    //         updatedDataGate3,
                    //         updatedDataGateTotal,
                    //         updatedDataOutflowTotal,
                    //         updatedDataOutflowAverage
                    //     ] = await Promise.all([
                    //         fetchUpdatedData(tsidSluice1, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidSluice2, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidSluiceTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidGate1, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidGate2, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidGate3, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidGateTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidOutflowTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidOutflowAverage, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1)
                    //     ]);
                    // } else if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                    //     [
                    //         updatedDataGate1,
                    //         updatedDataGate2,
                    //         updatedDataGate3,
                    //         updatedDataGate4,
                    //         updatedDataGateTotal,
                    //         updatedDataOutflowAverage
                    //     ] = await Promise.all([
                    //         fetchUpdatedData(tsidGate1, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidGate2, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidGate3, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidGate4, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidGateTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidOutflowAverage, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1)
                    //     ]);
                    // } else if (lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                    //     [
                    //         updatedDataSluiceTotal,
                    //         updatedDataGate1,
                    //         updatedDataGate2,
                    //         updatedDataGate3,
                    //         updatedDataGate4,
                    //         updatedDataGateTotal,
                    //         updatedDataOutflowTotal,
                    //         updatedDataOutflowAverage
                    //     ] = await Promise.all([
                    //         fetchUpdatedData(tsidSluiceTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidGate1, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidGate2, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidGate3, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidGate4, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidGateTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidOutflowTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidOutflowAverage, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1)
                    //     ]);
                    // } else if (lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
                    //     [
                    //         updatedDataGate1,
                    //         updatedDataGate2,
                    //         updatedDataGate3,
                    //         updatedDataGateTotal,
                    //         updatedDataOutflowAverage
                    //     ] = await Promise.all([
                    //         fetchUpdatedData(tsidGate1, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidGate2, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidGate3, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidGateTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                    //         fetchUpdatedData(tsidOutflowAverage, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1)
                    //     ]);
                    // }

                    // createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
                    //     tsidSluice1, updatedDataSluice1, tsidSluice2, updatedDataSluice2, tsidSluiceTotal, updatedDataSluiceTotal,
                    //     tsidGate1, updatedDataGate1, tsidGate2, updatedDataGate2, tsidGate3, updatedDataGate3, tsidGateTotal, updatedDataGateTotal,
                    //     tsidOutflowTotal, updatedDataOutflowTotal, tsidOutflowAverage, updatedDataOutflowAverage,
                    //     timeSeriesYesterdayDataSluice1, timeSeriesYesterdayDataSluice2, timeSeriesYesterdayDataSluiceTotal,
                    //     timeSeriesYesterdayDataGate1, timeSeriesYesterdayDataGate2, timeSeriesYesterdayDataGate3,
                    //     timeSeriesYesterdayDataGateTotal, timeSeriesYesterdayDataOutflowTotal, timeSeriesYesterdayDataOutflowAverage, tsidGate4, updatedDataGate4, null, timeSeriesTomorrowDataOutflow); // null is for yesterday data
                } catch (error) {
                    hideSpinner(); // Hide the spinner if an error occurs
                    cdaStatusBtn.innerText = "Failed to write data!";
                    console.error(error);
                }

                hideSpinner(); // Hide the spinner after the operation completes
            }
        });

    }

    function createDataEntryTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
        tsidSluice1, timeSeriesDataSluice1, tsidSluice2, timeSeriesDataSluice2, tsidSluiceTotal, timeSeriesDataSluiceTotal,
        tsidGate1, timeSeriesDataGate1, tsidGate2, timeSeriesDataGate2, tsidGate3, timeSeriesDataGate3, tsidGateTotal, timeSeriesDataGateTotal,
        tsidOutflowTotal, timeSeriesDataOutflowTotal, tsidOutflowAverage, timeSeriesDataOutflowAverage,
        timeSeriesYesterdayDataSluice1, timeSeriesYesterdayDataSluice2, timeSeriesYesterdayDataSluiceTotal, timeSeriesYesterdayDataGate1, timeSeriesYesterdayDataGate2,
        timeSeriesYesterdayDataGate3, timeSeriesYesterdayDataGateTotal, timeSeriesYesterdayDataOutflowTotal, timeSeriesYesterdayDataOutflowAverage, tsidGate4, timeSeriesDataGate4, timeSeriesYesterdayDataGate4) {

        const formatData = (data) => {
            if (!data || !Array.isArray(data.values)) return [];

            return data.values.map((entry) => {
                const timestamp = entry[0];
                const formattedTimestampCST = formatISODateToCSTString(Number(timestamp));
                return {
                    ...entry,
                    formattedTimestampCST
                };
            });
        };

        // Today's data
        let formattedDataSluice1 = null;
        let formattedDataSluice2 = null;
        let formattedDataSluiceTotal = null;
        let formattedDataGate1 = null;;
        let formattedDataGate2 = null;;
        let formattedDataGate3 = null;
        let formattedDataGate4 = null;
        let formattedDataGateTotal = null;
        let formattedDataOutflowTotal = null;;
        let formattedDataOutflowAverage = null;

        // Yesterday's data
        let formattedYesterdayDataSluice1 = null;
        let formattedYesterdayDataSluice2 = null;
        let formattedYesterdayDataSluiceTotal = null;
        let formattedYesterdayDataGate1 = null;
        let formattedYesterdayDataGate2 = null;
        let formattedYesterdayDataGate3 = null;
        let formattedYesterdayDataGate4 = null;
        let formattedYesterdayDataGateTotal = null;
        let formattedYesterdayDataOutflowTotal = null;
        let formattedYesterdayDataOutflowAverage = null;

        if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
            // Today's data
            formattedDataSluice1 = formatData(timeSeriesDataSluice1);
            formattedDataSluice2 = formatData(timeSeriesDataSluice2);
            formattedDataSluiceTotal = formatData(timeSeriesDataSluiceTotal);
            formattedDataGate1 = formatData(timeSeriesDataGate1);
            formattedDataGate2 = formatData(timeSeriesDataGate2);
            formattedDataGate3 = formatData(timeSeriesDataGate3);
            formattedDataGateTotal = formatData(timeSeriesDataGateTotal);
            formattedDataOutflowTotal = formatData(timeSeriesDataOutflowTotal);
            formattedDataOutflowAverage = formatData(timeSeriesDataOutflowAverage);

            console.log("formattedDataSluice1:", formattedDataSluice1);
            console.log("formattedDataSluice2:", formattedDataSluice2);
            console.log("formattedDataSluiceTotal:", formattedDataSluiceTotal);
            console.log("formattedDataGate1:", formattedDataGate1);
            console.log("formattedDataGate2:", formattedDataGate2);
            console.log("formattedDataGate3:", formattedDataGate3);
            console.log("formattedDataGateTotal:", formattedDataGateTotal);
            console.log("formattedDataOutflowTotal:", formattedDataOutflowTotal);
            console.log("formattedDataOutflowAverage:", formattedDataOutflowAverage);

            // Yesterday's data
            formattedYesterdayDataSluice1 = formatData(timeSeriesYesterdayDataSluice1);
            formattedYesterdayDataSluice2 = formatData(timeSeriesYesterdayDataSluice2);
            formattedYesterdayDataSluiceTotal = formatData(timeSeriesYesterdayDataSluiceTotal);
            formattedYesterdayDataGate1 = formatData(timeSeriesYesterdayDataGate1);
            formattedYesterdayDataGate2 = formatData(timeSeriesYesterdayDataGate2);
            formattedYesterdayDataGate3 = formatData(timeSeriesYesterdayDataGate3);
            formattedYesterdayDataGateTotal = formatData(timeSeriesYesterdayDataGateTotal);
            formattedYesterdayDataOutflowTotal = formatData(timeSeriesYesterdayDataOutflowTotal);
            formattedYesterdayDataOutflowAverage = formatData(timeSeriesYesterdayDataOutflowAverage);

            console.log("formattedYesterdayDataSluice1:", formattedYesterdayDataSluice1);
            console.log("formattedYesterdayDataSluice2:", formattedYesterdayDataSluice2);
            console.log("formattedYesterdayDataSluiceTotal:", formattedYesterdayDataSluiceTotal);
            console.log("formattedYesterdayDataGate1:", formattedYesterdayDataGate1);
            console.log("formattedYesterdayDataGate2:", formattedYesterdayDataGate2);
            console.log("formattedYesterdayDataGate3:", formattedYesterdayDataGate3);
            console.log("formattedYesterdayDataGateTotal:", formattedYesterdayDataGateTotal);
            console.log("formattedYesterdayDataOutflowTotal:", formattedYesterdayDataOutflowTotal);
            console.log("formattedYesterdayDataOutflowAverage:", formattedYesterdayDataOutflowAverage);
        } else if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
            // Today's data
            formattedDataGate1 = formatData(timeSeriesDataGate1);
            formattedDataGate2 = formatData(timeSeriesDataGate2);
            formattedDataGate3 = formatData(timeSeriesDataGate3);
            formattedDataGate4 = formatData(timeSeriesDataGate4);
            formattedDataGateTotal = formatData(timeSeriesDataGateTotal);
            formattedDataOutflowAverage = formatData(timeSeriesDataOutflowAverage);

            console.log("formattedDataGate1:", formattedDataGate1);
            console.log("formattedDataGate2:", formattedDataGate2);
            console.log("formattedDataGate3:", formattedDataGate3);
            console.log("formattedDataGate4:", formattedDataGate4);
            console.log("formattedDataGateTotal:", formattedDataGateTotal);
            console.log("formattedDataOutflowAverage:", formattedDataOutflowAverage);

            // Yesterday's data
            formattedYesterdayDataGate1 = formatData(timeSeriesYesterdayDataGate1);
            formattedYesterdayDataGate2 = formatData(timeSeriesYesterdayDataGate2);
            formattedYesterdayDataGate3 = formatData(timeSeriesYesterdayDataGate3);
            formattedYesterdayDataGate4 = formatData(timeSeriesYesterdayDataGate4);
            formattedYesterdayDataGateTotal = formatData(timeSeriesYesterdayDataGateTotal);
            formattedYesterdayDataOutflowAverage = formatData(timeSeriesYesterdayDataOutflowAverage);

            console.log("formattedYesterdayDataGate1:", formattedYesterdayDataGate1);
            console.log("formattedYesterdayDataGate2:", formattedYesterdayDataGate2);
            console.log("formattedYesterdayDataGate3:", formattedYesterdayDataGate3);
            console.log("formattedYesterdayDataGate4:", formattedYesterdayDataGate4);
            console.log("formattedYesterdayDataGateTotal:", formattedYesterdayDataGateTotal);
            console.log("formattedYesterdayDataOutflowAverage:", formattedYesterdayDataOutflowAverage);
        } else if (lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
            // Today's data
            formattedDataSluiceTotal = formatData(timeSeriesDataSluiceTotal);
            formattedDataGate1 = formatData(timeSeriesDataGate1);
            formattedDataGate2 = formatData(timeSeriesDataGate2);
            formattedDataGate3 = formatData(timeSeriesDataGate3);
            formattedDataGate4 = formatData(timeSeriesDataGate4);
            formattedDataGateTotal = formatData(timeSeriesDataGateTotal);
            formattedDataOutflowTotal = formatData(timeSeriesDataOutflowTotal);
            formattedDataOutflowAverage = formatData(timeSeriesDataOutflowAverage);

            console.log("formattedDataSluiceTotal:", formattedDataSluiceTotal);
            console.log("formattedDataGate1:", formattedDataGate1);
            console.log("formattedDataGate2:", formattedDataGate2);
            console.log("formattedDataGate3:", formattedDataGate3);
            console.log("formattedDataGate4:", formattedDataGate4);
            console.log("formattedDataGateTotal:", formattedDataGateTotal);
            console.log("formattedDataOutflowTotal:", formattedDataOutflowTotal);
            console.log("formattedDataOutflowAverage:", formattedDataOutflowAverage);

            // Yesterday's data
            formattedYesterdayDataSluiceTotal = formatData(timeSeriesYesterdayDataSluiceTotal);
            formattedYesterdayDataGate1 = formatData(timeSeriesYesterdayDataGate1);
            formattedYesterdayDataGate2 = formatData(timeSeriesYesterdayDataGate2);
            formattedYesterdayDataGate3 = formatData(timeSeriesYesterdayDataGate3);
            formattedYesterdayDataGate4 = formatData(timeSeriesYesterdayDataGate4);
            formattedYesterdayDataGateTotal = formatData(timeSeriesYesterdayDataGateTotal);
            formattedYesterdayDataOutflowTotal = formatData(timeSeriesYesterdayDataOutflowTotal);
            formattedYesterdayDataOutflowAverage = formatData(timeSeriesYesterdayDataOutflowAverage);

            console.log("formattedYesterdayDataSluiceTotal:", formattedYesterdayDataSluiceTotal);
            console.log("formattedYesterdayDataGate1:", formattedYesterdayDataGate1);
            console.log("formattedYesterdayDataGate2:", formattedYesterdayDataGate2);
            console.log("formattedYesterdayDataGate3:", formattedYesterdayDataGate3);
            console.log("formattedYesterdayDataGate4:", formattedYesterdayDataGate4);
            console.log("formattedYesterdayDataGateTotal:", formattedYesterdayDataGateTotal);
            console.log("formattedYesterdayDataOutflowTotal:", formattedYesterdayDataOutflowTotal);
            console.log("formattedYesterdayDataOutflowAverage:", formattedYesterdayDataOutflowAverage);
        } else if (lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
            // Today's data
            formattedDataGate1 = formatData(timeSeriesDataGate1);
            formattedDataGate2 = formatData(timeSeriesDataGate2);
            formattedDataGate3 = formatData(timeSeriesDataGate3);
            formattedDataGateTotal = formatData(timeSeriesDataGateTotal);
            formattedDataOutflowAverage = formatData(timeSeriesDataOutflowAverage);

            console.log("formattedDataGate1:", formattedDataGate1);
            console.log("formattedDataGate2:", formattedDataGate2);
            console.log("formattedDataGate3:", formattedDataGate3);
            console.log("formattedDataGateTotal:", formattedDataGateTotal);
            console.log("formattedDataOutflowAverage:", formattedDataOutflowAverage);

            // Yesterday's data
            formattedYesterdayDataGate1 = formatData(timeSeriesYesterdayDataGate1);
            formattedYesterdayDataGate2 = formatData(timeSeriesYesterdayDataGate2);
            formattedYesterdayDataGate3 = formatData(timeSeriesYesterdayDataGate3);
            formattedYesterdayDataGateTotal = formatData(timeSeriesYesterdayDataGateTotal);
            formattedYesterdayDataOutflowAverage = formatData(timeSeriesYesterdayDataOutflowAverage);

            console.log("formattedYesterdayDataGate1:", formattedYesterdayDataGate1);
            console.log("formattedYesterdayDataGate2:", formattedYesterdayDataGate2);
            console.log("formattedYesterdayDataGate3:", formattedYesterdayDataGate3);
            console.log("formattedYesterdayDataGateTotal:", formattedYesterdayDataGateTotal);
            console.log("formattedYesterdayDataOutflowAverage:", formattedYesterdayDataOutflowAverage);
        }

        const table = document.createElement("table");

        table.id = "gate-settings";

        const headerRow = document.createElement("tr");

        const dateHeader = document.createElement("th");
        dateHeader.textContent = "Time";
        headerRow.appendChild(dateHeader);

        if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
            const sluice1Header = document.createElement("th");
            sluice1Header.textContent = "Sluice 1 (ft)";
            headerRow.appendChild(sluice1Header);

            const sluice2Header = document.createElement("th");
            sluice2Header.textContent = "Sluice 2 (ft)";
            headerRow.appendChild(sluice2Header);
        }

        if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
            const sluiceTotalHeader = document.createElement("th");
            sluiceTotalHeader.textContent = "Sluice Total (cfs)";
            headerRow.appendChild(sluiceTotalHeader);
        }

        const gate1Header = document.createElement("th");
        gate1Header.textContent = "Gate 1 (ft)";
        headerRow.appendChild(gate1Header);

        const gate2Header = document.createElement("th");
        gate2Header.textContent = "Gate 2 (ft)";
        headerRow.appendChild(gate2Header);

        const gate3Header = document.createElement("th");
        gate3Header.textContent = "Gate 3 (ft)";
        headerRow.appendChild(gate3Header);

        if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
            const gate4Header = document.createElement("th");
            gate4Header.textContent = "Gate 4 (ft)";
            headerRow.appendChild(gate4Header);

            const gateTotalHeader = document.createElement("th");
            gateTotalHeader.textContent = "Gate Total (cfs)";
            headerRow.appendChild(gateTotalHeader);
        }

        if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
            const gateTotalHeader = document.createElement("th");
            gateTotalHeader.textContent = "Gate Total (cfs)";
            headerRow.appendChild(gateTotalHeader);

            const outflowTotalHeader = document.createElement("th");
            outflowTotalHeader.textContent = "Outflow Total (cfs)";
            headerRow.appendChild(outflowTotalHeader);
        }

        if (lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
            const outflowTotalHeader = document.createElement("th");
            outflowTotalHeader.textContent = "Outflow Total (cfs)";
            headerRow.appendChild(outflowTotalHeader);
        }

        if (lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
            const gateTotalHeader = document.createElement("th");
            gateTotalHeader.textContent = "Gate Total (cfs)";
            headerRow.appendChild(gateTotalHeader);
        }

        table.appendChild(headerRow);

        let dates = [];
        dates = [isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5];

        let entryDates = [];

        // Generate options for dropdown (24-hour format)
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            const time = `${hour.toString().padStart(2, '0')}:00`;  // "00:00", "01:00", ..., "23:00"
            times.push(time);
        }

        console.log("times for dropdown:", times);

        // entryDates = ["", "", "", "", "", ""]; // Blank entries for dropdown
        entryDates = [1]; // Blank entries for dropdown

        const selectedHours = {};
        let averageOutflowCalculate = null;

        entryDates.forEach((date, index) => {
            const row = document.createElement("tr");

            // const selectedHours = {}; // Object to store each hour as hour1, hour2, etc.
            const timeCell = document.createElement("td");
            const timeSelect = document.createElement("select");
            timeSelect.id = `timeSelect-${index}`;

            // Create a dynamic key for each row (hour1, hour2, hour3, etc.)
            const hourKey = `hour${index + 1}`;
            selectedHours[hourKey] = index === 0 ? times[0] : "NONE";  // Set default hour value

            if (index !== 0) {
                // Create "NONE" option as the default for all rows except the first
                const noneOption = document.createElement("option");
                noneOption.value = "NONE";
                noneOption.textContent = "NONE";
                timeSelect.appendChild(noneOption);
            }

            // Create options for the dropdown (24 hours)
            times.forEach(time => {
                const option = document.createElement("option");
                option.value = time;
                option.textContent = time;
                timeSelect.appendChild(option);
            });

            // Set the default value
            timeSelect.value = selectedHours[hourKey];

            // Make it non-editable
            timeSelect.disabled = true

            // Update the corresponding hour when changed
            timeSelect.addEventListener("change", (event) => {
                selectedHours[hourKey] = event.target.value;
                console.log(`${hourKey} selected:`, selectedHours[hourKey]);
            });

            timeCell.appendChild(timeSelect);
            row.appendChild(timeCell);

            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                // Sluice1 cell (editable)
                const sluice1Cell = document.createElement("td");
                const sluice1Input = document.createElement("input");
                sluice1Input.type = "number";
                sluice1Input.value = formattedYesterdayDataSluice1.at(-1)[1].toFixed(1);
                sluice1Input.id = `sluice1Input`;

                if (index === 0) {
                    sluice1Input.style.backgroundColor = "pink";
                }

                sluice1Cell.appendChild(sluice1Input);
                row.appendChild(sluice1Cell);
                // console.log(document.getElementById(`sluice1Input`));  // Check if element exists

                // Sluice2 cell (editable)
                const sluice2Cell = document.createElement("td");
                const sluice2Input = document.createElement("input");
                sluice2Input.type = "number";
                sluice2Input.value = formattedYesterdayDataSluice2.at(-1)[1].toFixed(1);
                sluice2Input.id = `sluice2Input`;

                if (index === 0) {
                    sluice2Input.style.backgroundColor = "pink";
                }

                sluice2Cell.appendChild(sluice2Input);
                row.appendChild(sluice2Cell);
            }

            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                // Sluice Total cell (editable)
                const sluiceTotalCell = document.createElement("td");
                const sluiceTotalInput = document.createElement("input");
                sluiceTotalInput.type = "number";
                sluiceTotalInput.value = formattedYesterdayDataSluiceTotal.at(-1)[1].toFixed(0);
                sluiceTotalInput.id = `sluiceTotalInput`;

                if (index === 0) {
                    sluiceTotalInput.style.backgroundColor = "pink";
                }

                sluiceTotalCell.appendChild(sluiceTotalInput);
                row.appendChild(sluiceTotalCell);
            }

            // Gate 1 (editable)
            const gate1Cell = document.createElement("td");
            const gate1Input = document.createElement("input");
            gate1Input.type = "number";
            gate1Input.value = formattedYesterdayDataGate1.at(-1)[1].toFixed(1);
            gate1Input.id = `gate1Input`;
            if (index === 0) {
                gate1Input.style.backgroundColor = "pink";
            }
            gate1Cell.appendChild(gate1Input);
            row.appendChild(gate1Cell);

            // Gate 2 (editable)
            const gate2Cell = document.createElement("td");
            const gate2Input = document.createElement("input");
            gate2Input.type = "number";
            gate2Input.value = formattedYesterdayDataGate2.at(-1)[1].toFixed(1);
            gate2Input.id = `gate2Input`;
            if (index === 0) {
                gate2Input.style.backgroundColor = "pink";
            }
            gate2Cell.appendChild(gate2Input);
            row.appendChild(gate2Cell);

            // Gate 3 (editable)
            const gate3Cell = document.createElement("td");
            const gate3Input = document.createElement("input");
            gate3Input.type = "number";
            gate3Input.value = formattedYesterdayDataGate3.at(-1)[1].toFixed(1);
            gate3Input.id = `gate3Input`;
            if (index === 0) {
                gate3Input.style.backgroundColor = "pink";
            }
            gate3Cell.appendChild(gate3Input);
            row.appendChild(gate3Cell);

            // Gate 4 (editable)
            if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                const gate4Cell = document.createElement("td");
                const gate4Input = document.createElement("input");
                gate4Input.type = "number";
                gate4Input.value = formattedYesterdayDataGate4.at(-1)[1].toFixed(1);
                gate4Input.id = `gate4Input`;
                if (index === 0) {
                    gate4Input.style.backgroundColor = "pink";
                }
                gate4Cell.appendChild(gate4Input);
                row.appendChild(gate4Cell);
            }

            // Gate Total Flow (editable)
            const gateTotalCell = document.createElement("td");
            const gateTotalInput = document.createElement("input");
            gateTotalInput.type = "number";
            gateTotalInput.value = formattedYesterdayDataGateTotal.at(-1)[1].toFixed(0);
            gateTotalInput.id = `gateTotalInput`;
            if (index === 0) {
                gateTotalInput.style.backgroundColor = "pink";
            }
            gateTotalCell.appendChild(gateTotalInput);
            row.appendChild(gateTotalCell);

            // Outflow Average Total (calculated)
            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                averageOutflowCalculate = (formattedYesterdayDataGateTotal.at(-1)[1] + formattedYesterdayDataSluiceTotal.at(-1)[1]).toFixed(0);
                const gateOutflowTotalCell = document.createElement("td");
                const gateOutflowTotalInput = document.createElement("input");
                gateOutflowTotalInput.type = "number";
                gateOutflowTotalInput.value = averageOutflowCalculate;
                gateOutflowTotalInput.id = `gateOutflowTotalInput`;
                gateOutflowTotalInput.readOnly = true; // Make it read-only
                gateOutflowTotalInput.style.backgroundColor = "#f0f0f0";
                gateOutflowTotalCell.appendChild(gateOutflowTotalInput);
                row.appendChild(gateOutflowTotalCell);
            }

            table.appendChild(row);
        });

        // Append the table to the specific container (id="output4")
        const output6Div = document.getElementById("output4");
        output6Div.innerHTML = ""; // Clear any existing content
        output6Div.appendChild(table);

        const gateAverageDiv = document.createElement("div");
        gateAverageDiv.className = "status";

        // Create a tableOutflowAvg
        const tableOutflowAvg = document.createElement("table");
        tableOutflowAvg.id = "gate-outflow-average-table";
        const tableRow = document.createElement("tr");
        tableOutflowAvg.style.width = "50%";
        tableOutflowAvg.style.marginTop = "10px";


        // Create the first cell for "Average Outflow (cfs)"
        const firstCell = document.createElement("td");
        firstCell.textContent = "Average Outflow (cfs)";
        tableRow.appendChild(firstCell);

        // Create the second cell with "--"
        const secondCell = document.createElement("td");
        secondCell.type = "number";
        secondCell.id = `gateOutflowAverageInput`;

        // if lakes have more then one flow source like sluice/spillway/turbine, use the average of all flows
        if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk" || lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
            secondCell.textContent = averageOutflowCalculate;
            secondCell.style.backgroundColor = "pink";
        }

        // Just use yesterday total gate flow for these lakes
        if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
            secondCell.textContent = formattedYesterdayDataGateTotal.at(-1)[1].toFixed(0);
            secondCell.style.backgroundColor = "pink";
        }
        tableRow.appendChild(secondCell);

        // Append the row to the tableOutflowAvg
        tableOutflowAvg.appendChild(tableRow);

        // Append the tableOutflowAvg to the div
        gateAverageDiv.appendChild(tableOutflowAvg);

        // Append the div to output6Div
        output6Div.appendChild(gateAverageDiv);

        const cdaSaveBtn = document.createElement("button");
        cdaSaveBtn.textContent = "Submit";
        cdaSaveBtn.id = "cda-btn-gate";
        cdaSaveBtn.disabled = true;
        output6Div.appendChild(cdaSaveBtn);

        const statusDiv = document.createElement("div");
        statusDiv.className = "status";
        const cdaStatusBtn = document.createElement("button");
        cdaStatusBtn.textContent = "";
        cdaStatusBtn.id = "cda-btn-gate";
        cdaStatusBtn.disabled = false;
        statusDiv.appendChild(cdaStatusBtn);
        output6Div.appendChild(statusDiv);

        // Create the buttonRefresh button
        const buttonRefresh = document.createElement('button');
        buttonRefresh.textContent = 'Refresh';
        buttonRefresh.id = 'refresh-gate-settings-button';
        buttonRefresh.className = 'fetch-btn';
        output6Div.appendChild(buttonRefresh);

        buttonRefresh.addEventListener('click', () => {
            // Remove existing table
            const existingTable = document.getElementById('gate-settings');
            if (existingTable) {
                existingTable.remove();
            }

            // Remove existing table
            const existingButton = document.getElementById('gate-outflow-average-table');
            if (existingButton) {
                existingButton.remove();
            }

            // Remove save button
            const existingRefresh = document.getElementById('cda-btn-gate');
            if (existingRefresh) {
                existingRefresh.remove();
            }

            // Fetch and create new table
            fetchTsidData();
        });

        // Add event listener to the submit button
        cdaSaveBtn.addEventListener("click", async () => {

            // Log selected hours for debugging
            Object.keys(selectedHours).forEach(hour => {
                console.log(`${hour} selected:`, selectedHours[hour]);
            });

            let sluice1Input = null;
            let sluice2Input = null;
            let sluiceTotalInput = null;
            let gate1Input = null;
            let gate2Input = null;
            let gate3Input = null;
            let gate4Input = null;
            let gateTotalInput = null;
            let gateOutflowTotalInput = null;
            let gateOutflowAverageInput = null;

            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                // Get the sluice1 input element and check if it exists
                sluice1Input = document.getElementById(`sluice1Input`);
                if (!sluice1Input) {
                    console.error("sluice1Input element not found!");
                    return; // Exit if input is missing
                }
                if (!sluice1Input.value) {
                    sluice1Input.value = 909;
                }

                // Get the sluice2 input element and check if it exists
                sluice2Input = document.getElementById('sluice2Input');
                if (!sluice2Input) {
                    console.error("sluice2Input element not found!");
                    return; // Exit if input is missing
                }
                if (!sluice2Input.value) {
                    sluice2Input.value = 909;
                }
            }

            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                // Get the sluiceTotal input element and check if it exists
                sluiceTotalInput = document.getElementById('sluiceTotalInput');
                if (!sluiceTotalInput) {
                    console.error("sluiceTotalInput element not found!");
                    return; // Exit if input is missing
                }
                if (!sluiceTotalInput.value) {
                    sluiceTotalInput.value = 909;
                }
            }

            // Get the Gate1 input element and check if it exists
            gate1Input = document.getElementById('gate1Input');
            if (!gate1Input) {
                console.error("gate1Input element not found!");
                return; // Exit if input is missing
            }
            if (!gate1Input.value) {
                gate1Input.value = 909;
            }

            // Get the Gate2 input element and check if it exists
            gate2Input = document.getElementById('gate2Input');
            if (!gate2Input) {
                console.error("gate2Input element not found!");
                return; // Exit if input is missing
            }
            if (!gate2Input.value) {
                gate2Input.value = 909;
            }

            // Get the Gate3 input element and check if it exists
            gate3Input = document.getElementById('gate3Input');
            if (!gate3Input) {
                console.error("gate3Input element not found!");
                return; // Exit if input is missing
            }
            if (!gate3Input.value) {
                gate3Input.value = 909;
            }

            if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                // Get the Gate4 input element and check if it exists
                gate4Input = document.getElementById('gate4Input');
                if (!gate4Input) {
                    console.error("gate4Input element not found!");
                    return; // Exit if input is missing
                }
                if (!gate4Input.value) {
                    gate4Input.value = 909;
                }
            }

            // Get the GateTotal input element and check if it exists
            gateTotalInput = document.getElementById('gateTotalInput');
            if (!gateTotalInput) {
                console.error("gateTotalInput element not found!");
                return; // Exit if input is missing
            }
            if (!gateTotalInput.value) {
                gateTotalInput.value = 909;
            }

            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                // ========================== CALCULATE GATE TOTAL ==========================
                // Get the gateOutflowTotal input element and check if it exists
                gateOutflowTotalInput = document.getElementById('gateOutflowTotalInput');
                console.log("gateOutflowTotalInput: ", gateOutflowTotalInput);
                if (!gateOutflowTotalInput) {
                    console.error("gateOutflowTotalInput element not found!");
                    return; // Exit if input is missing
                }
                if (!gateOutflowTotalInput.value) {
                    gateOutflowTotalInput.value = 909;
                }
            }

            // ========================== CALCULATE GATE AVERAGE ==========================
            // Get the gateOutflowAverage input element and check if it exists
            gateOutflowAverageInput = document.getElementById('gateOutflowAverageInput');
            if (!gateOutflowAverageInput) {
                console.error("gateOutflowAverageInput element not found!");
                return; // Exit if input is missing
            }
            if (!gateOutflowAverageInput.textContent.trim()) {
                gateOutflowAverageInput.textContent = "909";
            }

            let time1 = null;
            if (selectedHours['hour1'] !== "NONE") {
                time1 = isoDateToday.slice(0, 10) + "T" + selectedHours['hour1'] + `:00Z`;
            }

            let time2 = null;
            if (selectedHours['hour2'] !== "NONE") {
                time2 = isoDateToday.slice(0, 10) + "T" + selectedHours['hour2'] + `:00Z`;
            }

            let time3 = null;
            if (selectedHours['hour3'] !== "NONE") {
                time3 = isoDateToday.slice(0, 10) + "T" + selectedHours['hour3'] + `:00Z`;
            }

            let time4 = null;
            if (selectedHours['hour4'] !== "NONE") {
                time4 = isoDateToday.slice(0, 10) + "T" + selectedHours['hour4'] + `:00Z`;
            }

            let time5 = null;
            if (selectedHours['hour5'] !== "NONE") {
                time5 = isoDateToday.slice(0, 10) + "T" + selectedHours['hour5'] + `:00Z`;
            }

            let time6 = null;
            if (selectedHours['hour6'] !== "NONE") {
                time6 = isoDateToday.slice(0, 10) + "T" + selectedHours['hour6'] + `:00Z`;
            }

            let payloadSluice1 = null;
            let payloadSluice2 = null;
            let payloadSluiceTotal = null;
            let payloadGate1 = null;
            let payloadGate2 = null;
            let payloadGate3 = null;
            let payloadGate4 = null;
            let payloadGateTotal = null;
            let payloadOutflowTotal = null;
            let payloadOutflowAverage = null;

            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                payloadSluice1 = {
                    "name": tsidSluice1,
                    "office-id": office,
                    "units": "ft",
                    "values": [
                        [
                            convertToISO(selectedHours['hour1']),
                            sluice1Input.value,
                            0
                        ],
                        // [
                        //     time2,
                        //     sluice1Input.value,
                        //     0
                        // ],
                        // [
                        //     time3,
                        //     sluice1Input.value,
                        //     0
                        // ],
                        // [
                        //     time4,
                        //     sluice1Input.value,
                        //     0
                        // ],
                        // [
                        //     time5,
                        //     sluice1Input.value,
                        //     0
                        // ],
                        // [
                        //     time6,
                        //     sluice1Input.value,
                        //     0
                        // ],
                    ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                };
                console.log("payloadSluice1: ", payloadSluice1);

                payloadSluice2 = {
                    "name": tsidSluice2,
                    "office-id": office,
                    "units": "ft",
                    "values": [
                        [
                            convertToISO(selectedHours['hour1']),
                            sluice2Input.value,
                            0
                        ],
                        // [
                        //     time2,
                        //     sluice2Input.value,
                        //     0
                        // ],
                        // [
                        //     time3,
                        //     sluice2Input.value,
                        //     0
                        // ],
                        // [
                        //     time4,
                        //     sluice2Input.value,
                        //     0
                        // ],
                        // [
                        //     time5,
                        //     sluice2Input.value,
                        //     0
                        // ],
                        // [
                        //     time6,
                        //     sluice2Input.value,
                        //     0
                        // ],
                    ].filter(item => item[0] !== null),
                };
                console.log("payloadSluice2: ", payloadSluice2);
            }

            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                payloadSluiceTotal = {
                    "name": tsidSluiceTotal,
                    "office-id": office,
                    "units": "cfs",
                    "values": [
                        [
                            convertToISO(selectedHours['hour1']),
                            sluiceTotalInput.value,
                            0
                        ],
                        // [
                        //     time2,
                        //     sluiceTotalInput.value,
                        //     0
                        // ],
                        // [
                        //     time3,
                        //     sluiceTotalInput.value,
                        //     0
                        // ],
                        // [
                        //     time4,
                        //     sluiceTotalInput.value,
                        //     0
                        // ],
                        // [
                        //     time5,
                        //     sluiceTotalInput.value,
                        //     0
                        // ],
                        // [
                        //     time6,
                        //     sluiceTotalInput.value,
                        //     0
                        // ],
                    ].filter(item => item[0] !== null),
                };
                console.log("payloadSluiceTotal: ", payloadSluiceTotal);
            }

            payloadGate1 = {
                "name": tsidGate1,
                "office-id": office,
                "units": "ft",
                "values": [
                    [
                        convertToISO(selectedHours['hour1']),
                        gate1Input.value,
                        0
                    ],
                    // [
                    //     time2,
                    //     gate1Input.value,
                    //     0
                    // ],
                    // [
                    //     time3,
                    //     gate1Input.value,
                    //     0
                    // ],
                    // [
                    //     time4,
                    //     gate1Input.value,
                    //     0
                    // ],
                    // [
                    //     time5,
                    //     gate1Input.value,
                    //     0
                    // ],
                    // [
                    //     time6,
                    //     gate1Input.value,
                    //     0
                    // ],
                ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
            };
            console.log("payloadGate1: ", payloadGate1);

            payloadGate2 = {
                "name": tsidGate2,
                "office-id": office,
                "units": "ft",
                "values": [
                    [
                        convertToISO(selectedHours['hour1']),
                        gate2Input.value,
                        0
                    ],
                    // [
                    //     time2,
                    //     gate2Input.value,
                    //     0
                    // ],
                    // [
                    //     time3,
                    //     gate2Input.value,
                    //     0
                    // ],
                    // [
                    //     time4,
                    //     gate2Input.value,
                    //     0
                    // ],
                    // [
                    //     time5,
                    //     gate2Input.value,
                    //     0
                    // ],
                    // [
                    //     time6,
                    //     gate2Input.value,
                    //     0
                    // ],
                ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
            };
            console.log("payloadGate2: ", payloadGate2);

            payloadGate3 = {
                "name": tsidGate3,
                "office-id": office,
                "units": "ft",
                "values": [
                    [
                        convertToISO(selectedHours['hour1']),
                        gate3Input.value,
                        0
                    ],
                    // [
                    //     time2,
                    //     gate3Input.value,
                    //     0
                    // ],
                    // [
                    //     time3,
                    //     gate3Input.value,
                    //     0
                    // ],
                    // [
                    //     time4,
                    //     gate3Input.value,
                    //     0
                    // ],
                    // [
                    //     time5,
                    //     gate3Input.value,
                    //     0
                    // ],
                    // [
                    //     time6,
                    //     gate3Input.value,
                    //     0
                    // ],
                ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
            };
            console.log("payloadGate3: ", payloadGate3);

            if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                payloadGate4 = {
                    "name": tsidGate4,
                    "office-id": office,
                    "units": "ft",
                    "values": [
                        [
                            convertToISO(selectedHours['hour1']),
                            gate4Input.value,
                            0
                        ],
                        // [
                        //     time2,
                        //     gate3Input.value,
                        //     0
                        // ],
                        // [
                        //     time3,
                        //     gate3Input.value,
                        //     0
                        // ],
                        // [
                        //     time4,
                        //     gate3Input.value,
                        //     0
                        // ],
                        // [
                        //     time5,
                        //     gate3Input.value,
                        //     0
                        // ],
                        // [
                        //     time6,
                        //     gate3Input.value,
                        //     0
                        // ],
                    ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                };
                console.log("payloadGate4: ", payloadGate4);
            }

            payloadGateTotal = {
                "name": tsidGateTotal,
                "office-id": office,
                "units": "cfs",
                "values": [
                    [
                        convertToISO(selectedHours['hour1']),
                        gateTotalInput.value,
                        0
                    ],
                    // [
                    //     time2,
                    //     gateTotalInput.value,
                    //     0
                    // ],
                    // [
                    //     time3,
                    //     gateTotalInput.value,
                    //     0
                    // ],
                    // [
                    //     time4,
                    //     gateTotalInput.value,
                    //     0
                    // ],
                    // [
                    //     time5,
                    //     gateTotalInput.value,
                    //     0
                    // ],
                    // [
                    //     time6,
                    //     gateTotalInput.value,
                    //     0
                    // ],
                ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
            };
            console.log("payloadGateTotal: ", payloadGateTotal);

            if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                payloadOutflowTotal = {
                    "name": tsidOutflowTotal,
                    "office-id": office,
                    "units": "cfs",
                    "values": [
                        [
                            convertToISO(selectedHours['hour1']),
                            gateOutflowTotalInput.value,
                            0
                        ],
                        // [
                        //     time2,
                        //     gateTotalInput.value,
                        //     0
                        // ],
                        // [
                        //     time3,
                        //     gateTotalInput.value,
                        //     0
                        // ],
                        // [
                        //     time4,
                        //     gateTotalInput.value,
                        //     0
                        // ],
                        // [
                        //     time5,
                        //     gateTotalInput.value,
                        //     0
                        // ],
                        // [
                        //     time6,
                        //     gateTotalInput.value,
                        //     0
                        // ],
                    ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                };
                console.log("payloadOutflowTotal: ", payloadOutflowTotal);
            }

            payloadOutflowAverage = {
                "name": tsidOutflowAverage,
                "office-id": office,
                "units": "cfs",
                "values": [
                    [
                        convertToISO(selectedHours['hour1']),
                        gateOutflowAverageInput.textContent.trim(),
                        0
                    ],
                    // [
                    //     time2,
                    //     gateTotalInput.value,
                    //     0
                    // ],
                    // [
                    //     time3,
                    //     gateTotalInput.value,
                    //     0
                    // ],
                    // [
                    //     time4,
                    //     gateTotalInput.value,
                    //     0
                    // ],
                    // [
                    //     time5,
                    //     gateTotalInput.value,
                    //     0
                    // ],
                    // [
                    //     time6,
                    //     gateTotalInput.value,
                    //     0
                    // ],
                ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
            };
            console.log("payloadOutflowAverage: ", payloadOutflowAverage);

            async function loginCDA() {
                console.log("page");
                if (await isLoggedIn()) return true;
                console.log('is false');

                // Redirect to login page
                window.location.href = `https://wm.mvs.ds.usace.army.mil:8243/CWMSLogin/login?OriginalLocation=${encodeURIComponent(window.location.href)}`;
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

            async function createTS(payload) {
                if (!payload) throw new Error("You must specify a payload!");
                const response = await fetch("https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?store-rule=REPLACE%20ALL", {
                    method: "POST",
                    headers: { "Content-Type": "application/json;version=2" },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }
            }

            async function fetchUpdatedData(name, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1) {
                // Convert to Date object
                const date = new Date(isoDateDay1);

                // Add 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
                date.setTime(date.getTime() - (1 * 60 * 60 * 1000));

                // Convert back to ISO string (preserve UTC format)
                const end = date.toISOString();

                const tsidData = `${setBaseUrl}timeseries?name=${name}&begin=${isoDateToday}&end=${end}&office=${office}`;
                // console.log('tsidData:', tsidData);
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
                cdaStatusBtn.innerText = loginResult ? "" : "Failed to Login!";
            } else {
                try {
                    showSpinner();
                    if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                        await createTS(payloadSluice1);
                        cdaStatusBtn.innerText = "Write payloadSluice1 successful!";
                        await createTS(payloadSluice2);
                        cdaStatusBtn.innerText = "Write payloadSluice2 successful!";
                    }
                    if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                        await createTS(payloadSluiceTotal);
                        cdaStatusBtn.innerText = "Write payloadSluiceTotal successful!";
                    }
                    await createTS(payloadGate1);
                    cdaStatusBtn.innerText = "Write payloadGate1 successful!";
                    await createTS(payloadGate2);
                    cdaStatusBtn.innerText = "Write payloadGate2 successful!";
                    await createTS(payloadGate3);
                    cdaStatusBtn.innerText = "Write payloadGate3 successful!";
                    if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                        await createTS(payloadGate4);
                        cdaStatusBtn.innerText = "Write payloadGate4 successful!";
                    }
                    await createTS(payloadGateTotal);
                    cdaStatusBtn.innerText = "Write payloadGateTotal successful!";
                    if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                        await createTS(payloadOutflowTotal);
                        cdaStatusBtn.innerText = "Write payloadOutflowTotal successful!";
                    }
                    await createTS(payloadOutflowAverage);
                    cdaStatusBtn.innerText = "Write payloadOutflowAverage successful!";

                    // Initialize variables to prevent reference errors
                    let updatedDataSluice1 = null;
                    let updatedDataSluice2 = null;
                    let updatedDataSluiceTotal = null;
                    let updatedDataGate1 = null;
                    let updatedDataGate2 = null;
                    let updatedDataGate3 = null;
                    let updatedDataGate4 = null;
                    let updatedDataGateTotal = null;
                    let updatedDataOutflowTotal = null;
                    let updatedDataOutflowAverage = null;

                    if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                        [
                            updatedDataSluice1,
                            updatedDataSluice2,
                            updatedDataSluiceTotal,
                            updatedDataGate1,
                            updatedDataGate2,
                            updatedDataGate3,
                            updatedDataGateTotal,
                            updatedDataOutflowTotal,
                            updatedDataOutflowAverage
                        ] = await Promise.all([
                            fetchUpdatedData(tsidSluice1, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                            fetchUpdatedData(tsidSluice2, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                            fetchUpdatedData(tsidSluiceTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                            fetchUpdatedData(tsidGate1, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                            fetchUpdatedData(tsidGate2, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                            fetchUpdatedData(tsidGate3, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                            fetchUpdatedData(tsidGateTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                            fetchUpdatedData(tsidOutflowTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                            fetchUpdatedData(tsidOutflowAverage, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1)
                        ]);
                    } else if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
                        [
                            updatedDataGate1,
                            updatedDataGate2,
                            updatedDataGate3,
                            updatedDataGate4,
                            updatedDataGateTotal,
                            updatedDataOutflowAverage
                        ] = await Promise.all([
                            fetchUpdatedData(tsidGate1, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                            fetchUpdatedData(tsidGate2, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                            fetchUpdatedData(tsidGate3, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                            fetchUpdatedData(tsidGate4, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                            fetchUpdatedData(tsidGateTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                            fetchUpdatedData(tsidOutflowAverage, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1)
                        ]);
                    } else if (lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                        [
                            updatedDataSluiceTotal,
                            updatedDataGate1,
                            updatedDataGate2,
                            updatedDataGate3,
                            updatedDataGate4,
                            updatedDataGateTotal,
                            updatedDataOutflowTotal,
                            updatedDataOutflowAverage
                        ] = await Promise.all([
                            fetchUpdatedData(tsidSluiceTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                            fetchUpdatedData(tsidGate1, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                            fetchUpdatedData(tsidGate2, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                            fetchUpdatedData(tsidGate3, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                            fetchUpdatedData(tsidGate4, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                            fetchUpdatedData(tsidGateTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                            fetchUpdatedData(tsidOutflowTotal, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1),
                            fetchUpdatedData(tsidOutflowAverage, isoDateDay5, isoDateToday, isoDateMinus1Day, isoDateDay1)
                        ]);
                    }

                    createTable(isoDateMinus1Day, isoDateToday, isoDateDay1, isoDateDay2, isoDateDay3, isoDateDay4, isoDateDay5, isoDateDay6, isoDateDay7,
                        tsidSluice1, updatedDataSluice1, tsidSluice2, updatedDataSluice2, tsidSluiceTotal, updatedDataSluiceTotal,
                        tsidGate1, updatedDataGate1, tsidGate2, updatedDataGate2, tsidGate3, updatedDataGate3, tsidGateTotal, updatedDataGateTotal,
                        tsidOutflowTotal, updatedDataOutflowTotal, tsidOutflowAverage, updatedDataOutflowAverage,
                        timeSeriesYesterdayDataSluice1, timeSeriesYesterdayDataSluice2, timeSeriesYesterdayDataSluiceTotal,
                        timeSeriesYesterdayDataGate1, timeSeriesYesterdayDataGate2, timeSeriesYesterdayDataGate3,
                        timeSeriesYesterdayDataGateTotal, timeSeriesYesterdayDataOutflowTotal, timeSeriesYesterdayDataOutflowAverage, tsidGate4, updatedDataGate4, null); // null is for yesterday data
                } catch (error) {
                    hideSpinner(); // Hide the spinner if an error occurs
                    cdaStatusBtn.innerText = "Failed to write data!";
                    console.error(error);
                }

                hideSpinner(); // Hide the spinner after the operation completes
            }
        });

    }
};





                            // If there is new entry
                            // if (newDataEntryUsed === true) {
                            //     console.log("newDataEntryUsed is true, preparing payloads for new data entry...");

                            //     Object.keys(selectedHours).forEach(hour => {
                            //         console.log(`${hour} selected:`, selectedHours[hour]);
                            //     });

                            //     if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                            //         sluice1AdditionalInput = document.getElementById(`sluice1AdditionalInput`);
                            //         if (!sluice1AdditionalInput) {
                            //             console.error("sluice1AdditionalInput element not found!");
                            //             return;
                            //         }
                            //         if (!sluice1AdditionalInput.value) {
                            //             sluice1AdditionalInput.value = 909;
                            //         }

                            //         sluice2AdditionalInput = document.getElementById(`sluice2AdditionalInput`);
                            //         if (!sluice2AdditionalInput) {
                            //             console.error("sluice2AdditionalInput element not found!");
                            //             return;
                            //         }
                            //         if (!sluice2AdditionalInput.value) {
                            //             sluice2AdditionalInput.value = 909;
                            //         }
                            //     }

                            //     if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                            //         sluiceTotalAdditionalInput = document.getElementById(`sluiceTotalAdditionalInput`);
                            //         if (!sluiceTotalAdditionalInput) {
                            //             console.error("sluiceTotalAdditionalInput element not found!");
                            //             return;
                            //         }
                            //         if (!sluiceTotalAdditionalInput.value) {
                            //             sluiceTotalAdditionalInput.value = 909;
                            //         }
                            //     }

                            //     gate1AdditionalInput = document.getElementById(`gate1AdditionalInput`);
                            //     if (!gate1AdditionalInput) {
                            //         console.error("gate1AdditionalInput element not found!");
                            //         return;
                            //     }
                            //     if (!gate1AdditionalInput.value) {
                            //         gate1AdditionalInput.value = 909;
                            //     }

                            //     gate2AdditionalInput = document.getElementById(`gate2AdditionalInput`);
                            //     if (!gate2AdditionalInput) {
                            //         console.error("gate2AdditionalInput element not found!");
                            //         return;
                            //     }
                            //     if (!gate2AdditionalInput.value) {
                            //         gate2AdditionalInput.value = 909;
                            //     }

                            //     gate3AdditionalInput = document.getElementById(`gate3AdditionalInput`);
                            //     if (!gate3AdditionalInput) {
                            //         console.error("gate3AdditionalInput element not found!");
                            //         return;
                            //     }
                            //     if (!gate3AdditionalInput.value) {
                            //         gate3AdditionalInput.value = 909;
                            //     }

                            //     if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                            //         gate4AdditionalInput = document.getElementById(`gate4AdditionalInput`);
                            //         if (!gate4AdditionalInput) {
                            //             console.error("gate4AdditionalInput element not found!");
                            //             return;
                            //         }
                            //         if (!gate4AdditionalInput.value) {
                            //             gate4AdditionalInput.value = 909;
                            //         }
                            //     }
                            //     gateTotalAdditionalInput = document.getElementById(`gateTotalAdditionalInput`);
                            //     if (!gateTotalAdditionalInput) {
                            //         console.error("gateTotalAdditionalInput element not found!");
                            //         return;
                            //     }
                            //     if (!gateTotalAdditionalInput.value) {
                            //         gateTotalAdditionalInput.value = 909;
                            //     }

                            //     if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                            //         gateOutflowTotalInput = document.getElementById('gateOutflowTotalAdditionalInput');
                            //         if (!gateOutflowTotalInput) {
                            //             console.error("gateOutflowTotalInput element not found!");
                            //             return;
                            //         }
                            //         const gateTotal = gateTotalAdditionalInput ? Number(gateTotalAdditionalInput.value) || 0 : 0;
                            //         const sluiceTotal = sluiceTotalAdditionalInput ? Number(sluiceTotalAdditionalInput.value) || 0 : 0;
                            //         const calculatedValue = gateTotal + sluiceTotal;

                            //         gateOutflowTotalInput.value = calculatedValue > 0 ? calculatedValue : 909;
                            //     }

                            //     gateOutflowAverageInput = document.getElementById(`gateOutflowAverageInput`);
                            //     if (!gateOutflowAverageInput) {
                            //         console.error("gateOutflowAverageInput element not found!");
                            //         return;
                            //     }
                            //     if (!gateOutflowAverageInput.value) {
                            //         gateOutflowAverageInput.value = 909;
                            //     }

                            //     console.log("selectedHours['hour1']: ", selectedHours['hour1'], typeof (selectedHours['hour1']));

                            //     let time1 = null;
                            //     if (selectedHours['hour1'] !== "NONE") {
                            //         // Extract hours and minutes
                            //         let [hour, minute] = selectedHours['hour1'].split(':').map(Number);

                            //         // Create a Date object (using an arbitrary date)
                            //         let date = new Date();
                            //         date.setUTCHours(hour + dstOffsetHours, minute, 0, 0); // Add offset

                            //         // Format back to "HH:mm"
                            //         let adjustedHour = String(date.getUTCHours()).padStart(2, '0');
                            //         let adjustedMinute = String(date.getUTCMinutes()).padStart(2, '0');
                            //         let adjustedTime = `${adjustedHour}:${adjustedMinute}`;

                            //         // Construct the final time string
                            //         time1 = `${isoDateToday.slice(0, 10)}T${adjustedTime}:00Z`;
                            //     }
                            //     console.log("Adjusted time1:", time1);

                            //     if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
                            //         payloadSluice1Additional = {
                            //             "name": tsidSluice1,
                            //             "office-id": office,
                            //             "units": "ft",
                            //             "values": [
                            //                 [
                            //                     time1,
                            //                     sluice1AdditionalInput.value,
                            //                     0
                            //                 ],
                            //             ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                            //         };
                            //         console.log("payloadSluice1Additional: ", payloadSluice1Additional);
                
                            //         payloadSluice2Additional = {
                            //             "name": tsidSluice2,
                            //             "office-id": office,
                            //             "units": "ft",
                            //             "values": [
                            //                 [
                            //                     time1,
                            //                     sluice2AdditionalInput.value,
                            //                     0
                            //                 ],
                            //             ].filter(item => item[0] !== null),
                            //         };
                            //         console.log("payloadSluice2Additional: ", payloadSluice2Additional);
                            //     }
                
                            //     if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                            //         payloadSluiceTotalAdditional = {
                            //             "name": tsidSluiceTotal,
                            //             "office-id": office,
                            //             "units": "cfs",
                            //             "values": [
                            //                 [
                            //                     time1,
                            //                     sluiceTotalAdditionalInput.value,
                            //                     0
                            //                 ],
                            //             ].filter(item => item[0] !== null),
                            //         };
                            //         console.log("payloadSluiceTotalAdditional: ", payloadSluiceTotalAdditional);
                            //     }
                            //     payloadGate1Additional = {
                            //         "name": tsidGate1,
                            //         "office-id": office,
                            //         "units": "ft",
                            //         "values": [
                            //             [
                            //                 time1,
                            //                 gate1AdditionalInput.value,
                            //                 0
                            //             ],
                            //         ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                            //     };
                            //     console.log("payloadGate1Additional: ", payloadGate1Additional);
                
                            //     payloadGate2Additional = {
                            //         "name": tsidGate2,
                            //         "office-id": office,
                            //         "units": "ft",
                            //         "values": [
                            //             [
                            //                 time1,
                            //                 gate2AdditionalInput.value,
                            //                 0
                            //             ],
                            //         ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                            //     };
                            //     console.log("payloadGate2Additional: ", payloadGate2Additional);
                
                            //     payloadGate3Additional = {
                            //         "name": tsidGate3,
                            //         "office-id": office,
                            //         "units": "ft",
                            //         "values": [
                            //             [
                            //                 time1,
                            //                 gate3AdditionalInput.value,
                            //                 0
                            //             ],
                            //         ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                            //     };
                            //     console.log("payloadGate3Additional: ", payloadGate3Additional);
                
                            //     if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk" || lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
                            //         payloadGate4Additional = {
                            //             "name": tsidGate4,
                            //             "office-id": office,
                            //             "units": "ft",
                            //             "values": [
                            //                 [
                            //                     time1,
                            //                     gate4AdditionalInput.value,
                            //                     0
                            //                 ],
                            //             ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                            //         };
                            //         console.log("payloadGate4Additional: ", payloadGate4Additional);
                            //     }
                
                            //     payloadGateTotalAdditional = {
                            //         "name": tsidGateTotal,
                            //         "office-id": office,
                            //         "units": "cfs",
                            //         "values": [
                            //             [
                            //                 time1,
                            //                 gateTotalAdditionalInput.value,
                            //                 0
                            //             ],
                            //         ].filter(item => item[0] !== null), // Filters out entries where time1 is null,
                            //     };
                            //     console.log("payloadGateTotalAdditional: ", payloadGateTotalAdditional);
                            // }


                            // Add "NONE" as the first option
                            const noneOption = document.createElement("option");
                            noneOption.value = "23:59";
                            noneOption.textContent = "NONE";
                            timeSelectExisting.appendChild(noneOption);