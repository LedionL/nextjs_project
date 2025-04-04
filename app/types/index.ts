export type Car = {
    id: number;
    brand: string;
    model: string;
    fuelType: string;
    price: number;
    ownerName: string;
    ownerId?: number;
  };
  
  export type User = {
    id: number;
    name: string;
  };
  
  export type ResponseState = {
    success: boolean;
    message: string;
  } | null;