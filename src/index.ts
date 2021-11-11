import express from 'express';

const app = express();
app.listen(80, () => {
  console.log('server running on port 80');
});

app.get('/about', (req, res) => {
  res.status(200).json({'stocks': 'stocks'})
});