import { Entity, Property, PrimaryKey, ManyToOne, Rel } from "@mikro-orm/core";
import { issue } from "../issues/issue.entity.js";
import { user } from "../users/user.entity.js";

@Entity()
export class comment {
  @PrimaryKey({ fieldName: 'idComment', autoincrement: true, type: 'number' })
  idComment!: number;

  @Property({ fieldName: 'description', nullable: false })
  description!: string;

  @Property({ fieldName: 'createDate', nullable: false })
  createDate!: Date;

  @ManyToOne(() => issue, { fieldName: 'idIssue', nullable: false })
  issue!: Rel<issue>; //Se utiliza para indicar que es una relación con la entidad issue y que lo resuelva de forma diferenciada (Rel) para evitar cargar toda la entidad issue al cargar un comentario.

  @ManyToOne(() => user, { fieldName: 'idUser', nullable: false })
  user!: Rel<user>;
}