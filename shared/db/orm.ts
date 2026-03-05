//Realizamos la configuración del ORM
import { MikroORM } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";

export const orm = await MikroORM.init({
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],

  //dbName: process.env.DB_NAME,
  //dbName: process.env.MYSQLDATABASE,
  //host: process.env.DB_HOST,
  //host: process.env.MYSQLHOST,
  //port: Number(process.env.DB_PORT),
  //port: Number(process.env.MYSQLPORT),
  //user: process.env.DB_USER,
  //user: process.env.MYSQLUSER,
  //password: process.env.DB_PASSWORD,
  //password: process.env.MYSQLPASSWORD,

  clientUrl: process.env.MYSQL_URL,

  driver: MySqlDriver,
  highlighter: new SqlHighlighter(),
  debug: process.env.NODE_ENV !== "production",

  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});

//Función que crea en caso de que no exista
//En caso de que exista compara con lo que ya hay creado y hace los cambios necesarios
export const syncSchema = async () => {

  const generator = orm.getSchemaGenerator();
    /*
    await generatr.dropSchema() --> borra y crea desde cero
    await generator.createSchema() -->
    */

  //Solo se corre en desarrollo, en producción se recomienda usar migraciones
  if (process.env.NODE_ENV !== "production") {
  await generator.updateSchema();
  } else {
    console.warn("No se recomienda ejecutar updateSchema en producción. Asegúrate de tener un proceso de migración adecuado.");
  }
};