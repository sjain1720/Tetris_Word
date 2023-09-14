const words=["We design and develop applications","that run the world and","showcase the future"];

export const checkWord = (_wordToCheck) => words.indexOf(_wordToCheck) > -1;

export const sortWordQueue = (wordQueue) => {
    wordQueue.sort((a, b) => b.pos.x - a.pos.x);
    wordQueue.sort((a, b) => b.pos.y - a.pos.y);
    return wordQueue;
}

export const sortLetters = (letters) => {
    letters.sort((a, b) => b.letter.pos.x - a.letter.pos.x);
    letters.sort((a, b) => b.letter.pos.y - a.letter.pos.y);
    return letters;
}