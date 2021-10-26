const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');


const mongod = new MongoMemoryServer();

exports.dbConnect = async () => {

    await mongod.start();
    const mongoUri = mongod.getUri();
    
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

exports.dbDisconnect = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
};


