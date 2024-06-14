// Function to display RSS feed content in HTML
async function displayRss(xml) {
    const items = xml.querySelectorAll("item");
    let htmlOutput = ``;
    items.forEach(itemElement => {
        const title = itemElement.querySelector("title").textContent;
        const link = itemElement.querySelector("link").textContent;
        const description = itemElement.querySelector("description").textContent;
        let htmlOutput = ``;
        /* The concatenation of htmlOutput  
           string is applied for each item  
           element of array. querySelector  
           fetches first element of the descendant */

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
    });
}

// Function to get RSS feed from the local proxy server
async function fetchRss() {
    const proxyUrl = 'http://localhost:3000/fetch-rss';
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

// Immediately-invoked function to fetch and display RSS feed
(async () => {
    const xml = await fetchRss();
    if (xml) {
        console.log("fetchRss() got the RSS feed");
        displayRss(xml);
    } else {
        console.error('Failed to fetch RSS feed');
    }
})();