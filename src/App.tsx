import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CardList } from "./pages/CardList";
import { CardDetail } from "./pages/CardDetail";
import { Portfolio } from "./pages/Portfolio";
import { Leaderboard } from "./pages/Leaderboard";
import { NewspaperPage } from "./pages/NewspaperPage";
import { UserProvider, useUser } from "./context/UserContext";
import { ToastProvider } from "./context/ToastContext";
import { ToastContainer } from "./components/ToastContainer";
import { TraderOnboarding } from "./components/TraderOnboarding";
import { NavBar } from "./components/NavBar";
import { PixelSpinner } from "./components/PixelSpinner";

function AppRoutes() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PixelSpinner label="loading..." />
      </div>
    );
  }
  if (!user) {
    return <TraderOnboarding />;
  }

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<CardList />} />
        <Route path="/cards/:cardId" element={<CardDetail />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/newspaper" element={<NewspaperPage />} />
      </Routes>
    </>
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