import * as mysql from "mysql2";
import path from "path";
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '/../.env') });
export class Db{
    pool:mysql.Pool;
    constructor(){
        this.pool = mysql.createPool({
            host: process.env.db_host,
            port: +process.env.db_port,
            user: process.env.db_user,
            password: process.env.db_password,
            database: process.env.db_name,
            waitForConnections: true,
            connectionLimit: 8,
            queueLimit: 0
        });
        console.log("Db connected")
    }
    static buildWhere(queryObject) {
        const keys = Object.keys(queryObject);
        const values = Object.values(queryObject);
        const wherestring = " WHERE " + keys.join(" = ? AND ") + " = ? ";
        return [wherestring, values];
    }
    static buildInsertQuery(table, data): Array<any> {
        const fieldsPart = Object.keys(data).join(", ");
        const values: Array<any> = Object.values(data);
        const valuesPart = values.map(e => { return "?" }).join(", ");
        const query: string = `INSERT INTO ${table} (${fieldsPart}) VALUES(${valuesPart})`;
        return [query, values];
    }
}
export default new Db();