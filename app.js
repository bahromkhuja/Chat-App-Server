const express = require( 'express')
const mysql = require( 'mysql')
const  authRouter = require( './authRouter')
const  messageRouter = require( './messageRouter')
const socket = require('socket.io');

const PORT= process.env.PORT || 5000

const app=express()
app.use(express.json())
app.use("/auth", authRouter)
app.use("/message", messageRouter)

const server = app.listen(PORT, () => { console.log(`Server started on port: ${PORT}`) } )

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "chatapp"
})

// const { io } = require("./utils/socket");
// io.attach(server);

const io = socket(server)
//Socket.io Connection------------------
io.on('connection', (socket) => {

  console.log("New socket connection: " + socket.id)

  socket.on('message', (mess) => {
      var messages=JSON.parse(mess)
      con.connect(function(err) {
          console.log("Connected!");
          var sql = `INSERT INTO messages (message, userToken) VALUES ('${messages.message}', '${messages.token}')`;
          con.query(sql, function (err, result) {
            console.log("1 record inserted");
          })
          io.send(messages.message, messages.token)
        })
      console.log(messages)
  
  })
})



// app.get('/getMessages', (req, res)=>{
//     con.connect(function(err) {
//         if (err) throw err;
//         con.query("SELECT message FROM messages", function (err, result, fields) {
//           if (err) throw err;
//           console.log(result);
//           res.json(result)
//         });
//       });
// })

// app.post('/message', (req, res)=>{
//     io.send("привет")
//     res.status(200).send("Success!")
// })

module.exports = app;



//Socket.io Connection------------------
// io.on('connection', (socket) => {

//     console.log("New socket connection: " + socket.id)

//     socket.on('message', (mess) => {
//         var messages=JSON.parse(mess)
//         con.connect(function(err) {
//             console.log("Connected!");
//             var sql = `INSERT INTO messages (message, userToken) VALUES ('${messages.message}', '${messages.token}')`;
//             con.query(sql, function (err, result) {
//               console.log("1 record inserted");
//             })
//             io.send(messages.message);
//           })
//         console.log(messages)
    
//     })
// })



