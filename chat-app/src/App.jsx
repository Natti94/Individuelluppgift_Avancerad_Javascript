import Register from "./components/register/register";
import Login from "./components/login/login";
import { BrowserRouter } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Register />
        <Login />
      </div>
    </BrowserRouter>
  );
}

export default App;
