// DOM Manipulation
const form = document.getElementById('form');

// KEY 
const API_KEY = 'AIzaSyAxYifWHqq1v7fnjp-SK3tNySlkKHgk4Dc';

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
    imagesPaginated.innerHTML = '';

    const renderedImages = arrayOfResults
        .map((resultToDisplay) => {
            
            
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


   
    const list_items = arrayOfResults;
    const webResultsPaginated = document.getElementById('webResultsPaginated');
    const pageNumbers = document.getElementById('buttonsWrapper');

    webResultsPaginated.innerHTML = '';

    let current_page = 1;
    let rows = 5;


    function displayList (items, wrapper, rows_per_page, page) {
        wrapper.innerHTML = "";
        page--;
    
        let start = rows_per_page * page;
        let end = start + rows_per_page;
        let paginatedItems = items.slice(start, end);
        
        let item_element = paginatedItems
        .map((item) => {

            return `
            <li class="character">
                <h2>${item.title}</h2>
                <a href="${item.link}" >${item.formattedUrl}</a>
                <p>${item.htmlSnippet}</p>
            </li>
        `;
        }).join('');

        webResultsPaginated.innerHTML = item_element;
    }

    
    function setupPagination (items, wrapper, rows_per_page) {
        wrapper.innerHTML = "";
    
        let page_count = Math.ceil(items.length / rows_per_page);
        for (let i = 1; i < page_count + 1; i++) {
            let btn = paginationButton(i, items);
            wrapper.appendChild(btn);
        }
    }
    
    function paginationButton (page, items) {
        let button = document.createElement('button');
        button.innerText = page;
    
        if (current_page == page) button.classList.add('active');
    
        button.addEventListener('click', function () {
            current_page = page;
            displayList(items, webResultsPaginated, rows, current_page);
    
            let current_btn = document.querySelector('.pageNumbers button.active');
            console.log(current_btn);
            
            current_btn.classList.remove('active');
    
            button.classList.add('active');
        });
    
        return button;
    }
        
    displayList(list_items, webResultsPaginated, rows, current_page);
    setupPagination(list_items, pageNumbers, rows);

};
