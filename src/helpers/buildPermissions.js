module.exports = async function buildPermissions(client) {
    const clientPerms = client.permissions;
    const projection = { projection: { _id: 0, userID: 1 } };

    clientPerms.special = new Set(client.config.owner);
    clientPerms.admin = new Set([
        ...clientPerms.special,
        ...(await client.database.collection('users').find({ role: 2 }, projection).toArray())
            .map(player => player.userID)
    ]);
    clientPerms.moderator = new Set([
        ...clientPerms.admin,
        ...(await client.database.collection('users').find({ role: 1 }, projection).toArray())
            .map(player => player.userID)
    ]);

    // needs refactor

    return true;
}