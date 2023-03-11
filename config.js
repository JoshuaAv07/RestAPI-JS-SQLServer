const env = require('dotenv');

env.config({
    path: './.env',
});

module.exports = { 
    "databases": [
        { 
            "name": "development",
            "server": "localhost",
            "port": 1433,
            "database": "manga_project",
            "user": "sa",
            "password": "@Dmin1234",
            "options":{
                "trustServerCertificate": true
            }
        },
    ] 
};