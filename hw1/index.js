window.onload = () => {
	document.getElementById('sort-quotes-btn').onclick = () =>{
    	let authors = document.getElementsByClassName('author-sorting');
    	let quotes = document.getElementsByClassName('quote-text-sorting');
    	let nums = Array.apply(null, Array(authors.length)).map((_, i) => i);//get range 0..author.length-1
    	let newAuthors = {};
    	let newQuotes = {};
    	nums.sort( (i1, i2) => authors[i1].innerHTML.localeCompare(authors[i2].innerHTML))
    	.forEach((item, index) =>{
    		newAuthors[index.toString()] = authors[item].innerHTML;
    		newQuotes[index.toString()] = quotes[item].innerHTML
    	});

    	nums.forEach(item => {
    		authors[item].innerHTML = newAuthors[item.toString()];
    		quotes[item].innerHTML = newQuotes[item.toString()];
    	});
    }

	loadQuotes( quotesArray => {
		let quotes = {};
		let options = [];

		quotesArray.sort((q1, q2) => q1.quoteAuthor.localeCompare(q2.quoteAuthor))
		.forEach( quote => {
			if (!quotes[quote.quoteAuthor]){
				quotes[quote.quoteAuthor] = [];
			}
			quotes[quote.quoteAuthor].push(quote.quoteText);
		});

		Object.keys(quotes).sort().forEach(author => {
			let option = document.createElement('option');
			option.innerHTML = author;
			document.getElementById('author-selector').appendChild(option);
		});

		document.getElementById('change-quote-btn').onclick = () =>{
    	loadQuotes( quotesArray => {
    		let randIndex = Math.round(Math.random()*(quotesArray.length - 1));
    		document.getElementById('first-quote-text').innerHTML = 
    			quotesArray[randIndex].quoteText + ' -- ' + quotesArray[randIndex].quoteAuthor;
    	});
	};

	document.getElementById('quote-by-author-btn').onclick = () => {
		let selector = document.getElementById('author-selector');
		let author = selector.options[selector.selectedIndex].text;
		if (!author){
			alert('Please, choose author.');
			return;
		}
		document.getElementById('quote-author-name').innerHTML = 'Quote of ' + author + ':';
		document.getElementById('quote-author-random-text').innerHTML = quotes[author][Math.round(Math.random()*(quotes[author].length - 1))];
	}
		
	});
};

function loadQuotes(/*function(quotesArray[])*/successFunction){
	let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://raw.githubusercontent.com/4skinSkywalker/Database-Quotes-JSON/master/quotes.json', true);
    xhr.onload = () => {
    	let quotesArray = JSON.parse(xhr.responseText);
    	successFunction(quotesArray);
    } ;

    xhr.onerror = () => 
    	alert('Sorry, some error happened when document with quotes was loading... Please, reload page'); 
    xhr.send();
}

