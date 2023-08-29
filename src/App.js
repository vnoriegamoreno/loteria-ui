import { useState, useEffect } from "react";
import { getLoteriaRand } from "utils/random";
import { loteriaMap } from "utils/loteria";
import Swal from "sweetalert2";

function App() {
  const [list, setList] = useState({});
  const [randomCard, setRandomCard] = useState(`00`);
  const [countdown, setCountdown] = useState(4);
  const [loadCard, setLoadCard] = useState(false);

  useEffect(() => {
    if (countdown < 4 && loadCard) {
      setTimeout(() => {
        setCountdown(countdown + 1);
      }, 1000);
    } else {
      setCountdown(0);
      setLoadCard(false);
    }
  }, [countdown, loadCard]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setLoadCard(true);
    // if (!list[e.target.name.value]) {
    //   Swal.fire(
    //     "Buen trabajo!",
    //     "El invitado se a agregado correctamente!",
    //     "success"
    //   );
    //   const card = getLoteriaRand();
    //   setRandomCard(card);
    //   setList({ ...list, [e.target.name.value]: loteriaMap[card] });
    //   e.target.name.value = "";
    // } else {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "El invitado ya esta registrado!",
    //   });
    // }
  };

  const deleteHandler = (key) => {
    const newList = Object.entries(list).reduce((newObj, current) => {
      if (current[0] !== key) {
        newObj[current[0]] = current[1];
      }
      return newObj;
    }, {});
    setList(newList);
  };

  // useEffect(() => {
  //   console.log("useEffect");
  //   const countdownID = setTimeout(() => {
  //     while (countdown <= 3) {
  //       setCountdown(countdown + 1);
  //     }
  //     console.log("🚀 ~ file: App.js:35 ~ countdownID ~ countdown:", countdown);
  //   }, 1000);
  //   return clearTimeout(countdownID);
  // }, [countdown]);

  return (
    <div className="App">
      <h1 className="Title">Loteria</h1>
      <div className="ImageContainer">
        <p className="CountDown">
          <span className="InnerCountDown">
            {countdown === 0 ? "" : countdown}
          </span>
        </p>
        {countdown === 0 && (
          <img
            className="fullWidth"
            src={`/images/Cartas-${randomCard}.png`}
            alt="Carta de loteria"
          />
        )}
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
      {Object.keys(list)?.length > 0 && (
        <div className="TableContainer">
          <h2 className="Subtitle">Lista de Invitados</h2>
          <table className="Table" border="1">
            <thead className="TableHead">
              <tr className="TableRow">
                <th className="TableBoldData">Nombre</th>
                <th className="TableBoldData">Carta</th>
                <th className="TableBoldData">Eliminar</th>
              </tr>
            </thead>
            <tbody className="TableBody">
              {Object.entries(list).map((val, i) => (
                <tr key={`id-${i}`} className="TableRow">
                  <td className="TableDate">{val[0]}</td>
                  <td className="TableDate">{val[1]}</td>
                  <td className="TableDate">
                    <button
                      className="DeleteButton"
                      onClick={() => deleteHandler(val[0])}
                    >
                      x
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
