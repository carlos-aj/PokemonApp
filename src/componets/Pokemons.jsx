import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Pokemons.css';
import Header from "../componets/Header";

function Pokemons() {
  const [counts, setCounts] = useState([]);
  const [url, setUrl] = useState('https://pokeapi.co/api/v2/pokemon?limit=16');
  const navigate = useNavigate(); 

  useEffect(() => {
    pokeLoad();
  }, []);

  function pokeLoad() {
    fetch(url)
      .then((response) => response.json())
      .then(async (APIinfo) => {
        const pokemonData = await Promise.all(
          APIinfo.results.map(async (pokemons) => {
            const res = await fetch(pokemons.url);
            const pokemon = await res.json();
            return {
              ...pokemons,
              image: pokemon.sprites.other.dream_world.front_default,
              name: pokemon.name,
              id: pokemon.id
            };
          })
        );

        setCounts((prevCounts) => [...prevCounts, ...pokemonData]);
        setUrl(APIinfo.next);
      });
  }

  function LoadMore() {
    pokeLoad();
  }

  return (
    <>
      <Header />
      <div id="poke-container">
        <div className="row">
          {counts.map((pokemon) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={pokemon.id}>
              <div className="poke-card" onClick={() => navigate(`/Attributes/${pokemon.id}`)}>
                <img src={pokemon.image} className="poke-img" alt={pokemon.name} />
                <div className="card-body">
                  <h5 className="poke-name">{pokemon.name}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-4">
        <button id="poke-load-more" onClick={LoadMore}>Cargar más</button>
      </div>
    </>
  );
}

export default Pokemons;