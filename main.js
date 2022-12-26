import Player from "./modules/player.js"
import Game from "./modules/gameboard.js"

// 1. Take inputs from a form 
const inpP1 = document.getElementById("p1"); 
const inpP2 = document.getElementById("p2");

const startBtn = document.querySelector("button");
const p = document.createElement("p");

const beginGame = async () => {
    // 2. Remove the form with button and display the gameboard
    const player1 = Player(inpP1.value || "Player X", "✘");
    const player2 = Player(inpP2.value || "Player O", "𝓞");
    const game = new Game(player1, player2);

    const gameboard = document.querySelector(".gameboard");
    startBtn.classList.add("hide");
    p.classList.add("hide")
    gameboard.replaceChildren();
    game.render();

    // 3, play the game
    const winnerName = await game.play();
    if (winnerName) p.textContent = `Winner is ${winnerName}`;
    else {
        p.textContent = "It's a Draw";
        gameboard.childNodes.forEach(box => {
            box.classList.add("losing-boxes");
        })
    }

    // 4. Display the restart button and winner's name
    setTimeout(() => {
        p.classList.remove("hide")
        gameboard.after(p)
        startBtn.innerText = "Restart"
        startBtn.classList.remove("hide");
        }, 300)
}

startBtn.addEventListener("click", beginGame);
inpP2.addEventListener("keyup", evt => {
    if (evt.key === "Enter")
        startBtn.click();
})
