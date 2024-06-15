// Client js

// Function to get RSS feed from the local proxy server
async function fetchRss(url) {

    // If no url is provided use default
    if (!url) { url = 'https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss'; }

    // Access through proxy
    const proxyUrl = '/proxy?url=' + encodeURIComponent(url);
    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "application/xml");
        //return xml;
        displayRss(xml)
    } catch (error) {
        console.error('Error fetching the RSS feed:', error);
    }
}

// Function to display RSS feed content in HTML
function displayRss(xml) {
    const items = xml.querySelectorAll("item");
    let htmlOutput = ``;

    items.forEach(itemElement => {
        htmlOutput += ` 
            <li class="articlePreview"> 
                <h3>                                                
                    <a href="${itemElement.querySelector("link").innerHTML}" target="_blank" rel="noopener">                                 
                        ${itemElement.querySelector("title").innerHTML} 
                        <button style="border-radius:8px; background-color:rgb(32, 94, 170); color:white;border:none"> 
                            RSS 
                        </button> 
                    </a>                             
                </h3> 
                <p> 
                    ${itemElement.querySelector("description").innerHTML} 
                </p>          
                <p class="publishedOnBy">
                    Published on ${itemElement.querySelector("pubDate").innerHTML} by ${itemElement.querySelector("author").innerHTML} 
                </p>               
            </li> 
        `;
    });

    const rssContainer = document.getElementById("rssContainer");
    if (rssContainer) {
        rssContainer.innerHTML = htmlOutput;
    }
}

// Modal functionality
const modal = document.getElementById('modal');
const openButton = document.querySelector('.open-button');
const closeButton = document.querySelector('.close-button');

openButton.addEventListener('click', () => {
    modal.showModal();
});

closeButton.addEventListener('click', () => {
    modal.close();
});

window.onclick = function (event) {
    if (event.target == modal) {
        modal.close();
    }
}