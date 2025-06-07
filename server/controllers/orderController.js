import Order from "../models/order.js"
import Product from "../models/product.js"


// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address} = req.body 
        if(!address || items.length === 0){
            return res.json({success: false, message: "Invalid data"})
        }

        // Calculate amount using items
        let amount = await items.reduce(async (acc,item) => {
           const product = await Product.findById(item.product);
           return (await acc ) + product.offerPrice * item.quantity
        }, 0)

        // Add Tax charge 2%
        amount += Math.floor(amount * 0.02)

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType:"COD",
        });
        return res.json({success: true, message: "Order Placed Successfully"})
    } catch (error) {
        return res.json({success: false, message: error.message})

    }
}

// Place Order Paystack: /api/order/paystack
export const placeOrderPaystack = async (req, res) => {
    try {
        const { userId, items, address} = req.body;
        const { origin } = req.headers;
        if(!address || items.length === 0){
            return res.json({success: false, message: "Invalid data"})
        }
         
        let productData = [];
        // Calculate amount using items
        let amount = await items.reduce(async (acc,item) => {
           const product = await Product.findById(item.product);
           productData.push({
            name: product.name,
            price:product.offerPrice,
            quantity: item.quantity
           });
           return (await acc ) + product.offerPrice * item.quantity
        }, 0)

        // Add Tax charge 2%
        amount += Math.floor(amount * 0.02)

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType:"Online",
        });

        // PayStack Gateway Initialize
        const paystackInstance = new paystack(process.env.PAYSTACK_SECRET_KEY);

        // Create line items for Paystack   
        const line_items = productData.map((item) => {
              return{
                price_data: {
                    currency : "GH₵",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount : Math.floor(item.price + item.price * 0.02)*100
                },
                quantity:item.quantity,
              }
        })

        // Create Session
        const session = await paystackInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url:  `${origin}/loader?next=my-orders`,
            cancel_url:  `${origin}/cart`,
            metadata: {
                orderId : order._id.toString(),
                userId,
            }
        })
        
        return res.json({success: true, url : session})
    } catch (error) {
        return res.json({success: false, message: error.message})

    }
}

//  Get Orders by User ID : /api/order/user
export const  getUserOrder = async (req,res) =>{
    try {
         const { userId } = req.body ;
         const orders = await Order.find({
            userId,
            $or : [{paymentType : "COD"}, {isPaid:true}]
         }).populate("items.product address").sort({createdAt: -1});
         res.json({success:true, orders});
    } catch (error) {
        return res.json({success: false, message: error.message})        
   }
}

// Get All Orders (for seller/ admin) : /api/order/seller
export const  getAllOrders = async (req,res) =>{
    try {
         const orders = await Order.find({
            $or : [{paymentType : "COD"}, {isPaid:true}]
         }).populate("items.product address").sort({createdAt: -1});
         res.json({success:true, orders});
    } catch (error) {
        return res.json({success: false, message: error.message})        
   }
}  
