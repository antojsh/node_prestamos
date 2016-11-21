 
 'use strict'
 var express = require('express');
 var path = require('path');
 var favicon = require('serve-favicon');
 var logger = require('morgan');
 var cookieParser = require('cookie-parser');
 var bodyParser = require('body-parser');
 const mongoose = require('mongoose')
 const session = require('express-session')
 const session_middleware = require('./middlewares/session')
 var application = require('./routes/app');
 var User = require('./models/user')
 var moment = require('moment')
 var app = express();
 mongoose.connect('mongodb://localhost/prestamos', function(err) {
         if (err) console.log('No se puedo conectar')
         else console.log('Conectado');
     })
     // view engine setup
 app.listen(5000, function() {
     console.log('Listen 5000')
 })
 moment.locale('es');
 app.locals.moment = moment
 app.locals._str = require('underscore.string');

 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'jade');

 // uncomment after placing your favicon in /public
 //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
 //app.use(logger('dev'));
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(session({
     secret: "ifguksihgiosghsoghodhgduigi",
     resave: false,
     saveUninitialized: false
 }))
 app.use(cookieParser());
 app.use(express.static(path.join(__dirname, 'public')));


 app.get('/', function(req, res, next) {
     res.render('index', { title: 'Express' });
 });
 app.get('/singin', function(req, res, next) {
     res.render('register', { title: 'Express' });
 });
 app.post('/login', function(req, res) {
     let email = req.body.email
     let password = req.body.password
     console.log('ENTRO A ESTA MONDA ' + email)
     User.findOne({ 'email': email, 'password': password }, (err, user) => {
         if (err) {
             res.send('ERROR')
         }
         if (!user) {
             res.send('Correo o contraseña incorrecta')
         }
         req.session.user_id = user._id
         console.log(user)
         res.redirect('/app/dashboard')

     })
 })
 app.post('/singin', function(req, res) {
     let user = new User({
         name: req.body.name,
         user: req.body.user,
         email: req.body.email,
         password: req.body.password,
         password_confirmation: req.body.password_confirmation,
     })
     user.save(function(err) {
         if (err) {
             res.send(err)
         } else {
             res.redirect('/')
         }
     })
 })
 app.use('/app', session_middleware)
 app.use('/app', application)


 // catch 404 and forward to error handler
 app.use(function(req, res, next) {
     var err = new Error('Not Found');
     err.status = 404;
     next(err);
 });

 // error handlers

 // development error handler
 // will print stacktrace
 if (app.get('env') === 'development') {
     app.use(function(err, req, res, next) {
         res.status(err.status || 500);
         res.render('error', {
             message: err.message,
             error: err
         });
     });
 }

 // production error handler
 // no stacktraces leaked to user
 app.use(function(err, req, res, next) {
     res.status(err.status || 500);
     res.render('error', {
         message: err.message,
         error: {}
     });
 });

 // app.get('/login',function())


 module.exports = app;
