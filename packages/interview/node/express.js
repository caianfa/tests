const express = require('express')

const app = express();

app.get('/', (req, res) => {
  res.send('html')
})

app.use((req, res, next) => {
  console.log(111);
  next()
})

app.use((req, res, next) => {
  console.log(222);
})

app.listen(3333, () => {
  console.log('server start success');
});
