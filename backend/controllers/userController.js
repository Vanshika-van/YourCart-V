import User from "../model/userModel.js"

export const getCurrentUser = async(req,res)  => { 
    try {
        // Check if userId exists
        if (!req.userId) {
            return res.status(401).json({message: "Unauthorized: No user ID"});
        }

        // Find user and exclude password
        const user = await User.findById(req.userId).select("-password");
        
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        return res.status(200).json(user);

    } catch (error) {
        console.error("getCurrentUser error:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({message: "Invalid user ID format"});
        }
        return res.status(500).json({message: "Internal server error"});
    }
}
export const getAdmin = async(req,res)  => {
    try {
        let adminEmail = req.adminEmail
        if(!adminEmail){
            return res.status(400).json({message:"Admin not found"})
        }
        return res.status(201).json({
            email:adminEmail,
            role:"admin"
        })
    } catch (error) {
        console.error("login error", error);
    return res.status(500).json({ message: `getAdmin error ${error.message}` });
        
    }
}

export const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await orders.find({ userId }); // <-- fixed field name
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "userOrders error" });
  }
};