const express = require("express");
const bp = require("body-parser");
const request = require("request");
const https = require("https")

const app = express();

app.use(express.static("public"))
app.use(bp.urlencoded({extended:true}))

app.get("/",function(req, res){
  res.sendFile(__dirname + "/signup.html")
})

app.post("/",function(req, res){
  var fn = req.body.FirstName
  var fl = req.body.LastName
  var m = req.body.Email
  //console.log(fn,fl,m);

  var data = {
       members:[
         {
           email_address : m,
           status : "subscribed",
           merge_fields : {
               FNAME : fn,
               LNAME : fl
           }
         }
       ]
  };

  var jsonData = JSON.stringify(data)
  const url =  "https://us6.api.mailchimp.com/3.0/lists/bc143a4ccc"
  const options = {
    method: "POST",
    auth: "itachi:4da47d719ce158d3766ce29d4ee063d7-us6"
  }

  const request = https.request(url, options, function(response){

    if(response.statusCode == 200)
    {
      res.sendFile(__dirname+"/"+"success.html")
    }
    else {
      res.sendFile(__dirname+"/"+"failure.html")
    }

    response.on("data",function(d){
      console.log(JSON.parse(d));
    })
  })

   request.write(jsonData);
   request .end();

});

app.post("/failure",function(req,res){
  res.redirect("/");
});
//api key
//4da47d719ce158d3766ce29d4ee063d7-us6

//list id
//bc143a4ccc

app.listen(3000, function(req, res){
  console.log("Server running on port 3000");
});
