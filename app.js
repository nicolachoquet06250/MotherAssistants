let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let sassMiddleware = require('node-sass-middleware');

let loadRoutes = require('./routes/loadRoutes').loadRoutes;

let fileUpload = require('express-fileupload');
let session = require('express-session');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'vash');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
	src: path.join(__dirname, 'public'),
	dest: path.join(__dirname, 'public'),
	indentedSyntax: true, // true = .sass and false = .scss
	sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload({
	useTempFiles : true,
	tempFileDir : 'uploads/tmp/',
	limits: {
		fileSize: 50 * 1024 * 1024
	},
}));

app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	httpOnly: false
}));

loadRoutes(app);

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

app.use((err, res, next) => next(createError(403)));

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('errors/error');
});

module.exports = app;
