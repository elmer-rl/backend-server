let jwt = require('jsonwebtoken')


let SEED = require('../config/config').SEED;



//===========================================
//VErificar token
//===========================================

exports.verificaTOken = function(req,res, next){

    let token = req.query.token ;
    
    jwt.verify( token, SEED,  (err, decoded)=>{

        if(err){
            return res.status(401).json({
                ok:false,
                mensaje:'Token incorrecto',
                errors:err
            });;
        }

        req.usuario = decoded.usuario

        next();

    });
}
