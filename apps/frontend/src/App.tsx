import { useEffect, useState } from "react";
import "./App.css";

interface ApiResponse {
  status?: string;
  message?: string;
  timestamp?: string;
  env?: string;
}

function App() {
  const [health, setHealth] = useState<ApiResponse | null>(null);
  const [hello, setHello] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetch("/api/health"), fetch("/api/hello")])
      .then(async ([healthRes, helloRes]) => {
        if (!healthRes.ok || !helloRes.ok) throw new Error("API error");
        setHealth(await healthRes.json());
        setHello(await helloRes.json());
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="app">
      <h1>Live Code</h1>
      <p>React + Express + Railway</p>

      {error && <p className="error">Error: {error}</p>}

      {health && (
        <div className="card">
          <h2>Health</h2>
          <p>Status: {health.status}</p>
          <p>Time: {health.timestamp}</p>
        </div>
      )}

      {hello && (
        <div className="card">
          <h2>Hello</h2>
          <p>{hello.message}</p>
          <p>Env: {hello.env}</p>
        </div>
      )}
    </div>
  );
}

export default App;
