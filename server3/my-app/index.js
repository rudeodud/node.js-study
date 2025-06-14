import express from 'express';
import nunjucks from 'nunjucks';
import bodyParser from 'body-parser';
import path from "path";
import fs from 'fs';
import mongoose from 'mongoose';

const app = express();

const __dirname = path.resolve();

const filepath = path.join(__dirname, 'data', 'writing.json')

// body parser set
app.use(bodyParser.urlencoded({ extended: false })); // express 기본 모듈 사용
app.use(bodyParser.json());

// view engine set
app.set('view engine', 'html'); // main.html -> main(.html)

// nunjucks
nunjucks.configure('views', {
    watch: true, // html 파일이 수정될 경우, 다시 반영 후 렌더링
    express: app
})

mongoose.connect('mongodb://localhost:27017/mydb')
  .then(() => console.log("✅ MongoDB 연결 성공"))
  .catch(err => console.error("❌ MongoDB 연결 실패:", err));

const writingSchema = new mongoose.Schema({
  title: String,
  contents: String,
  date: String
});

const Writing = mongoose.model('Writing', writingSchema);


// middleware
// main page GET
app.get('/', async (req, res) => {
    const fileData = fs.readFileSync(filepath);
    const writings  = JSON.parse(fileData);

    console.log(writings);
    res.render('main', { list: writings });
});

app.get('/write', (req, res) => {
    res.render('write');
});

app.post('/write', async (req, res) => {
    const title = req.body.title;
    const contents = req.body.contents;
    const date = req.body.date;

    const fileData = fs.readFileSync(filepath);//파일 읽기
    console.log(fileData);

    const writings = JSON.parse(fileData);// 파일 변환
    console.log(writings);

    //requrst 저장
    writings.push({
        'title': title,
        'contents': contents,
        'date': date
    })
    // data/writing.json 저장
    fs.writeFileSync(filepath, JSON.stringify(writings));

    res.render('detail', { 'detail': { title: title, contents: contents, date: date } });
});

app.get('/detail', async (req, res) => {
    res.render('detail');
})

app.listen(3000, () => {
    console.log('Server is running');
});