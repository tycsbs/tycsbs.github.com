var app = require('http').createServer()
var io = require('socket.io')(app)
var PORT = 3000
app.listen(PORT)
io.on('connection',function(socket){
	socket.on('enter',(str) => {
		io.emit('enter',`${str.name}: 上线`)
	})

	socket.on('msg',(str) => {
		io.emit("msg",`${str.name}: ${str.text}`)
	})
	socket.on('disconnect',(str) => {
		io.emit('leave',`${str.name}: 离线`)
	})
})

console.log(`websocket server listening on port ${PORT}`)
