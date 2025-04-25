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