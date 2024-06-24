require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const routes = require("./routes");
const db = require("./config/db");
const errorMiddleHandle = require("./middlewares/errorMiddleware");

// Connect to DB
db.connect();

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));
app.use(errorMiddleHandle);
routes(app);

const PORT = 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
