const express = require('express');
const exegesisExpress = require('exegesis-express');
const http = require('http');
const path = require('path');

const passport = require('passport');
const exegesisPassport = require('exegesis-passport').default;
const JWTStrategy = require('passport-jwt').Strategy;
const extract_jwt = require('passport-jwt').ExtractJwt;

const basicAuthenticator = require('./security/basicAuthenticator');

var jwtOpts = {};
//header: {Authorization: JWT asfjkeiajrfjkfei...akfeifjefj..VERYLONGTOKEN}
//jwtOpts.jwtFromRequest = extract_jwt.fromAuthHeaderWithScheme('JWT'); // or fromAuthHeaderAsBearerToken()


//header: {Authorization: Bearer asfjkeiajrfjkfei...akfeifjefj..VERYLONGTOKEN}
jwtOpts.jwtFromRequest = extract_jwt.fromAuthHeaderAsBearerToken();
jwtOpts.secretOrKey = 'test-secret';
jwtOpts.issuer = 'cfpb';
jwtOpts.audience = 'cfpb';

passport.use('jwt',
    new JWTStrategy(jwtOpts,function(jwt_payload, done){
        console.log('log jwt passport strategy called');
        //to generate jwt token for client

        //verify nameId
        //hard-coded since this is Testing Application (non-production)
        if(jwt_payload.nameID==="joe"){
            //success
            var user = {name: "joe"};
            return done(null,user);
        }
        else{
            var err = {message: "invalid jwt token"};
            return done(err,false);
        }
    }));

async function createServer() {



    // See https://github.com/exegesis-js/exegesis/blob/master/docs/Options.md
    const options = {
        controllers: path.resolve(__dirname, './controllers'),
        allowMissingControllers: false,
        authenticators: {
            basicAuth: basicAuthenticator,
            jwt:exegesisPassport(passport,'jwt')
        }
    };

    // This creates an exegesis middleware, which can be used with express,
    // connect, or even just by itself.
    const exegesisMiddleware = await exegesisExpress.middleware(
        path.resolve(__dirname, './openapi.yaml'),
        options
    );

    const app = express();

    app.use(passport.initialize());

    // If you have any body parsers, this should go before them.
    app.use(exegesisMiddleware);

    // Return a 404
    app.use((req, res) => {
        res.status(404).json({message: `Not found`});
    });

    // Handle any unexpected errors
    app.use((err, req, res, next) => {
        res.status(500).json({message: `Internal error: ${err.message}`});
    });

    const server = http.createServer(app);

    return server;
}

createServer()
    .then(server => {
        server.listen(3000);
        console.log("Listening on port 3000");
        console.log("Try visiting http://localhost:3000/greet?name=Jason");
        console.log("Try visiting http://localhost:3000/company?name=Starbucks");
    })
    .catch(err => {
        console.error(err.stack);
        process.exit(1);
    });