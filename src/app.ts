import express, { NextFunction, Request, Response } from "express";
import { userRouter } from "./users/users.route.js";

const app = express();
app.use(express.json());

app.use("/api/user", userRouter);

app.use((_, res) => {
  return res.status(404).send({ message: "Resource not found" });
});

app.listen(3000, () => {
  console.log("Server runnning on http://localhost:3000/");
});

/* import express, { NextFunction, Request, Response } from 'express';
import { User } from "./users/users.entity.js"; //Por ahora se queda asi, despues se cambia por la DB

const app = express();

//Definimos el middleware para poder realizar los Post, Put y Patch
app.use(express.json()); //--> Solo funciona con Json, con otro tipo no anda

const users = [
  new User(
    "Pepe No",
    "Grillo Cambio 2",
    ["Programador", "PM", "Tester"],
    "pepe_grillo@test.com",
    "000123"
  ),
];

//El tipo de Request, Response son de express, lo visualizamos en el import del principio tambien
//Funciona como un middleware
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

//Con el user.http podemos llamar a la URI directamente dentro del VS
app.get("/api/users", (req, res) => {
  res.json(users);
});

app.get("/api/user/:id", (req, res) => {
  const user = users.find((user) => user.id === req.params.id);

  if (!user) {
    //Seteamos el valor que devuelve de status y mandamos mensaje de error
    return res.status(404).send({ message: "User no encontrado" });
  }

  res.json(user);
});

//User --> request --> express ~~> middleware que forma req.body --> app.post(req.body) -->response -->  User
//El middleware lo podemos poner en la ruta despues del path como "middleware" o en general al principio.
app.post("/api/user", sanitizaUserInput, (req, res) => {
  
  
  
  const input = req.body.sanitizaInput;

  //Con la info obtenida creamos el nuevo User
  const user = new User(
    input.name,
    input.lastName,
    input.rol,
    input.email,
    input.id
  );
  users.push(user);
  res.status(201).send({ message: "User creado correctamnte", data: user });
});

app.put("/api/user/:id", sanitizaUserInput, (req, res) => {
  //Encontrar la
  const userId = users.findIndex((user) => user.id === req.params.id);

  if (userId === -1) {
    //Seteamos el valor que devuelve de status y mandamos mensaje de error
    return res.status(404).send({ message: "User no encontrado" });
  }

  users[userId] = { ...users[userId], ...req.body.sanitizaInput };

  res.status(200).send({ message: "Modificaciones realizadas", data: users[userId] });
});

app.delete("/api/user/:id", (req, res) => {
  const userIdx = users.findIndex((user) => user.id === req.params.id);

  //El manejo de los status son diferentes según si es que no esta en DB o es porque otro User lo borro
  if (userIdx === -1) {
    return res.status(404).send({ message: "User no encontrado" });
  }

  users.splice(userIdx, 1);
  res
    .status(200)
    .send({ message: "Usuario borrado correctamente", data: users[userIdx] });
});

//Mensaje que se emite en caso de que la URI que se llama no exista y no llame a ningún método de los anteriores
//Se hace asi, porque sino devuelve un HTML y no una respuesta de API 
app.use((_, res) => {
  return res.status(404).send({ message: "Ruta no encontrada" });
});

//Sabemos si esta corriendo el Servidor que estamos usando
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/");
}); */
