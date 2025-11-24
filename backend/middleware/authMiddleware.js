import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // Check if cookies exist in the request
    if (!req.cookies) {
      console.log('No cookies in request');
      return res.status(401).json({ message: "No cookies found. Please enable cookies and login." });
    }

    // Check for token in cookies
    const token = req.cookies.token;
    
    if (!token) {
      console.log('No token in cookies');
      return res.status(401).json({ message: "No authentication token found. Please login." });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (!decoded || !decoded.id) {
        console.log('Invalid token format:', decoded);
        return res.status(401).json({ message: "Invalid token format" });
      }

      // Set the user ID in the request
      req.userId = decoded.id;
      next();
    } catch (jwtError) {
      // Handle specific JWT errors
      if (jwtError.name === 'TokenExpiredError') {
        console.log('Token expired');
        return res.status(401).json({ message: "Session expired. Please login again." });
      }
      console.log('JWT verification error:', jwtError);
      return res.status(401).json({ message: "Invalid authentication token" });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default authMiddleware;