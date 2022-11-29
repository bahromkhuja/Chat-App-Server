import express from 'express'
import { Server } from 'socket.io';
import fs from 'fs'
import mysql from 'mysql'

const app = express();

app.use(express.json())
var PORT = 3000;
const server = app.listen(PORT, ()=>{
    console.log(`Server was running on port: ${PORT}`)
})


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "chatapp"
  });

//Playing variables:
const io = new Server(server);

app.get('/getMessages', (req, res)=>{
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT message FROM messages", function (err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.json(result)
        });
      });
})

app.post('/message', (req, res)=>{
    io.send("привет")
    res.status(200).send("Success!")
})



//Socket.io Connection------------------
io.on('connection', (socket) => {

    console.log("New socket connection: " + socket.id)

    socket.on('message', (mess) => {
        var messages=JSON.parse(mess)
        con.connect(function(err) {
            console.log("Connected!");
            var sql = `INSERT INTO messages (message, user) VALUES ('${messages.message}', '${messages.user}')`;
            con.query(sql, function (err, result) {
              console.log("1 record inserted");
            })
            io.send(messages.message);
          })
        console.log(messages)
    
    })
})