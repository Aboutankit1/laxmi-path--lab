const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Server] Laxmi Path Lab API running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
});

process.on("unhandledRejection", (err) => {
  console.error(`[UnhandledRejection] ${err.message}`);
});
