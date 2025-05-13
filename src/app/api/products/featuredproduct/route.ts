import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import ProductRating from "@/models/ProductRating";
import { getToken } from "next-auth/jwt";
import { mongooseConnection } from "@/lib/mongoconnection";


export const GET = async (req: NextRequest) => {
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

    const products = await Product.find({
      seller: sessionToken.id,
      is_featured: true,
    }).lean();

    const productsWithRatings = await Promise.all(
      products.map(async (product) => {
        const ratings = await ProductRating.aggregate([
          { $match: { product: product._id } },
          { $group: { _id: null, avgRating: { $avg: "$rating" } } },
        ]);

        product.rating = ratings.length > 0 ? ratings[0].avgRating : 0;

        return {
          id: product._id,
          image: product.productImage.url,
          name: product.productName,
          description: product.productDescription,
          price: product.price,
          rating: product.rating,
          stock: product.stock,
        };
      })
    );

    if (productsWithRatings.length > 0) {
      return NextResponse.json(
        { message: "Your featured Products", products: productsWithRatings },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No Products found", products: [] },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Oops, some server error occurred" },
      { status: 500 }
    );
  }
};
