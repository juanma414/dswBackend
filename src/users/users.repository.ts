import { Repository } from "../../shared/repository.js";
import { User } from "./users.entity.js";
import { pool } from "../../shared/db/conn.mysql.js";

/*
const users = [
  new User(
    "Pepe No",
    "Grillo Cambio 2",
    ["Programador", "PM", "Tester"],
    "pepe_grillo@test.com",
    1
  ),
];
*/

export class UserRepository implements Repository<User> {

  public async findAll(): Promise<User[] | undefined> {
    const [users] = await pool.query("SELECT * FROM users");
    return users as User[];
  }

  public findOne(item: { id: string }): Promise<User | undefined> {
    //return users.find((user) => user.id === item.id);
    throw new Error("not implemented");
  }

  public add(item: User): Promise<User | undefined> {
    //users.push(item);
    //return item; //Cuando accedamos a la DB, se va a devolver el id que se genera
    throw new Error("not implemented");
  }

  public update(id: string, item: User): Promise<User | undefined> {
    /*const userIdx = users.findIndex((user) => user.id === item.id);

    if (userIdx != -1) {
      users[userIdx] = { ...users[userIdx], ...item };
    }
    return users[userIdx];*/
    throw new Error("not implemented");
  }

  public delete(item: { id: string }): Promise<User | undefined> {
    /*const userIdx = users.findIndex((user) => user.id === item.id);

    if (userIdx != -1) {
      const deleteuser = users[userIdx];
      users.splice(userIdx, 1);
    }
    return;*/
    throw new Error("not implemented");
  }
}