import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import { getToken } from "next-auth/jwt";
import { mongooseConnection } from "@/lib/mongoconnection";

export const POST = async (req: NextRequest) => {
  try {
    await mongooseConnection();

    const sessionToken = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Unauthorized access, please sign in" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const findProduct = await Product.findById(productId);

    if (!findProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (findProduct.seller.toString() !== sessionToken.id) {
      return NextResponse.json(
        { error: "You are not authorized to feature this product" },
        { status: 403 }
      );
    }

    findProduct.is_featured = !findProduct.is_featured;

    await findProduct.save();

    return NextResponse.json({
      success: true,
      message: findProduct.is_featured
        ? "Product has been featured successfully"
        : "Product has been removed from the featured list",
    });


  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Oops, some server error occurred" },
      { status: 500 }
    );
  }
};
