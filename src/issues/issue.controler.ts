import { Request, Response } from "express";
import { orm } from "../../shared/db/orm.js";
import { issue } from "./issue.entity.js";
import { user } from "../users/user.entity.js";

const em = orm.em;

//GET ALL (filtrado por rol de usuario)
async function findAll(req: Request, res: Response) {
  try {
    const { userRole, userId } = req.query;
    
    let filter: any = { 
      issueStataus: { $nin: ['deleted', 'completed'] } 
    };
    
    // Si no es administrador, filtrar por nombre del usuario
    if (userRole !== 'administrator') {
      // Obtener el nombre del usuario actual
      const currentUser = await em.findOne(user, { userId: parseInt(userId as string) });
      if (currentUser) {
        const fullName = `${currentUser.userName} ${currentUser.userLastName}`;
        filter.issueSupervisor = fullName;
      }
    }
    
    const issues = await em.find(issue, filter);
    
    // Como el campo issueSupervisor ya contiene el nombre completo,
    // simplemente lo usamos directamente
    const issuesWithUserInfo = issues.map((issueItem) => ({
      ...issueItem,
      supervisorName: issueItem.issueSupervisor || 'Sin Asignar'
    }));
    
    res.status(200).json({ message: "Se encontraron todos los Issues", issueClass: issuesWithUserInfo });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//POST (asignar issue al usuario que lo crea)
async function add(req: Request, res: Response) {
  try {
    const { userId } = req.body;
    
    // Obtener el nombre completo del usuario para asignarlo al issue
    let supervisorName = 'Usuario Desconocido';
    if (userId) {
      const currentUser = await em.findOne(user, { userId: parseInt(userId) });
      if (currentUser) {
        supervisorName = `${currentUser.userName} ${currentUser.userLastName}`;
      }
    }
    
    // Asignar automáticamente el issue al usuario que lo está creando
    const issueData = {
      ...req.body,
      issueSupervisor: supervisorName // Asignar el nombre completo del usuario
    };
    
    const issueClass = em.create(issue, issueData);
    await em.flush(); //Es el commit
    res.status(201).json({ message: "Issue creado", data: issueClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//GET ONE
async function findOne(req: Request, res: Response) {
  try {
    const issueId = Number.parseInt(req.params.id);
    const issueClass = await em.findOneOrFail(issue, { issueId });
    res.status(200).json({ message: "Issue encontrado", data: issueClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//PUT
async function update(req: Request, res: Response) {
  try {
    const issueId = Number.parseInt(req.params.id);
    const issueClass = em.getReference(issue, { issueId });
    //como ya tenemos el registro que queremos modificar, pasamos los datos que ingresaron
    em.assign(issueClass, req.body);
    await em.flush();
    res.status(200).json({ message: "Issue modificado", data: issueClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//DELETE (Soft Delete - solo administradores)
async function deleteUser(req: Request, res: Response) {
  try {
    const issueId = Number.parseInt(req.params.id);
    const { userRole } = req.body;
    
    // Verificar que solo administradores puedan eliminar
    if (userRole !== 'administrator') {
      return res.status(403).json({ message: "Solo los administradores pueden eliminar issues" });
    }
    
    const issueClass = await em.findOneOrFail(issue, { issueId });
    
    // En lugar de eliminar, cambiar el estado a 'deleted'
    issueClass.issueStataus = 'deleted';
    await em.flush();
    
    res.status(200).json({ message: "Issue marcado como eliminado", data: issueClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//PATCH - UPDATE STATUS ONLY
async function updateStatus(req: Request, res: Response) {
  try {
    const issueId = Number.parseInt(req.params.id);
    const { status } = req.body;
    
    const issueClass = await em.findOneOrFail(issue, { issueId });
    issueClass.issueStataus = status;
    
    // Si el nuevo status es 'completed', actualizar issueEndDate
    if (status === 'completed') {
      issueClass.issueEndDate = new Date();
    }
    
    await em.flush();
    
    res.status(200).json({ message: "Status del issue actualizado", data: issueClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//SEED DATA - TEMPORAL PARA PRUEBAS
async function seedData(req: Request, res: Response) {
  try {
    const testIssues = [
      {
        issueDescription: 'Implementar autenticación de usuarios',
        issueCreateDate: new Date(),
        issueStataus: 'todo',
        issuePriority: 'high',
        issueSupervisor: 'Admin'
      },
      {
        issueDescription: 'Diseñar interfaz de usuario para el dashboard',
        issueCreateDate: new Date(),
        issueStataus: 'inprogress',
        issuePriority: 'medium',
        issueSupervisor: 'Designer'
      },
      {
        issueDescription: 'Configurar base de datos y migraciones',
        issueCreateDate: new Date(),
        issueStataus: 'done',
        issuePriority: 'high',
        issueSupervisor: 'DevOps'
      },
      {
        issueDescription: 'Optimizar consultas de la base de datos',
        issueCreateDate: new Date(),
        issueStataus: 'todo',
        issuePriority: 'low',
        issueSupervisor: 'Backend Dev'
      }
    ];

    const createdIssues = [];
    for (const issueData of testIssues) {
      const newIssue = em.create(issue, issueData as any);
      createdIssues.push(newIssue);
    }
    
    await em.flush();
    
    res.status(201).json({ 
      message: `${testIssues.length} issues de prueba creados`, 
      data: createdIssues 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//GET DELETED ISSUES (Ver issues eliminados)
async function getDeleted(req: Request, res: Response) {
  try {
    const deletedIssues = await em.find(issue, { 
      issueStataus: 'deleted' 
    });
    res.status(200).json({ message: "Issues eliminados", data: deletedIssues });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//GET COMPLETED ISSUES (Ver issues completados)
async function getCompleted(req: Request, res: Response) {
  try {
    const completedIssues = await em.find(issue, { 
      issueStataus: 'completed' 
    });
    res.status(200).json({ message: "Issues completados", data: completedIssues });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//COMPLETE ISSUE - Marcar como completado con fecha de finalización
async function completeIssue(req: Request, res: Response) {
  try {
    const issueId = Number.parseInt(req.params.id);
    
    const issueClass = await em.findOneOrFail(issue, { issueId });
    issueClass.issueStataus = 'completed';
    issueClass.issueEndDate = new Date();
    
    await em.flush();
    
    res.status(200).json({ 
      message: "Issue marcado como completado", 
      data: issueClass 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const controler = {
  findAll,
  findOne,
  add,
  update,
  updateStatus,
  seedData,
  getDeleted,
  getCompleted,
  completeIssue,
  deleteUser,
};
