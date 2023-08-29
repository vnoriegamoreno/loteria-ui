import { useState } from "react";
import { getLoteriaRand } from "utils/random";

function App() {
  const [name, setName] = useState("");
  const [randomCard, setRandomCard] = useState(`00`);

  const onSubmitHandler = () => {};

  return (
    <div className="App">
      <h1 className="Title">Loteria</h1>
      <div className="ImageContainer">
        <img className="fullWidth" src={`/images/Cartas-${randomCard}.png`} />
      </div>
      <form className="Form">
        <input
          className="InputField"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre participante"
        />
        <input className="SubmitButton" type="submit" value="Generar" />
      </form>
    </div>
  );
}

export default App;
