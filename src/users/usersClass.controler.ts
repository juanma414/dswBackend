import { Request, Response } from "express";
import { orm } from "../../shared/db/orm.js";
import { UserClass } from "./usersClass.entity.js";

const em = orm.em;

//GET ALL
async function findAll(req: Request, res: Response) {
  try {
    const usersClasses = await em.find(UserClass, {});
    res.status(200).json({ messge: "Found all Users", usersClasses });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//GET ONE
async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const userClass = await em.findOneOrFail(UserClass, { id });
    res.status(200).json({ message: "User found", data: userClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//POST
async function add(req: Request, res: Response) {
  try {
    const userClass = em.create(UserClass, req.body);
    await em.flush(); //Es el commit
    res.status(201).json({ message: "User created", data: userClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//PUT
async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const userClass = em.getReference(UserClass, id);
    //como ya tenemos el registro que queremos modificar, pasamos los datos que ingresaron
    em.assign(userClass, req.body);
    await em.flush();
    res.status(200).json({ message: "User modify", data: userClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//DELETE
async function deleteUser(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const userClass = em.getReference(UserClass, id);
    em.removeAndFlush(userClass);
    res.status(200).json({ message: "User deleted", data: userClass });
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
