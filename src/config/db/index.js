require("dotenv").config();
const mongoose = require('mongoose');

async function connect() {

    try {
        await mongoose.connect(process.env.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Connect successfully.");
    } catch (e) {
        console.log("Connect failure!!!");
    }

}

module.exports = { connect };