export interface ProductModelServer {
  id: number;
  name: string;
  category: String;
  description: String;
  image: String;
  price: number;
  quantity: number;
  images: Blob;
}


export interface serverResponse {
  count: number;
  products: ProductModelServer[];
};
