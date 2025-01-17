
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
