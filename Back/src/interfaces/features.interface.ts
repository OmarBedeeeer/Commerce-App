export interface apiFeatures {
  readonly sort?: string;
  readonly fields?: string;
  readonly keyword?: string;
  readonly page?: number;
  readonly limit?: number;
  [key: string]: any; // Allows other properties
}
