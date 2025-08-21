import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Chat from "./components/Chat/Chat";
import "./App.css";

// HELT ENKELT NAVIGERING MED REACT ROUTER I HUVUDKOMPONENTEN
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
