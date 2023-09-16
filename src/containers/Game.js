import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

import Button from '@material-ui/core/Button';
import LeftIcon from '@material-ui/icons/ArrowBack';
import RightIcon from '@material-ui/icons/ArrowForward';
import DownIcon from '@material-ui/icons/ArrowDownward';


import BlockColumn from './Column'
import { noOfColumn, numberOfRow, moveTime, windowWidth, checkWordTime } from '../config/config'
import { checkWord, sortWordQueue } from '../config/wordCheck';
import { scoreForThisWord } from '../config/SaveScore';
import { lettersAdjustedPerWeight } from '../config/GenerateLetter';
import GameOver from './GameOver';

const flagIcon = <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" style={{ fill: 'aqua' }}>
    <path d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm300-440Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z"/>
    </svg>

const restartIcon = <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" style={{ fill: 'aqua' }}>
    <path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/>
    </svg>

const timerIcon  = <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" style={{ fill: 'aqua' }}>
    <path d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z"/>
    </svg>
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor:'#02051E',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    scoreLine: {
        display: 'flex',
        flexDirection: 'row',
        borderBottom: '4px solid aqua', 
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#02051E',
        color: 'aqua',
        fontFamily: "'Roboto', sans-serif",
        fontSize: "1.0rem",
        fontWeight: 600,
        "@media (max-width: 700px)": {
            width: windowWidth()
        },
        "@media (min-width: 700px)": {
            height: 50
        },
    },
    gameContainer: {
        backgroundColor: '#020626',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    score: {
        margin: 5,
        paddin: 5
    },
    controlContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTop: '4px solid aqua',
        backgroundColor:'#02051E',
        padding: 0
    },
    sectionStyles : {
        flex: 1, // Each section takes an equal share of the available space
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    buttons: {
        border: '1px solid aqua',
        color: 'aqua',
        backgroundColor: 'black',
        width: 80,
        height: 40,
        margin: 5
    },
    destroyColor: {
        backgroundColor: "green"
    }
});

const GAMESTATE = {
    INITIAL: 'initial',
    IN_PROGRESS: "inProgress",
    PAUSED: 'paused',
    ENDED: 'ended',
}

const allletters = lettersAdjustedPerWeight();

class Game extends Component {
    nextLetter = undefined;
    letters = [];
    wordQueue = [];
    gameState = GAMESTATE.INITIAL;
    checkWordAutomatic;
    state = {
        updateFlag: false,
        score: 0,
        startTime: 0,
        addTime: 0,
    }

    componentDidMount() {
        window.addEventListener("keydown", this._onKeyPress);
    }

    _onKeyPress = (evt) => {
        if (evt.key === "a" || evt.keyCode === 37) {
            evt.preventDefault();
            //move left
            this._moveLeft()
        } else if (evt.key === "d" || evt.keyCode === 39) {
            evt.preventDefault();
            //move right
            this._moveRight()
        } else if (evt.key === "s" || evt.keyCode === 40) {
            evt.preventDefault();
            //move right
            this._moveDown()
        }
    }

