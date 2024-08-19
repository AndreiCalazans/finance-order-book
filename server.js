const express = require('express');

const app = express();

app.use(express.static('public'));

app.get('/order-book-stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send an initial message to start the event stream
    res.write('retry: 10000\n\n');

    const sendFakeData = () => {
        const fakeData = generateFakeOrderBook();
        res.write(`data: ${JSON.stringify(fakeData)}\n\n`);
    };

    // Send fake order book data 40 times per second
    const intervalId = setInterval(sendFakeData, 25); // 40 times per second

    // Cleanup when the client disconnects
    req.on('close', () => {
        clearInterval(intervalId);
        res.end();
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

app.listen(3000, () => console.log('Server is running on port 3000'));
