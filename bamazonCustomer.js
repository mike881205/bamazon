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

let cartItems;
let cartTotal;
let product;
let price;
let stock;
let quantity;
let department;
let chosenItem;

// ======================================================================
// Main Menu
// ======================================================================

function start() {

    if (cartItems == undefined) {
        console.log("")
        console.log("Items in Cart: " + 0 + " | " + "Cart Total: " + "$" + 0)
        console.log("")
    }
    else {
        console.log("")
        console.log("Items in Cart: " + cartItems + " | " + "Cart Total: " + "$" + cartTotal)
        console.log("")
    }

    // Choose Department
    inquirer
        .prompt(
            {
                name: "dpt_list",
                type: "list",
                choices: ["Electronics", "Hardware", "Games/Toys", "Sporting Goods", "View Cart", "Exit"],
                message: "\n" + "Please select a department to view items for sale" + "\nor" + "\nSelect 'View Cart' to see items currently in your cart" + "\n"
            }
        )
        .then(function (dept) {

            // Department Switch Statement
            department = dept.dpt_list

            if (department == "View Cart") {
                viewNodeCart()
            }
            else if (department == "Exit") {
                console.log("Thank You for Coming! See You Soon!")
                connection.end();
            }
            else {
                deptMenu()
            }

        })

}

// ======================================================================
// Department Item Menu
// ======================================================================

function deptMenu() {

    // console.log("")
    // console.log("Items in Cart: " + cartItems + " | " + "Cart Total: " + "$" + cartTotal)
    // console.log("")

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
                    message: "\n" + "What would you like to purchase?" + "\n"
                }
            )
            .then(function (itemChoice) {

                // If the customer chooses 'Return' go back to Department Menu

                chosenItem = itemChoice.choice

                if (chosenItem == "Return") {
                    start();
                }
                // If the customer chooses an item, open the cart prompt menu
                else {
                    cartPrompt();
                }
            })
    })
}

// ======================================================================
// Cart Prompt Menu
// ======================================================================

function cartPrompt() {

    product = chosenItem.split(" | ")[0]
    price = parseInt(chosenItem.split(" | ")[1].split("$")[1])
    stock = parseInt(chosenItem.split(" | ")[2].split("Available: ")[1])


    // Ask the customer if they want to add the chosen item to their cart
    inquirer.prompt(
        {
            name: "prompt",
            type: "list",
            message: "\n" + "Are you sure you want to add this item?" + "\n",
            choices: ["Yes", "No"]
        }
    )
        .then(function (answer) {

            // If 'yes', add item to cart array and add item price to cart total, then return to main menu
            if (answer.prompt === "Yes") {
                if (stock >= 1) {
                    updateSQLcart();
                    removeSQLstock();
                    updateNodeCart();
                    console.log("");
                    console.log(product + " added to cart!");
                    deptMenu()
                }
                else {
                    console.log("")
                    console.log("You cannot add any more of this product")
                    console.log("")
                    deptMenu()
                }

            }
            // If 'no' return to list of items in chosen department
            else {
                deptMenu();
            }
        })

}

// ======================================================================
// Update SQL Cart
// ======================================================================

function updateSQLcart() {

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

}

// ======================================================================
// Remove stock from SQL product
// ======================================================================

function removeSQLstock() {

    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock: stock - 1
            },
            {
                product: product
            }
        ],
        function (err, results) {
            if (err) throw err;
            console.log("")
        })

}

// ======================================================================
// Update Node Cart
// ======================================================================

function updateNodeCart() {
    connection.query("SELECT * FROM cart", function (err, results) {
        if (err) throw err;

        cartItems = results.length

        let costArray = []
        cartTotal = 0;

        for (let i = 0; i < cartItems; i++) {
            costArray.push(results[i].price)
        }

        for (let i = 0; i < costArray.length; i++) {
            cartTotal += costArray[i]
        }

        console.log("Items in Cart: " + cartItems + " | " + "Cart Total: " + "$" + cartTotal)
        console.log("");
    });
}

// ======================================================================
// View Cart Menu
// ======================================================================

function viewNodeCart() {

    connection.query("SELECT * FROM cart", function (err, results) {
        if (err) throw err;

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
            console.log("")
            console.log("Items in Cart: " + cartItems + " | " + "Cart Total: " + "$" + cartTotal)
            console.log("")

            for (let i = 0; i < results.length; i++) {
                console.log(results[i].product + " | " + "$" + results[i].price + " | " + "Quantity: " + results[i].quantity)
            }
            console.log("")

            inquirer.prompt(
                {
                    name: "prompt",
                    type: "list",
                    message: "Would you like to checkout or keep shopping?",
                    choices: ["Checkout", "Keep Shopping"]
                }
            )
                .then(function (answer) {
                    if (answer.prompt == "Keep Shopping") {
                        start();
                    }
                    else {
                        checkoutMenu();
                    }
                })

        }

    })

}

// ======================================================================
// View Checkout Menu
// ======================================================================

function checkoutMenu() {

    connection.query("SELECT * FROM cart", function (err, results) {
        if (err) throw err;

        console.log("")
        console.log("Items in Cart: " + cartItems + " | " + "Cart Total: " + "$" + cartTotal)
        console.log("")

        for (let i = 0; i < results.length; i++) {
            console.log(results[i].product + " | " + "$" + results[i].price + " | " + "Quantity: " + results[i].quantity)
        }
        console.log("")

        inquirer.prompt(
            {
                name: "checkout",
                type: "list",
                message: "",
                choices: ["Complete Order", "Return"]
            }
        )
            .then(function (checkout) {
                if (checkout.checkout == "Return") {
                    start();
                }
                else {
                    console.log("Thank you for your purchase! Please come again!")
                    resetDB();
                    connection.end();
                }
            })
    })

}

function resetDB() {

    const products = [
        // Electronics
        [
            {
                stock: 6
            },
            {
                product: '72" Flat Screen TV'
            }
        ],
        [
            {
                stock: 9
            },
            {
                product: "VR Headset"
            }
        ],
        [
            {
                stock: 12
            },
            {
                product: "Wireless Bluetooth Earbuds"
            }
        ],

        // Hardware
        [
            {
                stock: 8
            },
            {
                product: "Cordless Power Drill"
            }
        ],
        [
            {
                stock: 12
            },
            {
                product: "Ratchet Set"
            }
        ],
        [
            {
                stock: 4
            },
            {
                product: "Table Saw"
            }
        ],

        // Games/Toys
        [
            {
                stock: 20
            },
            {
                product: "'Monopolize' Board Game"
            }
        ],
        [
            {
                stock: 30
            },
            {
                product: "'Bug-Man' Action Figure"
            }
        ],
        [
            {
                stock: 40
            },
            {
                product: "'Space Battles' Starfighter Model Kit"
            }
        ],

        // Sporting Goods
        [
            {
                stock: 5
            },
            {
                product: "Mountain Bike"
            }
        ],
        [
            {
                stock: 7
            },
            {
                product: "Hockey Goalie Mask"
            }
        ],
        [
            {
                stock: 9
            },
            {
                product: "Golf Club Bag"
            }
        ],
    ]

   for (let i = 0; i < products.length; i++) {
    connection.query(
        "UPDATE products SET ? WHERE ?",

        products[i],

        function (err, results) {
            if (err) throw err;
        })
   }

   console.log("")
   console.log("")
   console.log("")
   console.log("DB Reset")
    
}