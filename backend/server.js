const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const connectDB = require('./db');
const Dish = require('./dishModel');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjusted to allow all origins for the socket connection
    methods: ['GET', 'POST']
  }
});

app.use(cors()); // Adjusted to allow all origins for the API requests
app.use(express.json());

connectDB();

app.get('/api/dishes', async (req, res) => {
  const dishes = await Dish.find();
  res.json(dishes);
});

app.post('/api/dishes/toggle', async (req, res) => {
  const { dishId } = req.body;
  const dish = await Dish.findOne({ _id: dishId }); // Use _id instead of dishId
  if (dish) {
    dish.isPublished = !dish.isPublished;
    await dish.save();
    io.emit('update', dish);
    res.json(dish);
  } else {
    res.status(404).json({ message: 'Dish not found' });
  }
});

// Change Stream setup
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
  const changeStream = db.collection('dishes').watch();

  changeStream.on('change', (change) => {
    if (change.operationType === 'update' || change.operationType === 'insert') {
      const updatedDishId = change.documentKey._id;
      Dish.findById(updatedDishId).then((updatedDish) => {
        io.emit('update', updatedDish);
      });
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
