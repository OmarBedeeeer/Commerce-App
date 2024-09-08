type Payload = {
  id: string;
  email: string;
  role: string;
  phoneNumber: string;
  address: string;
  age: number;
  isVerified: boolean;
};

declare namespace Express {
  export interface Request {
    user?: Payload;
  }
}
