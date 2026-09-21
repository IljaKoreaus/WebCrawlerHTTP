function printReport(pages) {
    console.log("******");
    console.log("REPORT");
    console.log("******");

    const sortedPages = sortPages(pages);

    for(const sortedPage of sortedPages) {
        const url = sortedPage[0];
        const hits = sortedPage[1];
        console.log(`Found ${hits} links to page: ${url}`);
    }

    console.log("******");
    console.log("END");
    console.log("******");
};

function sortPages(pages) {
    const pagesArr = Object.entries(pages);
    pagesArr.sort((a, b) => {
        aValue = a[1];
        bValue = b[1];
        return bValue - aValue;
    });
    return pagesArr;
}

module.exports = {
    printReport,
    sortPages
}