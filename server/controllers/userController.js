const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const TokenService = require("../services/tokenService");
const sendMessageToAdmin = require("../functions/telegram");

const userLogin = async (req, res) => {
    try {

        const {email, password} = req.body;

        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({status: false, error: 'User not found'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({status: false, error: 'Incorrect password'});
        }
        const token = TokenService.generateToken({id: user.id});
        console.log(req.connection.remoteAddress)
        //get user ip
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log(ip)
        await sendMessageToAdmin(`user ${user.email} logged in from ${ip}`);

        return res.json({
            user,
            token,
            isBotRunning
        });
    } catch (e) {
        console.log(e);
        await sendMessageToAdmin(`Some error in userLogin ${e}`);
        res.status(500).json({status: false, error: 'Server error'});
    }

}
const userSignup = async (req, res) => {
    const {email, password} = req.body;
    console.log(email, password);
    // try {
    //     const user = await UserService.signup(email, password);
    //
    //     return res.json({
    //         user
    //     });
    // } catch (error) {
    //     return res.status(400).json({status: false, error: error.message});
    // }

}

const checkAuth = (req, res) => {
    return res.json({status: true, user: {...req.user, isBotRunning}});
}

module.exports = {
    userLogin,
    userSignup,
    checkAuth
}