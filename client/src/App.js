import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import Navbar from "./Components/Navbar/Navbar";
import Axios from "axios";
import Spinner from "./Spinner.svg";
import "./App.css";

function App() {
  const [userCode, setUserCode] = useState(``);

  const [userLang, setUserLang] = useState("c");

  const [userTheme, setUserTheme] = useState("vs-dark");

  const [fontSize, setFontSize] = useState(20);

  const [userInput, setUserInput] = useState("");

  const [userOutput, setUserOutput] = useState("");

  const [loading, setLoading] = useState(false);

  const options = {
    fontSize: fontSize,
  };

  const handleClick = async () => {
    setLoading(true);
    if (userCode === ``) {
      return;
    }
    console.log(userCode);

    const payload = {
      language: "c",
      code: userCode,
    };

    if (!userCode) {
      console.error("Empty code body");
      return; // or handle the error in an appropriate way
    }

    try {
      const { data } = await Axios.post("http://localhost:3000/run", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(data);
      setUserOutput(data.output);
      console.log(userOutput);
      setLoading(false);
    } catch (error) {
      console.log(error.response.status); // 400
      console.log(error.response.data); // { message: 'Bad request' }
    }
    // const output = await Axios.post("http://localhost:3000/run", payload)
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .then(() => {
    //     setLoading(false);
    //   });
    // console.log(output);

    // Axios.post(`http://localhost:3000/run`, {
    //   code: userCode,
    //   language: userLang,
    //   input: userInput,
    // })
    //   .then((res) => {
    //     setUserOutput(res.data.output);
    //     console.log(userOutput);
    //   })
    //   .then(() => {
    //     setLoading(false);
    //   });
  };

  function clearOutput() {
    setUserOutput("");
  }

  return (
    <div className="App">
      <Navbar
        userLang={userLang}
        setUserLang={setUserLang}
        userTheme={userTheme}
        setUserTheme={setUserTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />
      <div className="main">
        <div className="left-container">
          <Editor
            options={options}
            height="calc(100vh - 50px)"
            width="100%"
            theme={userTheme}
            language={userLang}
            defaultLanguage="c"
            defaultValue="#Enter your code here"
            onChange={(value) => {
              setUserCode(value);
            }}
          />
          <button className="run-btn" onClick={handleClick}>
            Run
          </button>
        </div>
        <div className="right-container">
          <h3>Input:</h3>
          <div className="input-box">
            <textarea
              id="code-inp"
              onChange={(e) => setUserInput(e.target.value)}
            ></textarea>
          </div>
          <h3>Output:</h3>
          {loading ? (
            <div className="spinner-box">
              <img src={Spinner} alt="Loading..." />
            </div>
          ) : (
            <div className="output-box">
              <pre>{userOutput}</pre>
              <button
                onClick={() => {
                  clearOutput();
                }}
                className="clear-btn"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
