import { Request, Response } from "express";
import { orm } from "../../shared/db/orm.js";
import { issue } from "./issue.entity.js";
import { typeIssue } from "../typeIssue/typeIssue.entity.js";
import { user } from "../users/user.entity.js";

const em = orm.em;

// Helper para enriquecer issues con datos completos del supervisor
async function enrichIssuesWithSupervisor(issues: issue[]): Promise<any[]> {
  return Promise.all(issues.map(async (iss) => {
    const issueData: any = { ...iss };
    
    if (iss.issueSupervisor) {
      const supervisorId = Number.parseInt(iss.issueSupervisor);
      
      // Si es un número válido, intentar buscar el usuario
      if (!isNaN(supervisorId)) {
        try {
          const supervisor = await em.findOne(user, { userId: supervisorId });
          if (supervisor) {
            issueData.supervisorData = {
              userId: supervisor.userId,
              userName: supervisor.userName,
              userEmail: supervisor.userEmail,
              userRol: supervisor.userRol
            };
          }
        } catch (error) {
          // Si no encuentra el usuario, mantener solo el ID
        }
      }
    }
    
    return issueData;
  }));
}

//GET ALL (excluir los eliminados y completados)
async function findAll(req: Request, res: Response) {
  try {
    // Filtrar issues que no estén eliminados ni completados
    const issueClass = await em.find(issue, { 
      issueStataus: { $nin: ['deleted', 'completed'] } 
    }, { populate: ['typeIssue', 'project', 'sprint'] });
    
    // Enriquecer con datos del supervisor
    const enriched = await enrichIssuesWithSupervisor(issueClass);
    
    res.status(200).json({ message: "Se encontraron todos los Issues", issueClass: enriched });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//POST
async function add(req: Request, res: Response) {
  try {
    const data = req.body;

    if (data.typeIssue) { data.typeIssue = em.getReference(typeIssue, data.typeIssue);}

    const issueClass = em.create(issue, data);
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
    const issueClass = await em.findOneOrFail(issue, { issueId }, { populate: ['typeIssue', 'project', 'sprint'] });
    
    // Enriquecer con datos del supervisor
    const enriched = await enrichIssuesWithSupervisor([issueClass]);
    
    res.status(200).json({ message: "Issue encontrado", data: enriched[0] });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// PUT
async function update(req: Request, res: Response) {
  try {
    const issueId = Number.parseInt(req.params.id);
    // ✅ Igual que en findOne/delete — busca el registro y luego asigna
    const issueClass = await em.findOneOrFail(issue, { issueId }, { populate: ['typeIssue', 'project', 'sprint'] });
    em.assign(issueClass, req.body);
    await em.flush();
    
    // Enriquecer con datos del supervisor
    const enriched = await enrichIssuesWithSupervisor([issueClass]);
    
    res.status(200).json({ message: "Issue modificado", data: enriched[0] });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//DELETE (Soft Delete - cambiar estado a deleted)
async function deleteIssue(req: Request, res: Response) {
  try {
    const issueId = Number.parseInt(req.params.id);
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
    
    // Si el nuevo status es 'closed', actualizar issueEndDate
    if (status === 'closed' && !issueClass.issueEndDate) {
      issueClass.issueEndDate = new Date();
    }
    
    await em.flush();
    
    res.status(200).json({ message: "Status del issue actualizado", data: issueClass });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//SEED DATA - TEMPORAL PARA PRUEBAS
/*async function seedData(req: Request, res: Response) {
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
}*/

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
    
    const issueClass = await em.findOneOrFail(issue, { issueId }, { populate: ['typeIssue', 'project', 'sprint'] });
    issueClass.issueStataus = 'completed';
    issueClass.issueEndDate = new Date();
    
    await em.flush();
    
    // Enriquecer con datos del supervisor
    const enriched = await enrichIssuesWithSupervisor([issueClass]);
    
    res.status(200).json({ 
      message: "Issue marcado como completado", 
      data: enriched[0]
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
  /*seedData,*/
  getDeleted,
  getCompleted,
  completeIssue,
  deleteIssue,
};
