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
    var id = uuidv4();
    var comapnyprefix = faker.company.companyName();
    var companyName = comapnyprefix + " " + faker.company.companySuffix() + " Hardware Suppliers";
    var address = 'No: ' + faker.address.streetAddress(true) + "," + faker.address.city();
    var mobile_no = faker.phone.phoneNumber('+94 9# ### ## ##');
    var email = faker.internet.email(comapnyprefix);
    return { id, companyName, address, mobile_no, email };
}

function createProductDetails() {
    var id = uuidv4();
    var name = faker.commerce.productName();
    var details = faker.commerce.productDescription();
    var material = faker.commerce.productMaterial();
    var price = faker.commerce.price(50, 1000, 2);
    var url = 'https://loremflickr/320/240/tools';
    var quantity = faker.datatype.number({ min: 45, max: 1000 });
    var lastdate = faker.date.between('2020-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z');
    var location = faker.address.countryCode('alpha-3');
    return { id, name, details, material, price, url, quantity, lastdate, location };
};


async function createSuppliers() {
    var q = 'insert into suppliers(sup_id,name,ph_no,address,email) values (?,?,?,?,?)';
    console.log('Creating Random Supplier Details...');
    var connection = await mysql.createConnection(opt);
    for (let i = 0; i < 20; i++) {
        var supplier = createSupplierDetails();
        await connection.execute(q, [supplier.id, supplier.companyName, supplier.mobile_no, supplier.address, supplier.email]);
    }
    console.log('Random suppliers created!');
    await connection.end();
}

async function createProducts() {
    console.log("Creating random products...");
    var q1 = 'insert into products(item_code,name,product_details,product_material,unit_price,picture_url) values (?,?,?,?,?,?)';
    var q2 = 'insert into stocks(item_code,quantity,store_location,last_received_on) values (?,?,?,?)';
    var connection = await mysql.createConnection(opt);
    for (let i = 0; i < 50; i++) {
        var product = createProductDetails();
        await connection.execute(q1, [product.id, product.name, product.details, product.material, product.price, product.url]);
        await connection.execute(q2, [product.id, product.quantity, product.location, product.lastdate]);
    }
    console.log('Random products created!');
    await connection.end();
}

async function createUsers() {
    console.log('Creating random employees....\n\n ');
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
    console.log('\nRandom employees created!');
    (await connection).end();
};

async function feedRandomData() {
    try {
        await createSuppliers();
        await createProducts();
        await createUsers();
        console.log('\nRandom data feeded to the database...     Done');
    } catch (error) {
        console.log(error);
    }
}


feedRandomData();

