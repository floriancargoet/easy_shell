
import fs from "fs";
import which from 'which';

class Command {
    constructor(config) {
        Object.assign(this, config);
    }
    valid() {
        if (this.ifExists) {
            return fs.existsSync(this.ifExists);
        }
        if (this.ifCommandExists) {
            return Boolean(which.sync(this.ifCommandExists, { nothrow: true }));
        }
        return true;
    }
    getCommandString() {
        return this.command;
    }
}

class CommandList {
    constructor(commands) {
        this.commands = commands;
    }
    valid() {
        return this.commands.some(c => c.valid());
    }
    getCommandString() {
        const command = this.commands.find(c => c.valid());
        if (command) {
            return command.getCommandString();
        }
        return "";
    }
}

export function $(_) {
    if (Array.isArray(_)) {
        return new CommandList(_.map(c => new Command(c)));
    }
    return new Command(_);
}

export function treeMap(obj, fn) {
    const mapped = {};
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        const ret = fn(key, value);
        if (ret) {
            let [newKey, newValue] = ret;
            if ({}.toString.call(newValue) == '[object Object]') {
                newValue = treeMap(newValue, fn);
            }
            mapped[newKey] = newValue;
        }
    });
    return mapped;
}

export function buildAutocompletionTree(substitutionTree) {
    return treeMap(substitutionTree, (key, value) => {
        if (value instanceof Command || value instanceof CommandList) {
            if (value.valid()) {
                return [key, []];
            }
            return ;
        }
        return [key, value];
    });
}

export function unindent(str) {
    const lines = str.split("\n");
    // first line is empty, read second to detect the indentation
    lines.shift();
    const [indentation] = lines[0].match(/^[\s]*/);
    return lines.map(l => l.replace(new RegExp("^"+ indentation), "")).join("\n");
}
