import bcrypt from "bcrypt";
import __dirname from "../dirname.js";
import mailer from "../utils/mailer.js";
import config from "../config/config.js";
import logger from "../utils/logger.js";
import DAOFactory from "../models/daos/DAOFactory.js";
import UserDTO from "../models/dtos/user.DTO.js";

const usersDAO = DAOFactory.createDao("user", config.DATABASE);

const getById = async (id)=>{
    try {
        if (id == "anonimo") return new UserDTO();
        const user = await usersDAO.getById(id);
        if (!user) throw {message: `NOE XISTE EL USUARIO CON LA ID: ${id}`, status: 404};
        const userDTO = new UserDTO(user);
        return userDTO;
    } catch (error) {
        throw error;
    }
};

const getByEmail = async (email)=>{
    try {
        if (email == "anonimo") return new UserDTO();
        const user = await usersDAO.getByEmail(email);
        if (!user) throw {message: `EL USUARIO NO TIENE EMAIL: ${email}`, status: 404};
        const userDTO = new UserDTO(user);
        return userDTO;
    } catch (error) {
        throw error;
    }
};

const updateById = async (id, newDataObj)=>{
    try {
        let user = {};
        const userArray = Object.entries(newDataObj);
        userArray.forEach(entries =>{
            if (entries[1]){
                user[entries[0]] = entries[1];
            }
        })
        await usersDAO.updateOne(id, user);
    } catch (error) {
        throw error;
    }
};

const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

const registerUser = async (user)=>{
    try {
        user.password = createHash(user.password);

        const userDB = await usersDAO.add(user);

        if (!userDB) throw {message: "EL MAIL YA SE ENCUENTRA REGISTRADO", status: 403};


    
        //Envío de mail con los datos del nuevo registro.
        const mailOptions = {
            from: 'FRANPAPEL SRL - MAYORISTA EN LIBRERÍA',
            to: config.TEST_MAIL,
            subject: 'NUEVO USUARIO REGISTRADO',
            html: `<h1 style="color: red;"> ¡SE REGISTRO UN NUEVO USUARIO! </h1>
            <p>Email: ${userDB.email}</p>
            <p>Role: ${userDB.role}</p>
            <p>First name: ${userDB.firstName}</p>
            <p>Last Name: ${userDB.lastName}</p>
            <p>Tel: ${userDB.tel}</p>
            `,
            attachments: [
                {path: userDB.avatar.startsWith("/uploads") ? __dirname + "/public" + userDB.avatar : userDB.avatar}
            ]
        }

        try {
            await mailer.sendMail(mailOptions); 
        } catch (error) {
            logger.warn("ERROR EN EL MAIL: " + error.message);
        }
    
        return new UserDTO(userDB);

    } catch (error) {
        if (error.status == 403 || error.code == 11000) {
            throw {message: "EL MAIL YA EXISTE EN LA BD", status: 403};
        } else{
            logger.error(error);
        }
    }
}


export default {
    getByEmail,
    getById,
    registerUser,
    updateById
}