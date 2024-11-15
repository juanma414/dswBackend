import { Request, Response } from "express";
import { orm } from "../../shared/db/orm.js";
import { user } from "./user.entity.js";

const em = orm.em;

//GET ALL
async function findAll(req: Request, res: Response) {
  try {
    const usersClasses = await em.find(user, {});
    res.status(200).json({ messge: "Todos los usuarios encontrados", usersClasses });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//POST
async function add(req: Request, res: Response) {
  try {
    const userClass = em.create(user, req.body);
    await em.flush(); //Es el commit
    res.status(201).json({ message: "Usuario creado", data: userClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//GET ONE
async function findOne(req: Request, res: Response) {
  try {
    const userId = Number.parseInt(req.params.id);
    const userClass = await em.findOneOrFail(user, { userId });
    res.status(200).json({ message: "Usuario encontrado", data: userClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//PUT
async function update(req: Request, res: Response) {
  try {
    const userId = Number.parseInt(req.params.id);
    const userClass = em.getReference(user, { userId });
    //como ya tenemos el registro que queremos modificar, pasamos los datos que ingresaron
    em.assign(userClass, req.body);
    await em.flush();
    res.status(200).json({ message: "Usuario modificado", data: userClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//DELETE
async function deleteUser(req: Request, res: Response) {
  try {
    const userId = Number.parseInt(req.params.id);
    const userClass = em.getReference(user, { userId });
    em.removeAndFlush(userClass);
    res.status(200).json({ message: "Usuario borrado", data: userClass });
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
