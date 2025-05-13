import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import Product from "@/models/Product";
import ProductRating from "@/models/ProductRating";
import { mongooseConnection } from "@/lib/mongoconnection";

export async function GET(req: NextRequest) {
  try {
    await mongooseConnection();

    const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!sessionToken) {
      return NextResponse.json(
        { error: "You must be signed in to access this information." },
        { status: 401 }
      );
    }

    const sellerId = sessionToken.id;

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const product = await Product.findOne({ _id: productId, seller: sellerId });
    if (!product) {
      return NextResponse.json({ error: "Product not found or unauthorized" }, { status: 404 });
    }

    const reviews = await ProductRating.find({ product: productId })
      .populate("user", "username") 
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, reviews }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching product reviews", error: error.message },
      { status: 500 }
    );
  }
}
