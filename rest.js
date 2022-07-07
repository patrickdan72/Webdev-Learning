const path = require('path');
const express = require('express');
const port = 5000;
const app = express();
const parser= require('body-parser');

app.use(parser.json())
app.use(parser.urlencoded({ extended: true }))

let books = [];

app.get('/books', (req,res)=>{
    if(books.length==0)
        res.json({"message":`There are no books in the collection!`});
    else
        res.json(books);
});

app.get('/books/:id', (req, res)=>{
    let id = req.params['id'];
    let found = books.filter(book => book.id == id);
    if(!found.length)
        res.json({"message":`The book with the id ${id} does not exist!`});
    else
        res.json(found);
});

app.post('/books', (req,res)=>{
    let data = req.body;
    books.push(data)
    res.json({"message":'The book has been added to the collection!'});
});

app.put('/books/:id', (req,res)=>{
    let ids = req.params['id'];
    let data = req.body;
    let i = books.findIndex(book => book.id == ids);
    if(i == -1)
        res.json({"messge":`The book with the id ${id} does not exist!`});
    else{
    books[i].name = data.name;
    books[i].auth = data.auth;
    res.json({"message":`The book's data was succesfully updated!`});
    }
});

app.delete('/books/:id', (req,res)=>{
    let id = req.params['id'];
    let aux = books.filter(book => book.id != id);
    if(aux.length == books.length)
        res.json({"message":`The book with the id ${id} does not exist!`});
    else
        res.json({"message": `The book with id ${id} was succesfully deleted!`});
    books = aux
});

app.listen(port, function() {
    console.log(`Server opened on port ${port}`)
}); 
