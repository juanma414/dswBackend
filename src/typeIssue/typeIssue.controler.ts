import { Request, Response } from "express";
import { orm } from "../../shared/db/orm.js";
import { typeIssue } from "./typeIssue.entity.js";

const em = orm.em;

// GET ALL
async function findAll(req: Request, res: Response) {
  try {
    const types = await em.find( typeIssue, {});
    res.status(200).json({ message: "Se encontraron todos los tipos de issue", data: types });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// GET ONE
async function findOne(req: Request, res: Response) {
  try {
    const idTypeIssue = Number.parseInt(req.params.id);
    const type = await em.findOneOrFail(typeIssue, { typeIssueId: idTypeIssue });
    res.status(200).json({ message: "Tipo de issue encontrado", data: type });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// POST
async function add(req: Request, res: Response) {
  try {
    const type = em.create(typeIssue, req.body);
    await em.flush();
    res.status(201).json({ message: "Tipo de issue creado", data: type });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// PUT
async function update(req: Request, res: Response) {
  try {
    const idTypeIssue = Number.parseInt(req.params.id);
    const type = em.getReference(typeIssue, { idTypeIssue } as any);
    em.assign(type, req.body);
    await em.flush();
    res.status(200).json({ message: "Tipo de issue modificado", data: type });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// DELETE
async function remove(req: Request, res: Response) {
  try {
    const idTypeIssue = Number.parseInt(req.params.id);
    const type = await em.findOneOrFail(typeIssue, { typeIssueId: idTypeIssue });
    await em.removeAndFlush(type);
    res.status(200).json({ message: "Tipo de issue eliminado" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const typeIssueControler = { findAll, findOne, add, update, remove };