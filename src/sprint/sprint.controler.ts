import { Request, Response } from "express";
import { orm } from "../../shared/db/orm.js";
import { sprint } from "./sprint.entity.js";

const em = orm.em;

// GET ALL
async function findAll(req: Request, res: Response) {
  try {
    const sprints = await em.find(sprint, {}, { populate: ['project'] });
    res.status(200).json({ message: "Se encontraron todos los sprints", data: sprints });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// GET ALL BY PROJECT
async function findByProject(req: Request, res: Response) {
  try {
    const idProject = Number.parseInt(req.params.idProject);
    const sprints = await em.find(sprint, { project: idProject as any }, { populate: ['issues'] });
    res.status(200).json({ message: "Sprints del proyecto encontrados", data: sprints });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// GET ONE
async function findOne(req: Request, res: Response) {
  try {
    const idSprint = Number.parseInt(req.params.id);
    const sprintFound = await em.findOneOrFail(sprint, { idSprint }, { populate: ['project', 'issues'] });
    res.status(200).json({ message: "Sprint encontrado", data: sprintFound });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// POST
async function add(req: Request, res: Response) {
  try {
    const sprintNew = em.create(sprint, req.body);
    await em.flush();
    res.status(201).json({ message: "Sprint creado", data: sprintNew });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// PUT
async function update(req: Request, res: Response) {
  try {
    const idSprint = Number.parseInt(req.params.id);
    const sprintFound = em.getReference(sprint, { idSprint } as any);
    em.assign(sprintFound, req.body);
    await em.flush();
    res.status(200).json({ message: "Sprint modificado", data: sprintFound });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// DELETE
async function remove(req: Request, res: Response) {
  try {
    const idSprint = Number.parseInt(req.params.id);
    const sprintFound = await em.findOneOrFail(sprint, { idSprint });
    await em.removeAndFlush(sprintFound);
    res.status(200).json({ message: "Sprint eliminado" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const sprintControler = { findAll, findByProject, findOne, add, update, remove };