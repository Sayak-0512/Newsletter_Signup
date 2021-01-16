const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");

});

app.post("/", function(req, res) {
  const lastName = req.body.lastName;
  const firstName = req.body.firstName;
  const email = req.body.emailId;
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }

  const jsonData = JSON.stringify(data);
  const url = "https://us7.api.mailchimp.com/3.0/lists/06b257cd94";
  const options = {
    method: "POST",
    auth: "sayak:954a809a80a1d99fbd4ee8ef1ca8b0fc-us7"
  }


  const request = https.request(url,options, function(response) {

    response.on("data", function(data) {
      // console.log(JSON.parse(data));
      console.log(response.statusCode);
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }


    });

  })



  request.write(jsonData);
  request.on("error", function(error) {
    console.log(error);
  });
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
})
app.listen(process.env.PORT || 2000, function() {
  console.log("Server is running on port 2000");
});


// API key=954a809a80a1d99fbd4ee8ef1ca8b0fc-us7
// list-id=06b257cd94
