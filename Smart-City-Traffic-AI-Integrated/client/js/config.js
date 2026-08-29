const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

// For local development, the API runs on localhost.
// Before deploying the frontend, replace the production URL with your own
// Render/Railway/etc. backend URL.
window.APP_CONFIG = {
    API_BASE_URL: isLocalhost
        ? "http://localhost:5000"
        : "https://YOUR-OWN-BACKEND-URL.onrender.com"
};
