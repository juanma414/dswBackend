import { Entity, Property, PrimaryKey,ManyToOne, OneToMany, Collection } from "@mikro-orm/core";
import { typeIssue } from "../typeIssue/typeIssue.entity.js";
import { comment } from "../comment/comment.entity.js";
import { project } from "../projects/project.entity.js";
import { sprint } from "../sprint/sprint.entity.js";

@Entity()
export class issue {
  @PrimaryKey({fieldName: 'issueId', autoincrement: true, type: 'number'})
  issueId!: number;

  @Property({ fieldName: 'issueDescription', nullable: false })
  issueDescription?: string; 

  @Property({fieldName: 'issueCreateDate', nullable: false })
  issueCreateDate?: Date;

  @Property({fieldName: 'issueEndDate', nullable: true })
  issueEndDate?: Date;

  @Property({ fieldName: 'issueStataus', nullable: false}) 
  issueStataus?: string;

  @Property({ fieldName: 'issueSupervisor'}) 
  issueSupervisor?: string;

  @Property({ fieldName: 'issuePriority', nullable: false}) 
  issuePriority?: string;

  // Relaciones del diagrama
  @ManyToOne(() => sprint, { fieldName: 'idSprint', nullable: true })
  sprint?: sprint;

  @ManyToOne(() => project, { fieldName: 'idProject', nullable: true })
  project?: project;

  @ManyToOne(() => typeIssue, { nullable: false }) 
  typeIssue!: typeIssue;

  @OneToMany(() => comment, (c) => c.issue)
  comments = new Collection<comment>(this);
}

