import Player from "./modules/player.js"
import Game from "./modules/gameboard.js"

// 1. Take inputs from a form 
const inpP1 = document.getElementById("p1"); 
const inpP2 = document.getElementById("p2");

const startBtn = document.querySelector("button");
const beginGame = async () => {
    // 2. Remove the form with button and display the gameboard
    const player1 = Player(inpP1.value || "Player X", "✘");
    const player2 = Player(inpP2.value || "Player O", "𝓞");
    const game = new Game(player1, player2);

    const gameboard = document.querySelector(".gameboard");
    startBtn.classList.add("hide");
    gameboard.replaceChildren();
    game.render();

    // 3, play the game
    const winnerName = await game.play();
    const p = document.createElement("p");
    if (winnerName) p.textContent = `Winner is ${winnerName}`;
    else p.textContent = "It's a Draw";

    // 4. Remove the gameboard then display the winner and restart button
    setTimeout(() => {
        gameboard.replaceChildren();
        gameboard.append(p);
        startBtn.innerText = "Restart"
        startBtn.classList.remove("hide");
    }, 300)
}

startBtn.addEventListener("click", beginGame);
inpP2.addEventListener("keyup", evt => {
    if (evt.key === "Enter")
        startBtn.click();
})
