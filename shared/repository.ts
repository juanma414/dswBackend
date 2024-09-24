//Los repository hacen referencias a los accesos de las DB.
//Se definen las interfaces

export interface Repository<T> {
  findAll(): Promise<T[] | undefined>; //Devuelve un arreglo
  findOne(item: { id: string }): Promise<T | undefined>; //Devueve un valor único
  add(item: T): Promise<T | undefined>;
  update(id: string, item: T): Promise<T | undefined>;
  delete(item: { id: string }): Promise<T | undefined>;
}
