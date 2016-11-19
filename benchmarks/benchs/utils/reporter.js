import times from './times';

function format(message, tabs = 0, tabChar = ' ') {
    const output = [];

    times(tabs, () => {
        output.push(`${tabChar}${tabChar}`);
    });

    output.push(message);

    return output.join(' ');
}

function report(message, tabs = 0, tabChar = ' ') {
    console.log(format(message, tabs, tabChar));
}

report.update = (message, tabs, tabChar) => {
    console.log(format(message, tabs, tabChar));
};

export default report;
