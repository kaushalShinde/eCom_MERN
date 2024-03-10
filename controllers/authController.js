import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";

import jwt from "jsonwebtoken";
import { hash } from "bcrypt";

export const resgisterController = async (req, res) => {
    try{
        const {name, email, password, phone, address, answer, role} = req.body;
        
        // validation
        if(!name || !email || !password || !phone || !address || !answer) {
            return res.send({message: 'Insufficient Details'});
        }

        const existingUser = await userModel.findOne({email});
        
        // check for existing user
        if(existingUser){
            return res.status(200).send({
                success: true,
                message : "User already Exist!"
            })
        }

        const hashedPassword = await hashPassword(password);
        // const user = await new userModel({name, email, phone, address, password: hashedPassword}).save;
        const response = await userModel.create({
            name, 
            email, 
            phone, 
            address, 
            password: hashedPassword,
            answer,
            role});
        console.log(response);

        res.status(201).send({
            success : true,
            message : 'User Registered Successfully',
        })
    }
    catch (error){
        console.log(error);
        res.status(500).send({
            success : false,
            message : 'Error in Registering',
            
        })
    }
}

export const loginController = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(404).send({
                success : false,
                message : 'Invalid email or password'
            })
        }

        //console.log(email);

        // Getting user
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success : false,
                message : 'User not Found'
            })
        }

        console.log(user);

        const match = await comparePassword(password, user.password);
        if(!match){
            return res.status(200).send({
                success : false,
                message : 'Invalid Password'
            })
        }

        // we can also use the data in jwt.sign
        const data = {
            user:{
                id: user.id
            }
        }
        // creating token
        const token = await jwt.sign({_id : user._id}, process.env.JWT_SECRET, {expiresIn: "7d",});
        //console.log(token);
        res.status(200).send({
            success : true,
            message : 'login successful',
            user : {
                name : user.name,
                email : user.email,
                phone : user.phone,
                address : user.address,
                answer: user.answer,
                role : user.role,
            },
            token,
        })
    }
    catch (error){
        console.log(error);
        res.status(500).send({
            success : false,
            message : "Error in Login",
        })
    }
}

// test controller
export const testController = (req, res) => {
    //console.log("Protected Route");
    res.status(200).send({
        success : true,
        message : 'testing protected routes'
    })
}



// forgot password
export const forgotPasswordController = async (req, res) => {
    //console.log("IN FORGOT PASSWORD")
    try{
        const {email, answer, newPassword} = req.body;
        if(!email || !answer || !newPassword){
            return res.status(500).send({
                success : false,
                message : 'Insufficient Details',
            })
        }

        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success : false,
                message : 'User Not Found',
            })
        }

        const userAnswer = user.answer;
        if(userAnswer !== answer){
            return res.status(201).send({
                success : false,
                message : 'Answer Did Not Matched',
    
            })
        }

        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, {password: hashed});
        res.status(200).send({
            success : true,
            message : 'Password Changed Successfully',

        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message : 'Something went Wrong',
            error
        })
    }
}

export const updateProfileController = async (req, res) => {
    try{
        //console.log('profile-update');
        const {name, email, password, phone, address} = req.body;

        const user = await userModel.findById(req.user._id);

        if(password && password.length < 6){
            return res.json({
                error: 'Password is Required and langth shuld be 6'
            })
        }

        const hashedPassword = password ? await hashPassword(password) : undefined;

        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address,
        }, {new: true});

        // console.log(updatedUser);
        res.status(201).send({
            success : true,
            message : 'User Updated Successfully',
            updatedUser,
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message : 'Error Profile Update',
            error
        })
    }
}


// user
// orders
export const getOrdersController = async (req, res) => {
    try{
        const orders = await orderModel.find({buyers: req.user._id}).populate('products', '-photo').populate('buyers', 'name');
        res.status(200).send(orders);
        
        // console.log('this is in authcontoller get order contoller')
        // console.log(orders);

    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message : 'Error Getting Orders',
            error
        })
    }
};


// get all orders
export const getAllOrdersController = async (req, res) => {
    try{
        const orders = await orderModel
                                .find({})
                                .populate('products', '-photo')
                                .populate('buyers', 'name')
                                .sort({createdAt: -1});
        res.status(200).send(orders);
        
        // console.log('this is in authcontoller get order contoller')
        // console.log(orders);

    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message : 'Error Getting Orders',
            error
        })
    }
};


export const orderStatusController = async (req, res) => {
    try{
        const { orderId } = req.params;
        const { status } = req.body;

        const orders = await orderModel.findByIdAndUpdate(orderId, {status: status}, {new: true});

        res.status(200).send(orders);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message : 'Error Changing Order Status',
            error
        })
    }

}