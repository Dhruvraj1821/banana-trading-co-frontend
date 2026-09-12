import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CardList } from "./pages/CardList";
import { CardDetail } from "./pages/CardDetail";
import { Portfolio } from "./pages/Portfolio";
import { UserProvider, useUser } from "./context/UserContext";
import { ToastProvider } from "./context/ToastContext";
import { ToastContainer } from "./components/ToastContainer";
import { TraderOnboarding } from "./components/TraderOnboarding";

function AppRoutes() {
  const { user, loading } = useUser();

  if (loading) {
    return <p className="font-data text-text-dim p-8">Loading...</p>;
  }
  if (!user) {
    return <TraderOnboarding />;
  }

  return (
    <Routes>
      <Route path="/" element={<CardList />} />
      <Route path="/cards/:cardId" element={<CardDetail />} />
      <Route path="/portfolio" element={<Portfolio />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <UserProvider>
          <AppRoutes />
        </UserProvider>
        <ToastContainer />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;