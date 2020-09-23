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

   
        // console.log(paginator(renderedWebSnippets));

        let state = {
            'querySet': arrayOfResults,
            'page': 1,
            'rows': 5
        };

        console.log(arrayOfResults.length);
        

        buildWebSnippets();

        function pagination(querySet, page, rows) {
            var trimStart = (page - 1) * rows;
            var trimEnd = trimStart + rows;

            var trimmedData = querySet.slice(trimStart, trimEnd);

            var pages = Math.round(querySet.length / rows);

            return {
                'querySet': trimmedData,
                'pages': pages
            }
        }

        function changePage() {
            var buttonValue = document.getElementById('changePageBtn');
            console.log(button);
            
            
            while(wrapper.firstChild) wrapper.removeChild(wrapper.firstChild);

            state.page = buttonValue;
            buildWebSnippets()
        }

        function pageButtons(pages) {
            var wrapper = document.getElementById('buttonsWrapper');
            console.log(pages);

            for (let page = 1; page <= pages; page++) {
                wrapper.innerHTML += 
                `
                    <button value=${page} id='changePageBtn' class='btn page' onClick=${changePage()} >${page}</button>
                `
                
            }
        }

        function buildWebSnippets() {
            var data = pagination(state.querySet, state.page, state.rows);
            var myList = data.querySet;
            console.log(myList);
            
            const renderedWebSnippets = myList
                .map((resultToDisplay) => {

                    return `
                    <li class="character">
                        <h2>${resultToDisplay.title}</h2>
                        <a href="${resultToDisplay.link}" >${resultToDisplay.formattedUrl}</a>
                        <p>${resultToDisplay.htmlSnippet}</p>
                    </li>
                `;
                }).join('');

                webResultsPaginated.innerHTML = renderedWebSnippets;
                pageButtons(arrayOfResults.length / 5);
        }

};
