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

    const products = await Product.find({ seller: sellerId });

    const result = await Promise.all(
      products.map(async (product) => {
        const ratings = await ProductRating.find({ product: product._id });
        const averageRating =
          ratings.reduce((acc, curr) => acc + curr.rating, 0) / (ratings.length || 1);

        return {
          id: product._id.toString(),
          image: product.productImage.url,
          name: product.productName,
          description: product.productDescription,
          price: product.price,
          rating: parseFloat(averageRating.toFixed(1)),
          quantity: product.stock,
        };
      })
    );

    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching product reviews", error: error.message },
      { status: 500 }
    );
  }
}
