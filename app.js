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
        res.send("You have logged in")
      }
    })

  }catch(error){
    res.status(500).send("Error while login please try again later")
  }
})


const PORT=3000

app.listen(PORT,()=>{
  console.log(`Server running at http://localhost:${PORT}`)
})