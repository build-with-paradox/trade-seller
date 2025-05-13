import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import { getToken } from "next-auth/jwt";
import cloudinary from "@/cloudinary/cloudinary";

export const PUT = async (req: NextRequest) => {
  try {
    const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized access, please sign in" }, { status: 401 });
    }

    const formData = await req.formData();

    const productId = formData.get("productId")?.toString();
    const productImage = formData.get("productImage") as File | null;
    const productName = formData.get("productName")?.toString();
    const productDescription = formData.get("productDescription")?.toString();
    const productCategory = formData.get("productCategory")?.toString();
    const price = parseFloat(formData.get("price")?.toString() || "0");
    const quantity = parseInt(formData.get("quantity")?.toString() || "0");

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.seller.toString() !== sessionToken.id) {
      return NextResponse.json({ error: "You don't have permission to update this product" }, { status: 403 });
    }

    let cloudinaryImageUrl = product.productImage.url;
    let cloudinaryPublicId = product.productImage.public_id;

    if (productImage && productImage.size > 0) {
      if (cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(cloudinaryPublicId);
          console.log("Deleted previous image:", cloudinaryPublicId);
        } catch (deleteError) {
          console.error("Failed to delete previous Cloudinary image:", deleteError);
        }
      }

      try {
        const buffer = await productImage.arrayBuffer();
        const mime = productImage.type;
        const base64Data = Buffer.from(buffer).toString("base64");
        const dataUri = `data:${mime};base64,${base64Data}`;

        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          public_id: `product_${Date.now()}`
        });

        cloudinaryImageUrl = uploadResult.secure_url;
        cloudinaryPublicId = uploadResult.public_id;
        console.log("Uploaded new image:", cloudinaryPublicId);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
      }
    }

    // Update product fields
    product.productImage = {
      url: cloudinaryImageUrl,
      public_id: cloudinaryPublicId
    };
    product.productName = productName || product.productName;
    product.productDescription = productDescription || product.productDescription;
    product.productCategory = productCategory || product.productCategory;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;

    await product.save();

    return NextResponse.json({ message: "Product updated successfully", product }, { status: 200 });

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Oops, something went wrong" }, { status: 500 });
  }
};
