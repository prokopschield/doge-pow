import { blake2sHex } from 'blakets';

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
export function verify<T>(
	p: Proven<T>,
	difficulty: number = p.signed.difficulty
): boolean {
	try {
		return (
			typeof p.signature === 'string' &&
			typeof p.signed.difficulty === 'number' &&
			typeof p.signed.nonce === 'number' &&
			p.signature.slice(0, difficulty) === '7'.repeat(difficulty) &&
			blake2sHex(p.signed as any) === p.signature
		);
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
	let signature: string = blake2sHex(signed as any);
	while (signature.slice(0, difficulty) !== prefix) {
		++signed.nonce;
		signature = blake2sHex(signed as any);
	}
	return { signature, signed };
}
