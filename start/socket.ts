import Ws from 'App/Services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */
Ws.io.on('connection', (socket) => {
  socket.on('testecliente', (data) => {
    console.log(data)
    socket.emit('testeserver', { hello: 'world' })
  })
})
