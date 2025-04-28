import dotenv from "dotenv";
dotenv.config();

export const serverConfig = {
    port: process.env.PORT!,
    urlFrontend: process.env.URL_FRONTEND!,
};