class BaseManager {
    constructor(collection, client) {
        this.collection = collection;
        this.client = client;
    }

    countDocuments() {
        return this.client.database.collection(this.collection).countDocuments();
    }

    find(filter = {}) {
        return this.client.database.collection(this.collection).findOne(filter);
    }

    delete(filter = {}) {
        return this.client.database.collection(this.collection).deleteOne(filter);
    }

    create(schema) {
        return this.client.database.collection(this.collection).insertOne(schema);
    }
}

module.exports = BaseManager;