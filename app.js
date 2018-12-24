const TOKEN = '657627110:AAHmqbjUTmGfDmrZW34zNLfTZXaq-uckMHs'

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
channelId = "-1001241155007"
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
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   if(addingTask) {
//     addTask(msg.text.toString(),null);
//   } else if(msg.text !== '/add') {
//     bot.sendMessage(chatId, 'Hello sir use /add to add a task');
//   }
// });
attendee = {
  FullName: "Yonas Tesfahun",
  PhoneNumber: "+251912433421",
  Status: "coming",
  telegramId: "ojfwiojeoiij",
  telegramName: "Jonah"
}
// console.log(bot.getChat("@GwaguzTeam"));
// db.collection('attendees').doc('ef').set(attendee);

bot.onText(/\/start/,(msg) => {

    bot.sendMessage(msg.chat.id, "Gwaguz " + msg.chat.username);
    bot.sendMessage(msg.chat.id, "Give us your Full Name: ");
    bot.once('message', (msg) => { 
      console.log(msg.from.id);
      attendee.telegramId = msg.from.id;
      attendee.telegramName = msg.from.username;
      attendee.FullName = msg.text;
      var option = {
        "parse_mode": "Markdown",
        "reply_markup": {
            "one_time_keyboard": true,
            keyboard: [[{
                text: "share contact", request_contact: true }],
                ["cancel"]
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
          bot.once("callback_query",(msg) => {
            console.log(msg);
            if(msg.data == 'coming') {
              attendee.Status = "coming";
            } else {
              attendee.Status = "not sure";
            }
            bot.sendMessage(msg.message.chat.id, "Thank you for registering, we will update you with full detail soon...");
            // bot.sendMessage(channelId,`Name: ${ attendee.FullName}, 
            //                                 Phone: ${ attendee.phone_number}
            //                                 Telegram: @${ attendee.telegramName},`);
            db.collection('attendees').doc(attendee.FullName + attendee.telegramId).set(attendee);
          })
      })
      
    });
});

// bot.onText(/\/register/,(msg) => {
  
//   db.collection('').doc('ef').set(attende);
//   addingTask = true;
// });

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});