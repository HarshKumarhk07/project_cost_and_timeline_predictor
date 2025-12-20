```javascript
const mongoose = require('mongoose');
const User = require('./backend/src/models/User'); // Adjust path as needed
require('dotenv').config({ path: './backend/.env' });

const bcrypt = require('bcryptjs'); // Assuming bcryptjs based on common patterns, will verify package.json

const createUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'manual.test@gmail.com';
        const rawPassword = 'Password@123';
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(rawPassword, salt);
        
        // delete existing
        await User.deleteOne({ email });

        const user = await User.create({
            username: 'ManualTest',
            email,
            password
        });

        console.log('User created:', user.email);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createUser();
