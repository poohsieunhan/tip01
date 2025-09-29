'use strict';
const dev = {
    app:{
        port:process.env.DEV_PORT || 2811
    },
    // db:{
    //     host: process.env.DEV_DB_HOST ,
    //     port: process.env.DEV_DB_PORT ,
    //     name: process.env.DEV_DB_NAME
    // }
    db:{
        username: process.env.DEV_DB_USERNAME,
        password: process.env.DEV_DB_PASSWORD
    }
}

const prd = {
    app:{
        port: process.env.PRD_PORT
    },
    db:{
        host: process.env.PRD_DB_HOST || 'localhost',
        port: process.env.PRD_DB_PORT || 27017,
        name: process.env.PRD_DB_NAME
    }
}


const config = {dev, prd}
const env = process.env.NODE_ENV;

console.log(config[env]);
module.exports = config[env];