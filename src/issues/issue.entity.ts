import { Entity, Property, PrimaryKey } from "@mikro-orm/core";

@Entity()
export class issue {
  @PrimaryKey({fieldName: 'issueId', autoincrement: true })
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
}