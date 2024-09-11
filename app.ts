import express from 'express';
import logger from "morgan";
import compress from 'compression';
require('log-timestamp');
import connectDB from './app/config/dbConnection'

//main routes
import routes from './app/src/routes/main.route'
import { get } from './app/config/config';
import path from 'node:path';

const config = get(process.env.NODE_ENV);

const PORT = config.SERVER_PORT || 3001;

// console.log("Hello world");

const app = express()

app.use(express.json());
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, '/public')));
console.log(path.join(__dirname, '../public'));


app.use(logger('dev'));
if (config.NODE_ENV === 'development') {
    app.use(logger('development'));
} else if (config.NODE_ENV === 'production') {
    app.use(compress({ threshold: 2 }));
}

app.use('/api', routes);

connectDB()

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.listen(PORT, () => {
    console.log(`server is running on : ${PORT}`);
})