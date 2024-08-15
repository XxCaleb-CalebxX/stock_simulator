import financialmodelingprep from "financialmodelingprep";
import axios from 'axios';
const get = axios.get;

var app_key = "n48w0k1NvUXRdebEFRFD0lmHXwC3VhHB";
const fmp = financialmodelingprep(app_key)

//A function that returns the price of a stock given its stock ticker
export async function getAppPrice(stock_name){
    let url = "https://financialmodelingprep.com/api/v3/quote-short/";
    let res = await get(url + stock_name + '?apikey=' + app_key);
    return res.data[0].price;

}
