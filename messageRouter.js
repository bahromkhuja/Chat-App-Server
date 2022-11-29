const Router = require ('express')
const router=new Router
const controller = require('./messageController')

router.post('/postMessage', controller.postMessage)


module.exports = router