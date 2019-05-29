const Connected = req => req.session.__id !== undefined;

const SaveAccountSession = (req, account) => {
    req.session.__id = account.json._id;
    return req.session.__id !== undefined;
};

module.exports = {
    Connected,
    SaveAccountSession
};