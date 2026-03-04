import { controler } from "./issue.controler.js";
import { orm } from "../../shared/db/orm.js";

// Mockeamos el ORM completo
jest.mock("../../shared/db/orm.js", () => ({
  orm: {
    em: {
      find: jest.fn(),
      findOneOrFail: jest.fn(),
      create: jest.fn(),
      flush: jest.fn(),
      assign: jest.fn(),
      getReference: jest.fn()
    }
  }
}));

describe("issue.controller - findAll", () => {

  let req: any;
  let res: any;

  beforeEach(() => {
    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it("debería devolver todos los issues activos (200)", async () => {

    const mockIssues = [
      { issueId: 1, issueStataus: "todo" },
      { issueId: 2, issueStataus: "inprogress" }
    ];

    (orm.em.find as jest.Mock).mockResolvedValue(mockIssues);

    await controler.findAll(req, res);

    expect(orm.em.find).toHaveBeenCalledWith(
      expect.anything(),
      { issueStataus: { $nin: ['deleted', 'completed'] } },
      { populate: ['typeIssue', 'project', 'sprint'] }
    );

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      message: "Se encontraron todos los Issues",
      issueClass: mockIssues
    });
  });

  it("debería manejar error y devolver 500", async () => {

    (orm.em.find as jest.Mock).mockRejectedValue(new Error("DB error"));

    await controler.findAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      message: "DB error"
    });
  });

});