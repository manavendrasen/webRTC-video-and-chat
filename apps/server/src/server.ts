import path from "path";
import express from "express";
import dotenv from "dotenv";
// import { BASE_ROUTE } from "../constants/routes";

dotenv.config({ path: path.join(__dirname, "config", "config.env") });

const HOST = "LOCALHOST";
const PORT = 5000;

// app
const app = express();

// Body parser
app.use(express.json());

// Express body parser
app.use(express.urlencoded({ extended: true }));

// // Test
// app.get(`${BASE_ROUTE}`, (req, res, next) => {
//   res.status(200).json({
//     success: true,
//     message: "Welcome to the API V1",
//   });
// });

app.listen(PORT, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});
