import WSresponse from "../libs/WSresponse.js";
import logger from "../utils/logger.js";

//Mid de AUTENTICACION.
const auth = (req, res, next)=>{
    if (req.isAuthenticated()) return next();
    return res.status(401).json(new WSresponse(null, 'DEBE INICIAR SESION', true, -1));
};

//Es dueño del carrito que esta tratando de acceder?
const ownerCartAuth = (req, res, next)=>{
    if (req.params.id == req.user.currentCart) return next();
    return res.status(401).json(new WSresponse(null, 'ESTE CARRITO NO ES TUYO', true, -1));
};

//El id del usuario a modificar coincide con el del user en sesion o es un admin?
const authUpdateUser = (req, res, next)=>{
    if (req.user.id == req.params.id || req.user.role === "admin") return next();
    return res.status(401).json(new WSresponse(null, 'NO TIENES PERMISO DE ADMINISTRADOR', true, -1));
};

//Mid de autenticacion y AUTORIZACION...
const adminAuth = (req, res, next)=>{
    if (req.isAuthenticated()){
        const role = req.user.role;
        if (role === "admin") return next();
    }
    return res.status(401).json(new WSresponse(null, `ruta ${req.originalUrl} método ${req.method} no autorizada`, true, -1));
};

const multerFileValidator = (req, res, next)=>{
    const file = req.file;
    
    if (!file){
        logger.warn('ERROR AL SUBIR LA IMAGEN!!');
        //return res.status(400).json(new WSresponse(null, 'Error al subir archivo de imagen (avatar)', true));
        return next();
    };

    req.body.avatar = `/uploads/${file.filename}`;
    next();
}

const generalError = (err, req, res, next) => {
    logger.error(err.stack);
    //res.status(500).send('Something broke!');
    res.render("error.ejs", {error: 'ALGO SE ROMPIÓ! [Status: 500]'});
}

const notFound = (req, res)=>{
    res.status(404).json(new WSresponse(null, `ruta ${req.originalUrl} método ${req.method} no implementada`, true, -2));
};

export {
    auth,
    ownerCartAuth,
    authUpdateUser,
    adminAuth,
    multerFileValidator,
    generalError,
    notFound
}