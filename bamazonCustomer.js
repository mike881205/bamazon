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

    console.log("======================================================================")
    console.log("Welcome to Bamazon!")
    console.log("======================================================================")

    start();
});

let cartItems;
let cartTotal;
let product;
let price;
let stock;
let department;
let addItem;
let removeItem;

// ==============================================================================================================================================
// Main Menu
// ==============================================================================================================================================

function start() {

    // Show customers their current cart
    if (cartItems == undefined) {

        console.log("======================================================================")
        console.log("Items in Cart: " + 0 + " | " + "Cart Total: " + "$" + 0)
        console.log("======================================================================")

    }
    else {

        console.log("======================================================================")
        console.log("Items in Cart: " + cartItems + " | " + "Cart Total: " + "$" + cartTotal)
        console.log("======================================================================")

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

            department = dept.dpt_list

            // If the customer chooses view cart
            if (department == "View Cart") {
                // Show their cart
                viewNodeCart()
            }
            // If the customer chooses Exit
            else if (department == "Exit") {
                // End connection
                console.log("Thank You for Coming! See You Soon!")
                connection.end();
            }
            // If the customer chooses a department
            else {
                // Show the department menu
                deptMenu()
            }

        })

}

// ==============================================================================================================================================
// Department Item Menu
// ==============================================================================================================================================

function deptMenu() {

    connection.query("SELECT * FROM products WHERE department=?", [department], function (err, results) {
        if (err) throw err;

        // Choose Item to Add or choose return
        inquirer
            .prompt(
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        let choiceArray = []
                        for (let i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].product + " | " + "$" + results[i].price + " | " + "Available: " + results[i].stock)
                            department = results[i].department
                        }
                        choiceArray.push("Return")
                        return choiceArray
                    },
                    message: "\n" + "What would you like to purchase?" + "\n"
                }
            )
            .then(function (itemChoice) {

                addItem = itemChoice.choice

                // If the customer chooses 'Return'
                if (addItem == "Return") {
                    // Go back to the main menu
                    start();
                }
                // If the customer chooses an item
                else {
                    // Ask the customer if they want to add the item
                    addItemPrompt();
                }
            })
    })
}

// ==============================================================================================================================================
// Add/Remove Item Prompt Menus
// ==============================================================================================================================================

// ----------------------------------------------------------------------
// Add items Prompt Menu
// ----------------------------------------------------------------------

function addItemPrompt() {

    // Store the customer's choice to variables
    product = addItem.split(" | ")[0]
    price = parseInt(addItem.split(" | ")[1].split("$")[1])
    stock = parseInt(addItem.split(" | ")[2].split("Available: ")[1])

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

            // If 'yes'
            if (answer.prompt === "Yes") {

                // If the stock in the SQL table is greater than 0
                if (stock > 0) {

                    // Update SQL Cart table
                    addToSQLCart();

                    // Remove stock from SQL product table
                    removeSQLstock();

                    // Update the cart info shown in the terminal
                    updateNodeCart();

                    // Let the customer know the item has been added
                    console.log("");
                    console.log(product + " added to cart!");

                    // Return to the item list in the chosen department
                    deptMenu()
                }

                // If the stock in the SQL table is equal to 0
                else {

                    // Let the customer know that they cannot add any more of the selected item
                    console.log("")
                    console.log("You cannot add any more of this product")
                    console.log("")

                    // Return to the item list in the chosen department
                    deptMenu()
                }

            }
            // If 'no'
            else {

                // Return to the item list in the chosen department
                deptMenu();
            }
        })

}

// ----------------------------------------------------------------------
// Remove items Prompt Menu
// ----------------------------------------------------------------------

