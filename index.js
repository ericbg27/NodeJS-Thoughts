const conn = require("./database/models/").sequelize
const app = require("./server")

conn
.sync()
.then(() => {
    app.listen(3000)
})
.catch((err) => console.log(err))