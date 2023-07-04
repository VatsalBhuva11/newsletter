const express = require("express");
const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

const client = require("@mailchimp/mailchimp_marketing");

client.setConfig({
  apiKey: "ca7a767650f5fbea15e495c6c18f5663-us13",
  server: "us13",
});



app.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const client = require("@mailchimp/mailchimp_marketing");

    const run = async () => {
        const response = await client.lists.batchListMembers("af3e674d94a", {
            members: [{
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }],
        });
        res.sendFile(__dirname + "/success.html")
    };

    run().catch(e => {
        res.sendFile(__dirname + "/failure.html")

        //if there is a post request on the home/failure route, redirect the user to home route.
        app.post("/failure", function(req, res){
            res.redirect("/");
        })
    });
    const responseStatus = res.statusCode;
    console.log(responseStatus);

})


app.listen(process.env.PORT || 3000, function(){
    console.log("Listening on port "+process.env.PORT+"...");
})