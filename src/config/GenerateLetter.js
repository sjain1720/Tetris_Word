// form Wiki => An analysis of entries in the Concise Oxford dictionary, ignoring frequency of word use, gives an order of 
const wordArray = ["We","design", "and", "develop", "applications","that","run","the","world","and","showcase","future"];

export const lettersAdjustedPerWeight = () => {
    // E appears most often in english dictionary, so will add e 26 times
    // A appears more often after e in english dictionary, so will add A 25 times
    // this way we will get good array of letters where probablity of finding most common letter will be higher.
    // let lettersArray = [];
    // Array.prototype.map.call(allletters, (_letter, index) => {
    //     for (var i = 0; i < allletters.length - index; i++) lettersArray.push(_letter);
    // });

    // return shuffle(lettersArray);
    let wordsArray = [];

  // Create an array of words weighted by their frequency
  wordArray.forEach((word, index) => {
    for (let i = 0; i < wordArray.length - index; i++) {
      wordsArray.push(word);
    }
  });

  return shuffle(wordsArray);
}


const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
}
