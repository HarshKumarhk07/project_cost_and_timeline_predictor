require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const checkUser = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/cost_timeline_db';
        console.log(`Connecting to: ${uri}`);
        await mongoose.connect(uri);

        const email = 'harshkumarhk@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            console.log(`User FOUND: ${user.email}`);
            console.log(`Has Password: ${!!user.password}`);
            console.log(`ID: ${user._id}`);
        } else {
            console.log(`User NOT FOUND: ${email}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

checkUser();
