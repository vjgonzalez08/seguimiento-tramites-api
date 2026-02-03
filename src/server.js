const app = require('./app');
const { port } = require('./config/env');

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
