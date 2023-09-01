  const express = require("express")
  const cors = require("cors")


  const corsOptions = {
    origin: 'http://localhost:5173', // Especifica el origen permitido
    methods: 'GET,POST,PUT,DELETE', // Métodos HTTP permitidos
    optionsSuccessStatus: 204, // Código de respuesta para opciones pre-vuelo
  };




  const PORT = process.env.PORT || 3001;
  const app = express();
  app.use(cors(corsOptions));

  const auth = require('./routes/auth.route')
  app.use("/api/auth", auth)

  const dashboard = require('./routes/dashboard.route.js')
  app.use("/api/dashboard", dashboard)

  const borrowers = require('./routes/borrowers.route')
  app.use("/api/borrowers", borrowers)

  const loans = require('./routes/loans.route')
  app.use("/api/loans", loans)

  const pdf = require('./routes/generatepdf')
  app.use("/api/pdf", pdf)

  app.get('/', (req, res) => {
    res.send('Servidor Inicializado Correctamente!');
  });


  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });