declare namespace NodeJS {
  interface ProcessEnv {
    readonly DBCONNECTION: string;
    readonly PORT: number;
    readonly SECRET_ROUNDS: number;
    readonly JWT_SECRET: string;
    readonly EMAIL: string;
    readonly PASSWORD: string;
  }
}
