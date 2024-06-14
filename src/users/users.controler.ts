import { NextFunction, Request, Response } from "express";
import { UserRepository } from "./users.repository.js";
import { User } from "./users.entity.js";

const repository = new UserRepository();

function sanitizaUserInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizaInput = {
    name: req.body.name,
    lastName: req.body.lastName,
    rol: req.body.rol,
    email: req.body.email,
    id: req.body.id,
  };

  //En este lugar se hacen el resto de las validaciones como el tipo, datos maliciosos, no hacer operaciones extrañas,etc.
  //Si no ponemos next, se queda esperando la respuesta o la resolución a la Request
  next();
}

//GET ALL
function findAll(req: Request, res: Response) {
  res.json({ data: repository.findAll() });
}

//GET ONE
function findOne(req: Request, res: Response) {
  const user = repository.findOne({ id: req.params.id });

  if (!user) {
    return res.status(404).send({ message: "User no encontrado" });
  }

  res.json(user);
}

//POST
function add(req: Request, res: Response) {
  const input = req.body.sanitizaInput;

  const userInput = new User(
    input.name,
    input.lastName,
    input.rol,
    input.email,
    input.id
  );

  const user = repository.add(userInput);
  res.status(201).send({ message: "User creado correctamnte", data: user });
}




//PUT and PATCH
function update(req: Request, res: Response) {
  req.body.sanitizaInput.id = req.params.id;

  const user = repository.update(req.body.sanitizaInput);

  if (!user) {
    return res.status(404).send({ message: "User no encontrado" });
  }

  return res
    .status(200)
    .send({ message: "Modificaciones realizadas", data: user });
}

//DELETE
function deleteUser(req: Request, res: Response) {
  const user = repository.delete({ id: req.params.id });

  if (!user) {
    return res.status(404).send({ message: "User no encontrado" });
  }

  return res.status(200).send({ message: "Usuario borrado correctamente" });
}

export const controler = {
  sanitizaUserInput,
  findAll,
  findOne,
  add,
  update,
  deleteUser,
};
