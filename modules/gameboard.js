export default class Game {
    constructor(player1, player2) {
        this.gameboard = [
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ];
        this.currPlayer = null;
        this.p1 = player1;
        this.p2 = player2;
        this.gameBoardDisplay = document.querySelector(".gameboard");
    }

    render() {
        document.querySelector('form').classList.add("remove");
        this.gameboard.forEach((row, i) => {
            row.forEach((_, j) => {
                const scoreDisplay = document.createElement("div");

                const scoreEventListener = () => {
                    row[j] = this.currPlayer.symbol;
                    scoreDisplay.classList.add("pretty-click")
                    scoreDisplay.classList.remove("valid-hover")
                    scoreDisplay.textContent = row[j];
                    scoreDisplay.removeEventListener("click", scoreEventListener);
                }
                scoreDisplay.addEventListener("click", scoreEventListener);

                const isValidHover = e => {
                    if (!scoreDisplay.textContent) {
                        scoreDisplay.classList.toggle("valid-hover");
                        return
                    }

                    scoreDisplay.classList.remove("valid-hover");
                    if (e.type == "mouseenter")
                        scoreDisplay.classList.add("invalid-hover")
                    else if (e.type == "mouseleave")
                        scoreDisplay.classList.remove("invalid-hover")
                }
                scoreDisplay.addEventListener("mouseenter", isValidHover);
                scoreDisplay.addEventListener("mouseleave", isValidHover);

                scoreDisplay.dataset.index = `${i}${j}`;

                this.gameBoardDisplay.append(scoreDisplay);
            })
        })
    }

    getWinner() {
        const hasWon = (postions) => {
            let delay = 200;
            this.gameBoardDisplay.childNodes.forEach(score => {
                if (postions.includes(score.dataset.index)) {
                    setTimeout(() => score.classList.add("winning-boxes"), delay);
                    delay *= 2;
                }
                else score.classList.add("losing-boxes");
                score.classList.add("game-over");
            })
        }

        for (let i = 0; i < 3; i++) {
            if ((this.gameboard[i][0]) &&
                (this.gameboard[i][0] === this.gameboard[i][1]) && 
                (this.gameboard[i][1] === this.gameboard[i][2]) 
            ) {
                hasWon([`${i}0`, `${i}1`, `${i}2`])
                return this.gameboard[i][0];
            }

            if ((this.gameboard[0][i]) &&
                (this.gameboard[0][i] === this.gameboard[1][i]) &&
                (this.gameboard[1][i] === this.gameboard[2][i])
            ) {
                hasWon([`0${i}`, `1${i}`, `2${i}`])
                return this.gameboard[0][i];
            }
        }

        if ((this.gameboard[0][0]) &&
            (this.gameboard[0][0] === this.gameboard[1][1]) && 
            (this.gameboard[1][1] === this.gameboard[2][2])
        ) {
            hasWon(['00', '11', '22']);
            return this.gameboard[0][0];
        }
        
        if ((this.gameboard[2][0]) &&
            (this.gameboard[2][0] === this.gameboard[1][1]) && 
            (this.gameboard[1][1] === this.gameboard[0][2])
        ) {
            hasWon(['02', '11', '20'])
            return this.gameboard[2][0];
        }

        return null;
    }

    async play() {
        const waitForClick = () => new Promise(resolve => {
            const scoreClickEvent = () => resolve("A valid box was clicked");
            this.gameBoardDisplay.childNodes.forEach(score => {
                score.removeEventListener("click", scoreClickEvent);
                if (!score.textContent)
                    score.addEventListener("click", scoreClickEvent);
            })
        })

        let winnerName;
        for (let i = 0; i < 9; i++) {
            this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;
            await waitForClick();

            const winner = this.getWinner();
            if (winner){
                winnerName = winner === this.p1.symbol ? 
                    this.p1.firstName : this.p2.firstName;
                break;
            }
        }
        return new Promise(resolve => resolve(winnerName));
    }
}

