import express from "express";
import { User } from "./user.js"; //Por ahora se queda asi, despues se cambia por la DB
const app = express();
//Definimos el middleware para poder realizar los Post, Put y Patch
app.use(express.json()); //--> Solo funciona con Json, con otro tipo no anda
const users = [
    new User("Pepe No", "Grillo Cambio 2", ["Programador", "PM", "Tester"], "pepe_grillo@test.com", "000123"),
];
//Con el user.http podemos llamar a la URI directamente dentro del VS
app.get("/api/users", (req, res) => {
    res.json(users);
});
app.get("/api/user/:id", (req, res) => {
    const user = users.find((user) => user.id === req.params.id);
    if (!user) {
        //Seteamos el valor que devuelve de status y mandamos mensaje de error
        res.status(404).send({ message: "User no encontrado" });
    }
    res.json(user);
});
//User --> request --> express ~~> middleware que forma req.body --> app.post(req.body) -->response -->  User
//El middleware lo podemos poner en la ruta despues del path como "middleware" o en general al principio.
app.post("api/user", (req, res) => {
    const { name, lastName, rol, email, id } = req.body;
    //Con la info obtenida creamos el nuevo User
    const user = new User(name, lastName, rol, email, id);
    users.push(user);
    res.status(201).send({ message: "User creado correctamnte", data: user });
});
app.put("/api/user/:id", (req, res) => {
    //Encontrar la
    const userId = users.findIndex((user) => user.id === req.params.id);
    if (userId === -1) {
        //Seteamos el valor que devuelve de status y mandamos mensaje de error
        res.status(404).send({ message: "User no encontrado" });
    }
    const input = {
        name: req.body.name,
        lastName: req.body.lastName,
        rol: req.body.rol,
        email: req.body.email,
        id: req.body.id,
    };
    users[userId] = { ...users[userId], ...input };
    res.status(200).send({ message: "Modificaciones realizadas", data: users });
});
//Sabemos si esta corriendo el Servidor que estamos usando
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000/");
});
//# sourceMappingURL=app.js.map