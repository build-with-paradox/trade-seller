// /api/seller/stats.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import Product from "@/models/Product";
import Orders from "@/models/Orders";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  

  try {
        const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
        if (!sessionToken) {
          return NextResponse.json(
            { error: "You must be signed in to access this information." },
            { status: 401 }
          );
        }
    
        const sellerId = sessionToken.id;
    // Get all orders for this seller
    const orders = await Orders.find({
      "products.productId": { $exists: true },
    }).lean();

    // Get all products of this seller
    const sellerProducts = await Product.find({ seller: sellerId }).lean();

    let totalRevenue = 0;
    let totalOrders = 0;
    let productSales: { [key: string]: number } = {};
    let productMeta: { [key: string]: { name: string; image: string } } = {};

    orders.forEach((order) => {
      order.products.forEach((product: any) => {
        const id = product.productId.toString();

        // Check if product belongs to this seller
        const sellerOwnsProduct = sellerProducts.some(
          (p:any) => p._id.toString() === id
        );
        if (!sellerOwnsProduct) return;

        const sales = product.price * product.quantity_buyed;
        totalRevenue += sales;
        totalOrders += 1;

        // Count product sales
        productSales[id] = (productSales[id] || 0) + product.quantity_buyed;

        // Store product meta if not already stored
        if (!productMeta[id]) {
          productMeta[id] = {
            name: product.productName,
            image: product.productImage,
          };
        }
      });
    });

    // Initialize defaults
    let bestSellingProduct = { name: "", image: "", sales: 0 };
    let leastSellingProduct = { name: "", image: "", sales: Infinity };

    for (let productId in productSales) {
      const sales = productSales[productId];
      const meta = productMeta[productId];

      if (sales > bestSellingProduct.sales) {
        bestSellingProduct = {
          name: meta.name,
          image: meta.image,
          sales,
        };
      }

      if (sales < leastSellingProduct.sales) {
        leastSellingProduct = {
          name: meta.name,
          image: meta.image,
          sales,
        };
      }
    }

    // Handle case where no sales at all
    if (leastSellingProduct.sales === Infinity) {
      leastSellingProduct.sales = 0;
    }

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      bestSellingProduct,
      leastSellingProduct,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching stats", error: error.message },
      { status: 500 }
    );
  }
}
