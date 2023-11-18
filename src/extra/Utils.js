const { v4: uuidv4 } = require('uuid');

module.exports = {
    generateToken(date = null) {
        const token = `${uuidv4()}.${(date ?? Date.now()).toString(36)}.${uuidv4()}`
        return token; // на данный момент у токена фиксированная длинна 82 символа!
    }
}