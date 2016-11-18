import times from './utils/times';
import format from './utils/format-memory';
import Container from '../src/index';

const cycles = 100;
const objects = 100000;
const container = new Container();
const initialMemory = process.memoryUsage().heapUsed;

console.log('Initial memory usage', format(initialMemory));
console.log('Allocating', objects, 'objects in', cycles, 'cycles');

times(cycles, () => {
    times(objects, (idx) => {
        container.const(idx.toString(), idx);
    });

    container.clear();
    global.gc();
});

console.log('Finished. Pause');
setTimeout(() => {
    const releasedMemory = process.memoryUsage().heapUsed;

    console.log('Final released memory usage', format(releasedMemory));
}, 1000);
