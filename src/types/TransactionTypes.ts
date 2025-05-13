export interface TransactionInterface {
    id?: string;
    transaction_id: string;
    order_id: string;
    total_payment: string;
    transaction_status: string;
    admin_share: string;
    seller_share: string;
    orderDetails?: {
      id: number;
      product: string;
      image: string;
      description: string;
      color: string;
      qty: number;
      price: number;
      total: number;
    }[];
    payment?: string;
    payment_type?: string;
    product_count?: number;
  }
  

