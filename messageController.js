const mysql = require( 'mysql')
const { Socket } = require("./utils/socket");

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "chatapp"
  });



class authController{
    async postMessage(req, res){
        console.log((req.body));
        try {
            const {message, token} = req.body
            if (!message) {
                res.status(422).json({message: 'Поле message является объязательным!'})
                return
            }
            if (!token) {
                res.status(422).json({message: 'Поле token является объязательным!'})
                return
            }
            conn.query(`INSERT INTO messages (message, userToken) VALUES ('${message}', '${token}')`, function (err, result) {
                if (err){ 
                    console.log(err);
                     res.status(500).json({message: "sever error"})
                }
                 Socket.send(message)
                 res.status(200).json({message:message, token: token})
            });
        } catch (e) {
            console.log(e)
            res.status(400).json({message: "message error"})
        }
    }
}

module.exports =new authController