import { Router } from "express";
import { commentControler } from "./comment.controler.js";

export const commentRouter = Router();

commentRouter.get("/", commentControler.findAll);
commentRouter.get("/issue/:idIssue", commentControler.findByIssue);
commentRouter.get("/:id", commentControler.findOne);
commentRouter.post("/", commentControler.add);
commentRouter.put("/:id", commentControler.update);
commentRouter.delete("/:id", commentControler.remove);