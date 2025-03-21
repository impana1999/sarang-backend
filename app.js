const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json({limit: '70mb'}));
app.use(bodyParser.urlencoded({limit: '70mb', extended: false, parameterLimit: 1000000}));
const cors=require("cors")
app.use(cors())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS,PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });
  
  const http=require('http');
  const server = http.createServer(app);
  const io = require('socket.io')(server,{
      cors: {
        origin: '*',
      }
    });
  const path=require('path');
  const staticPath=path.join(__dirname,'/public');
  app.use(express.static(staticPath))
  app.get('', function(req, res,next) {  
      res.sendFile(__dirname + "/public/index.html");
  });
  let usersJoin={}
  let UserBlock={}
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
  
    socket.on('userLoggedIn', ({ userId }) => {
      console.log(`User logged in: ${userId}`);
      usersJoin[socket.id] = userId;
      io.emit('userStatusChanged', { userId, status: 'online' });
    });
    socket.on('userLogin', (data) => {
      console.log('User userLogin', data);
      socket.join(data.userid);
    if(!UserBlock[socket.id]){
          UserBlock[socket.id]=data.userid
    }
    console.log("block",UserBlock)
     
  });
    socket.on('joinRoom', (room) => {
      socket.join(room);
      if (!usersJoin[socket.id]) {
        usersJoin[socket.id] = room;
      }

      io.to(room).emit("online message", [socket.id], { online: true });
    });
  
    socket.on('online message', (room) => {
      io.to(room).emit('online message1', { online: true, time: new Date().toLocaleTimeString() });
    });
  
    socket.on('firstDeviceLogout',(data)=>{
      console.log('firstDeviceLogout',data)
      io.to(data.id).emit('firstDeviceLogout1',{data})
    })
    
    socket.on('typing', (data) => {
      console.log('typing...', data[0].room,data[0].socket);
      i ,o.to(data[0].room).emit('typing1', data);
    });
  
    socket.on('stopTyping', (data) => {
      console.log('stoptyping...', data[0].room,data[0].socket);
      io.to(data[0].room).emit('stopTyping1', data);
    });
  
    socket.on('message', (data) => {
      console.log('message', data);
      io.to(data.room_id).emit('messageSend', data );
    });
  
    socket.on('getmessage', (data) => {
      console.log('getmessage', data);
      io.to(data.room_id).emit('getmessage', { ...data, time: new Date().toLocaleTimeString() });
    });
  
    socket.on('user attachment', (data) => {
      console.log('user attachment', data);
      io.to(data.room_id).emit('user attachment', { ...data, time: new Date().toLocaleTimeString()});
    });
    socket.on('location', (data) => {
      console.log('location', data);
      io.to(data.room_id).emit('location', { ...data, time: new Date().toLocaleTimeString()});
    });

    socket.on('AdminBlock',(data)=>{
      console.log('Admin Block',data)
      io.to(data._id).emit('userBlockStatus',{data})
   })
  
    socket.on('disconnect', () => {
      if (usersJoin.hasOwnProperty(socket.id)) {
        const userId = usersJoin[socket.id];
        // let time = new Date().toLocaleString();
        const time = new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        });
        delete usersJoin[socket.id];
        io.emit('userStatusChanged', { userId, time, status: 'offline' });
        console.log(`User logged out: ${userId}`);
      }
    });
  });
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Databse Connected Successfully!!");    
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});

const router = require('./app/routers/index');
app.use('/', router);


app.use((req, res, next)=>{
  next(new AppError(`can't find ${req.originalUrl} on the server`, 404 ))
})
const errorHandler = require("./app/utils/errorHandler.js");
const AppError = require('./app/utils/appError.js');
app.use(errorHandler)

app.get('/', (req, res) => {
    res.json({"message": "This is for testing"});
});


server.listen(8002, () => {
    console.log("Server is listening on port 8002");
});

