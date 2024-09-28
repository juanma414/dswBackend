import { Router } from "express";
import { controler } from "./users.controler.js";

export const userRouter = Router();

userRouter.get("/", controler.findAll);
userRouter.get("/:id", controler.findOne);
//userRouter.post("/", controler.sanitizaUserInput, controler.add);
//userRouter.put("/:id", controler.sanitizaUserInput, controler.update);
//userRouter.patch("/:id", controler.sanitizaUserInput, controler.update);
userRouter.delete("/:id", controler.deleteUser);

