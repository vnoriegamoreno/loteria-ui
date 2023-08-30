import { useState, useEffect } from "react";
import { getLoteriaRand } from "utils/random";
import { loteriaMap } from "utils/loteria";
import Swal from "sweetalert2";

function App() {
  const [list, setList] = useState({});
  const [randomCard, setRandomCard] = useState(`00`);
  const [countdown, setCountdown] = useState(4);
  const [loadCard, setLoadCard] = useState(false);
  const [key, setKey] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/loteria")
      .then((r) => r.json())
      .then((response) => {
        if (response.success && response.data.length) {
          const storedList = response.data.reduce((l, c) => {
            l[c.name] = c.card;
            return l;
          }, {});
          setList(storedList);
        }
      })
      .catch((err) =>
        console.log("🚀 ~ file: App.js:18 ~ useEffect ~ err:", err)
      );
  }, []);

  useEffect(() => {
    if (countdown > 0 && loadCard) {
      setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && loadCard) {
      const cardNumber = getLoteriaRand();
      setRandomCard(cardNumber);
      setList({ ...list, [key]: loteriaMap[cardNumber] });
      setKey("");
    } else {
      setLoadCard(false);
    }
  }, [countdown, loadCard]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!list[key] && key.trim() !== "") {
      setLoadCard(true);
      setCountdown(4);
      setKey(key);
    } else if (key.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor ingrese el nombre del invitado!",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El invitado ya esta registrado!",
      });
    }
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

  return (
    <div className="App">
      <h1 className="Title">Loteria</h1>
      <div className="ImageContainer">
        {loadCard && countdown !== 0 && (
          <p className="CountDown">
            <span className="InnerCountDown">
              {countdown !== 0 && countdown !== 4 ? countdown : ""}
            </span>
          </p>
        )}
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
          name="name"
          onChange={(e) => setKey(e.target.value)}
          placeholder="Nombre participante"
          type="text"
          value={key}
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
