## A repository for Stock Simulator Game
## Description
* App.js handles creating the server, connects to the mongodb, and defines the routes for handling HTTP requests from clients. It imports functions from db.js and controller.js to create a database and sets up functions to be run when a route is accessed.
* Controller.js defines the functions used to handle HTTP requests.
* stock_price.js uses an API called financialmodelingprep and exports a function that returns the real time price of a stock given its ticker name.
* db.js uses mongodb to set up and connect to a mongoserver and a specific database "stock-exchange"
* main-tests.js is where the unit tests are set up via mocha. There are a total of 12 tests designed to test registering a user, buying/selling stocks, setting up games , allowing admins to create and end games etc.

## Required and additional Features
* register players for the game
* provide all players a starting cash account in their portfolio
* allow player buy and sell actions at the current NYSE prices
* keep track of each player's portfolio and its value
* declare a winner at the end of the game
* maintain player login and profile information
* admin users that can create games
* allows admin users to add an additional amount of money to a player
* allows admin users to reset a players balance and stocks
* delete feature to remove players or admins
  
Additional features or changes that have not been implemented but wish to implement
* Keeping track of the current user. A major flaw in the app is that it does not keep track of an active user and requires the username of the user everytime a request is made
* A login feature. While there is a register feature, there is no login feature that lets a user stay active and run commands. It can be solved alongside the first change if tracking current users. It was not implemented because I thought it was a frontend function where the requests would also mention which user was active and send the request
* Changes to the code for better error handling. Currently the app can handle very few errors via requests, I hope to adjust my code so that it can handle any errors that may occur
## Set up and Requirements
The app requires the install of the following libraries or functions: 
* express
* financialmodelingprep
* axios
* mongoclient
* strictequal and fail from assert
  
The app can be run by simply running the app.js file after ensuring the mongodb server is running and all the dependencies are installed. In the package.json file type : module needs to be added. I did not push the node_modules file to the repo because there are over a thousand files in that and it kept freezing, I hope thats okay. 
  
## HTTP Calls
* POST /login : registers a user or admin. Requires type(Player/Admin) , a username and a password. Testing User registration tests adding and registering these users
* POST /buy & POST /sell: allows a user to buy stocks. Requires the username, the stocks ticker and the amount of stock needed to be purchased. Testing Stock purchases and sales tests these methods
* POST /game : allows an admin to add users to their game, Requires the admins username and a list of player usernames. Tested under Testing Admin game and user functions
* GET /game:admin : allows an admin to end a game, requires an admins username. The function goes through all the players in the game and calculates the total value of their portfolio using cummalativeValue() and returns the player with the highest amount. Tested under Testing admin game and user functions
* PUT /reset/:username : resets a players data, emptying their stocks and returning their balance to 1000 which is the start amount. Tested under Testing admin game and user functions
* PUT /add/:admin/:username/:amount : allows an admin to add a certain amount of money to a users balance. Tested under Testing admin game and user functions
* DELETE /delete/:username : deletes a player or admin permanently from the database. Tested under Testing admin game and user functions

## Unit tests
* Unit tests can be run by first running app.js and then using the 'npx mocha main-tests.js' command.
* Includes 12 unit tests, that test registering a user, an admin, an invalid user,  testing stock purchases and sales, tests an invalid purchase if the user does not possess enough funds and tests an invalid sale if the user does not possess said stocks or the mentioned amount of stocks. Also tests admin features such as adding and ending a game, reseting a players data and adding additional funds.
* Finally deletes the four users created during the unit tests to return to the before state. 
* All 12 unit tests are passing
  <img width="287" alt="image" src="https://github.com/CS3100W24/project-XxCaleb-CalebxX/assets/72302382/a6c54d73-40b3-4ef4-917f-c41e30c55188">


