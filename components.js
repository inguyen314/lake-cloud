// Create the buttonRefresh button
const buttonRefresh = document.createElement('button');
buttonRefresh.textContent = 'Refresh';
buttonRefresh.id = 'refreshGateSettingsBtn';
buttonRefresh.className = 'fetch-btn';
output6Div.appendChild(buttonRefresh);

buttonRefresh.addEventListener('click', () => {
    // Remove existing table
    const existingTable = document.getElementById('gate-settings');
    if (existingTable) {
        existingTable.remove();
    }

    // Remove both buttons
    const existingButton = document.getElementById('gateOutflowAverageTable');
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


lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk"


// Optional: small delay to allow backend to process the new data
await new Promise(resolve => setTimeout(resolve, 1000));


Math.round(averageOutflowPayload / 10) * 10;

// First, round 734.999488521653 to the nearest whole number → 735
// Then, round 735 to the nearest 10 → 740
Math.round(Math.round(averageOutflowYesterdayValue) / 10) * 10; // round 734.9999 to 740