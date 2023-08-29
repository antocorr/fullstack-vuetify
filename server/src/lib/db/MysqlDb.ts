import * as mysql from "mysql2/promise";
import path from "path";
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '/../.env') });
export class Db {
    pool: mysql.Pool;
    constructor() {
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
    async find(table, where = null, fields = null, limit = null, dryRun = false) {

        let fieldsString = '*';
        if (fields) {
            fieldsString = fields.join(', ');
        }

        const query: any = {
            begin: `SELECT ${fieldsString} FROM ${table}`,
            where: [],
            limit: ''
        };

        if (limit) {
            query.limit = `LIMIT ${limit.join(', ')}`;
        }

        if (where) {
            for (const [key, value] of Object.entries(where)) {
                let symb = '=';

                if (key.includes('=') || key.includes('>') || key.includes('<')) {
                    symb = '';
                }
                let condition;

                if (typeof value === 'string') {
                    condition = `${key} ${symb} ${mysql.escape(value)}`;
                } else if (typeof value === 'number') {
                    condition = `${key} ${symb} ${value}`;
                } else {
                    condition = `${key} ${symb} ${mysql.escape(value)}`;
                }

                query.where.push(condition);
            }
        }else{
            where = {};
        }

        query.where = query.where.length > 0 ? `WHERE ${query.where.join(' AND ')}` : '';

        const finalQuery = `${query.begin} ${query.where} ${query.limit}`;

        if (dryRun) {
            return mysql.format(finalQuery, Object.values(where));
        }

        return await this.pool.query(finalQuery, Object.values(where));

        //return rows;
    }
}
export default new Db();