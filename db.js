import {MongoClient} from 'mongodb';
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri , {useUnifiedTopology: true}) ;
var db;

export async function connectToDB() {
    try {
        await client.connect();
        db = await client.db('stock-exchange');
        console.log('Connected successfully to mongoDB');
    } catch(err) {
        throw err;
    }
}

export async function getDb() {
    return db;
}