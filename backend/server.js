const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const mongoose = require("mongoose");

require("dotenv").config();

// routes
const announcementRoutes = require("./routes/announcement");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const tagRoutes = require("./routes/tag");
const formRoutes = require("./routes/form");
const openApiJson = require("./routes/openapi.json");

// app
const app = express();

// database
mongoose
  .connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => {
    console.log(err);
  });

// cors
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// middleware
app.use(cookieParser());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "10mb" }));

// routes middleware
app.use("/api", announcementRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", tagRoutes);
app.use("/api", formRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiJson));

// port
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
