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

let cart = []
let cartTotal = 0



function start() {

// ======================================================================
// Main Menu
// ======================================================================

    console.log("")
    console.log("Welcome to Bamazon!")
    console.log("")
    console.log("Items in Cart: " + cart.length + " | " + "Cart Total: " + "$" + cartTotal)
    console.log("")

    inquirer
        .prompt({
            name: "dpt_list",
            type: "rawlist",
            choices: ["Electronics", "Hardware", "Games/Toys", "Sporting Goods", "Exit"],
            message: "Please select a department to view items"
        })
        .then(function (dept) {
            let department = dept.dpt_list
            switch (department) {
                case "Electronics":
                    deptMenu();
                    break;
                case "Hardware":
                    deptMenu();
                    break;
                case "Games/Toys":
                    deptMenu();
                    break;
                case "Sporting Goods":
                    deptMenu();
                    break;
                case "Exit":
                    console.log("Thank You for Coming! See You Soon!")
                    connection.end();
                    break;
            }

// ======================================================================
// Department Menu
// ======================================================================

            function deptMenu() {

                console.log("")
                console.log("Items in Cart: " + cart.length + " | " + "Cart Total: " + "$" + cartTotal)
                console.log("")

                connection.query("SELECT * FROM products WHERE department=?", [department], function (err, results) {
                    if (err) throw err;

                    inquirer
                        .prompt(
                            {
                                name: "choice",
                                type: "rawlist",
                                choices: function () {
                                    let choiceArray = []
                                    for (let i = 0; i < results.length; i++) {
                                        choiceArray.push(results[i].product + " | " + "$" + results[i].price + " | " + "Available: " + results[i].stock)
                                    }
                                    choiceArray.push("Return")
                                    return choiceArray
                                },
                                message: "What would you like to purchase?"
                            }
                        )
                        .then(function (itemChoice) {

                            if (itemChoice.choice == "Return") {
                                start()
                            }
                            else {
                                cartPrompt()
                            }

// ======================================================================
// Cart Prompt
// ======================================================================

                            function cartPrompt() {

                                let product = itemChoice.choice.split(" | ")[0]
                                let price = parseInt(itemChoice.choice.split(" | ")[1].split("$")[1])

                                inquirer.prompt(
                                    {
                                        name: "prompt",
                                        type: "list",
                                        message: "Are you sure you want to add this item?",
                                        choices: ["Yes", "No"]
                                    }
                                )
                                    .then(function (answer) {

                                        if (answer.prompt === "Yes") {

                                            cart.push(product)
                                            cartTotal = cartTotal + price

                                            console.log("")
                                            console.log("Item added to cart!")
                                            start()

                                        }
                                        else {
                                            deptMenu();
                                        }
                                    })

                            }

                        })

                })

            }

        })

}
















// // ======================================================================
// // Electronics
// // ======================================================================

// function electronics() {

//     console.log("")
//     console.log("Items in Cart: " + cart.length + " | " + "Cart Total: " + "$" + cartTotal)
//     console.log("")

//     connection.query("SELECT * FROM products WHERE department=?", ["Electronics"], function (err, results) {
//         if (err) throw err;

//         inquirer
//             .prompt(
//                 {
//                     name: "choice",
//                     type: "rawlist",
//                     choices: function () {
//                         let choiceArray = []
//                         for (let i = 0; i < results.length; i++) {
//                             choiceArray.push(results[i].product + " | " + "$" + results[i].price + " | " + "Available: " + results[i].stock)
//                         }
//                         choiceArray.push("Return")
//                         return choiceArray
//                     },
//                     message: "What would you like to purchase?"
//                 }
//             )
//             .then(function (itemChoice) {

//                 let product = itemChoice.choice.split(" | ")[0]
//                 let price = parseInt(itemChoice.choice.split(" | ")[1].split("$")[1])

//                 if (product == "Return") {
//                     start()
//                 }
//                 else {
//                     cartPrompt()
//                 }

//                 function cartPrompt() {

//                     inquirer.prompt(
//                         {
//                             name: "prompt",
//                             type: "list",
//                             message: "Are you sure you want to add this item?",
//                             choices: ["Yes", "No"]
//                         }
//                     )
//                         .then(function (answer) {

//                             if (answer.prompt === "Yes") {

//                                 cart.push(product)
//                                 cartTotal = cartTotal + price

//                                 console.log("")
//                                 console.log("Item added to cart!")
//                                 start()

//                             }
//                             else {
//                                 connection.end();
//                             }
//                         })

//                 }

//             })

//     })

// }

// // ======================================================================
// // Hardware
// // ======================================================================

// function hardware() {

//     console.log("")
//     console.log("Items in Cart: " + cart.length + " | " + "Cart Total: " + "$" + cartTotal)
//     console.log("")

//     connection.query("SELECT * FROM products WHERE department=?", ["Hardware"], function (err, results) {
//         if (err) throw err;

