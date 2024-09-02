declare namespace NodeJS {
  interface ProcessEnv {
    readonly DBCONNECTION: string;
    readonly PORT: number;
  }
}
