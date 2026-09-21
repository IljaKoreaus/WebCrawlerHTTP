const {JSDOM} = require('jsdom');

async function crawlPage(baseURL, currentURL, pages) {

    const baseURLObj = new URL(baseURL);
    const currnetURLObj = new URL(currentURL);

    // Checking If We're Still On
    // The Same Page
    if (baseURLObj.hostname !== currnetURLObj.hostname) {
        return pages;
    }

    const normalizedCurrentURL = normalizeURL(currentURL);

    // Counting The Amount Of The Page
    // Has Occurred
    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++;
        return pages;
    }

    pages[normalizedCurrentURL] = 1;

    console.log(`Actively Crawling ${currentURL}`);

    try {
        const resp = await fetch(currentURL);

        // Checking For Errors
        if (resp.status > 399) {
            console.log(`Error In Fetch With Status Code: ${resp.status} on page: ${currentURL}`);
            return pages;
        }

        const contentType = resp.headers.get("content-type");

        if (!contentType.includes("text/html")) {
            console.log(`Non HTML Response, Content Type: ${contentType} on page: ${currentURL}`);
            return pages;
        }

        const htmlBody = await resp.text();

        nextURLs = getURLsFromHTML(htmlBody, baseURL);

        for (const nextURL of nextURLs) {
            pages = await crawlPage(baseURL, nextURL, pages);
        }

    } catch (err) {
        console.log(`Error In Fetch: ${err.message}, on page ${currentURL}`);
    }

    return pages;
}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');

    for (const linkElement of linkElements) {
        
        // Check for relative and absolute URLs
        if (linkElement.href.slice(0, 1) === '/') {
            // relative
            try {
                const urlObj = new URL(`${baseURL}${linkElement.href}`);
                urls.push(urlObj.href);
            } catch (err) {
                console.log(`Error with relative url: ${err.message}`);
            }

        } else {
            //absolute
            try {
                const urlObj = new URL(linkElement.href);
                urls.push(urlObj.href);
            } catch (err) {
                console.log(`Error with absolute url: ${err.message}`);
            }
        }
    }
    return urls;
};

function normalizeURL(urlString) {
    const urlObj = new URL(urlString);
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
    
    // Check for trailing slash
    if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1);
    }
    return hostPath;
}

module.exports = {
    crawlPage,
    normalizeURL,
    getURLsFromHTML
}