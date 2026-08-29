const API_BASE_URL = window.APP_CONFIG?.API_BASE_URL || "http://localhost:5000";

// Use the user's current local time instead of a hard-coded 08:00 default.
// The value updates automatically every minute until the user chooses a custom time.
let departureTimeCustomized = false;

function getCurrentLocalTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
}

function initializeCurrentTime() {
    const input = document.getElementById("departureTime");
    const button = document.getElementById("currentTimeBtn");
    if (!input) return;

    input.value = getCurrentLocalTime();

    input.addEventListener("change", () => {
        departureTimeCustomized = true;
    });

    button?.addEventListener("click", () => {
        departureTimeCustomized = false;
        input.value = getCurrentLocalTime();
    });

    setInterval(() => {
        if (!departureTimeCustomized) {
            input.value = getCurrentLocalTime();
        }
    }, 60000);
}

async function loadCities() {

    try {

        const response = await fetch(`${API_BASE_URL}/api/cities`);

        const cities = await response.json();

        const source = document.getElementById("source");
        const destination = document.getElementById("destination");

        source.innerHTML = '<option value="">Select Source City</option>';
        destination.innerHTML = '<option value="">Select Destination City</option>';

        cities.forEach(city => {

            source.innerHTML += `<option value="${city}">${city}</option>`;
            destination.innerHTML += `<option value="${city}">${city}</option>`;

        });

    } catch (err) {

        console.error("Cities Error :", err);

        const source = document.getElementById("source");
        const destination = document.getElementById("destination");

        source.innerHTML = '<option value="">Backend not connected</option>';
        destination.innerHTML = '<option value="">Backend not connected</option>';
        source.disabled = true;
        destination.disabled = true;

        alert("Backend is not running. Start the server on http://localhost:5000 and refresh the page.");
    }

}

async function findRoute() {

    const btn = document.querySelector(".find-btn");

    btn.innerHTML = "Finding Route...";
    btn.disabled = true;

    const source = document.getElementById("source").value;
    const destination = document.getElementById("destination").value;
    const vehicle = document.getElementById("vehicle").value;
    const departureTime = document.getElementById("departureTime").value || "08:00";
    const dayType = document.getElementById("dayType").value;
    const departureHour = Number(departureTime.split(":")[0]);

    if (!source || !destination) {

        alert("Please select source and destination.");

        btn.innerHTML = "Find Best Route";
        btn.disabled = false;

        return;

    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/route?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&vehicle=${encodeURIComponent(vehicle)}&departureHour=${departureHour}&isWeekend=${dayType}`
        );

        const data = await response.json();

        if (!data.path) {

            document.getElementById("result").innerHTML =
                "<h3>No Route Found</h3>";

            btn.innerHTML = "Find Best Route";
            btn.disabled = false;

            return;

        }

        highlightedPath = data.path;
        drawGraph();
        drawRouteOnMap(data.path);

        loadNearbyPlaces(source);

        const alternativeHtml = (data.alternativeRoutes || [])
            .map((route, index) => `
                <div class="alternative-route">
                    <div class="alternative-title">Alternative ${index + 1}</div>
                    <p>🛣️ <b>Route :</b> ${route.path.join(" ➜ ")}</p>
                    <p>📏 <b>Distance :</b> ${route.distance} KM</p>
                    <p>🚦 <b>Traffic :</b> ${route.traffic}</p>
                    <p>⏱️ <b>Time :</b> ${route.estimatedTime}</p>
                </div>
            `)
            .join("");

        const ai = data.aiPrediction || {};
        const [departureHourText, departureMinuteText] = departureTime.split(":").map(Number);
        const forecastDate = new Date();
        forecastDate.setHours(departureHourText || 0, departureMinuteText || 0, 0, 0);
        forecastDate.setMinutes(forecastDate.getMinutes() + Number(ai.forecastOffsetMinutes || 30));
        const forecastTime = forecastDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const aiPredictionHtml = ai.predictedTraffic
            ? `
                <div class="ai-prediction-box">
                    <strong>🤖 AI Traffic Forecast</strong>
                    <p><b>Expected traffic at ${forecastTime}:</b> <span class="traffic-badge ${ai.predictedTraffic.toLowerCase()}">${ai.predictedTraffic}</span></p>
                    <p>🕒 <b>Predicted delay:</b> +${ai.predictedDelayMinutes} Minutes</p>
                    <p>⏱️ <b>Predicted travel time:</b> ${ai.predictedTravelMinutes} Minutes</p>
                    <small>Forecast is 30 minutes after the selected time · Model: ${ai.model} · trained on ${ai.trainingSamples} simulated historical samples</small>
                </div>
            `
            : "";

        const recommendationHtml = data.isAlternativeRecommended
            ? `
                <div class="recommendation-box">
                    <strong>💡 Lower-traffic alternative found</strong>
                    <p>${data.recommendation}</p>
                    <p><b>Shortest-distance route:</b> ${data.shortestRoute.path.join(" ➜ ")} — ${data.shortestRoute.distance} KM, ${data.shortestRoute.traffic} traffic</p>
                    <p><b>Recommended alternative:</b> ${data.recommendedRoute.path.join(" ➜ ")} — ${data.recommendedRoute.distance} KM, ${data.recommendedRoute.traffic} traffic</p>
                </div>
            `
            : `
                <div class="recommendation-box neutral">
                    <strong>✅ No suitable alternative</strong>
                    <p>${data.recommendation}</p>
                </div>
            `;

        document.getElementById("result").innerHTML = `

<div class="result-box">

<h3>🚦 Route Summary</h3>

${recommendationHtml}

${aiPredictionHtml}

<p>📍 <b>Source :</b> ${source}</p>

<p>🎯 <b>Destination :</b> ${destination}</p>

<p>🛣️ <b>Shortest Route :</b><br>${data.path.join(" ➜ ")}</p>

<p>📏 <b>Distance :</b> ${data.distance} KM</p>

<p>🚗 <b>Vehicle :</b> ${vehicle}</p>

<p>
🚦 <b>Traffic :</b>

<span class="traffic-badge ${data.traffic.toLowerCase()}">
${data.traffic}
</span>

</p>

<p>⏱️ <b>Estimated Time :</b> ${data.estimatedTime}</p>

<p>📊 <b>Traffic Score :</b> ${data.trafficScore}/100</p>

<p>⏳ <b>Traffic Delay :</b> +${data.trafficDelay} Minutes</p>

<p>⛽ <b>Fuel Cost :</b> ₹${data.fuelCost}</p>

${alternativeHtml ? `<div class="alternatives-list"><h4>🛣️ Other Available Routes</h4>${alternativeHtml}</div>` : ""}

</div>

`;

        btn.innerHTML = "Find Best Route";
        btn.disabled = false;

        setTimeout(() => {

            document.querySelector(".result-card").scrollIntoView({

                behavior: "smooth",
                block: "start"

            });

        }, 300);

    } catch (err) {

        console.error(err);

        btn.innerHTML = "Find Best Route";
        btn.disabled = false;

        document.getElementById("result").innerHTML =
            "<h3>⚠️ Server Error</h3>";

    }

}

initializeCurrentTime();
loadCities();

async function loadNearbyPlaces(city) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/places?city=${encodeURIComponent(city)}`
        );

        const places = await response.json();

        let html = "<ul>";

        places.forEach(place => {

            html += `<li>${place}</li>`;

        });

        html += "</ul>";

        document.getElementById("nearbyPlaces").innerHTML = html;

    } catch (err) {

        console.error(err);

    }

}