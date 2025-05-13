import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import { getToken } from "next-auth/jwt";

export const GET = async(req: NextRequest)=> { 
    try {
        const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized access, please sign in" }, { status: 401 });
    }

    const products = await Product.find({ seller: sessionToken.id})

    if(products){ 
        return NextResponse.json({ message: "Your Products", products: products}, { status: 200 } )
    }else{ 
        return NextResponse.json({ message: "No Products found", products: []}, { status: 200 })
    }

    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Oops, some server error occurred" }, { status: 500 });
    }
}