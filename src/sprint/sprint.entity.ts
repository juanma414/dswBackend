import { Entity, Property, PrimaryKey, ManyToOne, OneToMany, Collection } from "@mikro-orm/core";
import { project } from "../projects/project.entity.js";
import { issue } from "../issues/issue.entity.js";

@Entity()
export class sprint {
  @PrimaryKey({ fieldName: 'idSprint', autoincrement: true })
  idSprint!: number;

  @Property({ fieldName: 'startDate', nullable: false })
  startDate!: Date;

  @Property({ fieldName: 'endDate', nullable: false })
  endDate!: Date;

  @Property({ fieldName: 'description', nullable: true })
  description?: string;

  @ManyToOne(() => project, { fieldName: 'idProject', nullable: false })
  project!: project;

  @OneToMany(() => issue, (i) => i.sprint)
  issues = new Collection<issue>(this);
}