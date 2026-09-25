const app = require('./app');
const { parsePort } = require('./config');

const port = parsePort(process.env.PORT);

app.listen(port, '0.0.0.0', () => {
  console.log(`Application listening on port ${port}`);
});