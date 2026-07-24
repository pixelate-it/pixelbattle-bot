import "dotenv/config";

export const config = {
    token: process.env.TOKEN!,
    api: process.env.BACKEND_URL!,
    dbPath: process.env.DB_PATH ?? "./ideas.db",
    ideasChannel: process.env.IDEAS_CHANNEL ?? "1268582723409412176",
    modRoles: (process.env.MOD_ROLES ?? "1115954576777019402")
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean),
};
