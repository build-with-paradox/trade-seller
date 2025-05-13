import { formatErrorMessages } from "@/utils/utilfunctions";
import axios from "axios";


export const getEarningDashboarService = async()=> { 
    const earningDashboardValuesUrl = `${process.env.NEXT_PUBLIC_URL}/api/dashboards/earningdashboard`;
    try {
        const response = await axios.get(earningDashboardValuesUrl, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json", 
            },
          });

          if(response.status === 200){ 
            return{ 
                success: true, 
                dashboardvalues: response.data
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


export const getDashboarService = async()=> { 
  const dashboardValuesUrl = `${process.env.NEXT_PUBLIC_URL}/api/dashboards/overview`;
  try {
      const response = await axios.get(dashboardValuesUrl, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json", 
          },
        });

        if(response.status === 200){ 
          return{ 
              success: true, 
              dashboardvalues: response.data
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


export const getProductAnalyticsService = async()=> { 
  const productAnalyticsUrl = `${process.env.NEXT_PUBLIC_URL}/api/dashboards/productAnalytics`;
  try {
      const response = await axios.get(productAnalyticsUrl, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json", 
          },
        });

        if(response.status === 200){ 
          return{ 
              success: true, 
              productanalytics: response.data
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


export const getSalesInsightsService = async()=> { 
  const salesinsightsUrl = `${process.env.NEXT_PUBLIC_URL}/api/dashboards/salesinsights`;
  try {
      const response = await axios.get(salesinsightsUrl, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json", 
          },
        });

        if(response.status === 200){ 
          return{ 
              success: true, 
              salesinsights: response.data
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

