// Babel ES6/JSX Compiler
require('babel-register');

// Environment variables
require('dotenv').config()

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

// s3 dependencies
var aws = require('aws-sdk');
var s3Bucket = process.env.S3_BUCKET;

// db dependencies
var mongoose = require('mongoose');
var Medal = require('./models/medal');
var Vote = require('./models/vote');
var User = require('./models/user');
var News = require('./models/news');

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
  successRedirect: '/api/login'
}));

/**
 * POST /api/signup
 * Creates new user with passport
 */

app.post('/api/signup', passport.authenticate('signup', {
  successRedirect: '/api/login'
}));

/**
 * GET /api/signup/username
 * Returns true if user can sign up with the provided username
 */

app.get('/api/signup/username', function(req, res, next) {
  var username = req.query.username;

  User.findOne({ username: username }, function(err, user) {
    if (err) return next(err);
    if (user) { return res.status(200).send({ valid: false }); }
    return res.status(200).send({ valid: true });
  });
});

/**
 * GET /api/signup/email
 * Returns true if user can sign up with the provided email
 */

app.get('/api/signup/email', function(req, res, next) {
  var email = req.query.email;

  User.findOne({ email: email }, function(err, user) {
    if (err) return next(err);
    if (user) { return res.status(200).send({ valid: false }); }
    return res.status(200).send({ valid: true });
  });
});

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
        res.send({ message: 'An e-mail has been sent to ' + user.email + ' with further instructions. ' +
          'Please check your spam folder if you can\'t find the email.' });
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
/////////// AWS FILE STORAGE ENDPOINTS BELOW ////////////
/////////////////////////////////////////////////////////

/**
 * GET /api/sign-s3
 * Generates and returns signature for client-side javascript to upload image.
 */

app.get('/api/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: s3Bucket,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${s3Bucket}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
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

  var medalArray = [];

  /* pick first medal at random */
  Medal.find()
    .where('_active', true)
    .where('isBoosted', false)
    .where('voted', false)
    .limit(1)
    .exec(function(err, medalOne) {
      if (err) return next(err);

      if (medalOne[0] != null) {
        medalArray.push(medalOne[0]);

        /* pick second medal at random as long as it's different from first */
        Medal.find({ random: { $near: [Math.random(), 0] } })
          .where('_active', true)
          .where('isBoosted', false)
          .where('voted', false)
          .where('_id', {$ne: medalOne[0]._id})
          .where('no', {$ne: medalOne[0].no})
          .limit(1)
          .exec(function(err, medalTwo) {
            if (err) return next(err);

            if (medalTwo.length === 1) {
              medalArray.push(medalTwo[0]);
            }

            if (medalArray.length === 2) {
              return res.send(medalArray);
            } 

            /* do this is there weren't enough medals that haven't been voted yet */
            /* set all medals as voted = false and pick two at random */
            Medal.update({}, { $set: { voted: false } }, { multi: true }, function(err) {
          
              Medal.find({ random: { $near: [Math.random(), 0] } })
                .where('_active', true)
                .where('isBoosted', false)
                .limit(2)
                .exec(function(err, medals) {
                  if (err) return next(err);

                  if (medals.length === 2) {
                    return res.send(medals);
                  }
                });
            });
          });

      } else {
        /* do this if there weren't enough medals that haven't been voted yet */
        /* set all medals as voted = false and pick two at random */
        Medal.update({}, { $set: { voted: false } }, { multi: true }, function(err) {
      
          Medal.find({ random: { $near: [Math.random(), 0] } })
            .where('_active', true)
            .where('isBoosted', false)
            .limit(2)
            .exec(function(err, medals) {
              if (err) return next(err);

              if (medals.length === 2) {
                return res.send(medals);
              }
            });
          });
      }
    });
});

/**
 * GET /api/medals/featured
 * Returns 2 medals where one is featured
 */

