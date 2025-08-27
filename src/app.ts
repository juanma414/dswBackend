import "reflect-metadata";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { userRouter } from "./users/user.routers.js";
import { orm, syncSchema } from "../shared/db/orm.js";
import { RequestContext } from "@mikro-orm/core";
import { issueRouter } from "./issues/issue.routers.js";
import { projectRouter } from "./projects/project.routers.js";

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

//antes de las rutas y middleware del negocio

app.use("/api/user", userRouter);
app.use("/api/issue", issueRouter);
app.use("/api/project", projectRouter);

app.use((_, res) => {
  return res.status(404).send({ message: "Resource not found" });
});

await syncSchema(); //Nunca ponerlo en produccion

app.listen(3000, () => {
  console.log("Server runnning on http://localhost:3000/");
});
