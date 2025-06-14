import express from 'express';
import path from 'path';

const __dirname = path.resolve();

const app = express();

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/public/main.html');
})

app.listen(3000, () =>{
    console.log('server is running');
});