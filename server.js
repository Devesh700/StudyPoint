const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const Db = require("./src/config/DB");
const userRouter = require("./src/routes/userRouter");
const articleRouter = require("./src/routes/articleRouter");
const SkillTitleRouter = require("./src/routes/skillTitleRouter");
const subTitleRouter = require("./src/routes/subTitleRouter");
const topicRouter = require("./src/routes/topicRouter");
const { getLogs, createLogs } = require("./src/controllers/logController");
const cluster = require("cluster");
const os = require("os");
const process = require("process");
const verifyUser = require("./src/middleware/isLoggedin");
require("dotenv").config();

const PORT = process.env.PORT || 4000;
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary process ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Restart workers that exit unexpectedly
    cluster.on("exit", (worker, code, signal) => {
        if (code !== 0 && !worker.exitedAfterDisconnect) {
            console.log(`Worker ${worker.process.pid} exited with code ${code} (${signal}). Restarting...`);
            cluster.fork();
        }
    });

    // Graceful shutdown of primary process
    process.on("SIGTERM", () => {
        console.log("Primary process received SIGTERM. Shutting down workers...");
        for (const id in cluster.workers) {
            cluster.workers[id].send("shutdown");
            setTimeout(() => {
                cluster.workers[id].kill("SIGKILL");
            }, 5000);
        }
    });

} else {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));

    app.use(cors({
        origin: process.env.ALLOWED_ORIGINS || "*",
        credentials: true
    }));

    app.use((req, res, next) => {
        createLogs(req, res, next);
    });

    // Database connection
    (async () => {
        try {
            await Db();
            console.log("Database connected successfully");

            app.use("/api/v1/article", articleRouter);
            app.use("/api/v1/users", userRouter);
            app.use("/api/v1/skilltitle", SkillTitleRouter);
            app.use("/api/v1/subtitle", subTitleRouter);
            app.use("/api/v1/topics", topicRouter);
            app.get("/api/v1/logs", verifyUser, getLogs);

            // Error handling middleware
            app.use((err, req, res, next) => {
                console.error(err.stack);
                res.status(500).send({message:err.message, stack: err.stack.split("\n") });
            });

            const server = app.listen(PORT, () => {
                console.log(`Worker ${process.pid} started on PORT: ${PORT}`);
            });

            // Graceful shutdown of worker
            process.on("message", (message) => {
                if (message === "shutdown") {
                    console.log(`Worker ${process.pid} is shutting down...`);
                    server.close(() => {
                        console.log(`Worker ${process.pid} stopped`);
                        process.exit(0);
                    });
                }
            });

            // Handle unexpected errors
            process.on("uncaughtException", (err) => {
                console.error(`Worker ${process.pid} uncaught exception: ${err.message}`);
                process.exit(1);
            });

            process.on("unhandledRejection", (reason, promise) => {
                console.error(`Worker ${process.pid} unhandled rejection:`, promise, `reason: ${reason}`);
                process.exit(1);
            });

        } catch (error) {
            console.error("Failed to connect to the database", error);
            process.exit(1);
        }
    })();
}
