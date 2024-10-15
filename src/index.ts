import express from 'express';
import http from 'http';
import bodyparser from 'body-parser';
import cookieparser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';

const app = express();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieparser());
app.use(bodyparser.json());

const server = http.createServer(app);

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

const MONGO_URL = 'mongodb://localhost:27017/samay-db'

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error) => console.log(error));

app.use('/', router());