const express = require("express");
const router = express.Router();
const db = require("../config/db.config");
const nodemailer = require("nodemailer");
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



router.put('/changePassword', (req, res) => {
  const email = req.body.email;
  const password = req.body.newPassword;

  const query = `  Update Users set psswd = '${password}' WHERE email = '${email}'`;

  db.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    if (results.affectedRows > 0) {
      console.log({state: 500, msg: "Password Update Sucessfully"})
      res.sendStatus(200);
    } else {
      console.log({state: 401, msg: "No Emails Matched"})

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


router.post("/send-recovery-email", (req, res) => {
  const { email } = req.body;

  // Código para generar y enviar el correo de recuperación aquí
  

  function generateRandomCode(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
  
    return code;
  }
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "est.ronaldoernesto@gmail.com",
      pass: "uqbx lamt xtui bqnz",
    },
  });

 
  const randomCode = generateRandomCode(8)

  const query = `SELECT username FROM Users WHERE email = '${email}' `;
  db.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    if (results.length > 0) {
      console.log(results)
      const username = results[0].username
      const mailOptions = {
        from: "est.ronaldoernesto@gmail.com",
        to: email,
        subject: `Recuperación de contraseña - ${username}`,
        text: `Tu Codigo de Recuperacion Es ${randomCode}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error al enviar el correo de recuperación:", error);
          res.status(500).json({ msg: "Error al enviar el correo de recuperación", code: null });
        } else {
          console.log("Correo de recuperación enviado:", info.response);
          res.json({ msg: "Correo de recuperación enviado con éxito", code: randomCode});
        }
      });

    } else {
      res.sendStatus(401).send({msg: "No existe usuario con este correo", code: null });
    }
  });


 
});

module.exports = router
