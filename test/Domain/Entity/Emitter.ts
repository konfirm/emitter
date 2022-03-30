import test from 'tape';
import { EmissionInterface } from '../../../source/Domain/Contract/EmissionInterface';
import { EmissionMapper } from '../../../source/Domain/Contract/EmissionMapper';
import { Emitter } from '../../../source/Domain/Entity/Emitter';

const symbol = Symbol('sample');

interface SampleEmission extends EmissionInterface {
	type: `sample-${'a' | 'b'}` | symbol;
	sample: number;
}

type SampleEmissionMap = EmissionMapper<SampleEmission>;

let count = 0;

test('Domain/Entity/Emitter - on', (t) => {
	const emitter = new Emitter<SampleEmissionMap>();
	const emitted: Array<{ type: string | symbol, sample: number }> = [];

	emitter.on('sample-a', ({ type, sample }) => { emitted.push({ type, sample }) });
	emitter.on('sample-b', ({ type, sample }: SampleEmission) => { emitted.push({ type, sample }) });
	emitter.on(symbol, ({ type, sample }: SampleEmission) => { emitted.push({ type, sample }) });

	emitter.emit({ type: 'sample-a', sample: ++count });
	emitter.emit({ type: 'sample-a', sample: ++count });
	emitter.emit({ type: 'sample-b', sample: ++count });
	emitter.emit({ type: symbol, sample: ++count });

	const expect = [
		{ type: 'sample-a', sample: 1 },
		{ type: 'sample-a', sample: 2 },
		{ type: 'sample-b', sample: 3 },
		{ type: symbol, sample: 4 },
	]

	t.ok(emitted.length === expect.length, `collected ${expect.length} emissions`);
	emitted.forEach((record, index) => {
		t.deepEqual(record, expect[index], `collected ${index} ${JSON.stringify(expect[index])}`);
	});
	t.equal(count, 4, 'total emits is 3');

	t.end();
});

test('Domain/Entity/Emitter - once', (t) => {
	const emitter = new Emitter<SampleEmissionMap>();
	const emitted: Array<{ type: string | symbol, sample: number }> = [];

	emitter.once('sample-a', ({ type, sample }: SampleEmission) => { emitted.push({ type, sample }) });
	emitter.once('sample-b', ({ type, sample }: SampleEmission) => { emitted.push({ type, sample }) });
	emitter.once(symbol, ({ type, sample }: SampleEmission) => { emitted.push({ type, sample }) });

	emitter.emit({ type: 'sample-a', sample: ++count });
	emitter.emit({ type: 'sample-a', sample: ++count });
	emitter.emit({ type: 'sample-b', sample: ++count });
	emitter.emit({ type: symbol, sample: ++count });

	const expect = [
		{ type: 'sample-a', sample: 5 },
		{ type: 'sample-b', sample: 7 },
		{ type: symbol, sample: 8 },
	]

	t.ok(emitted.length === expect.length, `collected ${expect.length} emissions`);
	emitted.forEach((record, index) => {
		t.deepEqual(record, expect[index], `collected ${index} ${JSON.stringify(expect[index])}`);
	});
	t.equal(count, 8, 'total emits is 8');

	t.end();
});

test('Domain/Entity/Emitter - off', (t) => {
	const emitter = new Emitter<SampleEmissionMap>();
	const emitted: Array<{ type: string | symbol, sample: number }> = [];
	const handler = ({ type, sample }: SampleEmission) => { emitted.push({ type, sample }) };

	emitter.on('sample-a', handler);
	emitter.on('sample-b', handler);
	emitter.on(symbol, handler);

	emitter.emit({ type: 'sample-a', sample: ++count });
	emitter.emit({ type: 'sample-b', sample: ++count });
	emitter.emit({ type: symbol, sample: ++count });

	emitter.off('sample-a', handler);
	emitter.off('sample-b', handler);
	emitter.off(symbol, handler);

	emitter.emit({ type: 'sample-a', sample: ++count });
	emitter.emit({ type: 'sample-b', sample: ++count });
	emitter.emit({ type: symbol, sample: ++count });

	const expect = [
		{ type: 'sample-a', sample: 9 },
		{ type: 'sample-b', sample: 10 },
		{ type: symbol, sample: 11 },
	]

	t.ok(emitted.length === expect.length, `collected ${expect.length} emissions`);
	emitted.forEach((record, index) => {
		t.deepEqual(record, expect[index], `collected ${index} ${JSON.stringify(expect[index])}`);
	});
	t.equal(count, 14, 'total emits is 14');

	t.end();
});

test('Domain/Entity/Emitter - emission', (t) => {
	const emitter = new Emitter<SampleEmissionMap>();
	const emitted: Array<SampleEmission> = [];

	emitter.on('sample-a', (emission: SampleEmission) => emitted.push(emission));
	emitter.emit({ type: 'sample-a', sample: ++count });

	t.equal(count, 15, 'total emits is 15');

	const emission = emitted[0];
	const { type, sample, timestamp } = emission;
	const typeName = typeof type === 'symbol' ? 'Symbol(sample)' : `"${type}"`;

	t.equal(emission.type, 'sample-a', `emission has type ${typeName}`);
	t.equal(emission.sample, 15, `emission has sample ${sample}`);
	t.equal(typeof emission.timestamp, 'number', `emission has timestamp ${timestamp}`);


	t.doesNotThrow(() => (<any>emission).type = 'no-type', 'does not throw on writing emission type');
	t.doesNotThrow(() => (<any>emission).sample = 77, 'does not throw on writing emission sample');
	t.doesNotThrow(() => (<any>emission).timestamp = 0, 'does not throw on writing emission timestamp');

	t.equal(emission.type, type, `emission still has type ${typeName}`);
	t.equal(emission.sample, sample, `emission still has sample ${sample}`);
	t.equal(emission.timestamp, timestamp, `emission still has timestamp ${timestamp}`);

	t.doesNotThrow(() => delete (<any>emission).type, 'does not throw on deleting emission type');
	t.doesNotThrow(() => delete (<any>emission).sample, 'does not throw on deleting emission sample');
	t.doesNotThrow(() => delete (<any>emission).timestamp, 'does not throw on deleting emission timestamp');

	t.equal(emission.type, type, `emission still has type ${typeName}`);
	t.equal(emission.sample, sample, `emission still has sample ${sample}`);
	t.equal(emission.timestamp, timestamp, `emission still has timestamp ${timestamp}`);

	t.doesNotThrow(() => Object.defineProperty(emission, 'type', { value: 'no-type' }), 'does not throw on defining property emission type');
	t.doesNotThrow(() => Object.defineProperty(emission, 'sample', { value: 12 }), 'does not throw on defining property emission sample');
	t.doesNotThrow(() => Object.defineProperty(emission, 'timestamp', { value: 0 }), 'does not throw on defining property emission timestamp');

	t.equal(emission.type, type, `emission still has type ${typeName}`);
	t.equal(emission.sample, sample, `emission still has sample ${sample}`);
	t.equal(emission.timestamp, timestamp, `emission still has timestamp ${timestamp}`);

	t.doesNotThrow(() => Object.setPrototypeOf(emission, null), 'does not throw on setting prototype of emission');

	const proof = {};
	Object.setPrototypeOf(proof, null);

	t.notEqual(Object.getPrototypeOf(emission), null, 'emission prototype is not null');
	t.equal(Object.getPrototypeOf(proof), null, 'proof prototype is null');

	t.end();
});
