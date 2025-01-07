const mongoose = require('mongoose')

function connect() {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Connected to MongoDB ✅'))
        .catch(err => console.error('Error Connecting to MongoDB ❌:', err))
}

module.exports = connect;