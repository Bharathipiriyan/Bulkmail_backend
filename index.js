require("dotenv").config();
const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")
const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("DB connected sucesfully")

    const PORT = process.env.PORT || 5000;


    app.listen(PORT, function () {
        console.log("server started....")
    })

}).catch(() => {
    console.log("DB not conected")
})

const credential = mongoose.model("credential", { user: String, pass: String }, "bulkmail")

app.post("/sendemail", async function (req, res) {
    const textvalue = req.body.text
    const emaillist = req.body.emaillist

    //trnsporter for email send//
    credential.find()
        .then(async (data) => {
            const Transporter = nodemailer.createTransport(
                {
                    service: "gmail",
                    auth:
                    {
                        user: data[0].user,
                        pass: data[0].pass,
                    }
                })

            try {
                for (let i = 0; i < emaillist.length; i++) {
                    await Transporter.sendMail(
                        {
                            from: "bharathii8754@mail.com",
                            to: emaillist[i],
                            subject: "bharathii",
                            text: textvalue
                        })
                }

                res.send(true)
                console.log("Emails succesfully send")

            }
            catch (eror) {

                console.log("mail eror", eror)
                res.send(false)
            }
        })
        .catch((eror) => {
            console.log(eror)
        })
})


