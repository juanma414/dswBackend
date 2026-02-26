//Realizamos la configuración del ORM
import { MikroORM } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";

export const orm = await MikroORM.init({
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  dbName: "app2dolist",
  clientUrl: "mysql://root:MySql2025!@localhost:3306/app2dolist",
  driver: MySqlDriver,
  highlighter: new SqlHighlighter(),
  debug: true,

  schemaGenerator: {
    //solo se usa en desarrollo, nunca en producción
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});

//Función que crea en caso de que no exista
//En caso de que exista compara con lo que ya hay creado
export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator();
  /*
    await generatr.dropSchema() --> borra y crea desde cero
    await generator.createSchema() -->
    */
  await generator.updateSchema();
};