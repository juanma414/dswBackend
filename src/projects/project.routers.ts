import { Router } from "express";
import { controler } from "./project.controler.js";

export const projectRouter = Router();

projectRouter.get("/", controler.findAll);
projectRouter.get("/:id", controler.findOne);
projectRouter.post("/", controler.add);
projectRouter.put("/:id", controler.update);
projectRouter.delete("/:id", controler.deleteUser);