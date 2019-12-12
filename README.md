# bamazon

# Overview

This app is designed to handle user inputs (prompts and choices), read from a MySQL, write to a MySQL database, and log the results.

## Instructions

The main menu will allow the user to choose from 1 of 4 departments to begin shopping, a 'View cart' option to view the items in their cart, or they may choose 'Exit' to exit the application

### Departments

If the customer chooses a department, a list of corresponding items available to purchase will be shown along with a 'return' option to return the main menu

1. The customer will then choose an item from the list to add to their cart

2. Once the customer has added an item they will be returned to the list of available items where they can choose to return to the main menu

### View Cart

If the customer chooses 'view cart' from the main menu they will be shown a list of items in their cart with the options to 'Remove Items', 'Checkout', or 'Keep Shopping'.

1. If the customer chooses 'Keep Shopping', they will be returned to the main menu

2. If the customer chooses 'Remove Items', they will be asked which item they would like to remove from the list of items in their cart

    * Once the customer has chosen an item they will be returned to the 'View Cart' menu

3. If the customer chooses 'Checkout', they will be asked if they want to complete their order or return.

    * If they choose 'Return' they will be returned to the main menu

    * If they choose 'Complete Order' they will be thanked and the app will close.


# App Logic

## Main Menu

* Once the app loads, the 'start' function will run, and the customer will be given the following choices via 'inquirer':

    1. Departments ('Electronics', 'Hardware', 'Games/Toys', & 'Sporting Goods)
    2. View Cart
    3. Exit

## Department Menu

1. If the customer chooses a department, the 'deptMenu' function will run. The app will then connect to the MySQL database, access the 'products' table, and the chosen department will be passed into the query. 

    * Looping through the query results, the customer will be shown a list of items for sale in the chosen department along with a 'return' option

    ### - addItemPrompt -

    1. If the user chooses an item, the 'addItemPrompt' funtion will run

        * The chosen product, price, and stock are assigned to variables and the user is asked if they want to added the item to their cart via 'inquirer'

            #### Yes

            1. If the user chooses 'Yes', the following functions will run if the stock of the chosen item in the product table is greater than 0:

                ##### - addtoSQLCart -

                * addToSQLCart - The app will connect to the MySQL database, access the 'cart' table, and add the chosen item information and a quantity of 1 to the cart table

                ##### - removeSQLstock -

                * removeSQLstock - The app will connect to the MySQL database, access the 'products' table, and remove one (1) unit of stock from the chosen item in the product table

                ##### - updateNodeCart -

                * updateNodeCart - The app will connect to the MySQL database and access the 'cart' table.

                    * The length of the results object is stored to a variable, and logged as the total numbe of items in the cart

                    * The cost of the item added to the cart is pushed to an array, and all of the costs in the array are added together to give the cart total cost

                ##### - deptMenu -

                * deptMenu - the customer is returned to the list of items in the chosen department

            #### No

            2. If the user chooses 'No', the 'deptMenu' function will run and the customer is returned to the list of items in the chosen department

    ### Return Option
    
    2. If the user chooses 'Return' the 'start' function will run and the customer will be returned to the main menu

## View Cart

2. If the customer chooses 'View Cart', the 'viewNodeCart' function will run. The app will then connect to the MySQL database and access the 'cart' table

    ### Empty Cart

    * If the length of the results is 0, the message 'Cart Empty' will be logged, and the 'start' function will run returning the customer to the main menu


## GitHub Repo

[GitHUb Repo](https://github.com/mike881205/liri-node-app)

## Technologies used within the App

* spotify-node-API
* moment
* axios
* OMDB API
* BandsInTown API
* Spotify API

## Notes

* I am responsbile for creating all logic and writing all code within all files of this app


