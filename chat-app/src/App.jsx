import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import Chat from "./components/chat/chat";
import "./App.css";

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
