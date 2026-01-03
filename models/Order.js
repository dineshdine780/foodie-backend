const mongoose = require("mongoose"); 
 
const orderSchema = new mongoose.Schema(     
  {
    orderId: {
      type: String,
      unique: true,
    }, 

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:  false,
    },  

    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },   
        image: { type: String, required: false },      
      },
    ],

    orderType: {
      type: String,
      enum: ["Take Away", "Dining"],
      required: true,
    },
    orderTime: {
      type: String,
      required: true,
    },
      
      
    totalAmount: {
      type: Number,
      required: true,
    },
      
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Delivered", "Cancelled"],
      default: "Pending",
    }, 
      
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "Card"],
      default: "COD",
    },
      
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"], 
      default: "Pending",                  
    },
      
    address: {
      type: String,
      required: false,
    },
  }, 
  { timestamps: true }
);     
      
orderSchema.pre("save", function () {
  if (!this.orderId) {
    this.orderId = "ORD-" + Date.now(); 
  }    
});    
         
module.exports = mongoose.model("Order", orderSchema);
