class expressError extends Error {
    constructor(statusCode,message){
        super();//parent class constructor is being called.
        this.statusCode = statusCode ;
        this.message = message ;
    }
};
module.exports = expressError;