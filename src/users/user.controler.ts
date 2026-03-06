import { Request, Response } from "express";
import { orm } from "../../shared/db/orm.js";
import { user } from "./user.entity.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.utils.js";

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

//POST - REGISTER
async function add(req: Request, res: Response) {
  try {
    const { userName, userLastName, userRol, userEmail, userPassword } = req.body;
    
    // Verificar si el email ya existe
    const existingUser = await em.findOne(user, { userEmail });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }
    
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    
    const userData = {
      userName,
      userLastName,
      userRol,
      userEmail,
      userPassword: hashedPassword
    };
    
    const userClass = em.create(user, userData as any);
    await em.flush();
    
    // Generar JWT con datos seguros del usuario
    const token = generateToken({
      userId: userClass.userId as number,
      userEmail: userClass.userEmail || '',
      userRol: userClass.userRol?.toString() || 'developer',
      userName: userClass.userName || '',
      userLastName: userClass.userLastName || ''
    });
    
    res.status(201).json({ 
      message: "Usuario registrado exitosamente", 
      token,
      success: true 
    });
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

//LOGIN
async function login(req: Request, res: Response) {
  try {
    const { userEmail, userPassword } = req.body;
    
    // Buscar usuario por email
    const userClass = await em.findOne(user, { userEmail });
    if (!userClass) {
      return res.status(401).json({ message: "Email o contraseña incorrectos" });
    }
    
    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(userPassword, userClass.userPassword || '');
    if (!isValidPassword) {
      return res.status(401).json({ message: "Email o contraseña incorrectos" });
    }
    
    // Generar JWT con datos seguros del usuario
    const token = generateToken({
      userId: userClass.userId as number,
      userEmail: userClass.userEmail || '',
      userRol: userClass.userRol?.toString() || 'developer',
      userName: userClass.userName || '',
      userLastName: userClass.userLastName || ''
    });
    
    res.status(200).json({ 
      message: "Login exitoso", 
      token,
      success: true 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


//SEED USERS - Crear usuarios de prueba
/*async function seedUsers(req: Request, res: Response) {
  try {
    const testUsers = [
      {
        userName: 'Admin',
        userLastName: 'Sistema',
        userRol: 'administrator',
        userEmail: 'admin@test.com',
        userPassword: await bcrypt.hash('admin123', 10)
      },
      {
        userName: 'Juan',
        userLastName: 'Pérez',
        userRol: 'developer',
        userEmail: 'juan@test.com',
        userPassword: await bcrypt.hash('juan123', 10)
      }
    ];

    const createdUsers = [];
    for (const userData of testUsers) {
      const existingUser = await em.findOne(user, { userEmail: userData.userEmail });
      if (!existingUser) {
        const newUser = em.create(user, userData as any);
        createdUsers.push(newUser);
      }
    }
    
    await em.flush();
    
    res.status(201).json({ 
      message: `${createdUsers.length} usuarios de prueba creados`, 
      data: createdUsers.map(u => ({ ...u, userPassword: undefined }))
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}*/

export const controler = {
  findAll,
  findOne,
  add,
  update,
  deleteUser,
  login,
  /*seedUsers,*/
};
