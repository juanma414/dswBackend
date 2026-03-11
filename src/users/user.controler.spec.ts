import type { Request, Response } from "express";
import bcrypt from "bcrypt";

//Creamos el Mock del bcrypt
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

//Creamos el Mock del orm (EntityManager)
const emMock = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneOrFail: jest.fn(),
  create: jest.fn(),
  flush: jest.fn(),
  getReference: jest.fn(),
  assign: jest.fn(),
};

//Mockeamos el módulo que exporta `orm`
jest.mock("../../shared/db/orm.js", () => ({
  orm: { em: emMock },
}));

//Importamos el controlador después de haber mockeado
import { controler } from "./user.controler";

describe("user.controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  //Método FindAll
  describe("findAll", () => {
    it("debería devolver todos los usuarios", async () => {
      const fakeUsers = [{ userId: 1, userName: "Pepe" }];
      emMock.find.mockResolvedValue(fakeUsers);

      await controler.findAll(req as Request, res as Response);

      expect(emMock.find).toHaveBeenCalledWith(expect.any(Function), { userActive: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeUsers);
    });

    it("maneja errores", async () => {
      emMock.find.mockRejectedValue(new Error("DB error"));

      await controler.findAll(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "DB error" });
    });
  });

  //Método Add (create)
  describe("add", () => {
    it("registra un usuario nuevo", async () => {
      const body = {
        userName: "Ana",
        userLastName: "Lopez",
        userRol: "admin",
        userEmail: "ana@example.com",
        userPassword: "1234",
        userActive: true,
      };
      req.body = body;

      emMock.findOne.mockResolvedValue(null); // no existe el email
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed123");
      const fakeUser = { ...body, userPassword: "hashed123", userId: 10 };
      emMock.create.mockReturnValue(fakeUser);

      await controler.add(req as Request, res as Response);

      expect(emMock.findOne).toHaveBeenCalledWith(expect.any(Function), {
        userEmail: body.userEmail,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith("1234", 10);
      expect(emMock.create).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          userEmail: body.userEmail,
          userPassword: "hashed123",
        }),
      );
      expect(emMock.flush).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Usuario registrado exitosamente",
        success: true,
        token: expect.any(String),
      });
    });

    it("rechaza si el email ya existe", async () => {
      req.body = { userEmail: "repe@example.com" };
      emMock.findOne.mockResolvedValue({ userEmail: "repe@example.com" });

      await controler.add(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "El email ya está registrado",
      });
    });

    it("maneja errores en add", async () => {
      emMock.findOne.mockRejectedValue(new Error("DB fail"));

      await controler.add(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "DB fail" });
    });
  });

  //Método FindOne
  describe("findOne", () => {
    it("devuelve un usuario por id", async () => {
      req.params = { id: "5" };
      const fakeUser = { userId: 5, userName: "Luis" };
      emMock.findOneOrFail.mockResolvedValue(fakeUser);

      await controler.findOne(req as Request, res as Response);

      expect(emMock.findOneOrFail).toHaveBeenCalledWith(expect.any(Function), {
        userId: 5,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Usuario encontrado",
        data: fakeUser,
      });
    });

    it("maneja errores en findOne", async () => {
      req.params = { id: "5" };
      emMock.findOneOrFail.mockRejectedValue(new Error("No encontrado"));

      await controler.findOne(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "No encontrado" });
    });
  });

  //Método Update
  describe("update", () => {
    it("actualiza un usuario", async () => {
      req.params = { id: "3" };
      req.body = { userName: "Nuevo" };
      const fakeUser = { userId: 3 };
      const fakeUserFromDB = { userId: 3, userName: "Viejo" };
      emMock.getReference.mockReturnValue(fakeUser);
      emMock.findOneOrFail.mockResolvedValue(fakeUserFromDB);
      emMock.flush.mockResolvedValue(undefined);

      await controler.update(req as Request, res as Response);

      expect(emMock.getReference).toHaveBeenCalledWith(expect.any(Function), 3);
      expect(emMock.assign).toHaveBeenCalled();
      expect(emMock.flush).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Usuario modificado",
        data: fakeUser,
      });
    });

    it("maneja errores en update", async () => {
      emMock.getReference.mockImplementation(() => {
        throw new Error("fallo");
      });

      await controler.update(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "fallo" });
    });
  });
});
