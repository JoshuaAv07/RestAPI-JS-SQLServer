const env = require('dotenv');

env.config({
    path: './config.env',
});

module.exports = { 
    "databases": [
        { 
            "name": "development",
            "server": "localhost",
            "port": 1433,
            "database": "test",
            "user": "admin",
            "password": "266100",
            "options":{
                "trustServerCertificate": true
            }
        },
    ] 
};