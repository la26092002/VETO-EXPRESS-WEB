const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { Acteur } = require('../constants/Enums');

dotenv.config(); // Load environment variables

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
        req.user = decoded; // Store decoded user info in request object
        next();
    });
};


const isValidate = (req, res, next) => {
    if (!req.user.isValidate) {
        return res.status(401).json({ message: "Your account is not validated" });
    }
    next();
};

const isDocteur = (req, res, next) => {
    if (req.user.typeActeur !== Acteur.Docteur) {
        console.log(req.user.typeActeur)
        return res.status(401).json({ message: "the user must be Doctor" });
    }
    next();
};

const isVendeur = (req, res, next) => {
    if (req.user.typeActeur !== Acteur.Vendeur) {
        return res.status(401).json({ message: "the user must be Vendeur" });
    }
    next();
};
const isClient = (req, res, next) => {
    if (req.user.typeActeur !== Acteur.Client) {
        return res.status(401).json({ message: "the user must be Client" });
    }
    next();
};

const isLivreur = (req, res, next) => {
    if (req.user.typeActeur !== Acteur.Livreur) {
        return res.status(401).json({ message: "the user must be Livreur" });
    }
    next();
};

const isAdmin = (req, res, next) => {
    if (req.user.typeActeur !== Acteur.Admin) {
        return res.status(401).json({ message: "the user must be Admin" });
    }
    next();
};





module.exports = { verifyToken, isValidate, isDocteur ,isVendeur,isClient,isLivreur,isAdmin};
