const mongoose = require('mongoose');

const dbConnect = () => {

    mongoose.connect(process.env.DB_URI, ).then((con) =>{
        console.log(`Connected: ${con.connection.host}`)
    })
}

module.exports = dbConnect;