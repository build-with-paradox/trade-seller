import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import Orders from "@/models/Orders"
import Product from "@/models/Product"
import { mongooseConnection } from "@/lib/mongoconnection"

export const GET = async (req: NextRequest) => {
  try {
    await mongooseConnection()

    const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!sessionToken) {
      return NextResponse.json({ error: "You must be signed in to access this information." }, { status: 401 })
    }

    const sellerId = sessionToken.id

    const sellerProducts = await Product.find({ seller: sellerId }, '_id')
    const productIds = sellerProducts.map(product => product._id)

    if (productIds.length === 0) {
      return NextResponse.json({ 
        message: "You don't have any orders for products listed for sale yet.", 
        orders: [] 
      }, { status: 200 }) 
    }

    const orders = await Orders.find({
      'products.productId': { $in: productIds }
    }).sort({ createdAt: -1 })

    const sellerOrders = await Promise.all(
      orders.map(async (order: any) => {
        const filteredProducts = await Promise.all(
          order.products
            .filter((item: any) => productIds.some(pid => pid.equals(item.productId)))
            .map(async (item: any) => {
              const productDetails = await Product.findById(item.productId).lean()
              return {
                ...item.toObject(),
                fullProductDetails: productDetails
              }
            })
        )

        return {
          order_id: order._id,  // Including the orderId
          razorpayOrderId: order.razorpayOrderId,  // Including razorpayOrderId
          ...order.toObject(),
          products: filteredProducts
        }
      })
    )

    return NextResponse.json({
      message: "Here are the orders for your products.",
      orders: sellerOrders
    }, { status: 200 })

  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ 
      error: "Something went wrong while fetching the orders. Please try again later." 
    }, { status: 500 })
  }
}
