import Header from "./Header";
import Ranking from "./Ranking"; 
import { useState, useEffect } from "react";
import { db, auth } from "../firebase"; 
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import "../Game.css";

function Game() {
  const [pokemons, setPokemons] = useState([]);
  const [randomPokemon, setRandomPokemon] = useState(null);
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8000);
  const [timerRunning, setTimerRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const url = "https://pokeapi.co/api/v2/pokemon?limit=649";

  useEffect(() => {
    pokeLoad();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && timerRunning) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 10), 10);
      return () => clearTimeout(timer);
    } else if (timeLeft <= 0 && gameStarted) {
      setMessage("Time Out");
      setRevealed(true);
      setTimeout(() => {
        setMessage("");
        generateRandomPokemon();
      }, 1500);
    }
  }, [timeLeft, timerRunning, gameStarted]);

  function pokeLoad() {
    fetch(url)
      .then((response) => response.json())
      .then(async (APIinfo) => {
        const pokemonData = await Promise.all(
          APIinfo.results.map(async (pokemons) => {
            const res = await fetch(pokemons.url);
            const pokemon = await res.json();
            return {
              name: pokemon.name,
              image: pokemon.sprites.other.dream_world.front_default,
              id: pokemon.id,
            };
          })
        );
        setPokemons(pokemonData);
      });
  }

  function startPauseGame() {
    if (!gameStarted) {
      setGameStarted(true);
      generateRandomPokemon();
    } else {
      setTimerRunning(!timerRunning);
    }
  }

  function changeDifficulty(level) {
    setTimerRunning(false);
    setDifficulty(level);
    let newTime = level === "hard" ? 4000 : 8000;
    setTimeLeft(newTime);
    generateRandomPokemon(level);  
  }

  function generateRandomPokemon(level) {
    if (pokemons.length === 0) return;

    const correctPokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
    let choices = [correctPokemon];

    while (choices.length < 3) {
      let randomChoice = pokemons[Math.floor(Math.random() * pokemons.length)];
      if (!choices.includes(randomChoice)) {
        choices.push(randomChoice);
      }
    }

    setRevealed(false);
    setTimeout(() => { 
      setRandomPokemon(correctPokemon);
      setOptions(choices.sort(() => Math.random() - 0.5));
      let newTime = level === "hard" ? 4000 : 8000;
      setTimeLeft(newTime);
    }, 100);
  }

  async function updateUserScore(newPoints) {
    const user = auth.currentUser;
    if (!user) return;
  
    const userRef = doc(db, "Ranking", user.uid); 
    const userSnap = await getDoc(userRef);
  
    if (userSnap.exists()) {
      await updateDoc(userRef, {
        Points: userSnap.data().Points + newPoints
      });
    } else {
      await setDoc(userRef, {
        UserId: user.uid,
        userName: user.displayName || "Anon",
        Points: newPoints
      });
    }
  }
  
  

  function checkAnswer(name) {
    if (!timerRunning) return;
    setTimerRunning(false);

    if (name === randomPokemon.name) {
      const basePoints = difficulty === "easy" ? 10 : difficulty === "medium" ? 25 : 50;
      const bonusMultiplier = difficulty === "easy" ? 1 : difficulty === "medium" ? 1.5 : 2;
      const bonus = Math.floor((timeLeft / 100) * bonusMultiplier);

      const totalPoints = basePoints + bonus;
      setScore(score + totalPoints);
      updateUserScore(totalPoints); 

      setMessage(`+${totalPoints} points`);
      setRevealed(true);

      setTimeout(() => {
        setMessage("");
        generateRandomPokemon();
        setTimerRunning(true);
      }, 1500);
    } else {
      setMessage("Wrong");
      setRevealed(true);
      setTimeout(() => {
        setMessage("");
        generateRandomPokemon();
        setTimerRunning(true);
      }, 1500);
    }
  }

  return (
    <>
      <Header />
      <div className="game-container">
        <h2 className="score">Points: {score}</h2>
        <h2 className="timer">Time Left: {(timeLeft / 1000).toFixed(2)}s</h2>

        <div className="difficulty-buttons">
          <button onClick={() => changeDifficulty("easy")}>Easy</button>
          <button onClick={() => changeDifficulty("medium")}>Medium</button>
          <button onClick={() => changeDifficulty("hard")}>Hard</button>
        </div>

        <button className="start-button" onClick={startPauseGame}>
          {gameStarted ? (timerRunning ? "⏸ Pause" : "▶ Resume") : "▶ Start"}
        </button>

        {gameStarted && randomPokemon && (
          <div className="pokemon-container">
            <div className="pokemon-image-container">
            <img src={randomPokemon.image} alt="Pokémon" className={`pokemon-image ${revealed ? "revealed" : difficulty}`}/>
            </div>
            <div className="options-container">
              {options.map((poke) => (
                <button key={poke.id} className="option-button" onClick={() => checkAnswer(poke.name)}>
                  {poke.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {message && <p className="message">{message}</p>}

        <Ranking />
      </div>
    </>
  );
}

export default Game;
