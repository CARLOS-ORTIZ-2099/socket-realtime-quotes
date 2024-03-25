// el archivo que sera el servidor

const http = require('http')
const {Server} = require('socket.io')
const fs = require('fs')


const server = http.createServer( (req, res) => {
         if(req.url === '/') {
           const stream = fs.createReadStream('./index.html') 
           stream.pipe(res) 
          // stream.on('end', () => console.log('se termino de leer'))
           stream.on('error', (err) => {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(`Error al leer el archivo index: ${err}`);
            });
        }    
        else if(req.url === '/admin'){
            const stream = fs.createReadStream('./admin.html') 
            stream.pipe(res) 
            stream.on('error', (err) => {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(`Error al leer el archivo admin: ${err}`);
            });
        }
        else {
            res.writeHead(404,{'Content-Type': 'text/html'})
            res.end('<h1>page not found</h1>')
        }
       
})

server.listen(3000,() => console.log('server in listening on port 3000'))

// instanciando un objeto del tipo Server
const io = new Server(server)

// ejecuto el metodo connection de la instancia io, con este metodo escucho todos los sockets entrantes
io.on('connection', (socket) => {
    // apenas se establesca la connecion se emitira un evento welcome con un mensaje
    // y se le pasa un argumento
    socket.emit('welcome', { data: 'welcome' });
  
    // defino un evento new e imprimira el parametro data, que sera el valor que se le pase como argumento desde el archivo admin.html
    socket.on('new' , (data) => {   
            // impresion en la shell
            console.log(data)
            // enseguida emito otro evento next que se define en el archivo index.html
            // y se le pasa como argumento un objeto con los datos que vengan del parametro data que se envian desde el archivo admin.html
            io.sockets.emit( 'next' , { data : data } )
    }) 
});
