const PORT = 8000
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
app.use(express.json())
app.use(cors())

const API_KEY = process.env.API_KEY

// Sets up a route handler for POST requests to the /completions endpoint
app.post('/completions', async (req, res) => {

    // Options object for the HTTP request, including the method, headers (including the API key), and request body.
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: req.body.message }],
            max_tokens: 100
        })
    }

    // Handles the asynchronous operation of fetching data from the OpenAI API. It sends the request, parses the 
    // response as JSON, and sends the data back as the response to the client or logs any errors that occur
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json()
        res.send(data)
    } catch (error) {
        console.error(error)
    }
})

app.listen(PORT, () => console.log('Your server is running on PORT ' + PORT))