import express from "express"
import bodyParser from "body-parser";
import cors from "cors";
const app = express()
const port = 3000
import path from "path";
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '/../.env') });
console.log(process.env.ENV);
import db, { Db } from "./lib/db/MysqlDb"
import { ResultSetHeader } from "mysql2/promise";
app.use(bodyParser.json({ limit: "100mb" })); // to support JSON-encoded bodies
app.use(
    bodyParser.urlencoded({
        // to support URL-encoded bodies
        extended: false,
        limit: "100mb",
    })
);
app.use(
    cors({
        origin: [
            "http://localhost:8080",
            "http://localhost:8000",
            "https://localhost",
        ],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    })
);
app.listen(port, () => {
    console.log(`Server app listening on port ${port}`)
})
app.get('/users/:name', (req, res) => {
    console.log("/users requested");
    res.status(200).json({ name: req.params.name })

})
app.get('/users', (req, res) => {
    console.log("/ requested");
    db.pool.query("SELECT * FROM family_members", function (err, rows, fields) {
        // Connection is automatically released when query resolves
        res.status(200).json({ success: true, items: rows })
    });

})

app.get("/family-members", (req, res) => {
    // db.pool.query("SELECT * FROM family_members").then(([rows, fields]) => {
    //     // Connection is automatically released when query resolves
    //     res.status(200).json({ success: true, items: rows })

    // }).catch(err => {
    //     res.status(200).json({ success: false, items: [] })
    // });
    let where = null;
    if(req.query){
        where = req.query
    }
    db.find("family_members", where).then(([rows, fields]) => {
        // Connection is automatically released when query resolves
        res.status(200).json({ success: true, items: rows })

    }).catch(err => {
        console.log(err);
        res.status(200).json({ success: false, items: [] })
    });
})
app.post("/family-members", async (req, res) => {
    const [query, values]: any = Db.buildInsertQuery('family_members', { name: req.body.name, surname: req.body.surname, parent: req.body.parent ? req.body.parent.id : 0 });
    const insert = await db.pool.query(query, values);
    const insertion = insert[0] as ResultSetHeader;
    res.status(200).json({ success: true, insertId: insertion.insertId })
})
app.delete("/family-members/:id", async (req, res) => {
     db.pool.query("DELETE FROM family_members WHERE id = ?", [req.params.id]).then(([rows, fields]) => {
        // Connection is automatically released when query resolves
        res.status(200).json({ success: true })

    }).catch(err => {
        res.status(200).json({ success: false })
    });
})