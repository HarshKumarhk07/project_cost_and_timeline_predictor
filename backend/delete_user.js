require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const deleteUser = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/cost_timeline_db';
        console.log(`Connecting to: ${uri}`);
        await mongoose.connect(uri);

        const email = 'harshkumarhk@gmail.com';
        const result = await User.deleteOne({ email });

        if (result.deletedCount > 0) {
            console.log(`SUCCESS: User ${email} deleted.`);
        } else {
            console.log(`User ${email} not found.`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

deleteUser();
