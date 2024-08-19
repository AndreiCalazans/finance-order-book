const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Send fake order book data 40 times per second
    setInterval(() => {
        const fakeData = generateFakeOrderBook();
        socket.emit('orderBookUpdate', fakeData);
    }, 25); // 40 times per second = 1000ms / 40 = 25ms

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const generateFakeOrderBook = () => {
    const orders = [];
    for (let i = 0; i < 20; i++) {
        orders.push({
            price: (Math.random() * 100).toFixed(2),
            amount: (Math.random() * 10).toFixed(2),
            side: Math.random() > 0.5 ? 'buy' : 'sell'
        });
    }
    return orders;
};

server.listen(3000, () => console.log('Server is running on port 3000'));
