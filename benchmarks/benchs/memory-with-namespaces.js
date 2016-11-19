import times from './utils/times';
import format from './utils/format-memory';
import report from './utils/reporter';
import Container from '../../src/index';

const cycles = 20;
const objects = 50000;
const container = new Container();
const initialMemory = process.memoryUsage().heapUsed;

report('Memory. With namespaces');
report(`Initial memory usage ${format(initialMemory)}`, 1, '-');

times(cycles, (cycle) => {
    times(objects, (idx) => {
        container.namespace(`${idx}_namespace`).value(`${idx}_value`, {});
        container.resolve(`${idx}_namespace/${idx}_value`);
    });

    report.update(`Allocated ${objects} objects in ${cycle} cycle`, 2);
    container.clear();
    global.gc();
});

report('Finished. Pause');
setTimeout(() => {
    const releasedMemory = process.memoryUsage().heapUsed;

    report(`Final released memory usage ${format(releasedMemory)}`, 1);
    report(`Initial: ${format(initialMemory)}, final: ${format(releasedMemory)}`, 1);
}, 1000);
