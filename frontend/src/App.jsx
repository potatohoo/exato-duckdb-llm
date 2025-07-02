// App.jsx
import React, { useState } from "react";
import FileUpload from "./FileUpload";
import SQLQuery from "./SQLQuery";
import QueryResults from "./QueryResults";
import LLMChat from "./LLMChat";

const App = () => {
  const [queryResults, setQueryResults] = useState([]);
  const [queryExecuted, setQueryExecuted] = useState(false);
  const [llmMessages, setLlmMessages] = useState([]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #eff6ff, #c7d2fe)",
        padding: "1rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "0.5rem",
            }}
          >
            Data Analytics Platform
          </h1>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <FileUpload />
          <SQLQuery
            setQueryResults={setQueryResults}
            setQueryExecuted={setQueryExecuted}
          />
        </div>

        {queryExecuted && <QueryResults queryResults={queryResults} />}

        {/* <LLMChat llmMessages={llmMessages} setLlmMessages={setLlmMessages} /> */}
      </div>
    </div>
  );
};

export default App;
