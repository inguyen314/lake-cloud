document.addEventListener('DOMContentLoaded', async function () {
    console.log("lake: ", lake);
    console.log('datetime: ', datetime);

    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.wpc.ncep.noaa.gov/qpf/24hrqpfall.html';
    iframe.width = '100%';
    iframe.height = '3800'; // You can adjust height as needed
    iframe.style.border = 'none';

    document.getElementById('output18').appendChild(iframe);
});