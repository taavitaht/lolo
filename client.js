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

// Define an async function to handle decluttering
async function handleOpenButtonClick() {
    try {
        modal.showModal();
        let article = await declutter('https://www.helpnetsecurity.com/2024/05/22/authelia-open-source-authentication-authorization-server/');
        document.getElementById('modal-div').innerText = article.content;
    } catch (error) {
        console.error('Error fetching and displaying article:', error);
        // Handle error, e.g., display an error message
    }
}

// Attach event listener to openButton
openButton.addEventListener('click', handleOpenButtonClick);

closeButton.addEventListener('click', () => {
    modal.close();
});

window.onclick = function (event) {
    if (event.target == modal) {
        modal.close();
    }
}



// Before displaying the article, it must be freed from clutter using the Mercury API web parser
async function declutter(url) {

    if (!url) { url = 'https://www.theverge.com/tech'}  // Default url
    const apiUrl = 'http://0.0.0.0:3000/webparser';   // Server proxy for webparser

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        //console.log('Response from server:', data);
        return data;
    } catch (error) {
        console.error('Error sending POST request:', error);
    }
}
// Call the function to send the POST request
//declutter('https://www.theverge.com/tech');