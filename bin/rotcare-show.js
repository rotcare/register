#!/usr/bin/env node

let qualifiedName = process.argv[2];
if (!qualifiedName) {
    console.error('missing qualifiedName');
    process.exit(1);
}
const dotPos = qualifiedName.indexOf('.');
qualifiedName = dotPos === -1 ? qualifiedName : qualifiedName.substr(0, dotPos);

require('@rotcare/register').showTranspiled('.', qualifiedName);