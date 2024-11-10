import { Router } from "express";
import { controler } from "./issue.controler.js";

export const issueRouter = Router();

issueRouter.get("/", controler.findAll);
issueRouter.get("/:id", controler.findOne);
issueRouter.post("/", controler.add);
issueRouter.put("/:id", controler.update);
issueRouter.delete("/:id", controler.deleteUser);