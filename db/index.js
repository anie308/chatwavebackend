const mongoose = require('mongoose');

mongoose
.connect(process.env.MONGO_URL)
.then(
    () => console.log('ChatWave Database Connected')
)
.catch(
    err=> console.log('db connection failed:', err.message || err)
)