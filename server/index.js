const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/StudentSocialMedia");

app.post('/register', (res, req) =>{
    
})

app.listen(3001, () =>{
    console.log("sever is running")
})