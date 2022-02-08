const fs = require('fs');
const http = require('http');
const url = require('url');

// const { Server } = require('http');


// const { clearScreenDown } = require('readline');

// const textIn = fs.readFileSync('./input.txt', 'utf-8'); // Funcion que lee un txt

// const textOut = `Esta es una escritura en el archivo: ${textIn}`;
// fs.writeFileSync('./ouput.txt', textOut); // Funcion que crea y escribe un archivo

// const hello = 'hola mundo';
// console.log(hello);
// console.log(textIn);
// console.log(textOut);
// console.log('Archivo creado y escrito!');


/// WEB BASIC SERVER

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');




const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

const dataObj = JSON.parse(data);


const server = http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true);

    if (pathname === '/' || pathname === '/overview') {

        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        console.log(cardsHtml);

        res.end(output);


    } else if (pathname === '/product') {

        res.writeHead(200, { 'Content-type': 'text/html' }); // Para que se vean los iconos de los objetos del json
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);


    } else if (pathname === '/api') {

        res.writeHead(200, { 'Content-type': 'application/json' }); // Para que se vean los iconos de los objetos del json
        res.end(data);

    } else {
        res.end('<h1>Pagina no encontrada!</h1>');
    }


});

server.listen(8000, '127.0.0.1', () => {
    console.log('Escuchando el servidor en el puerto 8000');
});