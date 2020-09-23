// DOM Manipulation
const form = document.getElementById('form');

// KEY 
const API_KEY = 'AIzaSyB_e20EKxEoQdw2WBx69UJHdH1aGytZGPc';

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
    console.log(arrayOfResults);
    
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
        }).slice(0,per_page).join('');
        // });

        console.log(paginator(renderedWebSnippets));

        const paginatedSnippets = paginator(renderedWebSnippets).data;
        const prevPage = paginator(renderedWebSnippets).pre_page;
        const currentPage = paginator(renderedWebSnippets).page;
        const nextPage = paginator(renderedWebSnippets).next_page;     

    webResultsPaginated.innerHTML = `
        ${paginatedSnippets}
        <div>
            <a onClick=${paginator(renderedWebSnippets,1,5)} >${prevPage ? prevPage : ''}</a>
            <a >${currentPage}</a>
            <a onClick=${paginator(renderedWebSnippets,2,5)} >${nextPage ? nextPage : ''}</a>
        </div>
    `;
   
};

// Pagination 
function paginator(items, page, per_page) {

    var page = page || 1,
    per_page = per_page || 5,
    offset = (page - 1) * per_page,
  
    paginatedItems = items.slice(offset).slice(0, per_page).join(''),
    total_pages = Math.ceil(searchResults.items.length / per_page);
    return {
    page: page,
    per_page: per_page,
    pre_page: page - 1 ? page - 1 : null,
    next_page: (total_pages > page) ? page + 1 : null,
    total: items.length,
    total_pages: total_pages,
    data: paginatedItems
    };
  }



