// Client js


// On page load
function refreshPage() {
    // Clear page
    document.getElementById("rssContainer").innerHTML = ""
    // Init local storage
    initFeeds()
    // Get stored rss feed urls
    const allFeeds = getAllStoredFeeds()
    // Display each feed
    allFeeds.forEach(feed => {
        fetchRss(feed.storedRssFeed)
    })
}

// Local storage for rss feeds
// Initialize if nothing in local storage (run automatically)
function initFeeds() {
    storage = getAllStoredFeeds()
    if (storage.length == 0) {
        console.log("rss feed storage init")
        localStorage.setItem('rss1', 'https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss');
        for (let i = 2; i <= 20; i++) {
            localStorage.setItem(`rss${i}`, '');
        }
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
                <input type="text" size="70" id="${feed.key}" value="${feed.storedRssFeed}">
                <button onclick="saveChanges(${feed.key})">Save</button>
                <br><br>
            </li> 
        `;
    });
    // Add empty field for adding new feed
    let empty = getFirstEmptyStorage()
    htmlOutput += `<li class="storedFeed"> 
                <input type="text" size="70" id="${empty}" placeholder="Add another...">
                <button onclick="saveChanges(${empty})">Save</button>
                <br><br>
            </li> `
    modalDiv.innerHTML = htmlOutput;


    modal.showModal();
}

// Save changes made to rss feed storage item
function saveChanges(key) {
    let storageKey = key.id // rss1, rss2 ...    
    let input = document.getElementById(storageKey).value   // Input field text content    
    localStorage.setItem(storageKey, input);    // Write new value into storage
    console.log("Saved", storageKey, input)
    // Reload modal
    displayFeeds()
    // Refresh articles
    refreshPage()
}

// Find first empty local storage container
function getFirstEmptyStorage() {
    // Loop all local storage
    for (let i = 0; i <= localStorage.length; i++) {
        let key = `rss${i}`;
        // Check if the key exists in localStorage
        if (localStorage.getItem(key) !== null) {
            // Read content
            let storedRssFeed = localStorage.getItem(key);
            // Check if it is empty
            if (!storedRssFeed) {
                return key  // (rss1, rss2, ...)
            }
        }
    }
}

// Get all saved rss feeds from local storage
function getAllStoredFeeds() {
    const rssArr = [];
    for (let i = 0; i <= localStorage.length; i++) {
        let key = `rss${i}`;
        if (localStorage.getItem(key) !== null) {
            let storedRssFeed = localStorage.getItem(key);
            // Check if has stored content
            if (storedRssFeed) {
                rssArr.push({ key, storedRssFeed });
            }
        }
    }
    return rssArr;
}



// Function to get RSS feed from the local proxy server
async function fetchRss(url) {

    // If no url is provided use default
    //if (!url) { url = 'https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss'; }

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
        // Go on to display fetched rss feed on page
        displayRss(xml, url)
    } catch (error) {
        console.error('Error fetching the RSS feed:', error);
    }
}

// Function to display RSS feed content in HTML
function displayRss(xml, source) {
    const rssContainer = document.getElementById("rssContainer");
    const items = xml.querySelectorAll("item");
    let htmlOutput = ``;
    items.forEach(itemElement => {
        let link = itemElement.querySelector("link")
        if (link) {
            link = itemElement.querySelector("link").textContent
        } else { return }
        let title = itemElement.querySelector("title")
        if (title) {
            title = itemElement.querySelector("title").textContent
        } else { return }
        let description = itemElement.querySelector("description")
        if (description) {
            description = itemElement.querySelector("description").textContent
        } else { description = "" }
        let date = itemElement.querySelector("pubDate")
        if (date) {
            date = itemElement.querySelector("pubDate").textContent
        } else { return }
        let author = itemElement.querySelector("author")
        if (author) {
            author = itemElement.querySelector("author").textContent
        } else { author = "" }
        let image = itemElement.querySelector("[medium]")
        if (image) {
            image = image.getAttribute("url");
        } else { image = "" }


        htmlOutput += ` 
            <li class="articlePreview"> 

                <p class="pubDate">
                    ${date}
                </p>

                <h3 class="clickable">   
                    <p onclick="displayArticle('${link}')">                                 
                        ${title}
                    </p>                             
                </h3> 

                <img class="clickable" onclick="displayArticle('${link}')" src="${image}" alt="Image">

                <div class="clickable">
                    <p onclick="displayArticle('${link}')"> 
                        ${description} 
                    </p> 
                </div>                      
                `

        let category = itemElement.querySelectorAll("category")
        if (category) {
            htmlOutput += `<div class="category-container">`
            category.forEach(cat => {
                cat = cat.textContent
                if (cat.length > 0) {
                    htmlOutput += `<p class="category" onclick="filterCategory('${cat}')">
                        ${cat}
                    </p> `
                }
            })
            htmlOutput += `</div>`
        }

        htmlOutput += `
                <p class="source">
                    ${source}
                </p>
            </li>`

    });

    // Add article to page
    rssContainer.innerHTML += htmlOutput;
    sortByDate()
}

// There should be a way to filter articles based on their categories.
function filterCategory(cat) {
    let allPreviewsUl = document.getElementById("rssContainer");
    let previews = Array.from(allPreviewsUl.querySelectorAll(".articlePreview")); // Get all li elements
    // Clear list
    allPreviewsUl.innerHTML = "";
    previews.forEach(item => {
        let cats = item.querySelectorAll(".category")

        let catsArr = Array.from(cats);
        catsArr.forEach(category => {
        });
        // Add articles with selected category
        if (catsArr.some(category => category.textContent.includes(cat))) {
            allPreviewsUl.appendChild(item)
        }
    });
}


// All articles should be ordered by date (newest first)
function sortByDate() {
    // Get whole ul
    let allPreviewsUl = document.getElementById("rssContainer");
    // Get all li elements
    const previews = Array.from(document.querySelectorAll(".articlePreview"));

    // Sorting function to compare dates in descending order
    previews.sort((item1, item2) => {
        let date1 = new Date(item1.querySelector(".pubDate").textContent.trim());
        let date2 = new Date(item2.querySelector(".pubDate").textContent.trim());
        //console.log(`Comparing dates "${date1}" and "${date2}"`);
        return date2 - date1; // Sort in descending order
    });

    // Reset ul with sorted li-s
    allPreviewsUl.innerHTML = "";
    previews.forEach(item => allPreviewsUl.appendChild(item));
}


// Modal functionality
const modal = document.getElementById('modal');

// Display article on modal
async function displayArticle(url) {
    // Div in modal that will contain news article
    modalDiv = document.getElementById('modal-div')
    // Open modal
    modalDiv.innerText = "Loading article..."
    modal.showModal();
    // Fetch news article for displaying
    try {
        let article = await declutter(url);
        //console.log(article)
        modalDiv.innerHTML = article.content;
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

    //if (!url) { url = 'https://www.theverge.com/tech' }  // Default url
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
        if (data.error || data.failed) {
            console.log("Error when decluttering")
        }
        //console.log('Response from declutterer:', data);
        return data;
    } catch (error) {
        console.error('Error sending POST request:', error);
    }
}
