const User = require('./models/User')
const mysql = require( 'mysql')

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "chatapp"
  });

  function generateToken(length){
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];  
    for (var i=0; i<length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

class authController{
    async login(req, res){
        console.log((req.body));
        try {
            const {userName, password} = req.body
            if (!userName) {
                res.status(422).json({message: 'Поле userName является объязательным!'})
                return
            }
            if (!password) {
                res.status(422).json({message: 'Поле password является объязательным!'})
                return
            }
            conn.query(`SELECT * FROM users WHERE userName = '${userName}'`, function (err, result) {
                if (err){ 
                    console.log(err);
                     res.status(500).json({message: "sever error"})
                }
                if(result.length==0){
                        var token=generateToken(24)
                        var sql = `INSERT INTO users (userName, password, token) VALUES ('${userName}', '${password}', '${token}')`;
                        conn.query(sql, function (err, result) {
                            if (err){ 
                                console.log(err);
                                 res.status(500).json({message: "sever error"})
                            }
                            res.status(200).json({message: `Вы успешно былы зарегистрированы!`, name: userName, token: `'${token}'`})
                        });
                        return
                }
                console.log(result[0].token);
                res.status(200).json({message: `Успешный вход!`, name: userName, token: `'${result[0].token}'`})
            });
        } catch (e) {
            console.log(e)
            res.status(400).json({message: "Login error"})
            const user = new User({userName, password})
        }
    }

    async registration(req, res){
        try {
            
        } catch (e) {
            console.log(e)
            res.status(400).json({message: "Login error"})
        }
    }

    async getUsers(req, res){
        try {
            const user1 = new User({userName: "User1", password: "1234"})
            res.send(user1)
        } catch (e) {
            
        }
    }
}

module.exports =new authController