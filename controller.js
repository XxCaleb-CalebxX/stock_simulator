import {getDb} from './db.js';
import { getAppPrice } from './stock_price.js';

export async function login(req, res) {
    let user = req.params.username;
    let pass = req.params.password;
    let database = await getDb();
    let obj = await database.collection('stock-exchange').find({username : user}).toArray();
    if (obj.length == 0){
        console.log("No such user exists!");
        res.send('No such user exists!');
    } else {
        if (obj[0].password == pass) {
            console.log('User successfully logged in!');
            res.send('User successfully logged in!');
        } else {
        console.log('Incorrect Password!');
        res.send('incorrect Password');
        }
    }
}
/**
 * A function to register a new user.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function register_user(req, res) {
    try {
        let user = req.body.username;
        let pass = req.body.password; 
        let database = await getDb();
        if (req.body.type == "Player") {
            await database.collection('stock-exchange').insertOne({type : "Player" , username : user , password : pass , balance : 1000 , stocks : {} }); //add a player user
            console.log('User successfully registered!');
            res.send('User successfully registered!');
        } else if (req.body.type == "Admin") {
            await database.collection('stock-exchange').insertOne({type : "Admin" , username : user , password : pass , games : {} }); //add an admin user
            console.log('Admin successfully registered!');
            res.send('Admin successfully registered!');
        } else {res.send('Type not properly mentioned');}
    } catch (err) {throw err;}
}

/**
 * A function that lets a user purchase a certain amount of stock.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function buy_stock(req, res) {
    let user = req.body.username;
    let amount = req.body.amount;
    let database = await getDb();
    let obj = await database.collection('stock-exchange').find({username : user}).toArray(); //retrieve the users data including their balance and their stocks
    let stock_price = await getAppPrice(req.body.stock); //use the stock API to get real time price of wanted stock
    let object = obj[0];
    if (object.balance >= stock_price*amount) { //check whether player has enough balance to purchase stock
        object.balance = object.balance - stock_price * amount;
        object.stocks[req.body.stock] = amount;
        await database.collection('stock-exchange').updateOne({username : user} ,   {$set : {balance : object.balance , stocks : object.stocks}}); //update the players data after adding the stock and updating their balance
        console.log("User has successfully purchased stocks!");
        res.send("User has successfully purchased stocks!");
    } else {
        console.log("Insufficient funds!");
        res.send('Insufficient funds!')
    }
}

/**
 * A function that lets a user sell their own stock.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function sell_stock(req, res) {
    let user = req.body.username;
    let amount = req.body.amount;
    let database = await getDb();
    let obj = await database.collection('stock-exchange').find({username : user}).toArray();
    let object = obj[0];
    if (object.stocks[req.body.stock] >= amount) { //ensure the user has the correct amount of stock
        let stock_price = await getAppPrice(req.body.stock);
        object.balance = object.balance + (stock_price*amount);
        object.stocks[req.body.stock] = object.stocks[req.body.stock] - amount;
        await database.collection('stock-exchange').updateOne({username : user} ,   {$set : {balance : object.balance , stocks : object.stocks}});
        console.log("User has successfully sold their desired stocks!"); //update the new amount of stock and balance
        res.send('User has successfully sold their desired stocks!');
    } else {
        console.log("You do not have enough stocks to sell");
        res.send('You do not have enough stocks to sell');}
    
}

/**
 * A function that lets an admin add players to a game
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function start_game(req, res) {
    let admin_user = req.body.admin;
    let players = req.body.players;
    let database = await getDb();
    let obj = await database.collection('stock-exchange').find({username : admin_user}).toArray();
    let object = obj[0];
    for (let player of players) {
        object.games[player] = 0
    };
    await database.collection('stock-exchange').updateOne({username : admin_user} , {$set : {games : object.games}}); //stores the usernames of the players that are in the game
    console.log("Game has successfully been created!");
    res.send('Game has been successfully created!');
}

/**
 * A function that lets an admin end their game and announce the winner
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function end_game(req , res) {
    try{
        let admin_user = req.params.admin;
        let database = await getDb();
        let obj = await database.collection('stock-exchange').find({username : admin_user}).toArray();
        let object = obj[0].games;
        for (const key in object) {
            object[key] = await cummalativeValue(key); //loop through the list of players and calculate the total value of their portfolio including their balance
        }
        let winner;
        let highest = 0;
        for (const key in object) {
            if (object[key] > highest) {
                winner = key;
                highest = object[key]; //find the player with the highest valued portfolio
            }
        }
        await database.collection('stock-exchange').updateOne({username : admin_user} , {$set : {games : {}}}); //end the game
        console.log(`The winner of this game is ${winner} with ${highest} stock value!`);
        res.send({ name : winner});
    } catch (err) {throw(err)}

}

/**
 * A function that lets an admin reset a players account
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function reset(req , res) {
    let player = req.params.username;
    let database = await getDb();
    await database.collection('stock-exchange').updateOne({username : player} , {$set : {balance : 1000 , stocks : {}}});
    console.log("User successfully reset!");
    res.send('User has successfuly reset!');
}

/**
 * A function that lets an admin add a bonus amount of money to their balance
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function increase(req , res) {
    let player = req.params.username;
    let amount = req.params.amount;
    let database = await getDb();
    let obj = await database.collection('stock-exchange').find({username : req.params.admin}).toArray();
    let object = obj[0];
    await database.collection('stock-exchange').updateOne({username : player} , {$set : {balance : object.balance + amount}});
    console.log("Amount successfully added!");
    res.send('Amount successfully added!');
}

/**
 * A function that deletes a player or admins object from the database
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function delete_user(req , res) {
    let user = req.params.username;
    let database = await getDb();
    await await database.collection('stock-exchange').deleteOne({ username : user});
    console.log('User deleted!');
    res.send("User successfully deleted!");
}

export async function portfolio(req, res) {
    let user = req.params.username;
    let database = await getDb();
    let obj = await database.collection('stock-exchange').find({username : user}).toArray(); 
    let stocks_list = obj[0].stocks;
    res.send({ stocks : stocks_list})
}

//A function that calculates the total value of a players portfolio along with their current balance
async function cummalativeValue(player) {
    let database = await getDb();
    let obj = await database.collection('stock-exchange').find({username : player}).toArray(); 
    let object = obj[0].stocks;
    let value = obj[0].balance;
    for (const key in object) {
        let price = await getAppPrice(key);
        value = value + (object[key]*price); //loop through all of their stocks and calculate their current value
    }
    return value;
}