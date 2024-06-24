const mongoose = require('mongoose')

const googleSchema = mongoose.Schema({
    googleId:{
        type:String
    },
    email:{
        type:String
    },
    name:{
        type:String
    }
})

 const googleUser = mongoose.model('userGoogle' , googleSchema)
 module.exports = googleUser;
