/*import * as ormModule from "../../shared/db/orm.js";

jest.mock("../../shared/db/orm.js"),
  () => ({
    orm: { em: { find: jest.fn() } },
  });

test("findAll - devuelve proyectos", async () => {
  const emMock = ormModule.orm.em as jest.Mocked<typeof ormModule.orm.em>;
  emMock.find.mockResolvedValue([{ id: 1, name: "Proyecto A" }]);
});*/

import { Request, Response } from "express";

//Creamos un mock del orm (EntityManager)
const emMock = {
  find: jest.fn(),
  create: jest.fn(),
  flush: jest.fn(),
  findOneOrFail: jest.fn(),
  getReference: jest.fn(),
  assign: jest.fn(),
  removeAndFlush: jest.fn(),
};

//Mockeamos el módulo que exporta `orm`
jest.mock('../../shared/db/orm.js', () => ({
  orm: { em: emMock }
}));

//Importamos el controlador después de haber mockeado
import { controler } from './project.controler';

describe('project.controler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //Método FindAll
  it('findAll - devuelve proyectos (200)', async () => {
    const fakeProjects = [{ id: 1, title: 'T1' }];
    emMock.find.mockResolvedValue(fakeProjects);

    const req = {} as unknown as Request;
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res = { status } as unknown as Response & { status: any, json?: any };
    (res as any).status = status;

    await controler.findAll(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ messge: "Proyectos encontrados", projectClass: fakeProjects });
    expect(emMock.find).toHaveBeenCalled();
  });

  it('findAll - error de DB (500)', async () => {
    emMock.find.mockRejectedValue(new Error('DB fail'));

    const req = {} as unknown as Request;
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res = { status } as unknown as Response & { status: any };
    (res as any).status = status;

    await controler.findAll(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ message: 'DB fail' });
  });

  //Método Add (create)
  it('add - crea proyecto y responde 201', async () => {
    const fakeProject = { projectId: 10, title: 'Nuevo' };
    emMock.create.mockReturnValue(fakeProject);
    emMock.flush.mockResolvedValue(undefined);

    const req = { body: { title: 'Nuevo' } } as unknown as Request;
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res = { status } as unknown as Response & { status: any };
    (res as any).status = status;

    await controler.add(req, res);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({ message: "Proyecto creado", data: fakeProject });
    expect(emMock.create).toHaveBeenCalled();
    expect(emMock.flush).toHaveBeenCalled();
  });

  it('add - error (500)', async () => {
    emMock.create.mockImplementation(() => { throw new Error('create fail') });

    const req = { body: { title: 'x' } } as unknown as Request;
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res = { status } as unknown as Response & { status: any };
    (res as any).status = status;

    await controler.add(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ message: 'create fail' });
  });

  //Método FindOne
  it('findOne - encuentra proyecto (200)', async () => {
    const fakeProject = { projectId: 5, title: 'P' };
    emMock.findOneOrFail.mockResolvedValue(fakeProject);

    const req = { params: { id: '5' } } as unknown as Request;
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res = { status } as unknown as Response & { status: any };
    (res as any).status = status;

    await controler.findOne(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ message: "Proyecto encontrado", data: fakeProject });
    expect(emMock.findOneOrFail).toHaveBeenCalled();
  });

  it('findOne - no encuentra (500)', async () => {
    emMock.findOneOrFail.mockRejectedValue(new Error('not found'));

    const req = { params: { id: '9' } } as unknown as Request;
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res = { status } as unknown as Response & { status: any };
    (res as any).status = status;

    await controler.findOne(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ message: 'not found' });
  });

  //Método Update
  it('update - modifica proyecto y responde 200', async () => {
    const projectRef = { projectId: 7, title: 'old' };
    emMock.getReference.mockReturnValue(projectRef);
    emMock.assign.mockReturnValue(undefined);
    emMock.flush.mockResolvedValue(undefined);

    const req = { params: { id: '7' }, body: { title: 'new' } } as unknown as Request;
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res = { status } as unknown as Response & { status: any };
    (res as any).status = status;

    await controler.update(req, res);

    expect(emMock.getReference).toHaveBeenCalled();
    expect(emMock.assign).toHaveBeenCalledWith(projectRef, { title: 'new' });
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ message: "Proeycto modificado", data: projectRef });
  });

  it('update - error (500)', async () => {
    emMock.getReference.mockImplementation(() => { throw new Error('ref fail') });

    const req = { params: { id: '7' }, body: { title: 'x' } } as unknown as Request;
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res = { status } as unknown as Response & { status: any };
    (res as any).status = status;

    await controler.update(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ message: 'ref fail' });
  });

  //Método DeleteUser
  it('deleteUser - borra proyecto y responde 200', async () => {
    const projectRef = { projectId: 3, title: 't' };
    emMock.getReference.mockReturnValue(projectRef);
    emMock.removeAndFlush.mockResolvedValue(undefined);

    const req = { params: { id: '3' } } as unknown as Request;
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res = { status } as unknown as Response & { status: any };
    (res as any).status = status;

    await controler.deleteUser(req, res);

    expect(emMock.getReference).toHaveBeenCalled();
    expect(emMock.removeAndFlush).toHaveBeenCalledWith(projectRef);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ message: "Proyecto borrado", data: projectRef });
  });

  it('deleteUser - error (500)', async () => {
    emMock.getReference.mockImplementation(() => { throw new Error('ref fail') });

    const req = { params: { id: '3' } } as unknown as Request;
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res = { status } as unknown as Response & { status: any };
    (res as any).status = status;

    await controler.deleteUser(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ message: 'ref fail' });
  });
});