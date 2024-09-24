import { Repository } from "../../shared/repository.js";
import { User } from "./users.entity.js";
import { pool } from "../../shared/db/conn.mysql.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class UserRepository implements Repository<User> {
  public async findAll(): Promise<User[] | undefined> {
    const [users] = await pool.query("SELECT * FROM users");
    for (const user of users as User[]) {
      const [item] = await pool.query(
        "SELECT rolName FROM usersRol WHERE userId = ?",
        [user.id]
      );
      /*Transformamos lo que tenemos en un array de string para que sea compatible*/
      user.rol = (item as { rolName: string }[]).map((item) => item.rolName);
    }
    return users as User[];
  }

  public async findOne(item: { id: string }): Promise<User | undefined> {
    /*Transformamos el tipo de dato que ingresa de String a Number*/
    const id = Number.parseInt(item.id);
    const [users] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    if (users.length === 0) {
      return undefined;
    }
    /*Pasamos la única fila que tenemos del select anterior y ya lo definimos como User para no transformar despues*/
    const user = users[0] as User;
    const [rol] = await pool.query(
      "SELECT rolName FROM usersRol WHERE userId = ?",
      [user.id]
    );
    user.rol = (rol as { rolName: string }[]).map((rol) => rol.rolName);
    /*Devolvemos el registro con la info*/
    return user;
  }

  public async add(userInput: User): Promise<User | undefined> {
    /*Desglosamos los elementos del input ya que el id se genera solo y el rol es un arreglo*/
    const { id, rol, ...userRow } = userInput;
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO users SET ?",
      [userRow]
    );
    /*Recuperamos el ID que se genero con el insert*/
    userInput.id = result.insertId;
    for (const oneRol of rol) {
      await pool.query("INSERT INTO usersRol SET ?", {
        userId: userInput.id,
        rolName: oneRol,
      });
    }
    return userInput;
  }

  public async update(id: string, userInput: User): Promise<User | undefined> {
    /*Lo ponemos en una constante ya que lo necesitamos para actualizar ambas tablas*/
    const userId = Number.parseInt(id);
    const { rol, ...userRow } = userInput;
    /*await pool.query("UPDATE user SET ? WHERE id = ?",[userRow,Number.parseInt(id)]);*/
    await pool.query("UPDATE users SET ? WHERE id = ?", [userRow, userId]);

    /*Trabajamos con los roles*/
    /*Primero borramos la lista que tiene y luego ponemos los ingresados*/
    await pool.query("DELETE FROM usersRol WHERE userId = ?", [userId]);
    if (rol?.length > 0) {
      for (const oneRol of rol) {
        await pool.query("INSERT INTO usersRol SET ?", {
          userId: userId,
          rolName: oneRol,
        });
      }
    }
    return await this.findOne({id});
  }

  public async delete(item: { id: string }): Promise<User | undefined> {
    try {
      const userToDelete = await this.findOne(item);
      /*Lo ponemos en una constante ya que lo necesitamos para borrar en ambas tablas*/
      const id = Number.parseInt(item.id);

      /*Antes de borrar el usuario hay que borrar los roles*/
      await pool.query("DELETE FROM usersRol WHERE userId = ?", id);
      await pool.query("DELETE FROM users WHERE id = ?", id);

      return userToDelete;
    } catch (error: any) {
      throw new Error("No se pudo borrar usuario seleccionado");
    }
  }
}
