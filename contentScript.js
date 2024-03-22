// Get the text content of the page
const webpageContent = document.body.innerText;

// Store the webpage content in chrome.storage
chrome.storage.local.set({ webpageContent }, () => {
    console.log("Webpage content stored in chrome.storage");
});

