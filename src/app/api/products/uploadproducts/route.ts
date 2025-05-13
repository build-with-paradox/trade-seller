import { NextRequest, NextResponse } from "next/server";
import User from "@/models/Users";
import Product from "@/models/Product";
import { getToken } from "next-auth/jwt";
import cloudinary from "@/cloudinary/cloudinary";

export const POST = async (req: NextRequest) => {
  try {
    const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized access, please sign in" }, { status: 401 });
    }

    const formData = await req.formData();

    const productImage = formData.get("productImage") as File;
    const productName = formData.get("productName")?.toString();
    const productDescription = formData.get("productDescription")?.toString();
    const productCategory = formData.get("productCategory")?.toString();
    const price = parseFloat(formData.get("price")?.toString() || "0");
    const stock = parseInt(formData.get("stock")?.toString() || "0");

    if (!productName || !productDescription || !productCategory || !price || !stock) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await User.findById(sessionToken.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "seller") {
      return NextResponse.json({ error: "You are not authorized to perform this action." }, { status: 403 });
    }

    let cloudinaryImage = { url: "", public_id: "" };

    if (productImage) {
      try {
        const buffer = await productImage.arrayBuffer();
        const mime = productImage.type;
        const base64Data = Buffer.from(buffer).toString("base64");
        const dataUri = `data:${mime};base64,${base64Data}`;

        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          public_id: `product_${Date.now()}`
        });

        cloudinaryImage = {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id
        };

        console.log("Uploaded to Cloudinary:", cloudinaryImage);
      } catch (error: any) {
        console.error("Cloudinary upload error:", error);
        return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
      }
    }

    const product = await Product.create({
      productImage: cloudinaryImage,
      productName,
      productDescription,
      productCategory,
      price,
      stock,
      seller: user._id
    });

    return NextResponse.json({ message: "Product created successfully", product }, { status: 201 });

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Oops, some server error occurred" }, { status: 500 });
  }
};
