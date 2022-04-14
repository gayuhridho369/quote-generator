const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const quoteNext = document.getElementById('quoteNext');
const tagSelect = document.getElementById('tagSelect');
const speakIcon = document.getElementById('speakIcon');
const copyIcon = document.getElementById('copyIcon');
const twitterIcon = document.getElementById('twitterIcon');

getTagsQuote();
getRandomQuote();

function getRandomQuote(tag = 'random') {
    const defaultQuoteNext = quoteNext.textContent;
    quoteNext.textContent = 'WAIT...';
    quoteNext.classList.add('loading');

    randomQuoteAPI(tag)
        .then((result) => {
            quoteText.textContent = result.content;
            quoteAuthor.textContent = result.author;
        })
        .catch((error) => {
            quoteText.textContent = error.message;
        })
        .finally(() => {
            quoteNext.textContent = defaultQuoteNext;
            quoteNext.classList.remove('loading');
        });
}

function getTagsQuote() {
    tagsQuoteAPI()
        .then((result) => {
            result.forEach(result => {
                const option = document.createElement('option');
                option.setAttribute('value', result.name);
                option.textContent = result.name;
                option.classList.add('option');
                tagSelect.appendChild(option);

            });
        })
        .catch((error) => {
            console.error(error.message);
        });
}

async function randomQuoteAPI(tag) {
    let url;
    if (tag === 'random') {
        url = 'https://api.quotable.io/random';
    } else {
        url = `https://api.quotable.io/random?tags=${tag}`;
    }

    try {
        return await fetch(url).then(response => response.json());
    } catch (error) {
        throw new Error(`Something is wrong: ${error.message}!!!`);
    }
}

async function tagsQuoteAPI() {
    let url = 'https://api.quotable.io/tags';
    try {
        return await fetch(url).then(response => response.json());
    } catch (error) {
        throw new Error(`Something is wrong: ${error.message} in Tags Quote!!!`);
    }
}

quoteAuthor.addEventListener('click', (event) => {
    const googleURL = `https://google.com/search?q=${event.target.textContent}`;
    window.open(googleURL, '_blank');
});

quoteNext.addEventListener('click', (event) => {
    event.preventDefault();
    getRandomQuote(tagSelect.value);
});

tagSelect.addEventListener('change', (event) => {
    randomQuoteAPI(event.target.value);
});

speakIcon.addEventListener('click', () => {
    let utterance = new SpeechSynthesisUtterance(`${quoteText.textContent} by ${quoteAuthor.textContent}`);
    window.speechSynthesis.speak(utterance);
});

copyIcon.addEventListener('click', () => {
    navigator.clipboard.writeText(`${quoteText.textContent} (${quoteAuthor.textContent})`);
});

twitterIcon.addEventListener('click', () => {
    const twitterURL = `https://twitter.com/intent/tweet?url=${quoteText.textContent} (${quoteAuthor.textContent})`;
    window.open(twitterURL, '_blank');
});
