const nodemailer = require('nodemailer')


//const fetch = require('node-fetch')
const path=require('path')
var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            auth: {
              user: "mailto:youmail@gmail.com",
              pass: "ujhdheqyoegwulhb",
              
            },
            
      });
      function mailoption(email,otp){
        var mail ={

            from: '"Sarang" <mailto:youmail@gmail.com>',
            to: `${email}`,
            subject: "Recieved the Otp from Sarang",
            html:
            "<h3>Dear" +
            "  " +
            "User," +
            
            "</h3>" +
            `<h4>${otp} Is Your One Time Password(OTP) To Change Password Of Your Bodsphere Account</h4>`+
            "<p> Note:-Your OTP Valid Only For 30 Second Thank You</p>"
                    
              }
        
        return mail
      }
  
      const sendmail=async(email,otp)=>{
        try{
          
        transporter.sendMail(mailoption(email,otp),function(error,info){
          if(error){
          
              console.log(error)
          }else{
              console.log('email sent'+ info.response)
          }
          })
      }catch(err){
        console.log(err);
        throw err
       }    
      }
      module.exports = {sendmail}