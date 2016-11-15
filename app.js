var express = require('express');   //加载express模块
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');             //会话管理模块
var MongoStore = require('connect-mongo')(session);

var index = require('./routes/index');
var users = require('./routes/users');

var settings = require('./setting'); //加载配置文件  
var flash = require('connect-flash'); //flash 是一个在 session 中用于存储信息的特定区域

var blogs = require('./routes/blog/blogs');


var app = express();    //生成一个express实例 app。

// view engine setup
app.set('views', path.join(__dirname, 'views'));   //设置视图引擎目录
app.set('view engine', 'ejs');  //设置视图引擎为ejs


app.use(flash());//使用flash功能


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));   //启用日志
app.use(bodyParser.json());  //启用json格式解析
app.use(bodyParser.urlencoded({ extended: false }));  //启用url 编码
app.use(cookieParser());  //启用cookie解析
app.use(express.static(path.join(__dirname, 'public')));  //设置静态资源路径

//会化信息存储到mongoldb中
// secret 用来防止篡改 cookie，key 的值为 cookie 的名字
// 设置 cookie 的 maxAge 值设定 cookie 的生存期
// 设置它的 store 参数为 MongoStore 实例，把会话信息存储到数据库中
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    // db: settings.db,
    // host: settings.host,
    // port: settings.port
    url: 'mongodb://'+settings.host+':'+settings.port+'/'+settings.db
  })
}));




app.use('/', index);          //监控  /
app.use('/users', users);     //监控  /users

//blog实例
app.use('/blogs', blogs);       //监控  /blogs




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
