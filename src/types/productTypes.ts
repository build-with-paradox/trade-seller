export interface ProductInterface {
    _id: string;
    productImage: { url: string }; 
    productName: string;
    productDescription?: string;
    price: number;
    rating: number;
    stock: number;
    status?:boolean;
    is_featured?:boolean;
}