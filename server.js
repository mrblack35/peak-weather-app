const axios = require('axios').default;
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(cors());

const PORT = process.env.PORT || 8000;


app.get('/results', (req, res) => {
    
    let mValue = req.query.peak;
    let tForm = req.query.temp;
    //console.log(mValue, tForm);

    const options = {
        method: 'GET',
        url: `https://peak-conditions.p.rapidapi.com/report/daily/${mValue}`,
        headers: {
        'Temp-format': tForm,
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'peak-conditions.p.rapidapi.com'
        }
    };
    
    axios.request(options).then(function (response) {
        res.json(response.data[0].forecastData);
        //console.log(response.data[0].forecastData);
    }).catch(function (err) {
        return err;
        //console.log(err);
    })
})

app.listen(PORT, () => console.log('Running on PORT ' + PORT));