// The script handles navigation menu interactions.
// It communicates with the Bitly API to shorten URLs.
// It updates the UI with the shortened URL and handles errors.
// Users can copy the shortened URL to the clipboard.

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navItem = document.querySelectorAll(".nav-item");
const urlInput = document.getElementById("url-input");
const form = document.forms.url_form;
const submitBtn = document.getElementById("submit-url");
const result = document.querySelector(".result");
const errorBox = document.getElementById("error");

// Event listener to open/close mobile navigation menu
hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

// Event listener to close mobile navigation menu
navItem.forEach((item) => {
    item.addEventListener("click", function () {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    });
});

// Function that generates the resultCard containing short link
const resultCard = function (link, shortLink) {
    urlInput.value = "";
    //returns the div for original link and the short link to be copied, and a copy button
    return `<div class="result-card col-12">
                <span class="result-url">${link}</span>
                <div class="short-link">
                  <a href="https://${shortLink}" target="_blank">https://${shortLink}</a>
                  <button class="main-btns copy-btn">Copy</button>
                </div>
              </div>`;
};

// Function to generate shortLink using Bitly API

// Accepts a URL from an input field (urlInput).
// Trims leading and trailing spaces from the URL.
// Changes the content of a button (submitBtn) to "Loading..." during API request.
// Makes a POST request to the Bitly API with the provided URL and Bitly access token.
// Processes the API response, updating the button content based on success or failure.
// If successful, returns the shortened URL; if unsuccessful, logs errors and returns an error message.
// Handles unexpected errors during the API request, updating the button content accordingly.


function getShortLinkBitly() {
    let link = urlInput.value.trim();
    let ok;
    submitBtn.innerHTML = "Loading...";

    return fetch('https://api-ssl.bitly.com/v4/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 8a364d9d86934d08fdcf8a4b509857ba394875e5', // Bitly access token
        },
        body: JSON.stringify({ long_url: link, domain: 'bit.ly' }),
    })
        .then((res) => {
            ok = res.ok;
            return res.json();
        })
        .then((data) => {
            if (ok && data.id) {
                submitBtn.innerHTML = 'Shorten it!';
                return { result_url: data.id, error: null };
            }

            if (data.message) {
                console.error('Bitly API Error:', data.message);
                return { result_url: null, error: data.message };
            }
        })
        .catch((error) => {
            console.error('Error during Bitly API request:', error);
            submitBtn.innerHTML = 'Shorten it!';
            return { result_url: null, error: 'An unexpected error occurred.' };
        });

}



// Event listener to call the getShortLinkBitly() after the form is submitted
form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!urlInput.value) {
        showError("Please add a link", false);
        return;
    }

    showError("", true);

    getShortLinkBitly()
        .then(({ result_url, error }) => {
            if (error) {
                showError(error, false);
                return;
            }

            // Handle successful result_url if needed
            //result will be displayed in the page
            result.insertAdjacentHTML(
                'afterbegin',
                resultCard(urlInput.value, result_url)
            );
        });
});


// Toggle error function to show error
function showError(content, toggleRemove) {
    if (!toggleRemove) {
        urlInput.classList.add("error-outline");
        errorBox.innerHTML = content;
        return;
    }

    urlInput.classList.remove("error-outline");
    errorBox.innerHTML = "";
}
//Event listener to copy shortened url
document.addEventListener('click', function (event) {
    if (!event.target.classList.contains('copy-btn')) return;

    let short_link = event.target.parentNode.querySelector('.short-link > a');

    navigator.clipboard.writeText(short_link.href);

    event.target.classList.add('copied');
    event.target.textContent = 'Copied!';

    setTimeout(() => {
        event.target.classList.remove('copied')
        event.target.textContent = 'Copy'
    }, 2500);
});

//scroll to top button
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
        myBtn.style.display = "block";
    } else {
        myBtn.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {

    document.documentElement.scrollTop = 0;
}