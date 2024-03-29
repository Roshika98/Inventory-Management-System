const { v4: uuidv4 } = require('uuid');
const mysql2 = require('mysql2/promise');
const bcrypt = require('bcrypt');


const dbOpt = {
    host: process.env.DATABASE_URL,
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME
};



async function addNewUser(username, password, email, type) {
    var connection = null;
    // if (dbOpt.host) {
    //     connection = await mysql2.createConnection(dbOpt);
    // } else {
    //     connection = await mysql2.createConnection({
    //         host: process.env.DATABASE_URL,
    //         user: process.env.DATABASE_USER,
    //         database: process.env.DATABASE_NAME
    //     })
    // }
    connection = await mysql2.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'inventoryManagement'
    })
    const id = uuidv4();
    const hash = await bcrypt.hash(password, 12);
    const query = 'INSERT INTO users (user_id,user_name,user_pw,email,type) VALUES (?,?,?,?,?)';
    const response = await connection.execute(query, [id, username, hash, email, type]);
    connection.end();
};

const changePassword = async function changePassword(userID, old, newPassword) {
    const connection = await mysql2.createConnection(dbOpt);
    var query = 'SELECT user_id,user_name,user_pw,type FROM users WHERE user_id=?';
    var newQ = 'update users set user_pw=? where user_id=?';
    const result = await connection.execute(query, [userID]);
    if (result[0].length == 0) {
        await connection.end();
        return { isValid: false, message: 'no user found' };
    } else {
        const validPassword = await bcrypt.compare(old, result[0][0].user_pw);
        if (validPassword) {
            var hash = await bcrypt.hash(newPassword, 12);
            const response = await connection.execute(newQ, [hash, userID]);
            await connection.end();
            return { isValid: true, message: 'password change successful!' };
        } else {
            await connection.end();
            return { isValid: false, message: 'current password is wrong!' };
        }
    }
}


/**
 * Used to login a user to their account
 * @param  {String} username username of the user account
 * @param  {String} password password for the user account
 */
const userLogin = async function logginUser(username, password) {
    const connection = await mysql2.createConnection(dbOpt);
    var query = 'SELECT user_id,user_name,user_pw,type FROM users WHERE user_name=?';
    const result = await connection.execute(query, [username]);
    if (result[0].length == 0) {
        await connection.end();
        return { isValid: false };
    } else {
        const validPassword = await bcrypt.compare(password, result[0][0].user_pw);
        if (validPassword) {
            await connection.end();
            return { isValid: true, id: result[0][0].user_id, type: result[0][0].type };
        } else {
            await connection.end();
            return { isValid: false };
        }
    }
}

const serializeUser = function serializeUserSession(req, userID, type, username) {
    req.session.user_id = userID;
    req.session.user_type = type;
    req.session.signed_in = true;
    req.session.user_name = username;
}

const deserializeUser = function deserializeUserSession(req) {
    req.session.destroy();
}

module.exports = { login: userLogin, serializeUser: serializeUser, deserializeUser: deserializeUser, createNewUser: addNewUser, changePassword: changePassword };
