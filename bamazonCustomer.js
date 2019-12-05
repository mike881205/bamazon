const mysql = require("mysql")
const inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "StirFry16!",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    start();
});

function start() {

    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        console.log("")
        console.log("Welcome to Bamazon!")
        console.log("")
        inquirer
            .prompt({
                name: "dpt_list",
                type: "rawlist",
                choices: ["Electronics", "Hardware", "Games/Toys", "Sporting Goods", "Exit"],
                // choices: function () {
                //     let productArray = [];
                //     for (let i = 0; i < results.length; i++) {
                //         productArray.push(results[i].department);
                //     }
                //     return productArray
                // },
                message: "Please select a department"
            })
            .then(function (dept) {
                let department = dept.dpt_list
                switch (department) {
                    case "Electronics":
                        // electronics();
                        console.log("Under Construction")
                        connection.end();
                        break;
                    case "Hardware":
                        // hardware();
                        console.log("Under Construction")
                        connection.end();
                        break;
                    case "Games/Toys":
                        // gamesToys();
                        console.log("Under Construction")
                        connection.end();
                        break;
                    case "Exit":
                        console.log("Thank You for Coming! See You Soon!")
                        connection.end();
                        break;

                }

            })

    })

}


