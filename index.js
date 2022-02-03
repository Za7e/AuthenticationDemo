const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/user');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/authDemo', { useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN")
    })
    .catch(err => {
        console.log("OH NO MONGO ERROR");
        console.log(err)
    })

app.set('view engine', 'ejs');
app.set('views', 'views');

//required to parse URL body
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('THIS IS THE HOME PAGE');
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', async (req, res) => {
    const { password, username } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hash
    })
    await user.save();
    res.redirect('/')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
        res.send("WELCOME!")
    } else {
        res.send("TRY AGAIN")
    }
})

app.get('/secret', (req, res) => {
    res.send('THIS IS SECRET, CAN ONLY SEE IF LOGGED IN')
})

app.listen(3000, () => {
    console.log("SERVING YOUR APP")
})  