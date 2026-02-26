import { Router } from "express";
import { sprintControler } from "./sprint.controler.js";

export const sprintRouter = Router();

sprintRouter.get("/", sprintControler.findAll);
sprintRouter.get("/project/:idProject", sprintControler.findByProject);
sprintRouter.get("/:id", sprintControler.findOne);
sprintRouter.post("/", sprintControler.add);
sprintRouter.put("/:id", sprintControler.update);
sprintRouter.delete("/:id", sprintControler.remove);