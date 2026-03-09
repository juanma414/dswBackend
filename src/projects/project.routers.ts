import { Router } from "express";
import { controler } from "./project.controler.js";
import { authMiddleware, adminMiddleware } from "../utils/auth.middleware.js";

export const projectRouter = Router();

//La autorización base para todos los usuarios 
projectRouter.use(authMiddleware);

projectRouter.get("/", controler.findAll);
projectRouter.get("/:id", controler.findOne);

//Solo los administradores pueden agregar, actualizar o eliminar proyectos, por eso se agrega el adminMiddleware para estas rutas
projectRouter.post("/", adminMiddleware, controler.add);
projectRouter.put("/:id", adminMiddleware, controler.update);
projectRouter.delete("/:id", adminMiddleware, controler.deleteProject);