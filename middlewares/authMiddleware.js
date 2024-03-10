
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';


// Protected Routes 
// token base

// the next() is executed after req and before seding response
// if the next is not executed then the previous code is executed
// because it's middleware

export const requireSignIn = async (req, res, next) => {

    try{
        const decode = jwt.verify(
            req.headers.authorization, 
            process.env.JWT_SECRET);

        req.user = decode;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).send({
            success : false,
            message : 'error in required sign in middleware'
        })
    }   
}



// admin access
export const isAdmin = async (req, res, next) => {
    try{
        const user = await userModel.findById(req.user._id)
        if(user.role !== true){
            return res.status(401).send({
                success : false,
                message : 'Unauthorized User'
            })
        }

        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).send({
            success : false,
            message : 'error in isAdmin middleware'
        })
    }
}

