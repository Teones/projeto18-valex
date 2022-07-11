import express, { json } from "express";
// import cors from "cors";
// import "express-async-errors"
// import router from "./routes/index.js";

const app = express();
app.use(json());
// app.use(cors());
// app.use(router);

const PORT: number = +process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`the server is open on the port: ${PORT}`);
});