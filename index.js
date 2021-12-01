
const conn = require("./db/conn")
const app = require("./server")

conn
.sync()
.then(() => {
    app.listen(3000)
})
.catch((err) => console.log(err))