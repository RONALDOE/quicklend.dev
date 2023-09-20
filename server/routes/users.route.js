
const express = require("express");
const router = express.Router();
const db = require("../config/db.config");

router.use(express.json());


router.get('/', (req, res) =>{
    
    const query = 'SELECT id, username, email, admin_level from users '

    db.query(query, (err, data) =>{
        if(err) {
            res.sendStatus(500)
            return 

        }

        if(data.length > 0 ){
            res.send(data)
            
        } else {res.sendStatus(404)}
    })

    

})

module.exports = router