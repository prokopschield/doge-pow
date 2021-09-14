#!/usr/bin/env node

import { encode } from 'doge-json/lib/normalize-and-encode';
import { prove } from '.';

const input = process.argv.slice(2).join(' ');

console.log(encode(prove(input)));
