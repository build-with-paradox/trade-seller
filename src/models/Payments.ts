import mongoose from "mongoose";



const paymentSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    total_payment: { 
        type: Number,
        default: 0
    },
    admin_share: { 
        type: Number,
        default: 0
    },
    total_Paid: {
        type: Number,
        default: 0
    },
    pending_payments: {
        type: Number,
        default: 0
    },
    refunded_deduct_amount: {
        type: Number,
        default: 0
    },
    net_earning: {
        type: Number,
        default: 0
    },
},
    {
        timestamps: true,
    }
)

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;
