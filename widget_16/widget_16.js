document.addEventListener('DOMContentLoaded', async function () {
    console.log("lake: ", lake);
    console.log('datetime: ', datetime);

    if (lake === "Lk Shelbyville-Kaskaskia" || lake === "Lk Shelbyville") {
        // Reformat MM-DD-YYYY to YYYY-MM-DD for safe Date parsing
        const [month, day, year] = datetime.split('-');
        const isoDate = `${year}-${month}-${day}`; // '2025-05-17'
        const baseDate = new Date(`${isoDate}T00:00:00`); // safe for Date object

        // Format date like "Fri 17-May"
        function formatDate(dateObj) {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${days[dateObj.getDay()]} ${String(dateObj.getDate()).padStart(2, '0')}-${months[dateObj.getMonth()]}`;
        }

        // Offset helper
        function offsetDate(base, daysOffset) {
            const copy = new Date(base);
            copy.setDate(copy.getDate() + daysOffset);
            return copy;
        }

        // Generate ranges
        const observedStart = formatDate(baseDate);
        const observedEnd = formatDate(offsetDate(baseDate, 7));
        const qpf7Start = observedStart;
        const qpf7End = observedEnd;
        const qpf16Start = observedStart;
        const qpf16End = formatDate(offsetDate(baseDate, 15));

        // Construct HTML with responsive images
        const htmlContent = `
        <style>
            #output16 img {
            width: 100%;
            max-width: 1000px;
            height: auto;
            border: 2px solid #000;
            }
        </style>
        <p><center><strong><font size="+2">
            7-day Observed<br>
            <img src="https://mrcc.purdue.edu/files/cliwatch/GIS_plots/prcp_mpe/prcp_mpe_007_tot-0.png" alt="7-Day Observed Multi-sensor Precipitation"><br>
        </font></strong></center></p>
        <p><center><strong><font size="+2">
            7-day QPF<br>
            <img src="https://www.wpc.ncep.noaa.gov/qpf/p168i.gif?1512662281" alt="7-Day QPF"><br>
        </font></strong></center></p>
        <p><center><strong><font size="+2">
            16-day QPF<br>
            <img src="https://www.weather.gov/images/ohrfc/dynamic/NAEFS16.apcp.mean.total.png" alt="16-Day QPF"><br>
        </font></strong></center></p>
        `;

        document.getElementById('output16').innerHTML = htmlContent;

    } else if (lake === "Mark Twain Lk-Salt" || lake === "Mark Twain Lk") {
        const [month, day, year] = datetime.split('-');
        const baseDate = new Date(`${year}-${month}-${day}T00:00:00`);

        // Format helpers
        const formatMMDD = d => {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return `${days[d.getDay()]} ${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
        };
        const formatDayMonth = d => {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${days[d.getDay()]} ${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}`;
        };

        // Offsets
        const offset = (d, days) => new Date(d.getTime() + days * 86400000);

        // Dates
        const observedStart = formatMMDD(baseDate);
        const observedEnd = formatMMDD(offset(baseDate, 7));
        const qpf7Start = observedEnd;
        const qpf7End = formatMMDD(offset(baseDate, 14));
        const qpf16Start = formatDayMonth(offset(baseDate, 7));
        const qpf16End = formatDayMonth(offset(baseDate, 15));

        // Build HTML
        const html = `
        <style>
            #output16 img {
            max-width: 100%;
            height: auto;
            border: 2px solid black;
            }
        </style>

        <p><center><strong><font size="+2">
            7-day Observed<br>
            <img src="https://mrcc.purdue.edu/files/cliwatch/GIS_plots/prcp_mpe/prcp_mpe_007_tot-0.png" alt="7-Day Observed Multi-sensor Precipitation"><br>
        </font></strong></center></p>

        <p><center><strong><font size="+2">
            7-day QPF<br>
            <img src="https://www.wpc.ncep.noaa.gov/qpf/p168i.gif?1512662281" alt="7-Day QPF"><br>
        </font></strong></center></p>

        <p><center><strong><font size="+2">
            16-day QPF<br>
            <img src="https://www.weather.gov/images/ohrfc/dynamic/NAEFS16.apcp.mean.total.png" alt="16-Day QPF"><br>
        </font></strong></center></p>
        `;

        document.getElementById('output16').innerHTML = html;

    } else if (lake === "Carlyle Lk-Kaskaskia" || lake === "Carlyle Lk") {
        // Convert MM-DD-YYYY to safe format for Date
        const [month, day, year] = datetime.split('-');
        const isoDate = `${year}-${month}-${day}`;
        const baseDate = new Date(`${isoDate}T00:00:00`);

        // Date formatting
        function formatDate(dateObj) {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${days[dateObj.getDay()]} ${String(dateObj.getDate()).padStart(2, '0')}-${months[dateObj.getMonth()]}`;
        }

        // Add days to base date
        function offsetDate(date, daysOffset) {
            const result = new Date(date);
            result.setDate(result.getDate() + daysOffset);
            return result;
        }

        // Compute date ranges
        const observedStart = formatDate(baseDate);                  // today
        const observedEnd = formatDate(offsetDate(baseDate, 7));     // today + 7
        const qpf7Start = formatDate(offsetDate(baseDate, 7));       // today + 7
        const qpf7End = formatDate(offsetDate(baseDate, 14));        // today + 14
        const qpf16Start = qpf7Start;
        const qpf16End = formatDate(offsetDate(baseDate, 15));       // today + 15

        // Construct HTML
        const htmlContent = `
        <style>
            #output16 img {
            width: 100%;
            max-width: 1000px;
            height: auto;
            border: 2px solid #000;
            }
        </style>

        <p><center><strong><font size="+2">
            7-day Observed<br>
            <img src="https://mrcc.purdue.edu/files/cliwatch/GIS_plots/prcp_mpe/prcp_mpe_007_tot-0.png" alt="7-Day Observed Multi-sensor Precipitation"><br>
        </font></strong></center></p>

        <p><center><strong><font size="+2">
            7-day QPF<br>
            <img src="https://www.wpc.ncep.noaa.gov/qpf/p168i.gif?1512662281" alt="7-Day QPF"><br>
        </font></strong></center></p>

        <p><center><strong><font size="+2">
            16-day QPF<br>
            <img src="https://www.weather.gov/images/ohrfc/dynamic/NAEFS16.apcp.mean.total.png" alt="16-Day QPF"><br>
        </font></strong></center></p>
        `;

        document.getElementById('output16').innerHTML = htmlContent;

    } else if (lake === "Wappapello Lk-St Francis" || lake === "Wappapello Lk") {
        // Convert to a format JS Date understands
        const [month, day, year] = datetime.split('-');
        const baseDate = new Date(`${year}-${month}-${day}T00:00:00`);

        // Format: Fri 05/09
        function formatDateMMDD(dateObj) {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
            const dd = String(dateObj.getDate()).padStart(2, '0');
            return `${days[dateObj.getDay()]} ${mm}/${dd}`;
        }

        // Format: 01-Jun
        function formatDateDayMonth(dateObj) {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const day = String(dateObj.getDate()).padStart(2, '0');
            return `${days[dateObj.getDay()]} ${day}-${months[dateObj.getMonth()]}`;
        }

        // Offset helper
        function offsetDate(date, days) {
            const copy = new Date(date);
            copy.setDate(copy.getDate() + days);
            return copy;
        }

        // Calculate date ranges
        const observedStart = formatDateMMDD(baseDate);                  // today
        const observedEnd = formatDateMMDD(offsetDate(baseDate, 7));     // today + 7
        const qpf7Start = formatDateMMDD(offsetDate(baseDate, 7));       // today + 7
        const qpf7End = formatDateMMDD(offsetDate(baseDate, 14));        // today + 14
        const qpf16Start = qpf7Start;
        const qpf16End = formatDateDayMonth(offsetDate(baseDate, 15));   // today + 15

        // Build the HTML
        const htmlContent = `
        <style>
            #output16 img {
            width: 100%;
            max-width: 1000px;
            height: auto;
            border: 2px solid #000;
            }
        </style>

        <p><center><strong><font size="+2">
            7-day Observed<br>
            <img src="https://mrcc.purdue.edu/files/cliwatch/GIS_plots/prcp_mpe/prcp_mpe_007_tot-0.png" alt="7-Day Observed Multi-sensor Precipitation"><br>
        </font></strong></center></p>

        <p><center><strong><font size="+2">
            7-day QPF<br>
            <img src="https://www.wpc.ncep.noaa.gov/qpf/p168i.gif?1512662281" alt="7-Day QPF"><br>
        </font></strong></center></p>

        <p><center><strong><font size="+2">
            16-day QPF<br>
            <img src="https://www.weather.gov/images/ohrfc/dynamic/NAEFS16.apcp.mean.total.png" alt="16-Day QPF"><br>
        </font></strong></center></p>
        `;

        document.getElementById('output16').innerHTML = htmlContent;

    } else if (lake === "Rend Lk-Big Muddy" || lake === "Rend Lk") {
        const datetime = '05-17-2025'; // MM-DD-YYYY

        const [month, day, year] = datetime.split('-');
        const baseDate = new Date(`${year}-${month}-${day}T00:00:00`);

        function offsetDate(base, offset) {
            const d = new Date(base);
            d.setDate(d.getDate() + offset);
            return d;
        }

        function formatShortDate(date) {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return `${days[date.getDay()]} ${mm}/${dd}`;
        }

        function formatLongDate(date) {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const dd = String(date.getDate()).padStart(2, '0');
            return `${days[date.getDay()]} ${dd}-${months[date.getMonth()]}`;
        }

        // Dates
        const observedStart = formatShortDate(offsetDate(baseDate, -8));
        const observedEnd = formatShortDate(offsetDate(baseDate, -1));
        const qpf7Start = formatShortDate(offsetDate(baseDate, -1));
        const qpf7End = formatShortDate(offsetDate(baseDate, 6));
        const qpf16Start = formatLongDate(offsetDate(baseDate, -1));
        const qpf16End = formatLongDate(offsetDate(baseDate, 15));

        // HTML
        const html = `
        <style>
            #output16 img {
            max-width: 100%;
            height: auto;
            border: 2px solid black;
            }
        </style>

        <p>
            <strong><font size="+2"><center>
            7-day Observed<b><br>
            <img src="https://mrcc.purdue.edu/files/cliwatch/GIS_plots/prcp_mpe/prcp_mpe_007_tot-0.png" alt="7-Day Observed Multi-sensor Precipitation"><br>
            </font></center></strong>
        </p>

        <p>
            <font size="+2"><center><strong>
            7-day QPF<br>
            <img src="https://www.wpc.ncep.noaa.gov/qpf/p168i.gif?1512662281" alt="7-Day QPF"><br>
            </font></center></strong>
        </p>

        <p>
            <font size="+2"><center><strong>
            16-day QPF<br>
            <img src="https://www.weather.gov/images/ohrfc/dynamic/NAEFS16.apcp.mean.total.png" alt="16-Day QPF"><br>
            </font></center></strong>
        </p>
        `;

        document.getElementById('output16').innerHTML = html;

    }
});   