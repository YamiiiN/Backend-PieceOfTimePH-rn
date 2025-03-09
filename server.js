const app = require('./app')
const dotenv = require('dotenv');
const dbConnect = require('./config/dbConnect')
const cloudinary = require('cloudinary');


dotenv.config({ path: './.env' });


cloudinary.v2.config({
    cloud_name: 'dlqclovym',
    api_key: '474289674742291',
    api_secret: 'sVr9gDaIRHzQgxVWHHcF1FbDbG0'
})




dbConnect();




app.listen(process.env.PORT, () => {
    console.log(`Server Running: http://localhost:${process.env.PORT}`)
})