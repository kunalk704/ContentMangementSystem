import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import AuthProvider from "./context/AuthContext";
import ContentProvider from "./context/ContentContext";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AddContent from "./components/AddContent";
import EditContent from "./components/EditContent";
import ViewContent from "./components/ViewContent";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <Router>
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/add"
                  element={
                    <PrivateRoute>
                      <AddContent />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/edit/:id"
                  element={
                    <PrivateRoute>
                      <EditContent />
                    </PrivateRoute>
                  }
                />
                <Route path="/view" element={<ViewContent />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;
