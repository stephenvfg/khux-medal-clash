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
var nodemailer = require('nodemailer');
var crypto = require('crypto');

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
          newUser.email = req.body.email;
 
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

var isAuthenticatedContributor = function (req, res, next) {
  if (req.isAuthenticated() && (req.user.admin || req.user.contributor)) return next();
  res.redirect('/api/noauth');
}

var isAuthenticatedAdmin = function (req, res, next) {
  if (req.isAuthenticated() && req.user.admin) return next();
  res.redirect('/api/noauth');
}


/////////////////////////////////////////////////////////
////////// API ENDPOINT DEFINITIONS BEGIN HERE //////////
/////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////
/////////// LOGIN AND SIGNUP ENDPOINTS BELOW ////////////
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
 * Returns logged in user
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

/**
 * POST /api/forgot
 * Submits password reset token
 */

app.post('/api/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          return res.status(404).send({ message: 'Could not find email for: ' + req.body.email });
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'khuxmedalclash@gmail.com',
          pass: 'Q9EfI0Ic'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'khuxmedalclash@gmail.com',
        subject: 'KHUX Medal Clash Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        res.send({ message: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
  });
});

/**
 * GET /api/reset/:token
 * Validates token for password reset
 */

app.get('/api/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (err) return next(err);

    if (!user) {
      return res.status(404).send({ message: 'Password reset token is invalid or has expired.' });
    }

    res.send({ 'user': user });
  });
});

/**
 * POST /api/reset/:token
 * Submits new password for password reset
 */

 app.post('/api/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (err) return next(err);

        if (!user) {
          return res.status(404).send({ message: 'Password reset token is invalid or has expired.' });
        }

        user.password = createHash(req.body.password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          done(err, user);
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'khuxmedalclash@gmail.com',
          pass: 'Q9EfI0Ic'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'khuxmedalclash@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        res.send({ message: 'Success! Your password has been changed.' });
        done(err);
      });
    }
  ], function(err) {
    if (err) return next(err);
  });
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
  var voter = req.body.voter ? req.body.voter : null;

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
    voter: voter,
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
    },
    function(callback) {
      User.findOne({ _id: voter }, function(err, voter) {
        callback(err, voter);
      });
    }
  ],
  function(err, results) {
    if (err) return next(err);

    var winner = results[0];
    var loser = results[1];
    var voter = results[2];

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
      },
      function(callback) {
        if (voter) {
          voter.votes++;
          voter.save(function(err) {
            callback(err);
          });
        } else {
          callback();
        }
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
    .sort({'ratio':-1, 'wins':-1})
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
    .sort({'ratio':1, 'losses':-1})
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
//////// USER AUTH REQUIRED FOR ALL ROUTES BELOW ////////
/////////////////////////////////////////////////////////

/**
 * PUT /api/user
 * Update user profile information. 
 */

app.put('/api/user', isAuthenticated, function(req, res, next) {
  var username = req.body.username;
  var oldPassword = req.body.oldPassword;
  var password = req.body.password;
  var email = req.body.email;
  var _id = req.body.id;

  if (!_id || !req.user._id || req.user._id != _id) {
    return res.status(400).send({ message: 'Must be logged in to update profile information.' });
  }

  async.waterfall([
    function(done) {
      User.findOne({ username: username }, function(err, usr1) {
        done(err, usr1);
      });
    },
    function(usr1, done) {
      if (usr1 && username) {
        return res.status(404).send({ message: 'Username already taken: ' + username });
      }

      User.findOne({ email: email }, function(err, usr2) {
        done(err, usr2);
      });
    },
    function(usr2, done) {
      if (usr2 && email) {
        return res.status(404).send({ message: 'Email already taken: ' + email });
      }

      User.findOne({ _id: _id }, function(err, user) {
        done(err, user);
      });
    },
    function(user, done) {
      if (!user) {
        return res.status(404).send({ message: 'Could not find user account.' });
      }

      if (password && !isValidPassword(user, oldPassword)){
        return done(null, false, { message: 'Invalid password.' });
      }

      async.parallel([
        function(callback) {
          if (username) { user.username = username; }
          if (password) { user.password = createHash(password); }
          if (email) { user.email = email; }

          user.save(function(err) {
            if (err) return next(err)

            req.login(user, function(err) {
              if (err) return next(err)
              res.status(200).send({ message: 'Profile information updated successfully.' });
            })
          })
        }
      ]);
    }
  ], function(err) {
    if (err) return next(err);
  });
});

/////////////////////////////////////////////////////////
///// CONTRIBUTOR AUTH REQUIRED FOR ALL ROUTES BELOW ////
/////////////////////////////////////////////////////////

/**
 * POST /api/upload
 * Upload a file to the uploads directory.
 */

app.post('/api/upload', isAuthenticatedContributor, function(req, res) {

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

app.post('/api/medals', isAuthenticatedContributor, function(req, res, next) {

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
  var strBoost = req.body.strBoost;
  var defBoost = req.body.defBoost;
  var addedBy = req.body.addedBy;

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
          strBoost: strBoost,
          defBoost: defBoost,
          random: [Math.random(), 0],
          addedBy: addedBy
        });

        medal.save(function(err) {
          if (err) return console.info(err);
        });

      } catch (e) {
        res.status(404).send({ message: name + ' could not be added.' });
      }

      res.send({ message: name + ' has been added successfully!' });
    }
  ]);
});

/////////////////////////////////////////////////////////
/// ADMIN AUTHENTICATION REQUIRED FOR ALL ROUTES BELOW //
/////////////////////////////////////////////////////////

/**
 * GET /api/users
 * Retrieve a list of all users.
 */

app.get('/api/users', isAuthenticatedAdmin, function (req, res){
  var start = req.query.start ? parseInt(req.query.start) : 0;

  User
    .find()
    .sort({'username':1})
    .limit(20)
    .skip(start)
    .exec({}, function(err, users) {
      if (err) return console.info(err);

      res.json(users);
    });
});

/**
 * GET /api/users/count
 * Returns the total number of users.
 */

app.get('/api/users/count', isAuthenticatedAdmin, function(req, res, next) {
  User.count({}, function(err, count) {
    if (err) return next(err);
    res.send({ count: count });
  });
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