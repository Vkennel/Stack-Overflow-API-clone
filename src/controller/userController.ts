import express, { Request, Response, NextFunction } from "express";
import UserModel from "../model/UserModel";
import bcrypt from "bcryptjs";
import { registerSchema, options, loginSchema } from "../utils/utils";
import jwt from "jsonwebtoken";

export async function RegisterUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const saltPassword = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, saltPassword);

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
  });
  signUpUser
    .save()
    .then((data) => {
      return res.json(data);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Failed to create user",
        route: "/register",
      });
    });
}

export async function LoginUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validateResult = loginSchema.validate(req.body, options);
    if (validateResult.error) {
      return res
        .status(400)
        .json({ Error: validateResult.error.details[0].message });
    }

    const userLogin = await UserModel.findOne({
      email: req.body.email,
    });
    if (!userLogin) {
      return res.status(401).json({
        message: "User not found",
      });
    } else {
      const secret = process.env.JWT_SECRET as string;
      const token = jwt.sign({ userId: userLogin._id }, secret, {
        expiresIn: "1h",
      });
      const validUser = await bcrypt.compare(
        req.body.password,
        userLogin.password
      );

      res.cookie("authorize_user", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      });

      if (!validUser) {
        res.status(401).json({
          message: "Incorrect password",
        });
      }
      if (validUser) {
        res.status(200).json({
          message: "You have logged in Successfully",
          token,
          userLogin,
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to login",
      route: "/login",
    });
  }
}
