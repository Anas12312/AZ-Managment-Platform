const mongoose = require('mongoose'); 

const main = async () => {
    await mongoose.connect(process.env.DB_CONNECT)
}

main().catch(err => console.log(err))