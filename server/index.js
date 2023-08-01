const express = require("express")
const cors = require("cors")



const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors())    

const auth = require('./routes/auth.route')
app.use("/api/auth", auth)

const customers = require('./routes/customers.route')
app.use("/api/customers", customers)

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});