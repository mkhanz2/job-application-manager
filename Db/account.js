const mongoose= require('mongoose')

mongoose.connect("mongodb://localhost:27017/jobManagement")

const userSchema= mongoose.Schema({
    email: String,
    password: String,
    username: String
})

module.exports= mongoose.model('userDetail',userSchema)