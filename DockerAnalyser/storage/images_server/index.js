"use strict";
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

const querystring = require('querystring');

var Image = require('./models/image-noschema');

var app = express();
var readline = require('readline'); //read the input from the users
var path = require('path');

// Environment configurations
app.set('port', process.env.PORT || 3000);
app.set('env',process.env.NODE_ENV || 'production');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

var table ="/images";
var linkname_docker_compose = 'images_db' ; //link to database, resolved IP by DNS of bridge/overlay network


app.use(function (req, res, next) {
    console.log(req.method +" "+req.originalUrl);
    next();
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// development only
if ('development' == app.get('env')) {
   console.log("Development mode \n");
   app.set('db_path', '172.17.0.2');
}

// production only
if ('production' == app.get('env')) {
  console.log("Production mode \n ");
  app.set('db_path', linkname_docker_compose);   //images_db is set in docker-compose link
}

// Connect to the database before starting the application server.
var mongo_path = 'mongodb://'+app.get('db_path') + table;

var connectWithRetry = function() {
  return mongoose.connect(mongo_path, function (err, database) {
      console.log("\nTry to connect "+ mongo_path);
      if (err) {
        console.error(err.message+ '- retrying in 5 sec' );
        setTimeout(connectWithRetry, 5000);
      }else{
      // Save database object from the callback for reuse.
      console.log("Succesful Connection to database "+ mongo_path );
    }
  });
};

connectWithRetry();

//###################################################################################
//                                 ROUTES
// ################################################################################


//
app.get('/api/images/drop', function (req, res, next) {
  Image.remove({}, function(err, obj) {
    if (err) {
        console.log(err);
        return next(err);
    }
    res.json({
          "err": 0,
          "msg": obj.result.n + " images dropped."
    })
  })
});

var json_filename = "docker-analyser-images.json"

app.get('/api/images/export', function (req, res, next) {
  Image.find().lean().exec(function (err, images) {
    if (err) {
        console.log(err);
        return next(err);
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Content-Disposition", 'attachment; filename='+json_filename);
    res.json(images)
  })
});


// /api/images
app.use('/', require('./routes/api-noschema'));


// /search  endpoint with pagination, exach search match of images
app.use('/search', require('./routes/search-paginated'))

// /stats  endpoint with pagination, returns the statistics of the images
app.use('/stats', require('./routes/stats'))

// development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({"message": err.message,
          "error": err
        });
      });
}

// production error handler no stacktraces leaked to user
app.use(function(err, req, res, next) {
      res.status(err.status || 500);
        res.json({
              "message": err.message,
              "error": err
          });
});

// Start server
var server = app.listen(app.get('port'), function(){
    var port = server.address().port;
    console.log('Images Server is listening port: '+ port +"\n");
});
