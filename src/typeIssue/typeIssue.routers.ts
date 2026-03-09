import { Router } from "express";
import { typeIssueControler } from "./typeIssue.controler.js";
import { authMiddleware, adminMiddleware} from "../utils/auth.middleware.js";

export const typeIssueRouter = Router();

//La autorización base para todos los users, luego se agrega el adminMiddleware para las rutas que lo requieran
typeIssueRouter.use(authMiddleware);

typeIssueRouter.get("/", typeIssueControler.findAll);
typeIssueRouter.get("/:id", typeIssueControler.findOne);

typeIssueRouter.post("/", adminMiddleware, typeIssueControler.add);
typeIssueRouter.put("/:id", adminMiddleware, typeIssueControler.update);
typeIssueRouter.delete("/:id", adminMiddleware , typeIssueControler.remove);