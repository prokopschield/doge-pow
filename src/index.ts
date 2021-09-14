import { blake2sHex } from 'blakets';
import { encode } from 'doge-json/lib/normalize-and-encode';

export interface Proven<T> {
	signature: string;
	signed: {
		difficulty: number;
		nonce: number;
		data: T;
	};
}

/**
 * verify validity of proof object
 * @param p proof object
 * @returns whether signature is valid
 */
export function verify<T>(p: Proven<T>): boolean {
	try {
		if (typeof p.signature !== 'string') return false;
		if (typeof p.signed.difficulty !== 'number') return false;
		if (typeof p.signed.nonce !== 'number') return false;
		if (
			p.signature.substr(0, p.signed.difficulty) !==
			'7'.repeat(p.signed.difficulty)
		)
			return false;
		return blake2sHex(encode(p.signed)) === p.signature;
	} catch (error) {
		return false;
	}
}

/**
 * create proof object
 * @param data object to wrap
 * @param difficulty signature difficulty
 * @returns proof object
 */
export function prove<T>(data: T, difficulty: number = 3): Proven<T> {
	const prefix = '7'.repeat(difficulty);
	const signed = {
		difficulty,
		nonce: 0,
		data,
	};
	var signature: string = blake2sHex(encode(signed));
	while (signature.substr(0, difficulty) !== prefix) {
		++signed.nonce;
		signature = blake2sHex(encode(signed));
	}
	return { signature, signed };
}
