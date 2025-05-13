import { formatErrorMessages } from "@/utils/utilfunctions";
import axios from "axios";

export const uploadProduct = async (formData: FormData) => {
  const uploadProductUrl = `${process.env.NEXT_PUBLIC_URL}/api/products/uploadproducts`;

  try {
    const response = await axios.post(uploadProductUrl, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });

    if (response.status === 201) {
      return {
        success: true,
        message: response.data.message,
      };
    } else {
      return {
        success: false,
        error: response.data.error,
      };
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
};


export const getProducts = async()=> { 
    const getProductUrl = `${process.env.NEXT_PUBLIC_URL}/api/products/`;

    try {
        const response = await axios.get(getProductUrl, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data", 
            },
          });

          if(response.status === 200){ 
            return { 
                success: true,
                product: response.data.products,
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


export const updateProduct = async (formData: FormData) => {
  const uploadProductUrl = `${process.env.NEXT_PUBLIC_URL}/api/products/updateproduct`;

  try {
    const response = await axios.put(uploadProductUrl, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });

    if (response.status === 200) {
      return {
        success: true,
        message: response.data.message,
      };
    } else {
      return {
        success: false,
        error: response.data.error,
      };
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
};


export const getProductsApprovalDetails = async()=> { 
  const getProductUrl = `${process.env.NEXT_PUBLIC_URL}/api/products/`;

  try {
      const response = await axios.get(getProductUrl, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", 
          },
        });

        if(response.status === 200){ 
          return { 
              success: true,
              product: response.data.products,
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


export const featureProductsService = async(id:string)=> { 
  const featureProductUrl = `${process.env.NEXT_PUBLIC_URL}/api/products/featureproduct`;

  try {
    const response = await axios.post(featureProductUrl, { productId: id}, 
      { withCredentials: true, 
        headers: { 
          "Content-Type": "application/json", 
        }
      }, 
    )

    if(response.status === 200){ 
      return { 
        success: true,
        message: response.data.message
      }
    }else{ 
      return { 
        success: true, 
        error: response.data.error
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {

      return {
        success: false,
        message: formatErrorMessages(error.response.data) || "Failed to Feature product",
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


export const getFeaturedProductsService = async()=> { 
  const getFeaturedProductUrl = `${process.env.NEXT_PUBLIC_URL}/api/products/featuredproduct`;

  try {
      const response = await axios.get(getFeaturedProductUrl, { 
        withCredentials:true, 
        headers: { 
          "Content-Type": "application/json"
        }
      })

      if(response.status === 200){ 
        return { 
          success: true, 
          message: response.data.message, 
          products: response.data.products
        }
      }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {

      return {
        success: false,
        message: formatErrorMessages(error.response.data) || "Failed to get product",
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