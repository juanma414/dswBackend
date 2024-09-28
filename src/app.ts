import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import { userRouter } from "./users/users.route.js";
import { orm, syncSchema } from "../shared/db/orm.js";
import { RequestContext } from "@mikro-orm/core";
import { usersClassRouter } from "./users/usersClass.routers.js";

const app = express();
app.use(express.json());

//luego de los middlewares base
app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});
//antes de las rutas y middleware del negocio

//app.use("/api/user", userRouter);
app.use("/api/users/Classes", usersClassRouter);

app.use((_, res) => {
  return res.status(404).send({ message: "Resource not found" });
});

await syncSchema();//Nunca ponerlo en produccion

app.listen(3000, () => {
  console.log("Server runnning on http://localhost:3000/");
});