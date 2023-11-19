const { v4: uuidv4 } = require('uuid');
const { badges } = require('./PixelConstants');

module.exports = {
    generateToken(date = null) {
        const token = `${uuidv4()}.${(date ?? Date.now()).toString(36)}.${uuidv4()}`;
        return token; // на данный момент у токена фиксированная длинна 82 символа!
    },
    buildBadges(list = []) {
        if(!Array.isArray(list)) throw new TypeError('list is not a array');

        let string;
        string = list.map(x => badges[x]).join(' / ');
        if(!string) string = null;

        return string;
    },
    ms(val) {
        if(typeof val === 'string' && val.length > 0) {
            return parse(val);
        }
    
        function parse(str) {
            const s = 1000;
            const m = s * 60;
            const h = m * 60;
            const d = h * 24;
            const w = d * 7;
            const y = d * 365.25;
    
            str = String(str);
            if (str.length > 50) return null;
            
            const match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|миллисекунд?|мс?|ms|seconds?|с?|secs?|s|minutes?|м?|mins?|m|hours?|ч?|hrs?|h|days?|д?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
            if (!match) return null;
            
            const n = parseFloat(match[1]);
            const type = (match[2] || 'ms').toLowerCase();
            
            switch (type) {
                case 'years':
                case 'year':
                case 'yrs':
                case 'yr':
                case 'y':
                    return n * y;
                case 'weeks':
                case 'week':
                case 'w':
                    return n * w;
                case 'days':
                case 'дней':
                case 'day':
                case 'd':
                    return n * d;
                case 'hours':
                case 'hour':
                case 'часов':
                case 'hrs':
                case 'hr':
                case 'h':
                    return n * h;
                case 'minutes':
                case 'minute':
                case 'м':
                case 'mins':
                case 'min':
                case 'm':
                    return n * m;
                case 'seconds':
                case 'second':
                case 'с':
                case 'secs':
                case 'sec':
                case 's':
                    return n * s;
                case 'milliseconds':
                case 'мс':
                case 'millisecond':
                case 'msecs':
                case 'msec':
                case 'ms':
                    return n;
                default:
                    return undefined;
            }
        }
    }
}