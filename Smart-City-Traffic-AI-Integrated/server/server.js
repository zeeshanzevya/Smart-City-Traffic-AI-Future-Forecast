
const placeRoute = require("./routes/place");
const express = require("express");
const cors = require("cors");

const route = require("./routes/route");
const cityRoute = require("./routes/city");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", route);
app.use("/api", cityRoute);

app.use("/api", placeRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
    res.send("🚦 Smart Traffic Route Optimizer backend is running successfully!");
});

