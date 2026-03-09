import { Router } from "express";
import { controler } from "./issue.controler.js";
import { authMiddleware } from "../utils/auth.middleware.js";

export const issueRouter = Router();

//La autorización base para todos los usuarios 
issueRouter.use(authMiddleware);

issueRouter.get("/", controler.findAll);
//issueRouter.get("/seed", controler.seedData);
issueRouter.get("/deleted", controler.getDeleted);
issueRouter.get("/completed", controler.getCompleted);
issueRouter.get("/:id", controler.findOne);
issueRouter.post("/", controler.add);
issueRouter.put("/:id", controler.update);
issueRouter.patch("/:id/status", controler.updateStatus);
issueRouter.patch("/:id/complete", controler.completeIssue);
issueRouter.delete("/:id", controler.deleteIssue);