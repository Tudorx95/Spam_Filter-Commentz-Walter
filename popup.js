import british from "./hardcodes/british.js";
import arabic from "./hardcodes/arabic.js";
import chinese from "./hardcodes/chinese.js";
import french from "./hardcodes/french.js";
import german from "./hardcodes/german.js";
import indonesian from "./hardcodes/indonesian.js";
import italian from "./hardcodes/italian.js";
import spanish from "./hardcodes/spanish.js";


function search(text, patterns) {
    const failures = patterns.map(createFailureFunction);
    const results = {};

    patterns.forEach((pattern, index) => {
        results[pattern] = [];
        let i = 0;
        let j = 0;
        
        while (i < text.length) {
            if (text[i] === pattern[j]) {
                i++;
                j++;
            }
            if (j === pattern.length) {
                results[pattern].push(i - j);
                j = failures[index][j - 1];
            }
            if (i < text.length && text[i] !== pattern[j]) {
                if (j !== 0) {
                    j = failures[index][j - 1];
                } else {
                    i++;
                }
            }
        }
    });

    return results;
}

function createFailureFunction(pattern) {
    const failure = new Array(pattern.length).fill(0);
    let i = 0;
    let j = 1;

    while (j < pattern.length) {
        if (pattern[i] === pattern[j]) {
            failure[j] = i + 1;
            i++;
            j++;
        } else {
            if (i > 0) {
                i = failure[i - 1];
            } else {
                failure[j] = 0;
                j++;
            }
        }
    }

    return failure;
}


let matches=[];
let exists=0;
let distinctWords=[];
let wordCounts={};

const addWord=(pattern)=>{
	if (!distinctWords.includes(pattern)) {
        distinctWords.push(pattern);
        wordCounts[pattern] = 1;
        console.log(pattern);
    }
    else wordCounts[pattern]++;
}

const printWords = (text)=>{
    for (const pattern in matches) {
        matches[pattern].forEach(index => {
            if(text.slice(index, index + pattern.length) ===pattern)
            {
                //console.log(`Index: ${index}, Word: ${text.slice(index, index + pattern.length)}`);
                exists++;
                addWord(pattern);
            }
        });
    }
}

function preparation(text){
  const specialCharsRegex = /[^a-zA-ZÀ-ÖØ-öø-ÿĀ-ž]/g; ///[!@#$%^&*()_+{}[\]:;<>,.?/\\|~`'"-=©–]/g;
  const conseclines = /(?:\r+|\n+)/g;
  let allText=text;
  allText = allText.replace(specialCharsRegex,' ').replace(conseclines,' ').toString();
  let arr = allText.split(' ').filter(word=>word.length!==0).join(' ').toLowerCase();
  //arr=arr.replace(/\s/g,''); 
    let wordsArray=[...british,...french,...german,...indonesian,...italian,...spanish];

    wordsArray = wordsArray.map(word => word.replace(/\r/g, ''));
    wordsArray=wordsArray.map(word=>word.toLowerCase());
    const expressionRegex =  /[^\p{L}\p{N}_]+/u;

    wordsArray = wordsArray.filter(word => !expressionRegex.test(word));
    wordsArray=wordsArray.filter(word=>word!=="");
    
    if(wordsArray && wordsArray.length>0)
    {
	  const startTime=performance.now();
	  matches = search(arr,wordsArray);
	  const endTime=performance.now();
	  console.log(`Performance Time: ${endTime-startTime}`);
      printWords(arr);
    }
  };

  
  function calculateTotal(words){
    let i=0;
    words.forEach(pattern=>
        {
            if(wordCounts[pattern]>5)
                i++;
        }
    );
    return i;
  }

  
chrome.storage.local.get('webpageContent', (result) => {
    const content = result.webpageContent;
	if(content && content?.length>0)
        {
			preparation(content);
		}
	console.log("Append");
    const element=document.getElementById("bookmarks");
    const pTag=document.createElement('p');
    pTag.classList.add("title");
	pTag.innerText=`The webpage has ${distinctWords.length} distinct words from ${calculateTotal(distinctWords)} filtered`;
	
    element.appendChild(pTag);
})