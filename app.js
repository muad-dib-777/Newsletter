const express = require('express')
const request = require('request')
const https = require('https')
const bodyParser = require('body-parser')


const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const API_KEY = process.env.API_KEY
const Audience_ID = process.env.Audience_ID
const server = API_KEY.split("-")[1]

// console.log(API_KEY)
// console.log(Audience_ID)
// console.log(server)


const client = require("@mailchimp/mailchimp_marketing");

client.setConfig({

  apiKey: API_KEY, 
  server: server,

})

app.get("/", (req,res) => {

    res.sendFile(__dirname + "/signup.html")
})

app.post('/', (req, res) => {

    const userName = req.body.first_name;
    const userSurname = req.body.last_name;
    const userMail = req.body.email;

    // console.log(userName + " " + userSurname + " " + userMail);

    const data = {
        members : [
          // members, email_address, status, merge_fields, FNAME and LNAME
          // are default parameters mailchimp offers.
          {
          email_address: userMail,
          status: "subscribed",
          merge_fields: {
            FNAME: userName,
            LNAME: userSurname,
          }
          }
        ]
      }

    const jsonData = JSON.stringify(data);

    const url = `https://${server}.api.mailchimp.com/3.0/lists/${Audience_ID}`

    const options = {
        method: "POST", 
        auth: `deepronath@gmail.com:${API_KEY}` 
    }


    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){

            res.sendFile(__dirname + "/success.html")
        }
        else{

            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(data){

          console.log(JSON.parse(data));
        });

      });
     
      request.write(jsonData);
      request.end();
    

    
})

app.post("/failure", (req, res) => {

    res.redirect("/")
})


app.listen(process.env.PORT || 3000)
