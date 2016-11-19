import memory from './memory';

memory((err) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log('Done');
});
