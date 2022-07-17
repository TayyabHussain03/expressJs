const express = require('express')
const path = require('path')
const app = express()
const requests = require('requests')
const hbs = require('hbs')

// User Validation agr login hoga tau hee render krega
const middleware = (req, res, next) => {
    console.log("server on")
    next()
}


// const staticPath = path.join(__dirname, "./Public/src")
//built in middleware
// app.use(express.static(staticPath))

const tempelatePath = path.join(__dirname, "./Public/tempelates")
const partialPath = path.join(__dirname, "./Public/partials")

const PORT = process.env.PORT || 8000

app.set("view engine", "hbs")
app.set('views', tempelatePath)
hbs.registerPartials(partialPath)


app.get('/', (req, res) => {
    res.render('index', {
        page1: "Home",
        page2: "About Us",
    })
})
// app.get('/about', (req, res) => {
//     res.render('about', {
//         page1: "Home",
//         page2: "About Us",
//     })
// })


app.get('/', (req, res) => {
    res.send("hello from the server")
})
app.get('/about', middleware, (req, res) => {
    requests(`http://api.openweathermap.org/data/2.5/weather?q=${req.query.name}&units=metric&appid=40b95ca52ca2638caeb1226494165238`)
        .on('data', (chunk) => {
            const objData = JSON.parse(chunk)
            const arrData = [objData]
            res.write(`The temperature of ${arrData[0].name} is ${arrData[0].main.temp}°C `)
        })
        .on('end', (err) => {
            if (err) return console.log('conncetion lost due to error', err)
            res.end()
        })
})
app.get('/contact', (req, res) => {
    res.send("hello from the contact page")
})
app.get('/about/*', (req, res) => {
    res.send("Oops! Page Not Found")
})

app.listen(PORT, () => {
    console.log(`server running on PORT = ${PORT}`)
})