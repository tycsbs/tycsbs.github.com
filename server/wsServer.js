var app = require('http').createServer()
var io = require('socket.io')(app)
var PORT = 3000
app.listen(PORT)
var roomUser = []
var mine
io.on('connection', function (socket) {
    socket.on('login', function (user) {
        roomUser.push(user.name)
        mine = user.name
        io.emit('login', user)
    })

    socket.on('msg', (str) => {
        // io.emit("msg", `${str.name}: ${str.text}`)
        io.emit("msg", str)
    })
    socket.on('disconnect', () => {
        io.emit('leave', {name:mine})
    })
})

console.log(`websocket server listening on port ${PORT}`)
