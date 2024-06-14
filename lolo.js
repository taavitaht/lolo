// Pass rss to html
async function displayRss(xml) {

    // Divide xml into parts
    const items = xml.querySelectorAll("item");

    let htmlOutput = ``;

    // Process each item from xml and add to output
    items.forEach(itemElement => {
        htmlOutput += ` 
                    <div> 
                        <h3>                                                
                            <a href= 
                            "${itemElement.querySelector("link").innerHTML}" 
                                   target="_blank" rel="noopener">                                 
                                 ${itemElement.querySelector("title").innerHTML} 
                                <button style= 
                                "border-radius:8px; 
                                background-color:rgb(32, 94, 170); 
                                color:white;border:none"> 
                                     RSS 
                                </button> 
                            </a>                             
                        </h3> 
                        <p> 
                           ${itemElement
                .querySelector("description").innerHTML} 
                        <p>                         
                    </div> 
                    `;
    });

    // Returns the htmlOutput string 
    // in the HTML body element 
    // Check whether your query returns null 
    var input =
        document.getElementById("RssContainer");
    if (input) {
        input.innerHTML = htmlOutput;
    }
    document.body.style.backgroundColor = "rgb(203, 245, 245)";
}


// Get rss from local proxy server
async function fetchRss() {

    const proxyUrl = 'http://localhost:3000/fetch-rss'
    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "application/xml");
        return xml;
    } catch (error) {
        console.error('Error fetching the RSS feed:', error);
    }
}

(async () => {
    const xml = await fetchRss();
    if (xml) {
        console.log("fetchRss() got the rss feed")
        // Do something with acquired data
        displayRss(xml)
    } else {
        console.error('Failed to fetch RSS feed');
    }
})();