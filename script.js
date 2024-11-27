// DOM elements
const humidityElem = document.getElementById("humidity");
const temperatureElem = document.getElementById("temperature");
const photosensorElem = document.getElementById("photosensor");


// Chart data
const data = {
    labels: [],
    datasets: [
        {
            label: "Humedad (%)",
            data: [],
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
        },
        {
            label: "Temperatura (°C)",
            data: [],
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: true,
        },
    ],
};

// Initialize Chart.js
const ctx = document.getElementById("sensorChart").getContext("2d");
const sensorChart = new Chart(ctx, {
    type: "line",
    data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Tiempo",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Valores",
                },
            },
        },
    },
});

// Fetch data from the API
async function fetchSensorData() {
    try {
        const response = await fetch("https://fe9d-31-221-234-183.ngrok-free.app/data.json",{
            headers : {
                "ngrok-skip-browser-warning" : "test"
            }
        });
        const sensorData = await response.json();

        // Update current values
        humidityElem.textContent = sensorData.humidity;
        temperatureElem.textContent = sensorData.temperature;
        photosensorElem.textContent = sensorData.photosensor;

        // Update chart
        const currentTime = new Date().toLocaleTimeString();
        data.labels.push(currentTime);
        data.datasets[0].data.push(sensorData.humidity);
        data.datasets[1].data.push(sensorData.temperature);

        // Keep only the last 20 entries
        if (data.labels.length > 20) {
            data.labels.shift();
            data.datasets[0].data.shift();
            data.datasets[1].data.shift();
        }

        sensorChart.update();
    } catch (error) {
        console.error("Error fetching sensor data:", error);
    }
}

// Fetch data every 600 seconds
setInterval(fetchSensorData, 600000);
fetchSensorData();
