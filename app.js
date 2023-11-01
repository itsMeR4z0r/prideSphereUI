const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const dashboardRouter = require('./routes/dashboard');
const qrCodeRouter = require('./routes/qrcode');
const bodyParser = require("express");
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const {v4: uuid} = require("uuid");
const passport = require("passport");
const utils = require("./utils");
const http = require('http');
const CustomStrategy = require('passport-custom').Strategy;
const app = express();

passport.use('QrCode', new CustomStrategy((req, done) => {
    let data = {
        userAgent: req.headers['user-agent'], sid: req.body.sid, date: new Date(), key: process.env.KEY_VALIDATION,
    }
    let util = new utils();
    let encrypted = util.encrypt(JSON.stringify(data));

    const options = {
        "method": "POST",
        "hostname": process.env.API_HOST,
        "port": process.env.API_PORT,
        "path": "/login/validateSession"
    };
    const req2 = http.request(options, function (res2) {
        const chunks = [];

        res2.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res2.on("end", function () {
            try {
                const body = Buffer.concat(chunks);
                const decrypted = util.decrypt(body.toString());
                const data = JSON.parse(decrypted);
                if (data.error) {
                    return done(null, null, {message: data.error});
                } else {
                    if (data.key === process.env.KEY_VALIDATION) {
                        util.getUserPicture(data.user, (picture) => {
                            data.user.picture = picture;
                            return done(null, data.user);
                        });
                    } else {
                        return done(null, null, {message: 'Invalid Credentials'});
                    }
                }
            } catch (e) {
                console.log(e);
                return done(e, null);
            }
        });
    });
    req2.write(JSON.stringify({data: encrypted}));
    req2.end();
}));


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.KEY_VALIDATION));
app.use(express.static(path.join(__dirname, 'public')));

// Configurar sessão
app.use(session({
    genid: (req) => {
        return uuid();
    },
    store: new FileStore(),
    secret: process.env.KEY_VALIDATION, resave: false, saveUninitialized: true, cookie: {
        secure: false
    }
}));

// Inicializar o Passport e permitir que ele gerencie as sessões
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/dashboard', dashboardRouter);
app.use('/qrcode', qrCodeRouter);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
