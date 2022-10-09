const mysql = require('mysql2/promise');
const faker = require('faker');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const opt = {
    host: 'localhost',
    user: 'root',
    database: 'inventoryManagement'
};

async function createTables() {
    var q1 = 'create table orderdetails(order_no varchar(50) not null primary key,type varchar(50),order_date datetime,sub_total int)';
    var q2 = 'create table products(item_code varchar(50) not null primary key,name varchar(150),product_details varchar(150),product_material varchar(150),unit_price decimal(10,2),picture_url varchar(100))';
    var q3 = 'create table suppliers(sup_id varchar(50) not null primary key,name varchar(150),ph_no varchar(20),address varchar(150),email varchar(80))';
    var q4 = 'create table users(user_id varchar(50) not null primary key,user_name varchar(60),user_pw varchar(150),email varchar(50),first_name varchar(150),last_name varchar(100),mobile_no varchar(20),type varchar(20),status boolean)';
    var q5 = 'create table stocks(item_code varchar(50) not null primary key,quantity int,store_location varchar(100),last_received_on date,placed_Order boolean,FOREIGN KEY (item_code) REFERENCES products(item_code))';
    var q6 = 'create table order_product(order_id varchar(50),product_code varchar(50),quantity int,order_date datetime,foreign key (order_id) references orderdetails(order_no),foreign key (product_code) references products(item_code))';
    var q7 = 'create table order_supplier(order_no varchar(50),sup_id varchar(50),product_id varchar(50),quantity int,order_date datetime,foreign key (order_no) references orderdetails(order_no),foreign key (sup_id) references suppliers(sup_id),foreign key (product_id) references products(item_code))';
    var q8 = 'create table cart(item_no varchar(50) not null primary key,quantity int)';
    var q9 = 'create table temp_stock(orderID varchar(50),prodID varchar(50),quantity int,orderTime datetime)';
    var q10 = 'create table temp_order_restock(orderID varchar(50) primary key,suppID varchar(50),itemID varchar(50),quantity int,amount decimal(10,2))';
    var q11 = 'create table temp_order(orderID varchar(50),prodID varchar(50),quantity int,orderTime datetime,primary key (orderID,prodID))';
    var q12 = 'create table temp_restock(itemID varchar(50),suppID varchar(50),quantity int,primary key (itemID,suppID))';
    var tables = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12];
    console.log('Creating Tables...')
    var connection = await mysql.createPool(opt);
    for (let i = 0; i < tables.length; i++) {
        const element = tables[i];
        await connection.query(element);
    }
    await connection.end();
    console.log('Tables created...');
}

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
    var connection = await mysql.createPool(opt);
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
    var connection = await mysql.createPool(opt);
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
    var connection = await mysql.createPool(opt);
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
        await createTables();
        await createSuppliers();
        await createProducts();
        await createUsers();
        console.log('\nRandom data feeded to the database...     Done');
    } catch (error) {
        console.log(error);
    }
}


feedRandomData();

