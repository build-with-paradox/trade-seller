import mongoose from "mongoose";

const paymentHistorySchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Completed", "Refunded", "Cancelled"],
      default: "Completed",
    },
  },
  {
    timestamps: true, 
  }
);



const PaymentHistory =
mongoose.models.PaymentHistory || mongoose.model("PaymentHistory", paymentHistorySchema);


export default PaymentHistory;
