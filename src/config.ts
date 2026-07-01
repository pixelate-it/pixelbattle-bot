import "dotenv/config";

export const config = {
    token: process.env.TOKEN!,
    api: process.env.BACKEND_URL!
};
