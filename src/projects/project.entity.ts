import { Entity, Property, PrimaryKey } from "@mikro-orm/core";

@Entity()
export class project {
  @PrimaryKey({fieldName: 'projectId', autoincrement: true })
  projectId!: number;

  @Property({ fieldName: 'projectDescription', nullable: false })
  projectDescription?: string; 
}