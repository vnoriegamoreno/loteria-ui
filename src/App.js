import { useState } from "react";
import { getLoteriaRand } from "utils/random";
import { loteriaMap } from "utils/loteria";

function App() {
  const [randomCard, setRandomCard] = useState(`00`);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    // TODO: store the name and the card
    const cartaLoteria = getLoteriaRand();
    setRandomCard(cartaLoteria);
    console.log(
      "🚀 ~ file: App.js:10 ~ onSubmitHandler ~ e:",
      e.target.name.value,
      loteriaMap[cartaLoteria]
    );
  };

  return (
    <div className="App">
      <h1 className="Title">Loteria</h1>
      <div className="ImageContainer">
        <img
          className="fullWidth"
          src={`/images/Cartas-${randomCard}.png`}
          alt="Carta de loteria"
        />
      </div>
      <form className="Form" onSubmit={onSubmitHandler}>
        <input
          className="InputField"
          placeholder="Nombre participante"
          name="name"
          type="text"
        />
        <input className="SubmitButton" type="submit" value="Generar" />
      </form>
    </div>
  );
}

export default App;
