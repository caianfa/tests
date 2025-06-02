const fs = require('fs')
const path = require('path');
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.end('hello world')
})

app.get('/index', (req, res) => {
  const file = fs.readFileSync(path.resolve(__dirname, '../test.html'), 'utf-8')
  /* return buffer */
  res.end(file)
  /* return stream */
  // fs.createReadStream(__dirname + '/index.html').pipe(res)
})

app.listen(3000)