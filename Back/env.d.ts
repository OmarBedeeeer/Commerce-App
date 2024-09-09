declare namespace NodeJS {
  interface ProcessEnv {
    readonly DBCONNECTION: string;
    readonly PORT: number;
    readonly SECRET_ROUNDS: number;
    readonly JWT_SECRET: string;
    readonly ENV: "Development" | "Production";
    readonly BACKEND_URL: string;
    CLOUD_NAME: string;
    API_KEY: string;
    API_SECRET: string;
  }
}
