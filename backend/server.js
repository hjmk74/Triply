const express = require("express");
const cors = require("cors");
require("dotenv").config();

const countryRoutes = require("./routes/countries");
const destinationRoutes = require("./routes/destinations");
const hotelRoutes = require("./routes/hotels");
const activityRoutes = require("./routes/activities");

const app = express();

const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: CORS_ORIGIN,
  }),
);

app.use(express.json());

app.set("json spaces", 2);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Triply API is running",
  });
});

app.use("/api/countries", countryRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/activities", activityRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
