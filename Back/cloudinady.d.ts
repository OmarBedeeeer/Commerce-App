declare module "cloudinary" {
  export const v2: {
    config: (config: {
      cloud_name: string;
      api_key: string;
      api_secret: string;
    }) => void;
    uploader: {
      upload: (
        file: string,
        options?: {
          folder?: string;
          public_id?: string;
          overwrite?: boolean;
          resource_type?: "image" | "video" | "raw";
        }
      ) => Promise<{ secure_url: string }>;
    };
  };
}
