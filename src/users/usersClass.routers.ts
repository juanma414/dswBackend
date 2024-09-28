import { Router } from "express";
import { controler } from "./usersClass.controler.js";

export const usersClassRouter = Router();

usersClassRouter.get("/", controler.findAll);
usersClassRouter.get("/:id", controler.findOne);
usersClassRouter.post("/", controler.add);
usersClassRouter.put("/:id", controler.update);
usersClassRouter.delete("/:id", controler.deleteUser);
