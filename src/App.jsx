import Landing from "./componets/Landing";
import Game from "./componets/Game";
import Pokemons from "./componets/Pokemons";
import PrivateRoutes from "./componets/PrivateRoutes";
import Error404 from "./componets/Error404";
import Attributes from "./componets/Attributes";
import Login from "./componets/Login";
import Register from "./componets/Register";

import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        
        <Route element={<PrivateRoutes />}>
          <Route path="/Pokemons" element={<Pokemons />} />
          <Route path="/Game" element={<Game />} />
          <Route path="/Attributes/:id" element={<Attributes />} />
        </Route>

        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
