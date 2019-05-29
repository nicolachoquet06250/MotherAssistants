const UCFirst = string => {
    return string.substr(0, 1).toUpperCase() + string.substr(1, string.length - 1).toLowerCase();
};

module.exports = {
    UCFirst
};