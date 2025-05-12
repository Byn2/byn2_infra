//@ts-nocheck
//@ts-ignore
import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as CustomStrategy } from "passport-custom";
import jwt from "jsonwebtoken"
import * as authService from "../services/auth_service"
import User from "@/models/user"
import {connectDB} from '../lib/db'
import {
  startTransaction,
  commitTransaction,
  abortTransaction,
} from '../lib/db_transaction';

// Initialize Passport
export const initializePassport = () => {
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {

        try {
          
          const result = await authService.loginUser({ email, password });

          if (!result.success) {
            return done(null, false, { message: result.error });
          }

          const accessToken = generateToken(result.user);

          return done(null, { user: result.user, accessToken });

        } catch (error) {
          return done(error, false)
        }
      },
    ),
  )

  passport.use(
    "local-register",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        const { name, country_code } = req.body;
        const session = await startTransaction();
        try {
          await connectDB();

          // Check if business with email already exists
          const existingBusiness = await User.findOne({ email })
          if (existingBusiness) {
            return done(null, false, { message: "Email already in use" })
          }

          const newUser = await authService.registerUser(
            { name, email, password, country_code },
            session
          );

          const accessToken = generateToken(newUser);

          await commitTransaction(session);

          return done(null, { newUser, accessToken });

        } catch (error) {
          await abortTransaction(session);
          return done(error, false)
        }
      },
    ),
  )

  passport.use(
    "magic-link",
    new CustomStrategy(async (req, done) => {
      await connectDB();
      const session = await startTransaction();
      try {
        const { email } = req.body;

        // 1. Verify the token (you'll create this logic)
        const user = await authService.OtpLogin(email, session);

        if (!user) {
          return done(null, false, { message: "Invalid or expired token" });
        }

        const accessToken = generateToken(user);
        await commitTransaction(session);
        return done(null, { user, accessToken });
      } catch (error) {
        abortTransaction(session);
        return done(error);
      }
    })
  );
  // You can add Facebook and Google strategies here as needed
}

export const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_ACCESS_TOKEN || "your-secret-key", {
    expiresIn: "365d",
  })
}

export const verifyToken = async (req, res, next) => {
  // Extract token from Authorization header (Bearer token) or cookies
  const authHeader = req.headers.authorization
  const cookieToken = req.cookies?.auth_token

  let token = null

  // Check for Bearer token in Authorization header
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1]
  }
  // If no Bearer token, try to get from cookies (web app)
  else if (cookieToken) {
    token = cookieToken
  }

  if (!token) {
    return res.status(401).json({ message: "Authentication required" })
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN || "your-secret-key")

    await connectDB()
    const business = await Business.findById(decoded.id)

    if (!business) {
      return res.status(404).json({ message: "Business not found" })
    }

    req.user = {
      id: business._id,
      name: business.name,
      email: business.email,
    }

    next()
  } catch (error) {
    return res.status(401).json({ message: "This session has expired. Please login" })
  }
}
