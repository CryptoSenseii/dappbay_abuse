import fs from "fs";

export const getProxies = (fileName) => {
    return fs.readFileSync(fileName, {
        encoding: 'utf8',
        flag: 'r'
    }).split('\n').map(e => e.replace(/(\r\n|\n|\r)/gm, ''));
}