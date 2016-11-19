export default function times(cycles, cb) {
    let counter = 0;

    while (counter < cycles) {
        counter += 1;
        cb(counter);
    }
}
