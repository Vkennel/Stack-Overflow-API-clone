import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../model/UserModel";

const secret = process.env.JWT_SECRET as string;

export async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      if (req.headers["postman-token"]) {
        return res.status(401).json({
          Error: "Kindly sign in as a User",
        });
      } else {
        res.redirect("/login");
      }
    }
    const token = authorization?.slice(7, authorization.length) as string;

    let verified = jwt.verify(token, secret);

    if (!verified) {
      return res
        .status(401)
        .json({ Error: "User not verified, you can't access this route" });
    }

    const { userLogin } = verified as { [key: string]: string };

    const user = await UserModel.findOne({ id: userLogin });

    if (!user) {
      return res.status(404).json({ Error: "User not verified" });
    }

    req.userId = userLogin;
    next();
  } catch (error) {
    console.log(error);
  }
}
