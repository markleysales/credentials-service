"use strict";

import express from "express";
import credentialsApp from "./routes/credentials.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", credentialsApp);

app.listen(3000);
