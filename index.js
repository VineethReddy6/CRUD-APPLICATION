const mongoClient = require("mongodb").MongoClient;
const next = require("next");
const jwt = require("jsonwebtoken");
const express = require("express");
const { ConnectionClosedEvent } = require("mongodb");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoClient.connect("mongodb://localhost:27017", (err, client) => {
    if (err) {
        console.log("Error");
    }
    else {
        db = client.db("studb");
    }
})
function verifyToken(req, res, next) {
    let token = req.headers['authorization'];
    console.log(token);
    token = token.split(" ")[1];
    if (token) {
        jwt.verify(token, "keyVineeth", (err, decoded) => {
            if (err) {
                res.json({
                    success: false,
                    message: "token is invalid"
                });
            } else {
                next();
            }
        });
    } else {
        res.json({
            success: false,
            message: "need a token"
        })

    }
}
// app.get("/login",(req,res) =>{
//     const user = req.body.username;
//     const pass = req.body.password;
//     db.collection("users").find({"username":user, "password":pass}).toArray((err,item)=>{
//         // console.log(item);
//         if(err) {}
//         if(item) {
//             const token = jwt.sign(
//                 {
//                     "username":user 
//                 },
//                 "keyVineeth"
//             );
//             // console.log(token);
//             res.json({
//                 success:true,
//                 message:"Authentication successful",
//                 token:token
//             })
//         }
//         else {
//             res.json({
//                 success:false,
//                 message:"Authentication Unsuccessful",
//             })
//         }
//     })
// });


app.post("/login", (req, res) => {
    const user = req.body.username;
    const pass = req.body.password;
    // console.log(user +" " + pass);
    db.collection("users").find({ "username": user, "password": pass }).toArray((err, item) => {
        // console.log(item);
        if (err) { }
        if (item.length != 0) {
            const token = jwt.sign(
                {
                    "username": user
                },
                "keyVineeth"
            );

            res.json({
                success: true,
                token: token
            });
        }
        else {
            res.json({
                success: false,
                message: "Authentication Unsuccessful",
            });
        }
    })
});
app.get("/operations", (req, res) => {
    res.sendFile(__dirname + "/operations.html");
})
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});
app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/register.html");
});
app.get("/stu", (req, res) => {
    db.collection("stu").find().toArray((err, items) => {
        if (err) { }
        res.send(items);
    })
});
app.post("/addstu", (req, res) => {
    db.collection("stu").insertOne({
        _id: req.body.id,
        name: req.body.name,
        age: req.body.age
    });
    console.log("inserted successfully");
    res.end();
});
app.put("/updatestu/:id", (req, res) => {
    db.collection("stu").updateOne({ "_id": req.params.id }, { $set: { name: req.body.name, age: req.body.age } });
    console.log("updated");
});
app.delete("/deletestu/:id", (req, res) => {
    // console.log(req.body.key);
    // console.log(req.params.id);

    db.collection("stu").deleteOne({ "_id": req.params.id });
    console.log("deleted");
})

app.get("/stu/:id", (req, res) => {
    db.collection("stu").find({ "_id": req.params.id }).toArray((err, item) => {
        if (err) { }
        console.log(item);
        res.send(item);
        res.end();
    })
});
app.listen("4000", () => console.log("server started"));