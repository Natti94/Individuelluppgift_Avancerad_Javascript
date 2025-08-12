import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "../src/components/auth/login";
import Logout from "../src/components/auth/logout";
import Chat from "./components/chat/chat";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
