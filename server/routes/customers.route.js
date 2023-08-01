const express = require("express");
const router = express.Router();
const db = require("../config/db.config");
router.use(express.json())



router.get('/', (req, res) => {

  const query = `SELECT * FROM Borrowers `;
  db.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    if (results.length > 0) {
      console.log(results)
      const customers = results
      res.json({  customers });
      console.log(results)
      return {code: 1}
    } else {
      res.sendStatus(401);
    }
  });
});


module.exports = router
