const Connected = req => req.session.user !== undefined && req.session.user.__id !== undefined;

const GetMyRole = req => Connected(req) ? req.session.user.role : 'anonymous';

const GetMyParentRole = req => req.session.user.parent_role;

const SaveAccountSession = (req, account) => {
    if(account.role === 'ma') {
        delete account.password;
    }
    else if (account.role === 'parent') {
        for(let role in account.family) {
            if(account.family[role] !== null) {
                delete account.family[role].password;
            }
        }
    }
    let id = account._id;
    delete account._id;
    account.__id = id;

    req.session.user = account;

    return req.session.user !== undefined && req.session.user.__id !== undefined;
};

const DeleteAccountSession = req => {
    delete req.session.user;
};

const GetAccount = req => req.session.user;

const UpdateAccountProp = (req, prop, value) => {
    GetAccount(req)[prop] = value;
};

module.exports = {
    Connected,
    SaveAccountSession,
    GetMyRole,
    GetAccount,
    UpdateAccountProp,
    GetMyParentRole,
    DeleteAccountSession
};