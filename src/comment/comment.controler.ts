import { Request, Response } from "express";
import { orm } from "../../shared/db/orm.js";
import { comment } from "./comment.entity.js";
import { issue } from "../issues/issue.entity.js";

const em = orm.em;

// GET ALL
async function findAll(req: Request, res: Response) {
  try {
    const comments = await em.find(comment, {}, { populate: ['issue', 'user'] });
    res.status(200).json({ message: "Se encontraron todos los comentarios", data: comments });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// GET ALL BY ISSUE
async function findByIssue(req: Request, res: Response) {
  try {
    const idIssue = Number.parseInt(req.params.idIssue);
    const comments = await em.find(comment, { issue: idIssue as any }, { populate: ['user'] });
    res.status(200).json({ message: "Comentarios del issue encontrados", data: comments });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// GET ONE
async function findOne(req: Request, res: Response) {
  try {
    const idComment = Number.parseInt(req.params.id);
    const commentFound = await em.findOneOrFail(comment, { idComment }, { populate: ['issue', 'user'] });
    res.status(200).json({ message: "Comentario encontrado", data: commentFound });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// POST
async function add(req: Request, res: Response) {
  try {
    const newComment = em.create(comment, {
      ...req.body,
      createDate: new Date(),
    });
    await em.flush();
    res.status(201).json({ message: "Comentario creado", data: newComment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// PUT
async function update(req: Request, res: Response) {
  try {
    const idComment = Number.parseInt(req.params.id);
    const commentFound = em.getReference(comment, { idComment } as any);
    em.assign(commentFound, req.body);
    await em.flush();
    res.status(200).json({ message: "Comentario modificado", data: commentFound });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// DELETE
async function remove(req: Request, res: Response) {
  try {
    const idComment = Number.parseInt(req.params.id);
    const commentFound = await em.findOneOrFail(comment, { idComment });
    await em.removeAndFlush(commentFound);
    res.status(200).json({ message: "Comentario eliminado" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const commentControler = { findAll, findByIssue, findOne, add, update, remove };