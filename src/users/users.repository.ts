import { Repository } from "../../shared/repository.js";
import { User } from "./users.entity.js";

const users = [
  new User(
    "Pepe No",
    "Grillo Cambio 2",
    ["Programador", "PM", "Tester"],
    "pepe_grillo@test.com",
    "1"
  ),
];

export class UserRepository implements Repository<User> {
  public findAll(): User[] | undefined {
    return users;
  }

  public findOne(item: { id: string }): User | undefined {
    return users.find((user) => user.id === item.id);
  }

  public add(item: User): User | undefined {
    users.push(item);
    return item; //Cuando accedamos a la DB, se va a devolver el id que se genera
  }

  public update(item: User): User | undefined {
    const userIdx = users.findIndex((user) => user.id === item.id);

    if (userIdx != -1) {
      users[userIdx] = { ...users[userIdx], ...item };
    }
    return users[userIdx];
  }

  public delete(item: { id: string }): User | undefined {
    const userIdx = users.findIndex((user) => user.id === item.id);

    if (userIdx != -1) {
      const deleteuser = users[userIdx];
      users.splice(userIdx, 1);
    }
    return;
  }
}
