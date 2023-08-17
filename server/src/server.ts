import express from "express"
import bodyParser from "body-parser";
import cors from "cors";
const app = express()
const port = 3000
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
    res.status(200).json({name: req.params.name})
    
})
app.get('/users', (req, res) => {
    console.log("/ requested");
    res.status(200).json({name: req.params.name})
    
})



const familyMembers = ['Martin', 'Dario', 'Valeria', 'Antonio'];

app.get("/family-members", (req, res) => {
    console.log("getting fm")
    res.json({
        success: true,
        items: familyMembers
    })
})
app.post("/family-members", (req, res) => {
    console.log(req.body)
    familyMembers.push(req.body.name);
    res.json({
        success: true,
        items: familyMembers
    })
})