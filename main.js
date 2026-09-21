const {crawlPage} = require('./crawl.js');

function main() {

    // Check Command Line Arguments & Throw
    // Error If Necessary

    // Under 3 Args Provided
    if (process.argv.length < 3) {
        console.log("No Webiste Provided");
        process.exit(1);
    }

    // Too Many Args
    if (process.argv.length > 3) {
        console.log("Too Many Command Line Arguments");
        process.exit(1);
    }

    const baseURL = process.argv[2];

    console.log(`Starting Crawl Of ${baseURL}`);
    crawlPage(baseURL);
};

main();