import {User} from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';
import { deleteMediaFromCloudinary, uploadMedia } from '../utils/cloudinary.js';

export const register = async (req,res) => {
    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields"
            })
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            success: true,
            message: "User created successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const login = async (req,res) => {
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields"
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Incorrect Email"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success: false,
                message: "Incorrect Password"
            });
        }
        generateToken(res, user, `Welcome back ${user.name}`);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login Failed."
        })
    }
}

export const logout = async (_,res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            message: "Logout Successful",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Logout Failed."
        })
    }
}

export const getUserProfile = async (req,res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot get user profile."
        })
    }
}

export const updateProfile = async (req,res) => {
    try {
        const userId = req.id;
        const {name} = req.body;
        const profilePhoto = req.file;

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        // extract public id of user if exists
        if(user.photoUrl){
            const publicId = user.photoUrl.split("/").pop().split(".")[0];
            deleteMediaFromCloudinary(publicId);
        }
        // upload new photo
        const cloudResponse = await uploadMedia(profilePhoto.path);
        const photoUrl = cloudResponse.secure_url;

        const updatedData = {name, photoUrl}
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {new:true}).select("-password");
        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Profile Updated Successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Profile Updation Failed."
        })
    }
}