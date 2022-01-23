#!/usr/bin/env node

import { prove } from '.';

const input = process.argv.slice(2).join(' ');

console.log(JSON.stringify(prove(input), null, 4));
