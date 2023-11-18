Array.prototype.random = function random() {
    return this[Math.floor(Math.random() * this.length)];
}

String.prototype.cut = function cut(part) {
    return this.match(new RegExp(`/.{1,${part}}/g`));
}