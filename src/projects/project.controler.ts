import { Request, Response } from "express";
import { orm } from "../../shared/db/orm.js";
import { project } from "./project.entity.js";

const em = orm.em;

//GET ALL
async function findAll(req: Request, res: Response) {
  try {
    const projectClass = await em.find(project, {}, { populate: ['user'] });
    res.status(200).json({ messge: "Proyectos encontrados", projectClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//POST
async function add(req: Request, res: Response) {
  try {
    const projectClass = em.create(project, req.body);
    await em.flush(); //Es el commit
    res.status(201).json({ message: "Proyecto creado", data: projectClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//GET ONE
async function findOne(req: Request, res: Response) {
  try {
    const projectId = Number.parseInt(req.params.id);
    const projectClass = await em.findOneOrFail(project, { projectId }, { populate: ['user'] });
    res.status(200).json({ message: "Proyecto encontrado", data: projectClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//PUT
async function update(req: Request, res: Response) {
  try {
    const projectId = Number.parseInt(req.params.id);
    const projectClass = em.getReference(project, { projectId });
    //como ya tenemos el registro que queremos modificar, pasamos los datos que ingresaron
    em.assign(projectClass, req.body);
    await em.flush();
    res.status(200).json({ message: "Proeycto modificado", data: projectClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//DELETE
async function deleteUser(req: Request, res: Response) {
  try {
    const projectId = Number.parseInt(req.params.id);
    const projectClass = em.getReference(project, { projectId });
    em.removeAndFlush(projectClass);
    res.status(200).json({ message: "Proyecto borrado", data: projectClass });
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
