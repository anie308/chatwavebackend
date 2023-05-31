const express = require("express");
require("dotenv").config();
require("./db");
const morgan = require("morgan");
const port = process.env.PORT || 3300;
const userRoutes = require('./routes/userRoutes');

const cors = require("cors");


const app = express();
app.use(cors());
const apiSeedUrl = '/api/v1';
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));


app.use(`${apiSeedUrl}/user`, userRoutes);


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  }); 