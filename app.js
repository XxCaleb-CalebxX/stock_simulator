import express , {json , urlencoded} from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

app.use(json());
app.use(urlencoded({extended: true}));

import { connectToDB } from './db.js';
import {register_user , buy_stock , sell_stock , start_game , end_game , reset , increase , delete_user , login , portfolio } from './controller.js';
var server;

async function createServer() {
  try {
    await connectToDB();
    const __dirname = dirname(fileURLToPath(import.meta.url));
    app.use(express.static(__dirname + '/view'));

    app.get('/portfolio/:username' , portfolio)
    app.get('/login/:username/:password' , login)
    app.post('/login' , register_user);
    app.post('/buy' , buy_stock);
    app.post('/sell' , sell_stock);
    app.post('/game' , start_game);
    app.get('/game/:admin' , end_game);
    app.put('/reset/:username' , reset);
    app.put('/add/:admin/:username/:amount' , increase);
    app.delete('/delete/:username' , delete_user) ;
    server = app.listen(port ,  () => {console.log('App listening at http://localhost:%d', port);});
  } catch(err) {
    console.log(err)
  }
}

createServer();