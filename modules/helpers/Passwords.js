let bcrypt = require("bcrypt");

module.exports.cryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

module.exports.comparePassword = function(plainPass, hash_word) {
    return bcrypt.compareSync(plainPass, hash_word);
};