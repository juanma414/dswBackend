import "reflect-metadata";
import "dotenv/config";
import cors from "cors";
import { RequestContext } from "@mikro-orm/core";
import express, { NextFunction, Request, Response } from "express";
import { userRouter } from "./users/user.routers.js";
import { orm, syncSchema } from "../shared/db/orm.js";
import { issueRouter } from "./issues/issue.routers.js";
import { projectRouter } from "./projects/project.routers.js";
import { typeIssueRouter } from "./typeIssue/typeIssue.routers.js";
import { commentRouter } from "./comment/comment.routers.js";
import { sprintRouter } from "./sprint/sprint.routers.js";

process.on("unhandledRejection", (reason) => {
  console.error("[Startup] unhandled rejection", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[Startup] uncaught exception", error);
  process.exit(1);
});

const app = express();

const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

//luego de los middlewares base
app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

app.use("/api/user", userRouter);
app.use("/api/typeIssue", typeIssueRouter);
app.use("/api/sprint", sprintRouter);
app.use("/api/project", projectRouter);
app.use("/api/issue", issueRouter);
app.use("/api/comment", commentRouter);

app.use((_, res) => {
  return res.status(404).send({ message: "Resource not found" });
});

//Nunca ponerlo en produccion
if (process.env.NODE_ENV !== "production") {
  await syncSchema();
}
//Modificamos para que el puerto se asigne dinámicamente
//app.listen(3000, () => {
  //console.log("Server runnning on http://localhost:3000/");
//});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
