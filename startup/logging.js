const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function(){

    //handle uncaughtException and unhandledRejection and log the messages on file and mongodb
    winston.exceptions.handle(
      new winston.transports.File({ filename: 'uncaughtException.log' }),
      new winston.transports.MongoDB({
        db: 'mongodb://localhost/vidly',
        level: 'error'
      })
    );
    
    //convert unhandledRejection to a uncaughtException to let winston handle it
    process.on("unhandledRejection", (ex) => {
      throw ex;
    });
    
    //to log errors in file named logfile
    winston.add(new winston.transports.File({
      filename: 'logfile.log',
      level: 'error'
    }));

    // log to console 
    winston.add(new winston.transports.Console({
      format: winston.format.simple()
    }));
    
    //to log errors in mongodb
    winston.add(new winston.transports.MongoDB({
      db: 'mongodb://localhost/vidly',
      level: 'error',
    }));
};