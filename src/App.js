import { useState, useEffect } from "react";
import { getLoteriaRand } from "utils/random";
import { loteriaMap } from "utils/loteria";
import Swal from "sweetalert2";

const API_URL = `${
  process.env.REACT_APP_API_URL || "http://localhost:8080"
}/api/loteria`;

const LOTERIA_CHEAT = {
  "Vicente Noriega": "12",
  "Carolina Hernandez": "02",
  "Lupita Ocampo": "03",
  "Hector Hernandez": "16",
};

function App() {
  const [list, setList] = useState({});
  const [randomCard, setRandomCard] = useState(`00`);
  const [countdown, setCountdown] = useState(4);
  const [loadCard, setLoadCard] = useState(false);
  const [key, setKey] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then((response) => {
        if (response.success && response.data.length) {
          const storedList = response.data.reduce((l, c) => {
            l[c.name] = `${c.card}-${c.id}`;
            return l;
          }, {});
          setList(storedList);
        }
      })
      .catch((err) =>
        console.log(
          "🚀 ~ An error has been ocurred trying to retrieve a loteria list ERR: ",
          err
        )
      );
  }, []);

  useEffect(() => {
    if (countdown > 0 && loadCard) {
      setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && loadCard) {
      let cardNumber = getLoteriaRand();
      if (!Object.keys(LOTERIA_CHEAT).includes(key)) {
        while (Object.values(list).find((l) => l === loteriaMap[cardNumber])) {
          cardNumber = getLoteriaRand();
        }
      } else {
        cardNumber = LOTERIA_CHEAT[key];
      }
      setRandomCard(cardNumber);
      setList({ ...list, [key]: loteriaMap[cardNumber] });
      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: key, card: loteriaMap[cardNumber] }),
      })
        .then((data) =>
          console.log("🚀 ~ User has been assigned correctly to loteria", data)
        )
        .catch((err) =>
          console.log(
            "🚀 ~ An error has been ocurred trying to add a new user to loteria list ERR: ",
            err
          )
        );
      setKey("");
    } else {
      setLoadCard(false);
    }
  }, [countdown, loadCard]);

  useEffect(() => {
    const listArr = Object.values(list);
    const listValue = listArr[listArr.length - 1];
    if (listValue) {
      const cardName = listValue.split("-")[0];
      const cardNumber = Object.keys(loteriaMap).find(
        (key) => loteriaMap[key] === cardName && key
      );
      setRandomCard(cardNumber);
      setCountdown(0);
    } else {
      setRandomCard("00");
    }
  }, [list]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!list[key] && key.trim() !== "") {
      setLoadCard(true);
      setCountdown(4);
      setRandomCard("00");
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

  const deleteHandler = (key, id) => {
    console.log("🚀 ~ file: App.js:91 ~ deleteHandler ~ id:", id);
    const newList = Object.entries(list).reduce((newObj, current) => {
      if (current[0] !== key) {
        newObj[current[0]] = current[1];
      }
      return newObj;
    }, {});
    setList(newList);
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })
      .then((res) => console.log("🚀 ~ DELTE:", res))
      .catch((err) => console.log("🚀 ~ DELTE ERR:", err));
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
                  <td className="TableDate">{val[1].split("-")[0]}</td>
                  <td className="TableDate">
                    <button
                      className="DeleteButton"
                      onClick={() =>
                        deleteHandler(val[0], val[1].split("-")[1])
                      }
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
