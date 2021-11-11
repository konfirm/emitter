import test from 'tape';
import { EmissionInterface } from '../../../source/Domain/Contract/EmissionInterface';
import { EmissionMapper } from '../../../source/Domain/Contract/EmissionMapper';
import { Emitter } from '../../../source/Domain/Entity/Emitter';

interface SampleEmission extends EmissionInterface {
	type: `sample-${'a' | 'b'}`;
	sample: number;
}

type SampleEmissionMap = EmissionMapper<SampleEmission>;

let count = 0;

test('Domain/Entity/Emitter - on', (t) => {
	const emitter = new Emitter<SampleEmissionMap>();
	const emitted: Array<{ type: string, sample: number }> = [];

	emitter.on('sample-a', ({ type, sample }: SampleEmission) => { emitted.push({ type, sample }) });
	emitter.on('sample-b', ({ type, sample }: SampleEmission) => { emitted.push({ type, sample }) });

	emitter.emit({ type: 'sample-a', sample: ++count });
	emitter.emit({ type: 'sample-a', sample: ++count });
	emitter.emit({ type: 'sample-b', sample: ++count });

	const expect = [
		{ type: 'sample-a', sample: 1 },
		{ type: 'sample-a', sample: 2 },
		{ type: 'sample-b', sample: 3 },
	]

	t.ok(emitted.length === expect.length, `collected ${expect.length} emissions`);
	emitted.forEach((record, index) => {
		t.deepEqual(record, expect[index], `collected ${index} ${JSON.stringify(expect[index])}`);
	});
	t.equal(count, 3, 'total emits is 3');

	t.end();
});

test('Domain/Entity/Emitter - once', (t) => {
	const emitter = new Emitter<SampleEmissionMap>();
	const emitted: Array<{ type: string, sample: number }> = [];

	emitter.once('sample-a', ({ type, sample }: SampleEmission) => { emitted.push({ type, sample }) });
	emitter.once('sample-b', ({ type, sample }: SampleEmission) => { emitted.push({ type, sample }) });

	emitter.emit({ type: 'sample-a', sample: ++count });
	emitter.emit({ type: 'sample-a', sample: ++count });
	emitter.emit({ type: 'sample-b', sample: ++count });

	const expect = [
		{ type: 'sample-a', sample: 4 },
		{ type: 'sample-b', sample: 6 },
	]

	t.ok(emitted.length === expect.length, `collected ${expect.length} emissions`);
	emitted.forEach((record, index) => {
		t.deepEqual(record, expect[index], `collected ${index} ${JSON.stringify(expect[index])}`);
	});
	t.equal(count, 6, 'total emits is 6');

	t.end();
});

test('Domain/Entity/Emitter - off', (t) => {
	const emitter = new Emitter<SampleEmissionMap>();
	const emitted: Array<{ type: string, sample: number }> = [];
	const handler = ({ type, sample }: SampleEmission) => { emitted.push({ type, sample }) };

	emitter.on('sample-a', handler);
	emitter.on('sample-b', handler);

	emitter.emit({ type: 'sample-a', sample: ++count });
	emitter.emit({ type: 'sample-b', sample: ++count });

	emitter.off('sample-a', handler);
	emitter.off('sample-b', handler);

	emitter.emit({ type: 'sample-a', sample: ++count });
	emitter.emit({ type: 'sample-b', sample: ++count });

	const expect = [
		{ type: 'sample-a', sample: 7 },
		{ type: 'sample-b', sample: 8 },
	]

	t.ok(emitted.length === expect.length, `collected ${expect.length} emissions`);
	emitted.forEach((record, index) => {
		t.deepEqual(record, expect[index], `collected ${index} ${JSON.stringify(expect[index])}`);
	});
	t.equal(count, 10, 'total emits is 10');

	t.end();
});

test('Domain/Entity/Emitter - emission', (t) => {
	const emitter = new Emitter<SampleEmissionMap>();
	const emitted: Array<SampleEmission> = [];

	emitter.on('sample-a', (emission: SampleEmission) => emitted.push(emission));
	emitter.emit({ type: 'sample-a', sample: ++count });

	t.equal(count, 11, 'total emits is 11');

	const emission = emitted[0];
	const { type, sample, timestamp } = emission;

	t.equal(emission.type, 'sample-a', `emission has type "${type}}"`);
	t.equal(emission.sample, 11, `emission has sample ${sample}`);
	t.equal(typeof emission.timestamp, 'number', `emission has timestamp ${timestamp}`);


	t.doesNotThrow(() => (<any>emission).type = 'no-type', 'does not throw on writing emission type');
	t.doesNotThrow(() => (<any>emission).sample = 12, 'does not throw on writing emission sample');
	t.doesNotThrow(() => (<any>emission).timestamp = 0, 'does not throw on writing emission timestamp');

	t.equal(emission.type, type, `emission still has type "${type}"`);
	t.equal(emission.sample, sample, `emission still has sample ${sample}`);
	t.equal(emission.timestamp, timestamp, `emission still has timestamp ${timestamp}`);

	t.doesNotThrow(() => delete (<any>emission).type, 'does not throw on deleting emission type');
	t.doesNotThrow(() => delete (<any>emission).sample, 'does not throw on deleting emission sample');
	t.doesNotThrow(() => delete (<any>emission).timestamp, 'does not throw on deleting emission timestamp');

	t.equal(emission.type, type, `emission still has type "${type}"`);
	t.equal(emission.sample, sample, `emission still has sample ${sample}`);
	t.equal(emission.timestamp, timestamp, `emission still has timestamp ${timestamp}`);

	t.doesNotThrow(() => Object.defineProperty(emission, 'type', { value: 'no-type' }), 'does not throw on defining property emission type');
	t.doesNotThrow(() => Object.defineProperty(emission, 'sample', { value: 12 }), 'does not throw on defining property emission sample');
	t.doesNotThrow(() => Object.defineProperty(emission, 'timestamp', { value: 0 }), 'does not throw on defining property emission timestamp');

	t.equal(emission.type, type, `emission still has type "${type}"`);
	t.equal(emission.sample, sample, `emission still has sample ${sample}`);
	t.equal(emission.timestamp, timestamp, `emission still has timestamp ${timestamp}`);

	t.doesNotThrow(() => Object.setPrototypeOf(emission, null), 'does not throw on setting prototype of emission');

	const proof = {};
	Object.setPrototypeOf(proof, null);

	t.notEqual(Object.getPrototypeOf(emission), null, 'emission prototype is not null');
	t.equal(Object.getPrototypeOf(proof), null, 'proof prototype is null');

	t.end();
});
