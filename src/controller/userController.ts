import express, {Request, Response, NextFunction } from 'express'
import UserModel from "../model/UserModel"
import bcrypt from "bcryptjs"
import {registerSchema, options} from "../utils/utils"
import jwt from "jsonwebtoken"

export async function RegisterUser(req: Request, res: Response, next: NextFunction) {

const saltPassword = await bcrypt.genSalt(10)
const hashPassword = await bcrypt.hash(req.body.password, saltPassword)

const validateResult = registerSchema.validate(req.body, options);
    if (validateResult.error) {
      return res
        .status(400)
        .json({ Error: validateResult.error.details[0].message });
    }

    const duplicateEmail = await UserModel.findOne({
      email: req.body.email,
    });
    if (duplicateEmail) {
      return res
        .status(409)
        .json({ message: "Email has been used by another User" });
    }

const signUpUser = new UserModel({
   fullName: req.body.fullName,
   userName: req.body.userName,
   email: req.body.email,
   password: hashPassword,
   confirm_password: req.body.confirm_password
})
signUpUser.save().then(data => {
  res.json(data)
}).catch(error => {
  console.log(error)
})

res.status(500).json({
    message: "Failed to create user"
  });
}


export async function LoginUser(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body);

    UserModel.findOne({$or: [{email}]})
    .then(user => {
        if(user) {
            bcrypt.compare(password, user.password, function(error, result) {
                if(error) {
                    res.json({error: error})
                }
                if(result){
                    let token = jwt.sign({userName: user.userName}, "secretKey", {expiresIn: "1h"})
                    res.json({
                        message: "Login Successful",
                        token
                    })
                } else {
                    res.json({
                        message: "Password or Username does not match"
                    })
                }
            })
        } else {
            res.json({
                message: "No User found!"
            })
        }
    })
}

