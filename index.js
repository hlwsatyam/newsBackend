var express = require('express');
// const UserRouting = require('./Routes');
const mongoose = require('mongoose')
var app = express();
const cors = require('cors')
require('dotenv').config()
const port = process.env.port || 5000
app.use(cors())

const ConnectionDB = async () => {
    await mongoose.connect("mongodb+srv://satyam:20172522@newsweb.gjptu7l.mongodb.net/?retryWrites=true&w=majority").then(
        () => {
            console.log(' DB conection')
        }
    ).catch((err) => {
        console.log('error phase : During in DB conection')
    })
}

ConnectionDB()

const useSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    savearticles: []
})
const userModel = mongoose.model("NewsUser", useSchema)
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Hey")
})

// app.use('/user', UserRouting)
app.post('/login', async (req, res) => {
    const { email, pass } = req.body
    try {
        const ExistUser = await userModel.findOne({ email: email })
        if (ExistUser.password == pass) { return res.json({ "message": "login successfully!" }) } else {
            return res.json({ "message": "pass err!" })
        }
    } catch (error) {
        return res.json({ "message": "User Does Not Exist pls register!" })
    }
})


app.post('/register', async (req, res) => {
    const { name, email, pass } = req.body
    try {
        const UserDetail = await userModel.findOne({ email: email, password: pass })
        console.log(UserDetail.password)
        return res.json({ "message": "duplicate!" })
    } catch (error) {
        const user = new userModel({
            name: name,
            email: email,
            password: pass,
            savearticles: []
        })
        user.save()
            .then((data) => {
                return res.json({ "message": "Successfully registered!" })
            }).catch(() => {
                return res.json({ "message": "failed register!" })
            })
    }
})

app.post('/save', async (req, res) => {
    const { email, article } = req.body
    let Details;
    try {
        let Details = await userModel.findOne({ email: email })
        let articles = [article, ...Details.savearticles];
        let articlesId = Details._id;
        await userModel.findByIdAndUpdate(articlesId, { savearticles: articles })
    } catch (error) {
        console.log(error)
    }

})

app.post('/artices', async (req, res) => {
    const { EmailForArticle } = req.body
    try {
        let Details = await userModel.findOne({ email: EmailForArticle })
        let articles = Details.savearticles;
        return res.send(articles)
    } catch (error) {
        return res.send(error)
    }
})




app.listen(port, function () {
    console.log('Node server is running..');
});