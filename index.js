const express = require('express');
const port = 5000;
const app = express();
const parser= require('body-parser');

app.use(parser.text())
app.use(parser.urlencoded({ extended: true }))

app.get('/multiply/:id1/:id2', (req,res)=>{
    let id1 = req.params['id1'];
    let id2 = req.params['id2'];
    res.json({response: parseInt(id1)*parseInt(id2)});
});

app.get('/hello/:id', (req,res)=>{
    let name = req.params['id'];
    res.attachment("Hello.txt");
    res.type('txt');
    res.send('Hello ' + name + '!');
});

app.post('/multiply', (req,res)=>{
    let num=0;
    let mult=1;
    let data = req.body;
    data = JSON.stringify(data);
    for(i=0;i<data.length;i++){
        if(data[i]>='0' && data[i]<='9')
            num=num*10+(data[i]-'0');
        if(data[i]==' '){
            mult*=num;
            num=0;
        }
    }
    mult*=num;
    res.json(mult);
});

app.listen(port, function() {
    console.log(`Server deschis pe portul ${port}`)
}); 