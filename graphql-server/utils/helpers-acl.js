const jwt =  require('jsonwebtoken');
const { OAUTH2_PUBLIC_KEY } = require('../config/globals');

//TODO: Use this routines through all the code to have them in one place

module.exports = {
    getTokenFromContext: function (context) {
        let token_bearer =  context.request.headers["authorization"];
        let token = token_bearer.replace("Bearer ","");
        let decoded = jwt.verify(token, OAUTH2_PUBLIC_KEY);
        return decoded;
    },

    //INFO: can be useful for tests
    /*generateDummyToken: function (email) {
        return jsonwebtoken.sign({
            id: 1,
            email: email,
            roles: "admin"
        }, JWT_SECRET, { expiresIn: '1h' });
    }*/
};