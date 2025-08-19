const express = require('express')
const app= express()
const multer= require('multer')


// Authentication 
const jwt= require('jsonwebtoken')
const cookie= require('cookie-parser')
const bcrypt= require('bcrypt')

const verifyUser= require('./authentication')


app.set("view engine", "ejs")
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(cookie())

// DB

const userAcc= require('./Db/account')
const job= require('./Db/job')


app.get('/',(req,res)=>{
  res.render('createAcc')
})

app.post('/create-account', async(req,res)=>{
  try{

    const{email, password, username}= req.body
    console.log(req.body)

    const user= await userAcc.findOne({email})
    if(user){
     return res.status(500).send("User already registered")
    }

    bcrypt.genSalt(10, (err,salt)=>{
      bcrypt.hash(password, salt, async(err,hash)=>{
        const user= await userAcc.create({
          username,
          email,
          password: hash
        })
      })
    })

    const token= jwt.sign({email: `${email}`}, "abc")
    res.cookie("token", token)
    console.log(token);
    res.redirect('/login')


  }catch(error){
    console.log(error)
    res.status(500).send("Something went wrong while creating your account please try again later")
  }
})

app.get('/login',(req,res)=>{
  res.render('login')
})

app.post('/login', async(req,res)=>{
  try{
    const{email, password}= req.body
    const user= await userAcc.findOne({email: email})

    bcrypt.compare(password,user.password,(err,result)=>{
      if(err){
        res.send("Email or password is wrong")
      }else{
        const token= jwt.sign({email: email}, 'abc')
        res.cookie("token", token) 
        // res.redirect('/job-manager')
        res.redirect('/job-manager')
      }
    })

  }catch(error){
    res.status(500).send("Error while login please try again later")
  }
})

app.get('/job-manager', (req,res)=>{
  res.render('job-manager')
})

app.post('/applied-jobs',verifyUser, async(req,res)=>{

  try{
    const{title,company,type,location,skills,experience, appliedDate}= req.body 

    await job.create({
      email: req.user.email,
      title,
      company,
      type,
      location,
      skills,
      experience,
      appliedDate
    })

    res.send("Details saved")

  }catch(error){
    console.log("The error for adding job detials is ", error)
    res.status(500).send("Error in adding job detilas please try later")
  }
})

app.get('/saved-jobs',verifyUser, async(req,res)=>{
    const jobs=await job.find({email: req.user.email})
    res.render('saved-jobs', {jobs})
})

app.get('/delete/:id', verifyUser, async(req,res)=>{
  try{
    await job.findOneAndDelete({_id: req.params.id})
    res.redirect('/saved-jobs')
  }catch(error){
    res.status(500).send("Error in removing job detail please try again later")
  }
})

app.get('/account',verifyUser, async (req,res)=>{
  const userDetails= await userAcc.findOne({email: req.user.email})
  res.render('account', {userDetails})
})



const PORT=3000

app.listen(PORT,()=>{
  console.log(`Server running at http://localhost:${PORT}`)
})