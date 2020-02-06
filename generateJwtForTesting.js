var fs = require('fs');
var jwt = require('jsonwebtoken');

var token = jwt.sign({nameID: 'joe', user: 'joe', aud: 'cfpb', iss: 'cfpb'},'test-secret');

console.log('test token is: ' + token);

jwt.verify(token,'test-secret', function(err, decoded){
    console.log('decoded nameID: ' + decoded.nameID);
    console.log('decoded user: ' +decoded.user);
});