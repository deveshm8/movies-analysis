const express = require("express");
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const apiIndex = require("./api/index");
app.use("/movies-info", apiIndex);
    // pool.query('SELECT * FROM movies limit 1', (error, results) => {
    //   if (error) {
    //     console.error('Error executing query', error);
    //     //res.status(500).json({ error: 'Internal Server Error' });
    //   } else {
    //     //res.json(results.rows);
    //    console.log("?????????????", results)
    //   }
    // });
app.listen(process.env.PORT, function(){
    console.log(`Server is listening on port ${process.env.PORT}`);
});

