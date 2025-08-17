const app = require('./app');

const port = app.get('port');
app.listen(port, () => {
  console.log(`App is live on http://localhost:${port}`);
});
