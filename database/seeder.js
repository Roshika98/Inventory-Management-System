const mysql = require('mysql2/promise');
const faker = require('faker');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const opt = {
    host: 'localhost',
    user: 'root',
    database: 'inventoryManagement'
};

function createUserDetails(type) {
    var id = uuidv4();
    var fisrtname = faker.name.firstName('male');
    var lastname = faker.name.lastName('male');
    var email = faker.internet.email(fisrtname, lastname);
    var username = faker.internet.userName(fisrtname, lastname);
    var mobile = faker.phone.phoneNumber('+94 9# ### ## ##');
    var password = faker.internet.password(8);
    console.log(`username: ${username}  password: ${password}  userType: ${type}`);
    return { id, fisrtname, lastname, email, username, mobile, password };
};

function createSupplierDetails() {

}

function createProduct() {

};

async function createUsers() {
    var type = 'Manager';
    var user = createUserDetails(type);
    var q = 'insert into users(user_id,user_name,user_pw,email,first_name,last_name,mobile_no,type) values (?,?,?,?,?,?,?,?)';
    var connection = await mysql.createConnection(opt);
    const hash = await bcrypt.hash(user.password, 12);
    user.password = hash;
    const result = await connection.execute(q, [user.id, user.username, user.password, user.email, user.fisrtname, user.lastname, user.mobile, type]);
    type = 'Salesman';
    for (let i = 0; i < 2; i++) {
        user = createUserDetails(type);
        const hash = await bcrypt.hash(user.password, 12);
        user.password = hash;
        const result = await connection.execute(q, [user.id, user.username, user.password, user.email, user.fisrtname, user.lastname, user.mobile, type]);
    }
    type = 'Accountant';
    for (let i = 0; i < 2; i++) {
        user = createUserDetails(type);
        const hash = await bcrypt.hash(user.password, 12);
        user.password = hash;
        const result = await connection.execute(q, [user.id, user.username, user.password, user.email, user.fisrtname, user.lastname, user.mobile, type]);
    }
    type = 'StockHandler';
    for (let i = 0; i < 3; i++) {
        user = createUserDetails(type);
        const hash = await bcrypt.hash(user.password, 12);
        user.password = hash;
        const result = await connection.execute(q, [user.id, user.username, user.password, user.email, user.fisrtname, user.lastname, user.mobile, type]);
    }
    (await connection).end();
};

createUsers();

