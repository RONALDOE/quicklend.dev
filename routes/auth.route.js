const express = require("express");
const router = express.Router();
const db = require("../config/db.config");
router.use(express.json())


const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {
  const user = req.body.user;
  const password = req.body.password;

  const query = `SELECT * FROM Users WHERE username = '${user}' AND psswd = '${password}'`;
  db.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    if (results.length > 0) {
      console.log(results)
      const user = results[0]
      const token = jwt.sign({ user }, 'secretkey', {expiresIn: "1h"} );
      res.json({ token, user });
    } else {
      res.sendStatus(401);
    }
  });
});

router.post('/check-token', (req, res) =>{
  const { token } = req.body;

  try {
    // verifica que el token es válido
    const decoded = jwt.verify(token, 'secretkey');
    // si no hay errores, el token es válido
    return res.json({ valid: true });
  } catch (error) {
    // si hay un error, el token es inválido
    return res.json({ valid: false });
  }
})

module.exports = router
