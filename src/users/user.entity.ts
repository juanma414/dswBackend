import { Entity, Property, PrimaryKey } from "@mikro-orm/core";

@Entity()
export class user {
  @PrimaryKey({fieldName: 'userId', autoincrement: true })
  userId!: number; //con el signo de exclamación definimos que es un campo obligatorio

  @Property({ fieldName: 'userName', nullable: false })
  userName?: string; //con el signo de pregunta es un campo no obligatorio

  @Property({fieldName: 'userLastName', nullable: false })
  userLastName?: string;

  @Property({fieldName: 'userRol', nullable: false })
  userRol?: String;

  @Property({ fieldName: 'userEmail',unique: true }) //Unico sobre el correo, no duplicado
  userEmail?: string;

  @Property({ fieldName: 'userPassword', nullable: false })
  userPassword?: string;

  @Property({ fieldName: 'userActive', nullable: false, default: true }) 
  userActive: boolean = true; //Por defecto va en true es decir está activo.
}
