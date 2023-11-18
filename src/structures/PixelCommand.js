class PixelCommand {
    constructor(name, options = {}) {
        this.name = name;
        this.cooldown = options.cooldown || 3;
        this.aliases = options.aliases || [];
        this.userPermissions = options.userPermissions || [];
    }
}

module.exports = PixelCommand;