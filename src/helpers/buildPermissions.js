module.exports = async function buildPermissions(client) {
    const clientPerms = client.permissions;
    const projection = { projection: { _id: 0, userID: 1 } };

    clientPerms.special = client.config.owner;
    clientPerms.admin = Array.from(
        new Set([
            ...clientPerms.special,
            ...(await client.database.collection('users').find({ role: 'ADMIN' }, projection).toArray())
                .map(player => player.userID)
        ])
    );
    clientPerms.moderator = Array.from(
        new Set([
            ...clientPerms.admin,
            ...(await client.database.collection('users').find({ role: 'MOD' }, projection).toArray())
                .map(player => player.userID)
        ])
    )

    return true;
}