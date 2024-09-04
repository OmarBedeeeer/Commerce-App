type Payload = {
  id: string;
  email: string;
  role: string;
  phoneNumber: string;
  address: string;
  age: number;
};

declare namespace Express {
  export interface Request {
    user?: Payload;
  }
}
