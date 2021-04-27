const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')
const { response } = require('express')
const { request } = require('http')
const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html')
})

app.post('/', (req, res) => {
    firstName = req.body.firstName
    lastName = req.body.lastName
    email = req.body.email

    data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    jsonData = JSON.stringify(data)

    url = 'https://us1.api.mailchimp.com/3.0/lists/f9383038ab'
    options = {
        method: 'POST',
        auth: 'GuilhermeMelati:4f4790eeffc34b8d01264d0e11155ac6-us1'
    }
    const request = https.request(url, options, (response) => {

        if(response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html')
        } else {
            res.sendFile(__dirname + '/failure.html')
        }

        response.on('data', (data) => {
            console.log(JSON.parse(data))
        })
    })

    request.write(jsonData)
    request.end()
})

app.listen(process.env.PORT || 3000, () => {
    console.log('SERVER OK')
})
