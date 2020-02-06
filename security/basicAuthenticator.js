

// Note that authenticators can either return a Promise, or take a callback.
module.exports = async function (pluginContext, info) {
    const basicAuth = require('basic-auth');
    const bcrypt = require('bcrypt');

    const credentials = basicAuth(pluginContext.req);
    if (!credentials) {
        // The request failed to provide a basic auth header.
        return {type: 'missing', statusCode: 401};
    }

    const {name, pass} = credentials;

    //in non-test node.js application,
    //password would be stored in a db as a hash
    //since this is just a test application create hash value here

    const user = {name: "joe", password: "whatever", roles: ['read', 'write']};
    const passwordhash = await bcrypt.hash(user.password, 2);

    if (!user) {
        return {
            type: 'invalid',
            statusCode: 401,
            message: `User ${name} not found`,
        };
    }
    if (!(await bcrypt.compare(pass, passwordhash))) {

        return {
            type: 'invalid',
            statusCode: 401,
            message: `Invalid password for ${name}`,
        };
    }

    return {
        type: 'success',
        user,
        roles: user.roles, // e.g. `['admin']`, or `[]` if this user has no roles.
        scopes: [], // Ignored in this case, but if `basicAuth` was an OAuth
        // security scheme, we'd fill this with `['readOnly', 'readWrite']`
        // or similar.
    };
}