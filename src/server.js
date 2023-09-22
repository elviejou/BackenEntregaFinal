import __dirname from "./dirname.js";
import config from "./config/config.js";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoStore from "connect-mongo";
import cluster from "cluster";
import os from "os";
import logger from "./utils/logger.js";
import router from "./routes/index.js";
import DBFactory from "./models/db/DBFactory.js";
import passport from "./services/passport.service.js";
import { Server as IOServer } from "socket.io";
import { wsChatController } from "./controllers/messages.controller.js";
import cors from "cors";
import mongoose from "mongoose";

mongoose.set('strictQuery', true); // Configuración para Mongoose

const app = express();
app.use(cors());

const isCluster = config.MODO == "CLUSTER";
const numCpus = os.cpus().length;

if (isCluster && cluster.isPrimary) {
    for (let index = 0; index < numCpus; index++) {
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        cluster.fork();
    })

} else {

    // Use async/await to connect to MongoDB
    async function connectToDatabase() {
        try {
            await mongoose.connect(config.URLMongo, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
              });
            logger.info("Connected to MongoDB");
        } catch (error) {
            logger.error("Error connecting to MongoDB:", error);
        }
    }

    connectToDatabase();

    app.use(cookieParser());

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(express.static(`${__dirname}/public`));

    // EJS
    app.set("views", __dirname + "/views");
    app.set("view engine", ".ejs");

    // SESSIONS
    const mongoOptions = {};
    const sessionMiddleware = session({
        store: mongoStore.create({ mongoUrl: config.URLMongo, mongoOptions }),
        secret: "coderhouse",
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: {
            maxAge: Number(config.SESSION_TIME),
        },
    });
    app.use(sessionMiddleware);

    // INITIALIZ PASSPORT
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(router);

    const server = app.listen(config.PORT, () => logger.info(`SERVER LISTENING ON PORT: ${config.PORT}`));
    server.on("error", (err) => logger.error(`SOMETHING GOES WRONG!!: ${err}`));

    // WEBSOCKETS
    const io = new IOServer(server);

    // PASSPORT MIDDLEWARE
    const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
    io.use(wrap(sessionMiddleware));
    io.use(wrap(passport.initialize()));
    io.use(wrap(passport.session()));

    io.on("connection", wsChatController);
}
