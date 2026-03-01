import { Entity, Property, PrimaryKey, ManyToOne, Rel } from "@mikro-orm/core";
import { user } from "../users/user.entity.js";

@Entity()
export class project {
  @PrimaryKey({fieldName: 'projectId', autoincrement: true })
  projectId!: number;

  @Property({ fieldName: 'projectDescription', nullable: false })
  projectDescription?: string;

  @ManyToOne(() => user, { nullable: true })
  user?: Rel<user>;
}