function removeItemPrompt() {

    // Store customer's choice to variables
    product = removeItem.split(" | ")[0]
    price = parseInt(removeItem.split(" | ")[1].split("$")[1])
    stock = parseInt(removeItem.split(" | ")[2].split("Available: ")[1])

    // Ask the customer if they want to remove the chosen item from their cart
    inquirer.prompt(
        {
            name: "remove",
            type: "list",
            message: "\n" + "Are you sure you want to remove this item?" + "\n",
            choices: ["Yes", "No"]
        }
    )
        .then(function (removal) {

            // If 'yes'
            if (removal.remove === "Yes") {

                // Remove item info from SQL cart table
                removeFromSQLCart();

                // Add stock for item to SQL product table
                addSQLstock();

                // Update customer's cart
                updateNodeCart();

                // Let the customer know that the item has been removed
                console.log("");
                console.log(product + " removed from cart!");

                // Return to cart menu
                viewNodeCart()
            }

            // If 'no'
            else {

                // Return to cart menu
                viewNodeCart();
            }
        })

}

// ==============================================================================================================================================
// Add / Remove item functions
// ==============================================================================================================================================

// ----------------------------------------------------------------------
// Add to SQL Cart
// ----------------------------------------------------------------------

function addToSQLCart() {

    // Add chosen item info to SQL cart table
    connection.query(
        "INSERT INTO cart SET ?",
        {
            product: product,
            price: price,
            quantity: 1,
            department: department
        },
        function (err, res) {
            if (err) throw err;
        }
    );

}

// ----------------------------------------------------------------------
// Remove from SQL Cart
// ----------------------------------------------------------------------

function removeFromSQLCart() {

    // Remove item info from SQL cart table
    connection.query(
        "DELETE FROM cart WHERE ?",
        {
            product: product
        },
        function (err, res) {
            if (err) throw err;
        }
    );

}

// ----------------------------------------------------------------------
// Add to SQL product stock
// ----------------------------------------------------------------------

