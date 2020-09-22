// DOM Manipulation
const form = document.getElementById('form');

// KEY 
const API_KEY = process.env.API_KEY;

// EVENT LISTENER on SUBMIT
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const typedString = e.target[0].value.toLowerCase().trim();
    makeApiCall(typedString);
});

// FETCH FUNCTION + ERROR HANDLING
const makeApiCall = async (query) => {
  
    try {
        const res = await fetch(`https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=aca73bd47c044c702&q=${query}`);
        searchResults = await res.json();

        displaySearchResults(searchResults.items);
        
    } catch (err) {
        console.error(err);
    }
};

// RENDERING FUNCTION + ERROR HANDLING (API RES GIVES INCONSISTENT RESULTS)
const displaySearchResults = (arrayOfResults) => {
    const imagesPaginated = document.getElementById('imagesPaginated');
    const webResultsPaginated = document.getElementById('webResultsPaginated');

    const renderedImages = arrayOfResults
        .map((resultToDisplay) => {
            console.log(resultToDisplay);
            
            if(resultToDisplay.pagemap.thumbnail) {
            return `
                <div>
                    <img class="gallery-img" src=${resultToDisplay.pagemap.thumbnail[0].src} />
                </div>
            `} else if(resultToDisplay.pagemap.cse_thumbnail) {
                return `
                <div>
                    <img class="gallery-img" src=${resultToDisplay.pagemap.cse_thumbnail[0].src} />
                </div>
            `} else {
                return `
                <div>
                    <img class="gallery-img" src="./pexels_error_thumb.jpg" />
                </div>
            `
            };

        }).slice(0,9).join(''); 
    imagesPaginated.innerHTML = renderedImages;

    const renderedWebSnippets = arrayOfResults
        .map((resultToDisplay) => {

            return `
            <li class="character">
                <h2>${resultToDisplay.title}</h2>
                <a href="${resultToDisplay.link}" >${resultToDisplay.formattedUrl}</a>
                <p>${resultToDisplay.htmlSnippet}</p>
            </li>
        `;

        }).slice(0,5).join('');
    webResultsPaginated.innerHTML = renderedWebSnippets;
};


