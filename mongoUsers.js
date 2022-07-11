async function main()
{

const express = require('express');
const port = 5000;
const app = express();

let md5 = require('md5');

const parser = require('body-parser');
app.use(parser.json())
app.use(parser.urlencoded({ extended: true }))

const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://admin:<pass>@cluster0.2inaizf.mongodb.net/?retryWrites=true&w=majority";
const client =  new MongoClient(uri);

try{
await client.connect();
}catch(e){
    console.log(e);
    throw e;
}

app.post("/users",(req,res)=>{
    let dba = client.db("Users");
    let data = req.body;
    data.password = md5(data.password);
    dba.collection("Users").insertOne(data, (err,re)=>{
        if(err) res.status(400).json(err);
        else{
        delete data.password;
        res.json(data);
        }
    });
});

app.put("/users", (req,res)=>{
    let dba = client.db("Users");
    let data = req.body;
    let pass = data.password;
    delete data.password;
    dba.collection("Users").updateOne({email: data.email, password: md5(pass)},{$set:data}, (err,re)=>{
        if(err) throw err;
        if(re){
            res.json(data);
        }
        else{
            res.json({message: "Wrong email or password!"});
        }
    });
});

app.delete("/users/:id", (req,res)=>{
    let dba = client.db("Users");
    let id = req.params['id'];
    let data = req.body;
    let ok = dba.collection("Users").deleteOne({email: id, password: md5(data.password)});
    if(ok.deletedCount == 0){
        res.json({message: " Wrong email or password!"});
    }
    else{
        res.json({message: "User succesfully deleted!"});
    }
});

app.post("/auth", (req,res)=>{
    let em = req.body.email;
    let pass = req.body.password;
    let dba = client.db("Users");
    dba.collection("Users").findOne({email : em, password: md5(pass)}, (err,re)=>{
        if(err) throw err;
        if(re){
            res.json({error: null, data: em});
        }
        else{
            res.status(404).json({error: "Not found", data: null});
        }
    });
});

app.listen(port, function() {
    console.log(`Server opened on port ${port}`);
});
}; 

main();
