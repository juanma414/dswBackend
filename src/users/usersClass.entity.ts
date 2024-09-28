import {Entity,Property,} from "@mikro-orm/core";
import { BaseEntity } from "../../shared/db/baseEntity.entity.js";

@Entity()
export class UserClass extends BaseEntity{
 
  @Property({ nullable: false, unique: true }) //el unique hace que se cree un indice unico sobre el nombre
  name!: string; //con el signo de exclamación definimos que es un campo obligatorio

  @Property()
  lastName!: string;

  @Property()
  email!: string;
}
