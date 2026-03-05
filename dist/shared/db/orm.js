//Realizamos la configuración del ORM
import { MikroORM } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
const defaultDbName = "app2dolist";
const defaultClientUrl = `mysql://root:root@localhost:3306/${defaultDbName}`;
const mysqlUrlFromEnv = process.env.MYSQL_URL?.trim();
const databaseUrlFromEnv = process.env.DATABASE_URL?.trim();
const dbNameFromEnv = process.env.MYSQL_DB_NAME?.trim();
const validClientUrl = [mysqlUrlFromEnv, databaseUrlFromEnv].find((url) => {
    if (!url)
        return false;
    return url.startsWith("mysql://") || url.startsWith("mariadb://");
});
export const orm = await MikroORM.init({
    entities: ["dist/**/*.entity.js"],
    entitiesTs: ["src/**/*.entity.ts"],
    dbName: dbNameFromEnv || defaultDbName,
    clientUrl: validClientUrl || defaultClientUrl,
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
    await generator.updateSchema();
};
//# sourceMappingURL=orm.js.map