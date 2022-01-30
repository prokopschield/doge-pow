import { Hashable, normalizeInput } from 'blakets/lib/util';
import { ChildProcess, fork } from 'child_process';
import path from 'path';
import { prove, Proven } from '.';
import { AsyncRequest } from './types';

const children = Array<ChildProcess>();

function getChild() {
	return children.pop() || fork(path.resolve(__dirname, 'child.js'));
}

export async function prove_async<T extends Hashable>(
	data: T,
	difficulty: number = 3,
	nonce: number = 0
): Promise<Proven<T>> {
	return await new Promise(async (resolve) => {
		const child = getChild();
		const preprocessed = normalizeInput(data);
		const message: AsyncRequest = {
			data: Buffer.from(preprocessed).toString('base64'),
			difficulty,
			nonce,
		};
		child.send(message);
		child.once('message', (msg: Proven<Buffer>) => {
			children.push(child);
			return resolve(prove(data, difficulty, msg.signed.nonce));
		});
	});
}
