//Los repository hacen referencias a los accesos de las DB.
//Se definen las interfaces

/*
export interface Repository<T> {
    findAll(): T[] | undefined; //Devuelve un arreglo
    findOne(item: { id: string }): T | undefined; //Devueve un valor único
    add(item: T): T | undefined;
    update(item: T): T | undefined;
    delete(item: { id: string }): T | undefined;
  
    //La forma de abajo se utiliza cuando se acceda a la DB, con acceso asincrónico
    //findAll(): Promise<T[] | undefined>;
  } */

export interface Repository<T> {
  findAll(): Promise<T[] | undefined>; //Devuelve un arreglo
  findOne(item: { id: string }): Promise<T | undefined>; //Devueve un valor único
  add(item: T): Promise<T | undefined>;
  update(id: string, item: T): Promise<T | undefined>;
  delete(item: { id: string }): Promise<T | undefined>;
}
