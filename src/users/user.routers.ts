import { Router } from "express";
import { controler } from "./user.controler.js";
import { authMiddleware, adminMiddleware} from "../utils/auth.middleware.js";

export const userRouter = Router();

userRouter.post("/login", controler.login);

//La autorización base para todos los usuarios 
userRouter.use(authMiddleware);

userRouter.get("/", controler.findAll);
userRouter.get("/:id", controler.findOne);
//userRouter.post("/seed", controler.seedUsers);

//Solo los administradores pueden agregar, actualizar o eliminar usuarios, por eso se agrega el adminMiddleware para estas rutas
userRouter.post("/", adminMiddleware, controler.add);
userRouter.put("/:id", adminMiddleware, controler.update);
userRouter.delete("/:id", adminMiddleware, controler.deleteUser);