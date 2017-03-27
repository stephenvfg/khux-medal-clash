// Babel ES6/JSX Compiler
require('babel-register');

var swig  = require('swig');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var routes = require('./app/routes');
var config = require('./config');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var multiparty = require('multiparty');
var sharp = require('sharp');

var bcrypt = require('bcrypt');
const saltRounds = 10;

var async = require('async');
var request = require('request');
var xml2js = require('xml2js');
var _ = require('underscore');

// db dependencies
var mongoose = require('mongoose');
var Medal = require('./models/medal');
var Vote = require('./models/vote');
var User = require('./models/user');

// server

var app = express();

mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

app.set('port', process.env.PORT || 3000);
app.set('superSecret', config.secret);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// passport authentication

var passport = require('passport');
var expressSession = require('express-session');
var LocalStrategy   = require('passport-local').Strategy;

app.use(expressSession({ secret: config.secret }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('login', new LocalStrategy({ passReqToCallback : true },
  function(req, username, password, done) { 

    User.findOne({ 'username' :  username }, 
      function(err, user) {

        if (err) return done(err);

        if (!user){
          return done(null, false, { message: 'User not found.' });   
        }
        if (!isValidPassword(user, password)){
          return done(null, false, { message: 'Invalid password.' });
        }

        return done(null, user);
      }
    );
}));

passport.use('signup', new LocalStrategy({ passReqToCallback : true },
  function(req, username, password, done) {

    findOrCreateUser = function(){

      User.findOne({ 'username': username },function(err, user) {

        if (err) return done(err);

        if (user) {
          return done(null, false, { message: 'User already exists' });
        } else {
          var newUser = new User();
          newUser.username = username;
          newUser.password = createHash(password);
 
          newUser.save(function(err) {
            if (err) throw err;

            return done(null, newUser);
          });
        }
      });
    };
     
    process.nextTick(findOrCreateUser);
  })
);

var isValidPassword = function(user, password){
  return bcrypt.compareSync(password, user.password);
}

var createHash = function(password){
 return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/api/noauth');
}

var isAuthenticatedAdmin = function (req, res, next) {
  if (req.isAuthenticated() && req.user.admin) return next();
  res.redirect('/api/noauth');
}


/////////////////////////////////////////////////////////
////////// API ENDPOINT DEFINITIONS BEGIN HERE //////////
/////////////////////////////////////////////////////////

/**
 * GET /api/noauth
 * Returns error message when user is not authenticated 
 */

app.get('/api/noauth', function(req, res, next) {
  res.send({ message: 'Authentication required.' });
});

/**
 * GET /api/login
 * Returns error message when user is not authenticated 
 */

app.get('/api/login', isAuthenticated, function(req, res, next) {
  res.send({ user: req.user });
});

/**
 * POST /api/login
 * Authenticates user with passport
 */

app.post('/api/login', passport.authenticate('login', {
  successRedirect: '/api/login',
  failureRedirect: '/login'
}));

/**
 * POST /api/signup
 * Creates new user with passport
 */

app.post('/api/signup', passport.authenticate('signup', {
  successRedirect: '/api/login',
  failureRedirect: '/signup'
}));

/**
 * GET /api/signout
 * Signs out current user
 */
 
app.get('/api/signout', function(req, res, next) {
  req.logout();
  res.redirect(req.get('referer'));
});

/////////////////////////////////////////////////////////
///////// NO AUTHENTICATION FOR ALL ROUTES BELOW ////////
/////////////////////////////////////////////////////////

/**
 * GET /api/medals
 * Returns 2 random medals that have not been voted yet.
 */

app.get('/api/medals', function(req, res, next) {

  Medal.find({ random: { $near: [Math.random(), 0] } })
    .where('voted', false)
    .limit(2)
    .exec(function(err, medals) {
      if (err) return next(err);

      if (medals.length === 2) {
        return res.send(medals);
      }

      Medal.update({}, { $set: { voted: false } }, { multi: true }, function(err) {
        
        Medal.find({ random: { $near: [Math.random(), 0] } })
          .where('voted', false)
          .limit(2)
          .exec(function(err, medals) {
            if (err) return next(err);

            if (medals.length === 2) {
              return res.send(medals);
            }
          });
      });
    });
});

/**
 * GET /api/uploads/fullsize/:file
 * Retrieve a full size image from the uploads directory.
 */

app.get('/api/uploads/fullsize/:file', function (req, res){
  file = req.params.file;
  var img = fs.readFileSync(__dirname + "/uploads/fullsize/" + file);
  res.writeHead(200, {'Content-Type': 'image/*' });
  res.end(img, 'binary');
});

/**
 * GET /api/uploads/thumbs/:file
 * Retrieve a thumbnail image from the uploads directory.
 */

app.get('/api/uploads/thumbs/:file', function (req, res){
  file = req.params.file;
  var img = fs.readFileSync(__dirname + "/uploads/thumbs/" + file);
  res.writeHead(200, {'Content-Type': 'image/*' });
  res.end(img, 'binary');
});

/**
 * PUT /api/medals
 * Update winning and losing count for both medals. 
 * Create new Vote based on outcome.
 */

app.put('/api/medals', function(req, res, next) {
  var winner = req.body.winner;
  var loser = req.body.loser;

  if (!winner || !loser) {
    return res.status(400).send({ message: 'Voting requires two medals.' });
  }

  if (winner === loser) {
    return res.status(400).send({ message: 'Cannot vote for and against the same medals.' });
  }

  var vote = new Vote({
    winner: winner,
    loser: loser,
    date: new Date(),
    ip: req.ip
  });

  async.parallel([
      function(callback) {
        Medal.findOne({ _id: winner }, function(err, winner) {
          callback(err, winner);
        });
      },
      function(callback) {
        Medal.findOne({ _id: loser }, function(err, loser) {
          callback(err, loser);
        });
      }
    ],
    function(err, results) {
      if (err) return next(err);

      var winner = results[0];
      var loser = results[1];

      if (!winner || !loser) {
        return res.status(404).send({ message: 'One of the medals no longer exists.' });
      }

      if (winner.voted || loser.voted) {
        return res.status(200).end();
      }

      async.parallel([
        function(callback) {
          winner.wins++;
          winner.ratio = ((winner.wins / (winner.wins + winner.losses)) || 0);
          winner.voted = true;
          winner.random = [Math.random(), 0];
          winner.save(function(err) {
            callback(err);
          });
        },
        function(callback) {
          loser.losses++;
          loser.ratio = ((loser.wins / (loser.wins + loser.losses)) || 0);
          loser.voted = true;
          loser.random = [Math.random(), 0];
          loser.save(function(err) {
            callback(err);
          });
        },
        function(callback) {
          vote.save(function(err) {
            callback(err);
          });
        }
      ], function(err) {
        if (err) return next(err);
        res.status(200).end();
      });
    });
});

/**
 * GET /api/medals/count
 * Returns the total number of medals.
 */
app.get('/api/medals/count', function(req, res, next) {
  Medal.count({}, function(err, count) {
    if (err) return next(err);
    res.send({ count: count });
  });
});

/**
 * GET /api/medals/search
 * Looks up a medal by name. (case-insensitive)
 */
app.get('/api/medals/search', function(req, res, next) {
  var medalName = new RegExp(req.query.name, 'i');

  Medal.findOne({ name: medalName }, function(err, medal) {

    if (err) return next(err);

    if (!medal) {
      return res.status(404).send({ message: 'Medal not found.' });
    }

    res.send(medal);
  });
});

/**
 * GET /api/medals/top
 * Return 100 highest ranked medals. Filter by conditions as defined in the app.
 */
app.get('/api/medals/top', function(req, res, next) {
  var params = req.query;
  var conditions = {};

  _.each(params, function(value, key) {
    conditions[key] = value;
  });

  Medal
    .find(conditions)
    .sort({'ratio':-1})
    .limit(100)
    .exec(function(err, medals) {
      if (err) return next(err);
      res.send(medals);
    });
});

/**
 * GET /api/medals/shame
 * Returns 100 lowest ranked medals.
 */
app.get('/api/medals/shame', function(req, res, next) {
  Medal
    .find()
    .sort({'ratio':1})
    .limit(100)
    .exec(function(err, medals) {
      if (err) return next(err);
      res.send(medals);
    });
});

/**
 * GET /api/medals/:id
 * Returns detailed medal information by ID.
 */
app.get('/api/medals/:id', function(req, res, next) {
  var id = req.params.id;

  Medal.findOne({ _id: id }, function(err, medal) {
    if (err) return next(err);

    if (!medal) {
      return res.status(404).send({ message: 'Medal not found.' });
    }

    res.send(medal);
  });
});

/**
 * GET /api/medal/:id/votes
 * Returns 10 most recent votes tied to the medal.
 */
app.get('/api/medals/:id/votes', function(req, res, next) {
  var id = req.params.id;

  Vote
    .find({ "$or": [{ winner: id }, { loser: id }] })
    .sort('-date') // Sort in descending order (newest on top)
    .limit(10)
    .exec(function(err, votes) {
      if (err) return next(err);

      res.send(votes);
    });
});

/**
 * GET /api/medals/slug/:slug
 * Returns detailed medal information by slug.
 */
app.get('/api/medals/slug/:slug', function(req, res, next) {
  var slug = req.params.slug;

  Medal.findOne({ slug: slug }, function(err, medal) {
    if (err) return next(err);

    if (!medal) {
      return res.status(404).send({ message: 'Medal not found.' });
    }

    res.send(medal);
  });
});

/**
 * GET /api/medals/vote/:id
 * Returns medals associated to vote id
 */
app.get('/api/medals/vote/:id', function(req, res, next) {
  var id = req.params.id;

  Vote.findOne({ _id: id }, function(err, vote) {
    if (err) return next(err);

    if (!vote) {
      return res.status(404).send({ message: 'Vote not found.' });
    }

    Medal.findOne({ _id: vote.winner }, function(err, medalW) {
      if (err) return next(err);

      if (!medalW) {
        return res.status(404).send({ message: 'Winner medal not found.' });
      }

      Medal.findOne({ _id: vote.loser }, function(err, medalL) {
        if (err) return next(err);

        if (!medalL) {
          return res.status(404).send({ message: 'Loser medal not found.' });
        }

        res.send({ winner: medalW, loser: medalL });
      });
    });
  });
});

/**
 * GET /api/votes
 * Returns 100 most recent votes.
 */
app.get('/api/votes', function(req, res, next) {

  Vote
    .find()
    .sort('-date') // Sort in descending order (newest on top)
    .limit(100)
    .exec(function(err, votes) {
      if (err) return next(err);

      res.send(votes);
    });
});

/**
 * GET /api/votes/medal/:id
 * Returns 10 most recent votes tied to the medal.
 */
app.get('/api/votes/medal/:id', function(req, res, next) {
  var id = req.params.id;

  Vote
    .find({ "$or": [{ winner: id }, { loser: id }] })
    .sort('-date') // Sort in descending order (newest on top)
    .limit(10)
    .exec(function(err, votes) {
      if (err) return next(err);

      res.send(votes);
    });
});

/**
 * GET /api/stats
 * Returns medals statistics.
 */
app.get('/api/stats', function(req, res, next) {
  async.parallel([
      function(callback) {
        Medal.count({}, function(err, count) {
          callback(err, count);
        });
      },
      function(callback) {
        Medal.count({ affinity: 'upright' }, function(err, uprightCount) {
          callback(err, uprightCount);
        });
      },
      function(callback) {
        Medal.count({ affinity: 'reversed' }, function(err, reversedCount) {
          callback(err, reversedCount);
        });
      },
      function(callback) {
        Medal.count({ attribute: 'power' }, function(err, powerCount) {
          callback(err, powerCount);
        });
      },
      function(callback) {
        Medal.count({ attribute: 'speed' }, function(err, speedCount) {
          callback(err, speedCount);
        });
      },
      function(callback) {
        Medal.count({ attribute: 'magic' }, function(err, magicCount) {
          callback(err, magicCount);
        });
      },
      function(callback) {
        Medal.aggregate({ $group: { _id: null, total: { $sum: '$wins' } } }, function(err, totalVotes) {
            var total = totalVotes.length ? totalVotes[0].total : 0;
            callback(err, total);
          }
        );
      },
      function(callback) {
        Medal
          .find()
          .sort({'ratio':-1})
          .limit(100)
          .select('affinity')
          .exec(function(err, medals) {
            if (err) return next(err);

            var affinityCount = _.countBy(medals, function(medal) { return medal.affinity; });
            var max = _.max(affinityCount, function(affinity) { return affinity });
            var inverted = _.invert(affinityCount);
            var topAffinity = inverted[max];
            var topCount = affinityCount[topAffinity];

            callback(err, { affinity: topAffinity, count: topCount });
          });
      },
      function(callback) {
        Medal
          .find()
          .sort({'ratio':-1})
          .limit(100)
          .select('attribute')
          .exec(function(err, medals) {
            if (err) return next(err);

            var attributeCount = _.countBy(medals, function(medal) { return medal.attribute; });
            var max = _.max(attributeCount, function(attribute) { return attribute });
            var inverted = _.invert(attributeCount);
            var topAttribute = inverted[max];
            var topCount = attributeCount[topAttribute];

            callback(err, { attribute: topAttribute, count: topCount });
          });
      }
    ],
    function(err, results) {
      if (err) return next(err);

      res.send({
        totalCount: results[0],
        uprightCount: results[1],
        reversedCount: results[2],
        powerCount: results[3],
        speedCount: results[4],
        magicCount: results[5],
        totalVotes: results[6],
        leadingAffinity: results[7],
        leadingAttribute: results[8]
      });
    });
});

/////////////////////////////////////////////////////////
////// AUTHENTICATION REQUIRED FOR ALL ROUTES BELOW /////
/////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////
/// ADMIN AUTHENTICATION REQUIRED FOR ALL ROUTES BELOW //
/////////////////////////////////////////////////////////

/**
 * GET /api/users
 * Retrieve a list of all users.
 */

app.get('/api/users', isAuthenticatedAdmin, function (req, res){
  User.find({}, function(err, users) {
    res.json(users);
  });
});

/**
 * POST /api/upload
 * Upload a file to the uploads directory.
 */

app.post('/api/upload', isAuthenticatedAdmin, function(req, res) {

  var form = new multiparty.Form();

  form.parse(req, (err, fields, files) => {

    var tempPath = files.imageFile[0].path;
    var originalFilename = files.imageFile[0].originalFilename;

    fs.readFile(tempPath, function (err, data) {
      if(!originalFilename){
        console.info("There was an error - no image name found.")
        res.redirect("/");
        res.end();
      } else {
        var newPath = __dirname + "/uploads/fullsize/" + originalFilename;
        var thumbPath = __dirname + "/uploads/thumbs/" + originalFilename;

        fs.writeFile(newPath, data, (err) => {

          sharp(newPath)
            .resize(128, null)
            .toFile(thumbPath, function(err) {
              if (err) console.info(err);
            });

          fs.unlink(tempPath, () => {
            console.info("File uploaded to: " + newPath);
          });
        }); 
      }
    });
  });
});

/**
 * POST /api/medals
 * Adds a new medal to the database.
 */

app.post('/api/medals', isAuthenticatedAdmin, function(req, res, next) {

  var name = req.body.name;
  var slug = req.body.slug;
  var no = req.body.no;
  var imgPath = req.body.imgPath;
  var affinity = req.body.affinity;
  var attribute = req.body.attribute;
  var baseStr = req.body.baseStr;
  var baseDef = req.body.baseDef;
  var spAtk = req.body.spAtk;
  var spDesc = req.body.spDesc;
  var target = req.body.target;
  var tier = req.body.tier;
  var mult = req.body.mult;
  var gauges = req.body.gauges;
  var isGuilted = req.body.isGuilted;
  var isBoosted = req.body.isBoosted;

  async.waterfall([
    function() {
      try {
        var medal = new Medal({
          name: name,
          no: no,
          slug: slug,
          imgPath: imgPath,
          affinity: affinity,
          attribute: attribute,
          baseStr: baseStr,
          baseDef: baseDef,
          spAtk: spAtk,
          spDesc: spDesc,
          target: target,
          tier: tier,
          mult: mult,
          gauges: gauges,
          isGuilted: isGuilted,
          isBoosted: isBoosted,
          random: [Math.random(), 0]
        });

        medal.save(function(err) {
          if (err) return next(err);
        });

      } catch (e) {
        res.status(404).send({ message: name + ' could not be added.' });
      }

      res.send({ message: name + ' has been added successfully!' });
    }
  ]);
});

/////////////////////////////////////////////////////////
/////////// API ENDPOINT DEFINITIONS END HERE ///////////
/////////////////////////////////////////////////////////

app.use(function(req, res) {
  Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
      var page = swig.renderFile('views/index.html', { html: html });
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});

var server = require('http').createServer(app);

server.listen(app.get('port'), function() {
  console.log('Express server running and listening on port ' + app.get('port'));
});