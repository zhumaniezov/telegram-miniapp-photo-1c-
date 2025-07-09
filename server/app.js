const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: './upload/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.post('/upload', upload.single('photo'), (req, res) => {
  console.log('Файл получен:', req.file.filename);
  res.json({ message: 'Файл получен', filename: req.file.filename });
});

app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});
