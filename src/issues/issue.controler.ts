import { Request, Response } from "express";
import { orm } from "../../shared/db/orm.js";
import { issue } from "./issue.entity.js";

const em = orm.em;

//GET ALL
async function findAll(req: Request, res: Response) {
  try {
    const issueClass = await em.find(issue, {});
    res.status(200).json({ messge: "Se encontraron todos los Issues", issueClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//POST
async function add(req: Request, res: Response) {
  try {
    const issueClass = em.create(issue, req.body);
    await em.flush(); //Es el commit
    res.status(201).json({ message: "Issue creado", data: issueClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//GET ONE
async function findOne(req: Request, res: Response) {
  try {
    const issueId = Number.parseInt(req.params.id);
    const issueClass = await em.findOneOrFail(issue, { issueId });
    res.status(200).json({ message: "Issue encontrado", data: issueClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//PUT
async function update(req: Request, res: Response) {
  try {
    const issueId = Number.parseInt(req.params.id);
    const issueClass = em.getReference(issue, { issueId });
    //como ya tenemos el registro que queremos modificar, pasamos los datos que ingresaron
    em.assign(issueClass, req.body);
    await em.flush();
    res.status(200).json({ message: "Issue modificado", data: issueClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//DELETE
async function deleteUser(req: Request, res: Response) {
  try {
    const issueId = Number.parseInt(req.params.id);
    const issueClass = em.getReference(issue, { issueId });
    em.removeAndFlush(issueClass);
    res.status(200).json({ message: "Issue borrado", data: issueClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const controler = {
  findAll,
  findOne,
  add,
  update,
  deleteUser,
};