    _moveLeft = () => {
        let updatedSomething = false
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i].moving) {
                if (this.letters[i].pos.x > 0 && !this._alreadyHasLetterInPos({ x: this.letters[i].pos.x - 1, y: this.letters[i].pos.y })) {
                    this.letters[i].pos.x = this.letters[i].pos.x - 1;
                }
                updatedSomething = true;
            }
        }
        if (updatedSomething) {
            this.setState({ updateFlag: !this.state.updateFlag })
        }
    }

    _moveRight = () => {
        let updatedSomething = false
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i].moving) {
                if (this.letters[i].pos.x < noOfColumn - 1 && !this._alreadyHasLetterInPos({ x: this.letters[i].pos.x + 1, y: this.letters[i].pos.y })) {
                    this.letters[i].pos.x = this.letters[i].pos.x + 1;
                }
                updatedSomething = true;
            }
        }
        if (updatedSomething) {
            this.setState({ updateFlag: !this.state.updateFlag })
        }
    }

    _moveDown = () => {
        let updatedSomething = false
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i].moving) {
                const alreadyHas = this._alreadyHasLetterInPos({ x: this.letters[i].pos.x, y: this.letters[i].pos.y + 1 });
                if (this.letters[i].pos.y < numberOfRow - 1 && !alreadyHas) {
                    this.letters[i].pos.y = this.letters[i].pos.y + 1;
                }

                if (this.letters[i].pos.y === numberOfRow - 1 || alreadyHas) {
                    this.letters[i].moving = false;
                }
                updatedSomething = true;
            }
        }
        if (updatedSomething) {
            this.setState({ updateFlag: !this.state.updateFlag })
        }
    }


    _startGame = () => {
        if (this.gameState !== GAMESTATE.PAUSED)
            this.setState({ score: 0 , addTime: 0})
        this.setState({startTime:new Date().getTime()})
        this.gameState = GAMESTATE.IN_PROGRESS;
        if (this.letters.length === 0) {
            this.generateLetter();
        }
        setTimeout(this.startMoving, moveTime);
    }

    _pauseGame = () => {
        this.gameState = GAMESTATE.PAUSED;
        const elapsedTime = new Date().getTime() - this.state.startTime;
        this.setState((prevState) => ({
            addTime: prevState.addTime + elapsedTime
        }));
        clearInterval(this.gameInterval);
        this.setState({ updateFlag: !this.state.updateFlag });
    }

    _restartGame = () => {
        this.letters = [];
        clearInterval(this.gameInterval)
        this.gameState = GAMESTATE.ENDED;
        this.setState({ updateFlag: !this.state.updateFlag })
        this._startGame();
    }

    startMoving = () => {
        clearInterval(this.gameInterval)
        this.gameInterval = setInterval(this.moveLetters, moveTime);
    }

    _alreadyHasLetterInPos = (pos) => {
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i].pos.x === pos.x && this.letters[i].pos.y === pos.y) {
                return true;
            }
        }
        return false;
    }

    moveLetters = () => {
        let updatedSomething = false
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i].pos.y < numberOfRow - 1 && this.letters[i].moving) {
                const alreadyHas = this._alreadyHasLetterInPos({ x: this.letters[i].pos.x, y: this.letters[i].pos.y + 1 })
                if (!alreadyHas)
                    this.letters[i].pos.y = this.letters[i].pos.y + 1;
                if (this.letters[i].pos.y === numberOfRow - 1 || alreadyHas) {
                    this.letters[i].moving = false;
                }
                if (this.letters[i].pos.y === 0) {
                    // so basically one column is full Game over
                    this.letters = [];
                    clearInterval(this.gameInterval)
                    this.gameState = GAMESTATE.ENDED;
                    this.setState({ updateFlag: !this.state.updateFlag })
                }
                updatedSomething = true;
            }
        }
        if (updatedSomething) {
            //console.log(this.state.letters, " vs ", updated)
            this.setState({ updateFlag: !this.state.updateFlag })
        } else {
            // this._checkPossibleWords();
            this.generateLetter();
        }
    }

    _getNewLetter = () => {
        let _newLetter;
        if (this.nextLetter) {
            _newLetter = this.nextLetter;
            this.nextLetter = allletters[Math.floor(Math.random() * allletters.length)];
        } else {
            _newLetter = allletters[Math.floor(Math.random() * allletters.length)];
            this.nextLetter = allletters[Math.floor(Math.random() * allletters.length)];
        }
        return _newLetter;
    }
    _dummyFunc = () =>
    {
        
    }
    _formatTime(milliseconds) {
        const minutes = Math.floor(milliseconds / 60000); // 1 minute = 60,000 milliseconds
        const seconds = Math.floor((milliseconds % 60000) / 1000); // 1 second = 1,000 milliseconds
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    generateLetter = () => {
        const letter = this._getNewLetter();
        const columnno = Math.floor(Math.random() * noOfColumn);
        const newLetter = {
            letter: letter,
            moving: true,
            isWord: false,
            pos: {
                x: columnno,
                y: 0
            }
        }
        this.letters = [...this.letters, newLetter]
        this.setState({ updateFlag: !this.state.updateFlag })
    }

    _getLetterAtPos = (pos) => {
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i].pos.x === pos.x && this.letters[i].pos.y === pos.y) {
                return this.letters[i]
            }
        }

        return undefined;
    }

    _checkPossibleWords = () => {
        //not implemented poperly so not using
        this.letters.forEach((_letter, index) => {
            let possibleWord = _letter.letter;
            let letterEnvolved = [_letter]

            //check on y
            for (let i = _letter.pos.y - 1; i > 0; i--) {
                let posToCheck = { x: _letter.pos.x, y: i }
                let letterAtThisPos = this._getLetterAtPos(posToCheck)
                if (letterAtThisPos) {
                    possibleWord = possibleWord + letterAtThisPos.letter
                    letterEnvolved.push(letterAtThisPos)
                } else {
                    i = 0;
                }
            }
            if (checkWord(possibleWord.toLowerCase())) letterEnvolved.forEach(_letter => _letter.isWord = true)

            // check on x

        })
    }

    _getLetterForThisColumn = (column) => {
        const _letterInColumn = []
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i].pos.x === column)
                _letterInColumn.push(this.letters[i])
        }
        return _letterInColumn
    }

    _getColumn = () => {
        let columns = []
        for (let i = 0; i < noOfColumn; i++) {
            const letter = this._getLetterForThisColumn(i)
            columns.push(<BlockColumn key={`column${i}`} columnId={i} letters={letter} onLetterClick={this._onLetterClick} />)
        }

        return columns;
    }

    _onLetterClick = (letter) => {

        // Find the letter object with the specified position
const foundLetter = this.letters.find((_l) => _l && _l.pos.x === letter.pos.x && _l.pos.y === letter.pos.y);

if (foundLetter) {
  foundLetter.isWord = !foundLetter.isWord;

  if (foundLetter.isWord) {
    this.wordQueue.push(letter);
  } else {
    // Remove from wordQueue
    const indexToRemove = this.wordQueue.findIndex((_l) => _l && _l.pos.x === letter.pos.x && _l.pos.y === letter.pos.y);
    if (indexToRemove !== -1) {
      this.wordQueue.splice(indexToRemove, 1);
    }
  }
}
        this.setState({ updateFlag: !this.state.updateFlag })
        //check word automatically 
        clearTimeout(this.checkWordAutomatic)
        this.checkWordAutomatic = setTimeout(this._checkWordAndDestroy, checkWordTime)
    }

    _checkWordAndDestroy = () => {
        if (this.wordQueue.length > 0) {
            this.wordQueue = sortWordQueue(this.wordQueue);
            //check its proper selected // in sequence
            // row check 
            let wordIsInRow = true;
            let wordIsInColumn = true;
            if (this.wordQueue.length > 1) {
                for (let i = 0; i < this.wordQueue.length - 1; i++) {
                    if (Math.abs(this.wordQueue[i].pos.x - this.wordQueue[i + 1].pos.x) !== 1) {
                        wordIsInRow = false;
                    }
                }
            }

            if (!wordIsInRow) {
                // if not in row then only we will check for column
                for (let i = 0; i < this.wordQueue.length - 1; i++) {
                    if (Math.abs(this.wordQueue[i].pos.y - this.wordQueue[i + 1].pos.y) !== 1) {
                        wordIsInColumn = false;
                    }
                }
            }

            if (wordIsInRow || wordIsInColumn) {
                let word = "";
                this.wordQueue.forEach(_w => word = word + _w.letter);
                if (checkWord(word.toLowerCase())) {
                    this._foundValidWord(word, wordIsInRow, wordIsInColumn);
                } else if (checkWord(word.toLowerCase().split("").reverse().join(""))) {
                    // check reverse word as well
                    this._foundValidWord(word, wordIsInRow, wordIsInColumn);
                }
            }
            this.wordQueue = [];
            this.letters.forEach(_l => _l.isWord = false);
            this.setState({ updateFlag: !this.state.updateFlag })
        }
    }

    _foundValidWord = (word, wordIsInRow, wordIsInColumn) => {
        // valid word
        this.letters = this.letters.filter(_letter => {
            const _letterInWordQueue = this.wordQueue.find(_wl => (_wl.pos.x === _letter.pos.x && _wl.pos.y === _letter.pos.y))
            if (_letterInWordQueue) return false;
            return true
        })
        const newScore = this.state.score + scoreForThisWord(word.length);

        //fill empty space left by destroyed letters
        if (wordIsInRow) {
            this.wordQueue.forEach(_wq => {
                this.letters.forEach(_l => {
                    if (_l.pos.x === _wq.pos.x && _l.pos.y < _wq.pos.y) {
                        _l.pos.y = _l.pos.y + 1;
                    }
                })
            })
        } else if (wordIsInColumn) {
            this.letters.forEach(_l => {
                if (_l.pos.x === this.wordQueue[0].pos.x && _l.pos.y < this.wordQueue[0].pos.y) {
                    _l.pos.y = _l.pos.y + this.wordQueue.length
                }
            })
        }


        this.setState({ updateFlag: !this.state.updateFlag, score: newScore })
    }

    render() {
        return (
            <div className={css(styles.container)} >
                <div className={css(styles.scoreLine)}>
                    <div className={css(styles.score)}> {`USERFACET`} </div>
                    {this.nextLetter && <div className={css(styles.score)}> {`Next : ${this.nextLetter.toUpperCase()}`} </div>}
                    <div className={css(styles.score)}> {flagIcon}{` Score : ${this.state.score}`} </div>
                </div>
                {this.gameState !== GAMESTATE.ENDED &&
                    <div className={css(styles.gameContainer)}>
                        {this._getColumn()}
                    </div>
                }
                {this.gameState === GAMESTATE.ENDED &&
                    <GameOver score={this.state.score} />
                }
                <div className={css(styles.controlContainer)}>
                    <div className={css(styles.sectionStyles)}>
                    {(this.gameState === GAMESTATE.IN_PROGRESS || this.gameState === GAMESTATE.PAUSED) &&
                        <Button variant="contained" size="small" color="secondary" className={css(styles.buttons)} onClick={this._restartGame}> {restartIcon}</Button>}
                    </div>
                    <div className={css(styles.sectionStyles)}>
                    {this.gameState !== GAMESTATE.IN_PROGRESS &&
                        <Button variant="contained" size="small" color="secondary" className={css(styles.buttons)} onClick={this._startGame}> {this.letters.length > 0 ? "Resume" : "Start"}</Button>}
                    {this.gameState !== GAMESTATE.PAUSED && this.gameState === GAMESTATE.IN_PROGRESS &&
                        <Button variant="contained" size="small" color="secondary" className={css(styles.buttons)} onClick={this._pauseGame}> Pause</Button>}
                    {this.wordQueue.length > 0 &&
                        <Button variant="contained" size="small" color="primary" className={css([styles.buttons, styles.destroyColor])} onClick={this._checkWordAndDestroy}> Destroy</Button>}
                    {this.gameState !== GAMESTATE.PAUSED && this.gameState === GAMESTATE.IN_PROGRESS &&
                        <Button variant="contained" size="small" color="primary" className={css(styles.buttons)} onClick={this._moveLeft}><LeftIcon /></Button>}
                    {this.gameState !== GAMESTATE.PAUSED && this.gameState === GAMESTATE.IN_PROGRESS &&
                        <Button variant="contained" size="small" color="primary" className={css(styles.buttons)} onClick={this._moveDown}><DownIcon /></Button>}
                    {this.gameState !== GAMESTATE.PAUSED && this.gameState === GAMESTATE.IN_PROGRESS &&
                        <Button variant="contained" size="small" color="primary" className={css(styles.buttons)} onClick={this._moveRight}><RightIcon /></Button>}
                    </div>
                    <div className={css(styles.sectionStyles)}>
                    {this.gameState === GAMESTATE.IN_PROGRESS &&
                    <Button variant="contained" size="small" color="primary" className={css(styles.buttons)} onClick={this._dummyFunc}>
                        {timerIcon}
                        {' '}
                        {this._formatTime(new Date().getTime() - this.state.startTime + this.state.addTime)}
                    </Button>
                    }
                    {this.gameState === GAMESTATE.PAUSED &&
                    <Button variant="contained" size="small" color="primary" className={css(styles.buttons)} onClick={this._dummyFunc}>
                        {timerIcon}
                        {' '}
                        {this._formatTime(this.state.addTime)}
                    </Button>
                    }
                    </div>
                </div>
            </div>
        );
    }
}


export default Game