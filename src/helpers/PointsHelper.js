class PointsHelper {
    constructor(client) {
        this.client = client;
    }

    async updatePoints(userID, changing) {
        return this.client.database.collection('users').updateOne({ userID }, {
            $inc: {
                points: changing
            },

        }, { hint: { userID: 1 } });
    }
}

module.exports = PointsHelper;