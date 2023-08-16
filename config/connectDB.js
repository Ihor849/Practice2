// const mongoose = require('mongoose');
const { trace } = require("console");
const { connect } = require("mongoose"); //Деструкторизировали
// mongoose.connect('mongodb://127.0.0.1:27017/test');

const connectDB = async () => {
    try {
        const db = await connect(process.env.DB_HOST);
        console.log(`Database is connected. Name: ${db.connection.name}. Host: ${db.connection.host}. Port: ${db.connection.port}`.yellow.italic.bold);
    } catch (error) {
        console.log(error.message.red.bold);
        process.exit(1)
    }
  
};

module.exports = connectDB;

// const Cat = mongoose.model('Cat', { name: String });

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));
