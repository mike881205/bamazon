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

    console.log("")
    console.log("Welcome to Bamazon!")
    console.log("")

    start();
});

let cartItems = 0
let cartTotal = 0


// connection.query("SELECT * FROM cart", function (err, results) {
//     if (err) throw err;
    
//     for (let i = 0; i < results.length; i++) {
//         cartTotal = cartTotal + results[i].price
//         cartItems = results.length
//     }
// })

function start() {



    // ======================================================================
    // Main Menu
    // ======================================================================

    //Show number of items in cart + cart dollar total
    console.log("Items in Cart: " + cartItems + " | " + "Cart Total: " + "$" + cartTotal)
    console.log("")

    // Choose Department
    inquirer
        .prompt({
            name: "dpt_list",
            type: "list",
            choices: ["Electronics", "Hardware", "Games/Toys", "Sporting Goods", "View Cart", "Exit"],
            message: "Please select a department to view items for" + "\nor" + "\nSelect 'View Cart' to see items currently in your cart"
        })
        .then(function (dept) {

            // Department Switch Statement
            let department = dept.dpt_list

            if (department == "View Cart") {
                viewCart()
            }
            else if (department == "Exit") {
                console.log("Thank You for Coming! See You Soon!")
                connection.end();
            }
            else {
                deptMenu()
            }
            

            // ======================================================================
            // Department Menu
            // ======================================================================

            function deptMenu() {

                console.log("")
                console.log("Items in Cart: " + cartItems + " | " + "Cart Total: " + "$" + cartTotal)
                console.log("")

                connection.query("SELECT * FROM products WHERE department=?", [department], function (err, results) {
                    if (err) throw err;

                    // Choose Item
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

                            // If the customer chooses 'Return' go back to Department Menu

                            let chosenItem = itemChoice.choice

                            if (chosenItem == "Return") {
                                start();
                            }
                            // If the customer chooses an item, open the cart prompt menu
                            else {
                                cartPrompt();
                            }

                            // ======================================================================
                            // Cart Prompt Menu
                            // ======================================================================

                            function cartPrompt() {

                                let product = chosenItem.split(" | ")[0]
                                let price = parseInt(chosenItem.split(" | ")[1].split("$")[1])

                                // Ask the customer if they want to add the chosen item to their cart
                                inquirer.prompt(
                                    {
                                        name: "prompt",
                                        type: "list",
                                        message: "Are you sure you want to add this item?",
                                        choices: ["Yes", "No"]
                                    }
                                )
                                    .then(function (answer) {

                                        // If 'yes', add item to cart array and add item price to cart total, then return to main menu
                                        if (answer.prompt === "Yes") {

                                            connection.query(
                                                "INSERT INTO cart SET ?",
                                                {
                                                    product: product,
                                                    price: price,
                                                    quantity: 1
                                                },
                                                function (err, res) {
                                                    if (err) throw err;
                                                }
                                            );

                                            connection.query("SELECT * FROM cart", function (err, results) {
                                                if (err) throw err;
                                                
                                                for (let i = 0; i < results.length; i++) {
                                                    cartTotal = cartTotal + results[i].price
                                                    cartItems = results.length
                                                }
                                            })

                                            console.log("");
                                            console.log(product + " added to cart!");
                                            console.log("");
                                            start()

                                        }
                                        // If 'no' return to list of items in chosen department
                                        else {
                                            deptMenu();
                                        }
                                    })

                            }

                        })

                })

            }

            function viewCart() {

                connection.query("SELECT * FROM cart", function (err, results) {

                    if (err) throw err;

                    console.log("")
                    console.log("Items in Cart: " + cartItems + " | " + "Cart Total: " + "$" + cartTotal)
                    console.log("")

                    if (results.length === 0) {
                        inquirer
                            .prompt(
                                {
                                    name: "return",
                                    type: "list",
                                    choices: ["Return"],
                                    message: "Cart Empty"
                                }
                            )
                            .then(function (ret) {
                                if (ret.return == "Return") {
                                    start();
                                }
                            })
                    }
                    else {

                        for (let i = 0; i < results.length; i++) {
                            console.log(results[i].product + " | " + "$" + results[i].price + " | " + "Quantity: " + results[i].quantity)
                        }
                        console.log("")
                        connection.end();
                    }


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

