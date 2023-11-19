Array.prototype.random = function random() {
    return this[Math.floor(Math.random() * this.length)];
}