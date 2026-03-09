import { Router } from "express";
import { sprintControler } from "./sprint.controler.js";
import { authMiddleware,adminMiddleware } from "../utils/auth.middleware.js";

export const sprintRouter = Router();

//La autorización base para todos los usuarios 
sprintRouter.use(authMiddleware);

sprintRouter.get("/", sprintControler.findAll);
sprintRouter.get("/project/:idProject", sprintControler.findByProject);
sprintRouter.get("/:id", sprintControler.findOne);

//Solo los administradores pueden agregar, actualizar o eliminar sprints, por eso se agrega el adminMiddleware para estas rutas
sprintRouter.post("/", adminMiddleware, sprintControler.add);
sprintRouter.put("/:id", adminMiddleware, sprintControler.update);
sprintRouter.delete("/:id", adminMiddleware, sprintControler.remove);