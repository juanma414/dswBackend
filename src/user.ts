import crypto from "node:crypto";

export class User {
  constructor(
    public name: string,
    public lastName: string,
    public rol: string[],
    public email: string,
    public id:string
  ) {}
}
