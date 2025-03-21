const axios = require('axios');

var method = function SendNotification(notification)
    { 
          let pushData = {
        "notification" : {
            "title" : "Get a notification from Bodshere" 
            ,"body" : notification[0].msg,
            "image" : "impageurl"+ notification[0].ProfilePic,
            "Page_Name": notification[0].Type
        },        
        data: {
            "title" : "Get a notification from Bodshere" 
            ,"body" : notification[0].msg,
            "image" : "impageurl"+ notification[0].ProfilePic,
            "Page_Name": notification[0].Type
        },
        "to" : notification[0].token
        }

   let headers = { headers : { 'Content-Type' :'application/json', 'Authorization':'key=AAAAjWu2Jk8:APA91bE_VTIL-Kqfqhor7IvRmjVPkxbctrSW_Ns_lPZ0nkyc05SkBCGx67SIsZ6ZS73iLkkbNohG1bhQSDk4LtIVG1VrOnY0Yt4yqlCQ8w1GWMg1WauMXOdQ2ht4MA8qA20wgbIv2DEe'
                              } };
                              
    axios.post('https://fcm.googleapis.com/fcm/send',pushData,headers)
    .then(resData =>   
    {   console.log(" successfully sent", resData.data);       
       
    }).catch(err => console.log(err));

    }
    module.exports = method;    