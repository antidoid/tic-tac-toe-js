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
    }

    render() {
        const gameBoardDisplay = document.querySelector(".gameboard");

        this.gameboard.forEach(row => {
            row.forEach((_, i) => {
                const scoreDisplay = document.createElement("div");

                const scoreEventListener = () => {
                    row[i] = this.currPlayer.symbol;
                    scoreDisplay.classList.add("pretty-click")
                    scoreDisplay.classList.remove("valid-hover")
                    scoreDisplay.textContent = row[i];
                    scoreDisplay.removeEventListener("click", scoreEventListener);
                }
                scoreDisplay.addEventListener("click", scoreEventListener);

                const isValidHover = e => {
                    if (scoreDisplay.textContent) {
                        scoreDisplay.classList.remove("valid-hover");
                        if (e.type == "mouseenter")
                            scoreDisplay.classList.add("invalid-hover")
                        else if (e.type == "mouseleave")
                            scoreDisplay.classList.remove("invalid-hover")
                    }
                    else
                        scoreDisplay.classList.toggle("valid-hover");
                }
                scoreDisplay.addEventListener("mouseenter", isValidHover);
                scoreDisplay.addEventListener("mouseleave", isValidHover);

                gameBoardDisplay.append(scoreDisplay);
            })
        })
    }

    getWinner() {
        for (let i = 0; i < 3; i++) {
            if ((this.gameboard[i][0] === this.gameboard[i][1]) && 
                (this.gameboard[i][1] === this.gameboard[i][2]) && 
                (this.gameboard[i][0] === "X" ||this.gameboard[i][0] === "O")
            ) return this.gameboard[i][0];

            if ((this.gameboard[0][i] === this.gameboard[1][i]) &&
                (this.gameboard[1][i] === this.gameboard[2][i]) &&
                (this.gameboard[0][i] === "X" || this.gameboard[0][i] === "O")
            ) return this.gameboard[0][i];
        }

        if ((this.gameboard[0][0] === this.gameboard[1][1]) && 
            (this.gameboard[1][1] === this.gameboard[2][2]) &&
            (this.gameboard[0][0] === "X" || this.gameboard[0][0] === "O")
        ) return this.gameboard[0][0];
        
        if ((this.gameboard[2][0] === this.gameboard[1][1]) && 
            (this.gameboard[1][1] === this.gameboard[0][2]) &&
            (this.gameboard[2][0] === "X" || this.gameboard[2][0] === "O")
        ) return this.gameboard[2][0];

        return null;

    }

    async play() {
        const gameboard = document.querySelector(".gameboard");
        const waitForClick = () => new Promise(resolve => {
            const scoreClickEvent = () => resolve("A valid box was clicked");
            gameboard.childNodes.forEach(score => {
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

