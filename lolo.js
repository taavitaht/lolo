function functionCall() { 
    //const newsFeedContents = 'lolo.xml'; 
    const newsFeedContents = 'https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss';
    fetch(newsFeedContents, { mode: 'no-cors' }) 
        .then(response => response.text()) 
  
        // DOMparser is the interface which parses  
        // a string having XML  
        // and return XML document 
        .then(str => new window.DOMParser() 
            .parseFromString(str, "text/xml")) 
        .then(data => { 
  
            //Returns collection of child elements 
            // of the matched selector. 
            const items = data.querySelectorAll("item"); 
  
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
                document.getElementById("RSSfeedID"); 
            if (input) { 
                input.innerHTML = htmlOutput; 
            } 
            document.body.style.backgroundColor = "rgb(203, 245, 245)"; 
        }); 
}