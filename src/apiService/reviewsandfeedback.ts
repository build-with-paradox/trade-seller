import { formatErrorMessages } from "@/utils/utilfunctions";
import axios from "axios";

export const getProductsAndDetailsService = async()=> { 
    const getProductUrl = `${process.env.NEXT_PUBLIC_URL}/api/products/productanddetails`;
  
    try {
        const response = await axios.get(getProductUrl, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json" 
            },
          });
  
          if(response.status === 200){ 
            return { 
                success: true,
                product: response.data,
            }
          }else{ 
            return { 
                success: false,
                error: response.data.error
            }
          }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("Upload error:", error.response.data);
      
            return {
              success: false,
              message: formatErrorMessages(error.response.data) || "Failed to upload product",
            };
          } else {
            console.error("An error occurred:", error);
            return {
              success: false,
              message: "An error occurred. Please try again later.",
            };
          }
    }
  }
  


export const getProductsReviewService = async (productId: string) => {
  const getProductUrl = `${process.env.NEXT_PUBLIC_URL}/api/products/reviews/?productId=${productId}`;

  try {
    const response = await axios.get(getProductUrl, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.status === 200) {
      return {
        success: true,
        reviews: response.data.reviews, 
      };
    } else {
      return {
        success: false,
        error: response.data.error || "Unexpected error",
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Review fetch error:", error.response.data);

      return {
        success: false,
        message:
          formatErrorMessages(error.response.data) ||
          "Failed to fetch product reviews",
      };
    } else {
      console.error("An error occurred:", error);
      return {
        success: false,
        message: "An error occurred. Please try again later.",
      };
    }
  }
};

  

