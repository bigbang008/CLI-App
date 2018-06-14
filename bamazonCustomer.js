var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "250833sS",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    queryAllItems();
});

function queryAllItems() {
  connection.query("SELECT * FROM products", function(err, res, rows) {
    if (err) throw err;
    console.log(rows[0].name + "|" + rows[1].name);
    console.log(rows[0].name + ": " + res[0].item_id + "|" + res[0].product_name + "|" + res[0].department_name + "|" + res[0].price + "|" + res[0].stock_quantity );
    // connection.end();
    });
}