app.get('/api/medals/featured', function(req, res, next) {

  var medalArray = [];

  /* pick medal from list of 10 least-voted medals */
  Medal.find()
    .where('_active', true)
    .where('isBoosted', false)
    .sort({'__v':1})
    .limit(10)
    .exec(function(err, medalOne) {
      if (err) return next(err);

      medalArray.push(medalOne[Math.floor(Math.random()*medalOne.length)]);

      /* pick second medal at random as long as it's different from first */
      Medal.find({ random: { $near: [Math.random(), 0] } })
        .where('_active', true)
        .where('isBoosted', false)
        .where('voted', false)
        .where('_id', {$ne: medalOne[0]._id})
        .where('no', {$ne: medalOne[0].no})
        .limit(1)
        .exec(function(err, medalTwo) {
          if (err) return next(err);

          if (medalTwo[0] != null) {
            medalArray.push(medalTwo[0]);
          }

          if (medalArray.length === 2) {
            return res.send(medalArray);
          } 

          /* do this if there weren't enough medals that haven't been voted yet */
          /* set all medals as voted = false and pick two at random */
          Medal.update({}, { $set: { voted: false } }, { multi: true }, function(err) {
        
            Medal.find({ random: { $near: [Math.random(), 0] } })
              .where('_active', true)
              .where('isBoosted', false)
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
});

/**
 * GET /api/medals/newest
 * Returns 2 medals where one has fewer than 80 votes
 */

app.get('/api/medals/newest', function(req, res, next) {

  var medalArray = [];

  /* pick first medal from list of newest medals with the least amount of votes */
  Medal.find()
    .where('_active', true)
    .where('isBoosted', false)
    .where('__v', {$lt: 80})
    .sort({'__v':1})
    .exec(function(err, medalOne) {
      if (err) return next(err);

      if (medalOne.length >= 1) {
        medalArray.push(medalOne[Math.floor(Math.random()*medalOne.length)]);

        /* pick second medal at random as long as it's different from first */
        Medal.find({ random: { $near: [Math.random(), 0] } })
          .where('_active', true)
          .where('isBoosted', false)
          .where('voted', false)
          .where('_id', {$ne: medalOne[0]._id})
          .where('no', {$ne: medalOne[0].no})
          .limit(1)
          .exec(function(err, medalTwo) {
            if (err) return next(err);

            if (medalTwo[0] != null) {
              medalArray.push(medalTwo[0]);
            }

            if (medalArray.length === 2) {
              return res.send(medalArray);
            } 

            /* do this if there weren't enough medals that haven't been voted yet */
            /* set all medals as voted = false and pick two at random */
            Medal.update({}, { $set: { voted: false } }, { multi: true }, function(err) {
          
              Medal.find({ random: { $near: [Math.random(), 0] } })
                .where('_active', true)
                .where('isBoosted', false)
                .limit(2)
                .exec(function(err, medals) {
                  if (err) return next(err);

                  if (medals.length === 2) {
                    return res.send(medals);
                  }
                });
            });
          });
      } else {
        /* if there aren't any new medals then redirect to the standard medal retrieval */
        res.redirect('/api/medals');
      }
    });
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
  var legit = req.body.legit;

  if (!legit) {
    return res.status(200).send({ message: 'You must vote through the web application only.' });
  }

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
  Medal.count({ _active: true }, function(err, count) {
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

  Medal.findOne({ name: medalName, _active: true, isGuilted: false, isBoosted: false }, function(err, medal) {
    if (err) return next(err);
    if (!medal) {
      return res.status(404).send({ message: 'Medal not found.' });
    }
    res.send(medal);
  });
});

/**
 * GET /api/medals/search/results
 * Looks up a ist of medals by name
 */

app.get('/api/medals/search/results', function(req, res, next) {
  var medalName = new RegExp(req.query.name, 'i');

  Medal
    .find({ name: medalName, isGuilted: false, isBoosted: false })
    .where('_active', true)
    .limit(20)
    .exec(function(err, medals) {
      if (err) return next(err);
      if (!medals) {
        return res.status(404).send({ message: 'Medals not found.' });
      }
      res.send(medals);
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
    .where('_active', true)
    .where('__v', {$gt: 50})
    .sort({'ratio':-1, 'wins':-1})
    .limit(100)
    .exec(function(err, medals) {
      if (err) return next(err);
      res.send(medals);
    });
});

/**
 * GET /api/medals/shame
 * Returns 100 lowest ranked medals. Filter by conditions as defined in the app.
 */

app.get('/api/medals/shame', function(req, res, next) {
  var params = req.query;
  var conditions = {};

  _.each(params, function(value, key) {
    conditions[key] = value;
  });

  Medal
    .find(conditions)
    .where('_active', true)
    .where('__v', {$gt: 50})
    .sort({'ratio':1, 'losses':-1})
    .limit(100)
    .exec(function(err, medals) {
      if (err) return next(err);
      res.send(medals);
    });
});

/**
 * GET /api/medals/slug/:slug
 * Returns detailed medal information by slug.
 */

app.get('/api/medals/slug/:slug', function(req, res, next) {
  var slug = req.params.slug;

  Medal.findOne({ slug: slug, _active: true }, function(err, medal) {
    if (err) return next(err);
    if (!medal) {
      return res.status(404).send({ message: 'Medal not found.' });
    }
    res.send(medal);
  });
});

/**
 * GET /api/medals/no/:no
 * Returns medals based on the medal number.
 */

app.get('/api/medals/no/:no', function(req, res, next) {
  var no = req.params.no;

  Medal
    .find({ no: no })
    .where('_active', true)
    .exec(function(err, medals) {
      if (err) return next(err);
      res.send(medals);
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

    Medal.findOne({ _id: vote.winner, _active: true }, function(err, medalW) {
      if (err) return next(err);
      if (!medalW) {
        return res.status(404).send({ message: 'Winner medal not found.' });
      }

      Medal.findOne({ _id: vote.loser, _active: true }, function(err, medalL) {
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
 * GET /api/medals/user/:id
 * Returns all medals added by the specified user ID.
 */

app.get('/api/medals/user/:id', function(req, res, next) {
  var user = req.params.id;
  Medal
    .find()
    .where('addedBy', user)
    .sort({'name':-1})
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

  Medal.findOne({ _id: id, _active: true }, function(err, medal) {
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
    .where('_active', true)
    .sort('-date') // Sort in descending order (newest on top)
    .limit(10)
    .exec(function(err, votes) {
      if (err) return next(err);
      res.send(votes);
    });
});

/**
 * GET /api/votes
 * Returns 100 most recent votes.
 */

app.get('/api/votes', function(req, res, next) {

  Vote
    .find()
    .where('_active', true)
    .sort('-date') // Sort in descending order (newest on top)
    .limit(100)
    .exec(function(err, votes) {
      if (err) return next(err);
      res.send(votes);
    });
});

/**
 * GET /api/votes/count
 * Returns the total number of votes.
 */

app.get('/api/votes/count', function(req, res, next) {
  Vote.count({ _active: true }, function(err, count) {
    if (err) return next(err);
    res.send({ count: count });
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
    .where('_active', true)
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
        Medal.count({ _active: true }, function(err, count) {
          callback(err, count);
        });
      },
      function(callback) {
        Medal.count({ affinity: 'upright', _active: true }, function(err, uprightCount) {
          callback(err, uprightCount);
        });
      },
      function(callback) {
        Medal.count({ affinity: 'reversed', _active: true }, function(err, reversedCount) {
          callback(err, reversedCount);
        });
      },
      function(callback) {
        Medal.count({ attribute: 'power', _active: true }, function(err, powerCount) {
          callback(err, powerCount);
        });
      },
      function(callback) {
        Medal.count({ attribute: 'speed', _active: true }, function(err, speedCount) {
          callback(err, speedCount);
        });
      },
      function(callback) {
        Medal.count({ attribute: 'magic', _active: true }, function(err, magicCount) {
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
          .where('_active', true)
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
          .where('_active', true)
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

/**
 * GET /api/news
 * Returns 10 most recent news items.
 */

app.get('/api/news', function(req, res, next) {
  var start = req.query.start ? parseInt(req.query.start) : 0;

  News
    .find()
    .where('_active', true)
    .sort('-date') // Sort in descending order (newest on top)
    .limit(10)
    .skip(start)
    .exec(function(err, news) {
      if (err) return next(err);
      res.send(news);
    });
});

/**
 * GET /api/news/count
 * Returns the total number of news items.
 */

app.get('/api/news/count', function(req, res, next) {
  News.count({ _active: true }, function(err, count) {
    if (err) return next(err);
    res.send({ count: count });
  });
});

/**
 * GET /api/news/newest
 * Returns the most recent news item.
 */

app.get('/api/news/newest', function(req, res, next) {
  News
  .findOne()
  .where('_active', true)
  .sort('-date') // Sort in descending order (newest on top)
  .exec(function(err, news) {
    if (err) return next(err);
    res.send(news);
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

  var username = req.body.username ? req.body.username : undefined;
  var oldPassword = req.body.oldPassword ? req.body.oldPassword : undefined;
  var password = req.body.password ? req.body.password : undefined;
  var email = req.body.email ? req.body.email : undefined;
  var _id = req.body.id ? req.body.id : undefined;

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

/**
 * GET /api/user/votes
 * Returns votes tied to a user.
 */

app.get('/api/user/votes', isAuthenticated, function(req, res, next) {
  var start = req.query.start ? parseInt(req.query.start) : 0;

  if (!req.user) {
    return res.status(400).send({ message: 'Must be logged in to update votes.' });
  }

  Vote
    .find({ voter: req.user._id })
    .sort('-date') // Sort in descending order (newest on top)
    .limit(20)
    .skip(start)
    .exec(function(err, votes) {
      if (err) return next(err);
      res.send(votes);
    });
});

/**
 * GET /api/user/votes/count
 * Returns count of votes tied to a user.
 */

app.get('/api/user/votes/count', isAuthenticated, function(req, res, next) {
  if (!req.user) {
    return res.status(400).send({ message: 'Must be logged in to get user votes.' });
  }

  Vote.count({ voter: req.user._id }, function(err, count) {
    if (err) return next(err);
    res.send({ count: count });
  });
});

/**
 * PUT /api/user/votes
 * Update user vote information. 
 */

app.put('/api/user/votes', isAuthenticated, function(req, res, next) {

  var id = req.body.id;
  var active = req.body.active ? req.body.active : undefined;
  var winner = req.body.winner ? req.body.winner : undefined;
  var loser = req.body.loser ? req.body.loser : undefined;

  async.waterfall([

    function(done) {
      Vote.findOne({ _id: id }, function(err, vote) {
        done(err, vote);
      });
    },
    function(vote, done) {
      if (!vote) {
        return res.status(404).send({ message: 'Could not find vote.' });
      }

      if (!req.user._id.equals(vote.voter)) {
        return res.status(404).send({ message: 'You can only change your own votes.' });
      }

      async.parallel([
        function(callback) {

          if (active) { vote._active = active; }
          if (winner) { vote.winner = winner; }
          if (loser) { vote.loser = loser; }

          vote.save(function(err) {
            if (err) return next(err)
            res.status(200).send({ message: 'Vote information updated successfully.' });
          })
        }
      ]);
    }
  ], function(err) {
    if (err) return next(err);
  });
});

/**
 * PUT /api/medal/refresh
 * Refreshes medal vote information
 */

app.put('/api/medal/refresh', isAuthenticated, function(req, res, next) {

  var id = req.body.id;

  async.parallel([
    function(callback) {
      Medal.findOne({ _id: id }, function(err, medal) {
        callback(err, medal);
      });
    },
    function(callback) {
      Vote.count({ winner: id, _active: true }, function(err, wins) {
        callback(err, wins);
      });
    },
    function(callback) {
      Vote.count({ loser: id, _active: true }, function(err, losses) {
        callback(err, losses);
      });
    }
  ],
  function(err, results) {
    if (err) return next(err);

    var medal = results[0];
    var wins = results[1];
    var losses = results[2];

    if (!medal) {
      return res.status(404).send({ message: 'Medal not found.' });
    }

    async.parallel([
      function(callback) {
        medal.wins = wins;
        medal.losses = losses;
        medal.save(function(err) {
          callback(err);
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.status(200).end();
    });
  });
});

/////////////////////////////////////////////////////////
///// CONTRIBUTOR AUTH REQUIRED FOR ALL ROUTES BELOW ////
/////////////////////////////////////////////////////////

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

/**
 * PUT /api/medals/:id
 * Update medal information. 
 */

app.put('/api/medals/:id', isAuthenticatedContributor, function(req, res, next) {

  var _id = req.params.id;

  var name = req.body.name ? req.body.name : undefined;
  var slug = req.body.slug ? req.body.slug : undefined;
  var no = req.body.no ? req.body.no : undefined;
  var imgPath = req.body.imgPath ? req.body.imgPath : undefined;
  var affinity = req.body.affinity ? req.body.affinity : undefined;
  var attribute = req.body.attribute ? req.body.attribute : undefined;
  var baseStr = req.body.baseStr ? req.body.baseStr : undefined;
  var baseDef = req.body.baseDef ? req.body.baseDef : undefined;
  var spAtk = req.body.spAtk ? req.body.spAtk : undefined;
  var spDesc = req.body.spDesc ? req.body.spDesc : undefined;
  var target = req.body.target ? req.body.target : undefined;
  var tier = req.body.tier ? req.body.tier : undefined;
  var mult = req.body.mult ? req.body.mult : undefined;
  var gauges = req.body.gauges ? req.body.gauges : undefined;
  var strBoost = req.body.strBoost ? req.body.strBoost : undefined;
  var defBoost = req.body.defBoost ? req.body.defBoost : undefined;

  var _active = req.body.active ? req.body.active : undefined;

  if (!_id) {
    return res.status(400).send({ message: 'Must provide medal id.' });
  }

  async.waterfall([
    function(done) {
      Medal.findOne({ _id: _id }, function(err, medal) {
        done(err, medal);
      });
    },
    function(medal, done) {
      if (!medal) {
        return res.status(404).send({ message: 'Could not find medal.' });
      }

      async.parallel([
        function(callback) {

          if (name) { medal.name = name; }
          if (slug) { medal.slug = slug; }
          if (no) { medal.no = no; }
          if (imgPath) { medal.imgPath = imgPath; }
          if (affinity) { medal.affinity = affinity; }
          if (attribute) { medal.attribute = attribute; }
          if (baseStr) { medal.baseStr = baseStr; }
          if (baseDef) { medal.baseDef = baseDef; }
          if (spAtk) { medal.spAtk = spAtk; }
          if (spDesc) { medal.spDesc = spDesc; }
          if (target) { medal.target = target; }
          if (tier) { medal.tier = tier; }
          if (mult) { medal.mult = mult; }
          if (gauges) { medal.gauges = gauges; }
          if (strBoost) { medal.strBoost = strBoost; }
          if (defBoost) { medal.defBoost = defBoost; }

          if (_active) { medal._active = _active; }

          medal.save(function(err) {
            if (err) return next(err)
            res.status(200).send({ message: 'Medal information updated successfully.' });
          })
        }
      ]);
    }
  ], function(err) {
    if (err) return next(err);
  });
});

/**
 * POST /api/news
 * Adds a new news items to the database.
 */

app.post('/api/news', isAuthenticatedContributor, function(req, res, next) {

  var headline = req.body.headline;
  var content = req.body.content;
  var type = req.body.type;
  var author = req.body.author;

  async.waterfall([
    function() {
      try {
        var news = new News({
          headline: headline,
          content: content,
          type: type,
          date: new Date(),
          author: author
        });

        news.save(function(err) {
          if (err) return console.info(err);
        });

      } catch (e) {
        res.status(404).send({ message: headline + ' could not be added.' });
      }

      res.send({ message: headline + ' has been added successfully!' });
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

/**
 * PUT /api/user/admin
 * Update user admin and contributor information. 
 */

app.put('/api/user/admin', isAuthenticatedAdmin, function(req, res, next) {

  var contributor = req.body.contributor ? req.body.contributor : undefined;
  var admin = req.body.admin ? req.body.admin : undefined;
  var _id = req.body.id ? req.body.id : undefined;

  var adminDevId = '58dc9e7045371246b4cd8d84';
  var stephenDevId = '58dc9e7045371246b4cd8d84';

  var adminId = '58f7974b7d44850011ee5a48';
  var stephenId = '58f7976b7d44850011ee5a49';

  if (_id == adminDevId || _id == stephenDevId || _id == adminId || _id == stephenId) {
    return res.status(400).send({ message: 'Cannot change this user\'s permissions. Sorry!!! ;)' });
  }

  if (!_id) {
    return res.status(400).send({ message: 'Must provide user id.' });
  }

  async.waterfall([
    function(done) {
      User.findOne({ _id: _id }, function(err, user) {
        done(err, user);
      });
    },
    function(user, done) {
      if (!user) {
        return res.status(404).send({ message: 'Could not find user account.' });
      }

      async.parallel([
        function(callback) {
          if (contributor) { user.contributor = contributor; }
          if (admin) { user.admin = admin; }

          user.save(function(err) {
            if (err) return next(err)
            res.status(200).send({ message: 'User information updated successfully.' });
          })
        }
      ]);
    }
  ], function(err) {
    if (err) return next(err);
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