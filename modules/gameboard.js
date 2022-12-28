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
                const boxDisplay = document.createElement("div");

                const scoreEventListener = () => {
                    row[j] = this.currPlayer.symbol;
                    boxDisplay.classList.add("pretty-click")
                    boxDisplay.classList.remove("valid-hover")
                    boxDisplay.textContent = row[j];
                    boxDisplay.removeEventListener("click", scoreEventListener);
                }
                boxDisplay.addEventListener("click", scoreEventListener);

                const isValidHover = e => {
                    if (!boxDisplay.textContent) {
                        boxDisplay.classList.toggle("valid-hover");
                        return
                    }

                    boxDisplay.classList.remove("valid-hover");
                    if (e.type == "mouseenter")
                        boxDisplay.classList.add("invalid-hover")
                    else if (e.type == "mouseleave")
                        boxDisplay.classList.remove("invalid-hover")
                }
                boxDisplay.addEventListener("mouseenter", isValidHover);
                boxDisplay.addEventListener("mouseleave", isValidHover);

                boxDisplay.dataset.index = `${i}${j}`;

                this.gameBoardDisplay.append(boxDisplay);
            })
        })
    }

    getWinner() {
        const hasWon = (postions) => {
            let delay = 200;
            for (const box of this.gameBoardDisplay.childNodes) {
                if (postions.includes(box.dataset.index)) {
                    setTimeout(() => box.classList.add("winning-boxes"), delay);
                    delay *= 2;
                }
                else box.classList.add("losing-boxes");
                box.classList.add("game-over");
            }
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
            hasWon(['20', '11', '02'])
            return this.gameboard[2][0];
        }

        return null;
    }

    async play() {
        const waitForClick = () => new Promise(resolve => {
            const scoreClickEvent = e => {
                resolve("A valid box was clicked");
                e.target.removeEventListener("click", scoreClickEvent);
            }

            for (const box of this.gameBoardDisplay.childNodes)
                if (!box.textContent)
                    box.addEventListener("click", scoreClickEvent);
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

