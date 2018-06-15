const mysql = require('mysql');
const inquirer = require('inquirer');
const Table = require('cli-table');
const figlet = require('figlet');
const chalk = require('chalk');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "250833sS",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;

    console.log(chalk.blue.bgRed.bold(figlet.textSync('..BAMAZON..', {
        font: 'Train',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    })));
    
    queryAllItems();
    askingPurchase();
    
});

function queryAllItems() {
  connection.query("SELECT * FROM products", function(err, res, rows) {
    if (err) throw err;
    
    //Declare the colums' name in the table
    var headName = [];
    for (var i = 0; i < (rows.length-1); i++) {
        headName.push(rows[i].name);
    }
    // console.log(headName);
    
    //Get the data in the table
    var tableData = [];
    for(var i = 0; i < res.length; i++) {
        var data = [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price];
        tableData.push(data);
    }
    // console.log(tableData);

    //Create A Table 
    var table = new Table({
        head: headName, 
        colWidths: [10, 30, 20, 10],
        // style: { 'text-align': 'center', 'padding-left': 0}
    });

    for (var i = 0; i < tableData.length; i++){
        table.push(tableData[i]);
    }
    console.log(chalk.underline.yellow(("------bamazonList----")));
    console.log(table.toString());
    console.log(chalk.blue("----------------------------------------------------------"));
    }) // close connection
};


function askingPurchase() {
    connection.query("SELECT * FROM products", function(err, res, rows) {
    //Questions
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "What item ID of the product you would like to buy?",
            validate: function(value){
                //check if it is a number or not and that number is in the data
                var firstID = parseInt(res[0].item_id);
                var lastID = parseInt(res[res.length-1].item_id);
                if(!isNaN(value) && parseInt(value) >= firstID && parseInt(value) <= lastID){
                    return true;
                } else{
                    console.log(chalk.red("\nPlease Enter a Number Item ID Within the List"));
                    return false;
                }  
            }
        },  
        {
            type: "input",
            name: "quantity",
            message: "How many units would you like to buy?",
            validate: function(value){
                if(isNaN(value)){
                    return false;
                } else{
                    return true;
                }
            }
        }
    ]).then(answers => {
        var selectedItemIndex = (answers.id - 100);
        var orderQuantity = parseInt(answers.quantity);
        var availableQuantity = parseInt(res[selectedItemIndex].stock_quantity);
        var selectedProduct = (res[selectedItemIndex].product_name);
        var selectedPrice = parseFloat(res[selectedItemIndex].price);
        var orderTotal = (orderQuantity * selectedPrice).toFixed(2);
        var currentQuantity = (availableQuantity - orderQuantity)

        //to check if a order quantity meets the available 
        if (orderQuantity <= availableQuantity){

            connection.query("UPDATE products SET ? WHERE ?",
                [   {stock_quantity: currentQuantity}, 
                    {item_id: answers.id}], function(err, res) {
                if(err) throw err;
                console.log(chalk.blue("----------------------------------------------------------"));
                console.log(chalk.bold("***ORDER SUMMARY***"));
                console.log(chalk.green(("You ordered " + selectedProduct + " | Qty: " + orderQuantity)));
                console.log("Order total: $" + orderTotal);
                console.log(chalk.blue("----------------------------------------------------------"));  
                }
            );
        } else {
            console.log(chalk.bold.red("Sorry, Insufficient quantity!!"));
            console.log("TRY AGIAN...");
            askingPurchase();
        }
    });

    }) // close connection
};