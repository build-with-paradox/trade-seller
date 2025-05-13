import { formatErrorMessages } from "@/utils/utilfunctions";
import axios from "axios";


export const getOrderedProductsService = async()=> { 
    const orderedProductUrl = `${process.env.NEXT_PUBLIC_URL}/api/orders/allOrders`;
    try {
        const response = await axios.get(orderedProductUrl, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data", 
            },
          });

          if(response.status === 200){ 
            return{ 
                success: true, 
                orders: response.data.orders
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


export const getPendingOrdersServices = async()=>  {
  const getPendingProductUrl = `${process.env.NEXT_PUBLIC_URL}/api/orders/pendingOrders`;

  try {
    const response = await axios.get(getPendingProductUrl, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });

    if(response.status === 200){ 
      return{ 
          success: true, 
          orders: response.data.orders
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


export const getOrderStatusService = async()=> { 
  const getOrderStatusUrl = `${process.env.NEXT_PUBLIC_URL}/api/orders/orderStatus`;

  try {
      const response = await axios.get(getOrderStatusUrl, 
        { 
          withCredentials: true,
          headers: { 
            'Content-Type': 'application/json'
          }
        })

        if(response.status === 200){ 
          return { 
            success: true, 
            orders: response.data.orders
          }
        }else{ 
          return { 
            success: false,
            message: response.data.message
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