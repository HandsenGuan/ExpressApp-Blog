var settings = require('../setting');
var mongodb = require('mongodb');
var Db = mongodb.Db,
    Connect = mongodb.Connect,
    Server = mongodb.Server;

module.exports = new Db(
    settings.db, 
    new Server(settings.host, settings.port),
    {safe: true}
);

