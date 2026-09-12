import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CardList } from "./pages/CardList";
import { CardDetail } from "./pages/CardDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CardList />} />
        <Route path="/cards/:cardId" element={<CardDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;