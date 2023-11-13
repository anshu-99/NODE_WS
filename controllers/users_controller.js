const User = require('../models/user');

// Show user profile details
module.exports.profile = async function (req, res) {
    try {
        const userId = req.cookies.user_id;

        if (!userId) {
            return res.redirect('/users/sign-in');
        }

        const user = await User.findById(userId);

        if (user) {
            return res.render('user_profile', {
                title: 'User Profile',
                user: user,
            });
        } else {
            return res.redirect('/users/sign-in');
        }
    } catch (error) {
        console.error('Error in retrieving user profile:', error);
        return res.redirect('/users/sign-in');
    }
};

// Render the sign-up page
module.exports.signUp = function (req, res) {
    return res.render('user_sign_up', {
        title: 'ConnectoPia | Sign Up',
    });
};

// Render the sign-in page
module.exports.signIn = function (req, res) {
    return res.render('user_sign_in', {
        title: 'ConnectoPia | Sign In',
    });
};

// Handle user sign-up
module.exports.create = async function (req, res) {
    try {
        if (req.body.password !== req.body.confirm_password) {
            return res.redirect('back');
        }

        const existingUser = await User.findOne({ email: req.body.email });

        if (!existingUser) {
            const newUser = await User.create(req.body);
            return res.redirect('/users/sign-in');
        } else {
            return res.redirect('back');
        }
    } catch (error) {
        console.error('Error in user creation:', error);
        return res.redirect('back');
    }
};

// Handle user sign-in and create a session
module.exports.createSession = async function (req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user && user.password === req.body.password) {
            res.cookie('user_id', user.id);
            return res.redirect('/users/profile');
        } else {
            return res.redirect('back');
        }
    } catch (error) {
        console.error('Error in user sign-in:', error);
        return res.redirect('back');
    }
};
