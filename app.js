const TOKEN = '657627110:AAHmqbjUTmGfDmrZW34zNLfTZXaq-uckMHs'
// const TOKEN = '735717824:AAHBPxaN_sKZZyJcHtlBANgVLg0nRFjI8fA';

var express = require('express');
var app = express();
var firebase = require('firebase');
var database = require('firebase/database');
var config = {
    apiKey: "AIzaSyA5Oh6NEEYQAuyxZEg9VhmfoQ1t16S6-BY",
    authDomain: "gwaguzlist.firebaseapp.com",
    databaseURL: "https://gwaguzlist.firebaseio.com",
    projectId: "gwaguzlist",
    storageBucket: "gwaguzlist.appspot.com",
    messagingSenderId: "425382393150"
  };
  firebase.initializeApp(config);
var admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});
adminId = "288870772";
// var tasks = [];
// function getTasks() {
//   return db.ref('/tasks/').once('value').then(function(snapshot) {
//   tasks.push(snapshot.val());
//   console.log(snapshot.val());
//   });
// }
const firestore = firebase.firestore();
 const settings = {/* your settings... */ timestampsInSnapshots: true};
 firestore.settings(settings);
 var db = firebase.firestore();
function addTask() {}
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

// app.get('/', function(req, res) {
//     res.render('index');
// });
const Bot = require('node-telegram-bot-api');
const bot = new Bot(TOKEN, {polling: true});
var addingTask = false;

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});

attendee = {
  FullName: "Yonas Tesfahun",
  PhoneNumber: "+251912433421",
  Status: "coming",
  telegramId: "ojfwiojeoiij",
  telegramName: "Jonah"
}

bot.onText(/\/start/,(msg) => {

    bot.sendMessage(msg.chat.id, "Gwaguz " + msg.chat.username);
    bot.sendMessage(msg.chat.id, "Give us your Full Name: ");
    bot.once('message', (msg) => { 
      attendee.telegramId = msg.from.id;
      attendee.telegramName = msg.from.username;
      attendee.FullName = msg.text;
      var option = {
        "parse_mode": "Markdown",
        "reply_markup": {
            "one_time_keyboard": true,
            keyboard: [[{
                text: "share contact", request_contact: true }]
            ]
        }
      }
      bot.sendMessage(msg.chat.id, "Contact Info", option);
      bot.once("contact",(msg) => {
          // bot.sendMessage(msg.id,"",msg.contact.first_name,msg.contact.phone_number,option);
          attendee.PhoneNumber = msg.contact.phone_number;
          var option_two = {
            reply_markup: {
              inline_keyboard: [[{ text: "I am Coming", callback_data: "coming" }],
                    [{ text: "I'll think About It", callback_data: "onhold"}] ]
            }
          }
          bot.sendMessage(msg.chat.id, "How certain are you to come?", option_two);
          
      bot.on("callback_query",(msg) => {
        if(msg.data == 'coming') {
          attendee.Status = "coming";
        } else if(msg.data == "onhold"){
          attendee.Status = "not sure";
        } else if(msg.data == "cancel_share") {
          bot.sendMessage(msg.message.chat.id, "Thank you for registering, we will update you with the dethails very soon...");
        }
        bot.sendMessage(adminId,`Name: ${ attendee.FullName}, Phone: ${ attendee.PhoneNumber } Telegram: @${ attendee.telegramName},`);
          db.collection('attendees').doc(attendee.FullName + attendee.telegramId).set(attendee);
      })
    });  
      })
});

var http = require('https');
var path = require('path');
setInterval(function() {
  var res = http.get('https://gwaguz.herokuapp.com/');
},30000);
app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});