document.addEventListener("DOMContentLoaded", () => {
    const boxes = document.querySelectorAll(".box");
    const playerScoreElement = document.getElementById("player_score");
    const computerScoreElement = document.getElementById("computer_score");
    const drawsScoreElement = document.getElementById("draws_score");
    const gameSettingsModal = document.getElementById("gameSettingsModal");
    const startGameButton = document.getElementById("startGameButton");
    const resetGameButton = document.getElementById("resetGameButton");
    const playerSymbolSelect = document.getElementById("playerSymbol");
    const gameDifficultySelect = document.getElementById("gameDifficulty");

    const placeSymbolSound = document.getElementById("placeSymbolSound");
    const winSound = document.getElementById("winSound");
    const loseSound = document.getElementById("loseSound");
    const drawSound = document.getElementById("drawSound");
    const backgroundMusic = document.getElementById("backgroundMusic");

    let playerScore = 0;
    let computerScore = 0;
    let drawsScore = 0;
    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let playerSymbol = "X";
    let computerSymbol = "O";
    let gameDifficulty = "easy";
    let isGameActive = true;

    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i < 8; i++) {
            const winCondition = winConditions[i];
            let a = board[winCondition[0]];
            let b = board[winCondition[1]];
            let c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            announce(currentPlayer === playerSymbol ? "PLAYER_WON" : "COMPUTER_WON");
            isGameActive = false;
            return;
        }

        if (!board.includes("")) {
            announce("DRAW");
        }
    }

    const announce = (type) => {
        switch(type) {
            case "PLAYER_WON":
                playerScore++;
                playerScoreElement.textContent = `Player: ${playerScore}`;
                winSound.play();
                break;
            case "COMPUTER_WON":
                computerScore++;
                computerScoreElement.textContent = `Computer: ${computerScore}`;
                loseSound.play();
                break;
            case "DRAW":
                drawsScore++;
                drawsScoreElement.textContent = `Draws: ${drawsScore}`;
                drawSound.play();
        }
        setTimeout(resetGame, 1000); // Delay reset to see the winning move
    };

    const isValidAction = (box) => {
        return box.innerText === "" && isGameActive;
    };

    const updateBoard = (index) => {
        board[index] = currentPlayer;
    };

    const changePlayer = () => {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    };

    const userAction = (box, index) => {
        if (isValidAction(box)) {
            box.innerText = currentPlayer;
            box.classList.add(`player${currentPlayer}`);
            placeSymbolSound.play();
            updateBoard(index);
            handleResultValidation();
            changePlayer();
            if (isGameActive && currentPlayer === computerSymbol) {
                setTimeout(computerAction, 500); // Delay computer move for better UI/UX
            }
        }
    };

    const computerAction = () => {
        let availableBoxes = [];
        boxes.forEach((box, index) => {
            if (isValidAction(box)) {
                availableBoxes.push(index);
            }
        });

        if (gameDifficulty === "easy") {
            if (availableBoxes.length > 0) {
                const randomIndex = availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
                const selectedBox = boxes[randomIndex];
                userAction(selectedBox, randomIndex);
            }
        } else {
            // Implement hard difficulty logic here (e.g., blocking player moves or winning moves)
            // For simplicity, let's use the same logic as easy difficulty here.
            if (availableBoxes.length > 0) {
                const randomIndex = availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
                const selectedBox = boxes[randomIndex];
                userAction(selectedBox, randomIndex);
            }
        }
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
        boxes.forEach(box => {
            box.innerText = "";
            box.classList.remove("playerX");
            box.classList.remove("playerO");
        });
        isGameActive = true;
        currentPlayer = playerSymbol;
    };

    const resetGame = () => {
        resetBoard();
        gameSettingsModal.style.display = "flex";
    };

    const startGame = () => {
        playerSymbol = playerSymbolSelect.value;
        computerSymbol = playerSymbol === "X" ? "O" : "X";
        gameDifficulty = gameDifficultySelect.value;
        currentPlayer = playerSymbol;
        gameSettingsModal.style.display = "none";
        isGameActive = true;
        backgroundMusic.play();
    };

    boxes.forEach((box, index) => {
        box.addEventListener("click", () => userAction(box, index));
    });

    startGameButton.addEventListener("click", startGame);
    resetGameButton.addEventListener("click", resetGame);

    gameSettingsModal.style.display = "flex";
});
