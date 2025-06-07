import jwt from 'jsonwebtoken'

const authSeller = async (req,res,next) =>{
    const {sellerToken} = req.cookies;

    if(!sellerToken){
        return res.json({success: false, message:"Not Authourized"})
    }

    try {
            const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
    
            // ✅ Patch: Make sure req.body exists
            if (!req.body) req.body = {};
    
            if (tokenDecode.email === process.env.SELLER_EMAIL) {
                req.body.userId = tokenDecode.id;
                next();
            } else {
                return res.json({ success: false, message: "Not Authorized" });
            }
    
            
        } catch (error) {
            return res.json({ success: false, message: error.message });
        }
}

export default authSeller;