import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { genToken1 } from "../middleware/config/token.js";
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};


export const registration = async (req, res) => {
  try {
    const { name, email, password, googleId } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Enter Strong Password" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashPassword });

    let token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json(user);
  } catch (error) {
    console.log("signUp error", error);
    return res.status(500).json({ message: `Register error ${error}` });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, passwordType: typeof password });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    console.log('User found:', {
      email: user.email,
      passwordType: typeof user.password,
      passwordValue: user.password,
    });

    // Check password existence and type
    if (!user.password) {
      return res.status(400).json({ message: "This user does not have a password, please login with Google." });
    }

    if (typeof user.password !== 'string') {
      return res.status(500).json({ message: "User password is stored in an invalid format." });
    }

    // Now compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // If matched, continue with login
    res.status(200).json({ 
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('login error', error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logOut = async(req,res) => {
try {
  res.clearCookie("token");
  return res.status(200).json({message:"logOut successful"});
  
} catch (error) {
  
   console.error("logOut error", error);
    return res.status(500).json({ message: `LogOut error ${error.message}` });

}
}
export const googleLogin = async(req,res) =>{
  console.log("Request body:", req.body);

  try {
    let 
      {name,email,googleId} =req.body;
      if (!email || !googleId) {
      return res.status(400).json({ message: "Missing required fields " });
    }

  
    let user = await User.findOne({email})
    if(!user){
       user = await User.create({name,email,googleId,})
        
       }
       let token = generateToken(user);
       res.cookie("token", token, {
      httpOnly: true, 
      secure: false,  
      sameSite: "Strict", 
      maxAge: 7 * 24 * 60 * 60 * 1000,  

  })
        return res.status(200).json(user);  
      
    
    
    
    
  }   catch(error){
    console.error("googleLogin error:",error);
    return res.status(500).json({ message: ` googleLogin error ${error.message}` });
  }
    
  }
  

  export const adminLogin = async(req,res) =>{
    try {
      let {email,password} = req.body;
      
      // Make sure environment variables exist
      if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        console.error("Admin credentials not properly configured in environment");
        return res.status(500).json({ message: "Server configuration error" });
      }

      // Use AND instead of OR for credential comparison
      if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
        let token = genToken1(email);
        res.cookie("token", token, {
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production',  
          sameSite: "Strict", 
          maxAge: 1 * 24 * 60 * 60 * 1000,  
        });
        return res.status(200).json({ success: true });  
      } 
      return res.status(400).json({message:"Invalid admin credentials"});
    } catch (error) {
      console.error("adminLogin error", error);
      return res.status(500).json({ message: "Server error" });
    } 
  }
