import { strictEqual, fail } from 'assert';
import axios from 'axios';
const create = axios.create;

var myurl = 'http://localhost:3000';           
// Let's configure the base url
const instance = create({
    baseURL: myurl,
    timeout: 5000, //5 seconds max
    headers: {'content-type': 'application/json'}
});

describe('Stock exchange app - Tests with Mocha' , function() {
    describe('Testing User Registration' , function () {
        it('Success 1. POST - Register Player for the game' , async function() {
            let data = {
                type : "Player" , username : "Jacob" , password : "Password"
            }
            let res = await instance.post('/login' , data);
            strictEqual(res.data , 'User successfully registered!');
        });
        it('Success 2. POST - Register Admin for the game' , async function() {
            let data = {
                type : "Admin" , username : "Percy" , password : "Password"
            }
            let res = await instance.post('/login' , data);
            strictEqual(res.data , 'Admin successfully registered!');
        });
        it('Fail 1. POST - Register an invalid user for the game' , async function() {
            let data = {
                type : "Blah" , username : "Billy" , password : "Password"
            }
            let res = await instance.post('/login' , data);
            strictEqual(res.data , 'Type not properly mentioned');
        });
    });

    describe('Testing Stock purchases and sales' , function () {
        it('Success 1. POST -  Allows a user to purchase a stock' , async function() {
            let data = {
                username : "Jacob" , stock : 'AAPL' , amount : 2
            }
            let res = await instance.post('/buy' , data);
            strictEqual(res.data , "User has successfully purchased stocks!");
        });
        it('Fail 1. POST -  User does not have enough funds to purchase stock' , async function() {
            let data = {
                username : "Jacob" , stock : 'MSFT' , amount : 5
            }
            let res = await instance.post('/buy' , data);
            strictEqual(res.data , 'Insufficient funds!');
        });
        it('Success 2. POST - Sell stocks' , async function() {
            let data = {
                username : "Jacob" , stock : 'AAPL' , amount : 1
            }
            let res = await instance.post('/sell' , data);
            strictEqual(res.data , 'User has successfully sold their desired stocks!');
        });
        it('Fail 2. POST - User does not have enough stocks to sell' , async function() {
            let data = {
                username : "Jacob" , stock : 'AAPL' , amount : 3
            }
            let res = await instance.post('/sell' , data);
            strictEqual(res.data , 'You do not have enough stocks to sell');
        });
        
    });
    describe('Testing Admin game and user functions' , function () {
        it('Success 1. POST -  Allows an admin to add players to their game' , async function() {
            let data1 = {
                type : "Player" , username : "Bob" , password : "Password"
            }
            let res = await instance.post('/login' , data1);
            strictEqual(res.data , 'User successfully registered!');
            let data = {
                admin : "Percy" , players : ['Percy' , 'Jacob']
            }
            res = await instance.post('/game' , data);
            strictEqual(res.data , 'Game has been successfully created!');
        });

        it('Success 2. GET -  End a game and announce the winner' , async function() {
            let res = await instance.get('/game/Percy');
            strictEqual(res.data.name , 'Jacob');
        });
        it('Success 3. PUT -  Reset a players data' , async function() {
            let res = await instance.put('/reset/Jacob');
            strictEqual(res.data , 'User has successfuly reset!');
        });
        it('Success 4. PUT -  Add additional funds to a player' , async function() {
            let res = await instance.put('/add/Percy/Jacob/100');
            strictEqual(res.data , 'Amount successfully added!');
        });

    });

    describe('Testing Delete function and returning to the before state' , function () {
        it('Success 1. DELETE - Delete all users we added during tests' , async function() {
            let res = await instance.delete('/delete/Jacob');
            strictEqual(res.data , "User successfully deleted!");
            res = await instance.delete('/delete/Bob');
            strictEqual(res.data , "User successfully deleted!");
            res = await instance.delete('/delete/Percy');
            strictEqual(res.data , "User successfully deleted!");
        });
        
    });
    
});