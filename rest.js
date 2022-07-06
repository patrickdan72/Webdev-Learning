const path = require('path');
const express = require('express');
const port = 5000;
const app = express();
const parser= require('body-parser');

app.use(parser.json())
app.use(parser.urlencoded({ extended: true }))

let books = [];

app.get('/books', (req,res)=>{
    if(books.length==0){
        res.json("Nu exista carti in colectie!");
    }
    res.json(books);
});

app.get('/books/:id', (req, res)=>{
    let id = req.params['id'];
    let ok=0;
    for(i=0;i<books.length;i++)
    {
        if(books[i].id==id)
            {
                ok=1;
                res.json(books[i]);
            }
    }
    if(!ok)
        res.json(`Cartea cu idul ${id} nu exista!`);
});

app.post('/books', (req,res)=>{
    let data = req.body;
    books.push(data)
    res.json('Cartea a fost adaugata la colectie!');
});

app.put('/books/:id', (req,res)=>{
    let ids = req.params['id'];
    let data = req.body;
    let i = books.findIndex(book => book.id == ids);
    if(i == -1)
        res.json(`Cartea cu idul ${id} nu exista!`);
    books[i].name = data.name;
    books[i].auth = data.auth;
    res.json('Datele cartii au fost schimbate cu succes!');
});

app.delete('/books/:id', (req,res)=>{
    let id = req.params['id'];
    let ok=0;
    for(i=0;i<books.length;i++)
    {
        if(books[i].id==id)
            {
                books.splice(i,1);
                ok=1;
                res.json(`Cartea cu idul ${id} a fost eliminata cu succes!`);
            }
    }
    if(!ok)
        res.json(`Cartea cu idul ${id} nu exista!`);
});
app.listen(port, function() {
    console.log(`Server deschis pe portul ${port}`)
}); 