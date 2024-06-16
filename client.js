// Client js


// On page load fetch all news items and display
function displayAllRss() {
    const allFeeds = getAllStoredFeeds()
    allFeeds.forEach(feed => {
        fetchRss(feed.storedRssFeed)
    })
}

// Local storage for rss feeds
// Initialize if nothing in local storage (run automatically)
if (localStorage.length == 0) {
    localStorage.setItem('rss1', 'https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss');
    for (let i = 2; i <= 20; i++) {
        localStorage.setItem(`rss${i}`, '');
    }
}

// The user can add/edit/remove custom RSS feeds, which should remain even after refreshing the page
function displayFeeds() {
    // Display stored feeds on modal
    const modalDiv = document.getElementById('modal-div')
    //modalDiv.innerText = ""

    const allFeeds = getAllStoredFeeds()
    let htmlOutput = `Stored RSS feeds<br><br>`;

    // List all stored feeds
    allFeeds.forEach(feed => {
        htmlOutput += ` 
            <li class="storedFeed"> 
                <input type="text" id="${feed.key}" value="${feed.storedRssFeed}">
                <button onclick="">Save</button>
                <br><br>
            </li> 
        `;
    });
    // Add empty field for adding new feed
    let empty = getFirstEmptyStorage
    htmlOutput += `<li class="storedFeed"> 
                <input type="text" id="${empty.key}" placeholder="Add another..."><br><br>
            </li> `
    modalDiv.innerHTML = htmlOutput;


    modal.showModal();
}

// Find first empty local storage container
function getFirstEmptyStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Check key
        if (key.startsWith('rss')) {
            const storedRssFeed = localStorage.getItem(key);
            // Check if has stored content
            if (!storedRssFeed) {
                console.log('First empty slot: ', localStorage.key)
                return localStorage.key
            }
        }
    }
}

// Get all saved rss feeds from local storage
function getAllStoredFeeds() {
    const rssArr = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Check key
        if (key.startsWith('rss')) {
            const storedRssFeed = localStorage.getItem(key);
            // Check if has stored content
            if (storedRssFeed) {
                rssArr.push({ key, storedRssFeed });
            }
        }
    }
    console.log(rssArr)
    return rssArr;
}



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
        // Go on to display fetched rss feen on page
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
                <h3 class="clickable">                                                
                                               
                    <p onclick="displayArticle('${itemElement.querySelector("link").innerHTML}')">                                 
                        ${itemElement.querySelector("title").innerHTML}
                    </p>                             
                </h3> 
                <div class="clickable">
                    <p onclick="displayArticle('${itemElement.querySelector("link").innerHTML}')"> 
                        ${itemElement.querySelector("description").innerHTML} 
                    </p> 
                </div>         
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

// Display article on modal
async function displayArticle(url) {
    // Open modal
    document.getElementById('modal-div').innerText = "Loading article..."
    modal.showModal();
    // Fetch news article for displaying
    try {
        let article = await declutter(url);
        document.getElementById('modal-div').innerHTML = article.content;
    } catch (error) {
        console.error('Error fetching and displaying article:', error);
        document.getElementById('modal-div').innerText = ('Error fetching and displaying article:', error);
    }
}

// Close modal on click outside of modal
window.onclick = function (event) {
    if (event.target == modal) {
        modal.close();
    }
}

// Before displaying the article, it must be freed from clutter using the Mercury API web parser
async function declutter(url) {

    if (!url) { url = 'https://www.theverge.com/tech' }  // Default url
    //const apiUrl = 'http://0.0.0.0:3000/webparser';   // Local server proxy for webparser
    const apiUrl = 'https://lolo-slse.onrender.com/webparser'   // For running on render

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
