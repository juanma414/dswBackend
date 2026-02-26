import { Router } from "express";
import { typeIssueControler } from "./typeIssue.controler.js";

export const typeIssueRouter = Router();

typeIssueRouter.get("/", typeIssueControler.findAll);
typeIssueRouter.get("/:id", typeIssueControler.findOne);
typeIssueRouter.post("/", typeIssueControler.add);
typeIssueRouter.put("/:id", typeIssueControler.update);
typeIssueRouter.delete("/:id", typeIssueControler.remove);