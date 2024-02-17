import Express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import UserRouter from "./Routes/User.routes.js";
import authRoute from "./Routes/Auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import ListingRouter from "./Routes/Listing.route.js";

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = Express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const __dirname = path.resolve();
// app.use(Express.static(path.join(__dirname, "/client/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
// });
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());
app.use(cookieParser());

app.listen(5001, () => {
  console.log("server running on port 5001  ");
});
app.get("/", (req, res) => {
  return res.json({ message: "hello" });
});
app.use("/User", UserRouter);
app.use("/Auth", authRoute);
app.use("/List", ListingRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    status: false,
    statusCode,
    message,
  });
});
