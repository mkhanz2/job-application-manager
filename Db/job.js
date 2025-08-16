const mongoose= require('mongoose')

const userSchema= mongoose.Schema({
    email: String,
    title: String,
    company: String,
    skills: String,
    experience: Number,
    appliedDate: Date
})

module.exports= mongoose.model('job', userSchema)