function addSQLstock() {

    // Add stock to SQL product table
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock: stock + 1
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

// ----------------------------------------------------------------------
// Remove from SQL product stock
// ----------------------------------------------------------------------

function removeSQLstock() {

    // Remove stock from SQL product table
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

// ==============================================================================================================================================
// Update Node Cart
// ==============================================================================================================================================

function updateNodeCart() {
    connection.query("SELECT * FROM cart", function (err, results) {
        if (err) throw err;

        // Item total equal total number of items in terminal cart
        cartItems = results.length

        let costArray = []
        cartTotal = 0;

        // Add the cost for each item to the cost array
        for (let i = 0; i < cartItems; i++) {
            costArray.push(results[i].price)
        }

        // Total cost of all items
        for (let i = 0; i < costArray.length; i++) {
            cartTotal += costArray[i]
        }

        // Show customer their current cart
        console.log("======================================================================")
        console.log("Items in Cart: " + cartItems + " | " + "Cart Total: " + "$" + cartTotal)
        console.log("======================================================================")
    });
}

// ==============================================================================================================================================
// View Node Cart Menu
// ==============================================================================================================================================

function viewNodeCart() {

    connection.query("SELECT * FROM cart", function (err, results) {
        if (err) throw err;

        // If the cart has no items
        if (results.length === 0) {

            // Let the customer know the cart is empty
            console.log("======================================================================")
            console.log("Cart Empty")
            console.log("======================================================================")

            // Return to the main menu
            start();

        }

        // If the cart has 1 or more items
        else {

            // Show the customer the items in their cart
            console.log("======================================================================")
            console.log("Items in Cart: " + cartItems + " | " + "Cart Total: " + "$" + cartTotal)
            console.log("======================================================================")
            console.log("")
            console.log("----------------------------------------------------------------------")

            // Show the cart breakdown
            for (let i = 0; i < results.length; i++) {
                console.log(results[i].product + " | " + "$" + results[i].price + " | " + "Quantity: " + results[i].quantity)
            }
            console.log("----------------------------------------------------------------------")
            console.log("")

            // Ask the customer if they would like to Checkout, Remove Items, or Keep Shopping
            inquirer.prompt(
                {
                    name: "prompt",
                    type: "list",
                    message: "Would you like to checkout or keep shopping?",
                    choices: ["Checkout", "Remove Items", "Keep Shopping"]
                }
            )
                .then(function (answer) {

                    // If they choose 'keep shopping'
                    if (answer.prompt == "Keep Shopping") {

                        // Return to the main menu
                        start();
                    }

                    // If they choose 'remove items'
                    else if (answer.prompt == "Remove Items") {

                        // Bring up the remove items menu
                        removeItemMenu();
                    }

                    // If they choose 'Checkout'
                    else {

                        // Bring up the checkout menu
                        checkoutMenu();
                    }
                })

        }

    })

}

// ==============================================================================================================================================
// View Remove Items Menu
// ==============================================================================================================================================

function removeItemMenu() {
    connection.query("SELECT * FROM cart", function (err, results) {
        if (err) throw err;

        // Choose Item to remove or choose return
        inquirer
            .prompt(
                {
                    name: "remove",
                    type: "rawlist",
                    choices: function () {
                        let cartArr = []
                        for (let i = 0; i < results.length; i++) {
                            cartArr.push(results[i].product + " | " + "$" + results[i].price + " | " + "Available: " + results[i].quantity)
                        }
                        cartArr.push("Return")
                        return cartArr
                    },
                    message: "\n" + "Which item would you like to remove?" + "\n"
                }
            )
            .then(function (item) {

                removeItem = item.remove

                // If the customer chooses 'return'
                if (removeItem == "Return") {

                    // Return to cart menu
                    viewNodeCart();
                }

                // If the customer chooses an item
                else {

                    // Ask the customer if they want to remove the item
                    removeItemPrompt();

                }
            })
    })

}

// ==============================================================================================================================================
// View Checkout Menu
// ==============================================================================================================================================

function checkoutMenu() {

    connection.query("SELECT * FROM cart", function (err, results) {
        if (err) throw err;

        // Show the customer their current cart
        console.log("======================================================================")
        console.log("Items in Cart: " + cartItems + " | " + "Cart Total: " + "$" + cartTotal)
        console.log("======================================================================")
        console.log("")
        console.log("----------------------------------------------------------------------")

        // Show the cart breakdown
        for (let i = 0; i < results.length; i++) {
            console.log(results[i].product + " | " + "$" + results[i].price + " | " + "Quantity: " + results[i].quantity)
        }
        console.log("----------------------------------------------------------------------")
        console.log("")

        // Ask the customer if they want to Complete their order, or return to the main menu
        inquirer.prompt(
            {
                name: "checkout",
                type: "list",
                message: "",
                choices: ["Complete Order", "Return"]
            }
        )
            .then(function (checkout) {

                // If the customer chooses 'return'
                if (checkout.checkout == "Return") {

                    // Return to the main menu
                    start();
                }

                // If the customer chooses 'Complete Order'
                else {

                    // Thank the customer, reset the SQL database, and end connection
                    console.log("")
                    console.log("Thank you for your purchase! Please come again!")
                    resetDB();
                    connection.end();
                }
            })
    })

}

// ==============================================================================================================================================
// Reset SQL Database
// ==============================================================================================================================================

function resetDB() {

    // Resets stock for all items in SQL table
    const resetProducts = [

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

    for (let i = 0; i < resetProducts.length; i++) {
        connection.query(
            "UPDATE products SET ? WHERE ?",

            resetProducts[i],

            function (err, results) {
                if (err) throw err;
            })
    }

    // Remove all items from SQL cart table
    const resetCart = [
        {
            department: "Electronics"
        },
        {
            department: "Hardware"
        },
        {
            department: "Games/Toys"
        },
        {
            department: "Sporting Goods"
        },
    ]

    for (let i = 0; i < resetCart.length; i++) {
        connection.query(
            "DELETE FROM cart WHERE ?",

            resetCart[i],

            function (err, res) {
                if (err) throw err;
            }
        );
    }

    console.log("")
    console.log("")
    console.log("")
    console.log("DB Reset")

}