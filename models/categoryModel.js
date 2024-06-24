const mongoose=require("mongoose");

 const categorySchema = new mongoose.Schema({
    
    categoryName:{
        type:String,
        required:true,
        unique: true
    },
   
    status:{
        type:Boolean,
        default:true
    },
    blocked: {
        type: Boolean,
        default: false, 
      },
      createdAt: {
        type: Date,
        default: Date.now,
    },
    offer: {
        type: {
            type: String,
        },
        amount: {
            type: Number,
        },
        endDate: {
            type: Date,
        },
    },
 })

 module.exports=mongoose.model('Category',categorySchema)