//         inquirer
//             .prompt(
//                 {
//                     name: "choice",
//                     type: "rawlist",
//                     choices: function () {
//                         let choiceArray = []
//                         for (let i = 0; i < results.length; i++) {
//                             choiceArray.push(results[i].product + " | " + "$" + results[i].price + " | " + "Available: " + results[i].stock)
//                         }
//                         choiceArray.push("Return")
//                         return choiceArray
//                     },
//                     message: "What would you like to purchase?"
//                 }
//             )
//             .then(function (itemChoice) {

//                 let product = itemChoice.choice.split(" | ")[0]
//                 let price = parseInt(itemChoice.choice.split(" | ")[1].split("$")[1])

//                 if (product == "Return") {
//                     start()
//                 }
//                 else {
//                     cartPrompt()
//                 }

//                 function cartPrompt() {

//                     inquirer.prompt(
//                         {
//                             name: "prompt",
//                             type: "list",
//                             message: "Are you sure you want to add this item?",
//                             choices: ["Yes", "No"]
//                         }
//                     )
//                         .then(function (answer) {

//                             if (answer.prompt === "Yes") {

//                                 cart.push(product)
//                                 cartTotal = cartTotal + price

//                                 console.log("")
//                                 console.log("Item added to cart!")
//                                 start()

//                             }
//                             else {
//                                 connection.end();
//                             }
//                         })

//                 }

//             })

//     })

// }

// // ======================================================================
// // Games/Toys
// // ======================================================================

// function gamesToys() {

//     console.log("")
//     console.log("Items in Cart: " + cart.length + " | " + "Cart Total: " + "$" + cartTotal)
//     console.log("")

//     connection.query("SELECT * FROM products WHERE department=?", ["Games/Toys"], function (err, results) {
//         if (err) throw err;

//         inquirer
//             .prompt(
//                 {
//                     name: "choice",
//                     type: "rawlist",
//                     choices: function () {
//                         let choiceArray = []
//                         for (let i = 0; i < results.length; i++) {
//                             choiceArray.push(results[i].product + " | " + "$" + results[i].price + " | " + "Available: " + results[i].stock)
//                         }
//                         choiceArray.push("Return")
//                         return choiceArray
//                     },
//                     message: "What would you like to purchase?"
//                 }
//             )
//             .then(function (itemChoice) {

//                 let product = itemChoice.choice.split(" | ")[0]
//                 let price = parseInt(itemChoice.choice.split(" | ")[1].split("$")[1])

//                 if (product == "Return") {
//                     start()
//                 }
//                 else {
//                     cartPrompt()
//                 }

//                 function cartPrompt() {

//                     inquirer.prompt(
//                         {
//                             name: "prompt",
//                             type: "list",
//                             message: "Are you sure you want to add this item?",
//                             choices: ["Yes", "No"]
//                         }
//                     )
//                         .then(function (answer) {

//                             if (answer.prompt === "Yes") {

//                                 cart.push(product)
//                                 cartTotal = cartTotal + price

//                                 console.log("")
//                                 console.log("Item added to cart!")
//                                 start()

//                             }
//                             else {
//                                 connection.end();
//                             }
//                         })

//                 }

//             })

//     })

// }

// // ======================================================================
// // Sporting Goods
// // ======================================================================

// function sportingGoods() {

//     console.log("")
//     console.log("Items in Cart: " + cart.length + " | " + "Cart Total: " + "$" + cartTotal)
//     console.log("")

//     connection.query("SELECT * FROM products WHERE department=?", ["Sporting Goods"], function (err, results) {
//         if (err) throw err;

//         inquirer
//             .prompt(
//                 {
//                     name: "choice",
//                     type: "rawlist",
//                     choices: function () {
//                         let choiceArray = []
//                         for (let i = 0; i < results.length; i++) {
//                             choiceArray.push(results[i].product + " | " + "$" + results[i].price + " | " + "Available: " + results[i].stock)
//                         }
//                         choiceArray.push("Return")
//                         return choiceArray
//                     },
//                     message: "What would you like to purchase?"
//                 }
//             )
//             .then(function (itemChoice) {

//                 let product = itemChoice.choice.split(" | ")[0]
//                 let price = parseInt(itemChoice.choice.split(" | ")[1].split("$")[1])

//                 if (product == "Return") {
//                     start()
//                 }
//                 else {
//                     cartPrompt()
//                 }

//                 function cartPrompt() {

//                     inquirer.prompt(
//                         {
//                             name: "prompt",
//                             type: "list",
//                             message: "Are you sure you want to add this item?",
//                             choices: ["Yes", "No"]
//                         }
//                     )
//                         .then(function (answer) {

//                             if (answer.prompt === "Yes") {

//                                 cart.push(product)
//                                 cartTotal = cartTotal + price

//                                 console.log("")
//                                 console.log("Item added to cart!")
//                                 start()

//                             }
//                             else {
//                                 connection.end();
//                             }
//                         })

//                 }

//             })

//     })

// }

