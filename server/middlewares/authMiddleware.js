const TokenService = require('../services/tokenService');

const authMiddleware = (req, res, next) => {
    const {authorization} = req.headers;
    if (!authorization) {
        return res.status(401).json({error: 'You must be logged in.'});
    }
    const token = authorization.split(" ")[1];

    const result = TokenService.validateToken(token)

    if (!result) {
        return res.status(401).json({error: 'You must be logged in.'});
    }

    req.user = result;

    next();
}

module.exports = authMiddleware;