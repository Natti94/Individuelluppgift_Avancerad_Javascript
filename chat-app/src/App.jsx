import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Logout from "./components/Auth/Logout";
import Chat from "./components/Chat/Chat";
import SideNav from "./components/SideNav/SideNav";
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
        <Route path="/sidenav" element={<SideNav to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
