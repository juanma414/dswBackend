export class User {
  constructor(
    public name: string,
    public lastName: string,
    public rol: string[],
    public email: string,
    public id?:number //Se pone como opcional, ya que al crear no se tiene ID y se autogenera
  ) {}
}
