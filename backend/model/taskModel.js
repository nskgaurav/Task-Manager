const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title :{
        type:String,
        required :true
    },
    description:{
        type:String,
        required :true
    },
    type:{
        type:Boolean
    },
    date:{
        type:Date,
        default:Date.now
    }
})

const Task = mongoose.model("task", taskSchema)
module.exports = Task