import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
} from "@mikro-orm/core";
import { BaseEntity } from "../../shared/db/baseEntity.entity.js";
import { Rol } from "./roles.entity.js";

@Entity()
export class User extends BaseEntity {
  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  lastName!: string;

  @ManyToMany(() => Rol, (roles) => roles.roles, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  roles!: Rol[];

  @Property({ nullable: false })
  email!: string;
}
