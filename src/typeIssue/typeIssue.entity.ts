import { Entity, Property, PrimaryKey, OneToMany, Collection } from "@mikro-orm/core";
import { issue } from "../issues/issue.entity.js";

@Entity()
export class typeIssue {
  @PrimaryKey({ fieldName: 'typeIssueId', autoincrement: true })
  typeIssueId!: number;

  @Property({ fieldName: 'typeIssueDescription', nullable: false })
  typeIssueDescription!: string;

  @OneToMany(() => issue, (i) => i.typeIssue)
  issues = new Collection<issue>(this);
}