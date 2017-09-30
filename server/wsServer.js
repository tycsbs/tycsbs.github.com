var app = require('http').createServer()
var io = require('socket.io')(app)
var PORT = 3000
app.listen(PORT)
var clientCount = 0
io.on('connection',function(socket){
	clientCount++
	socket.name = `用户${clientCount}`
	io.emit('enter',`${socket.name}: 上线`)

	socket.on('msg',(str) => {
		io.emit("msg",`${socket.name}: ${str}`)
	})
	socket.on('disconnect',() => {
		io.emit('leave',`${socket.name}: 离线`)
	})
})

console.log(`websocket server listening on port ${PORT}`)
