import {Collection, Entity,ManyToMany,Property,} from "@mikro-orm/core";
import { BaseEntity } from "../../shared/db/baseEntity.entity.js";
import { User } from "./users.entity.js";

@Entity()
export class Rol extends BaseEntity{
 
  @Property({ nullable: false, unique: true }) 
  name !: string

  @ManyToMany(() => User, (user) => user.roles )
  roles = new Collection<User>(this)

}