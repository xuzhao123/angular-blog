const path = require('path');

function escape(context, from) {
    if (from && path.isAbsolute(from)) {
        return from;
    } else {
        // Ensure context is escaped before globbing
        // Handles special characters in paths
        const absoluteContext = path.resolve(context)
            .replace(/[\*|\?|\!|\(|\)|\[|\]|\{|\}]/g, (substring) => `[${substring}]`);

        if (!from) {
            return absoluteContext;
        }

        // Cannot use path.join/resolve as it "fixes" the path separators
        if (absoluteContext.endsWith('/')) {
            return `${absoluteContext}${from}`;
        } else {
            return `${absoluteContext}/${from}`;
        }
    }
}

module.exports = escape;