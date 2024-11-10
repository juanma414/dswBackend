import { Router } from "express";
import { controler } from "./user.controler.js";

export const userRouter = Router();

userRouter.get("/", controler.findAll);
userRouter.get("/:id", controler.findOne);
userRouter.post("/", controler.add);
userRouter.put("/:id", controler.update);
userRouter.delete("/:id", controler.deleteUser);