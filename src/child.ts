import { prove } from '.';
import { AsyncRequest } from './types';

process.on('message', ({ data, difficulty, nonce }: AsyncRequest) => {
	process?.send?.(prove(Buffer.from(data, 'base64'), difficulty, nonce));
});
