import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuth from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectDashboard from "./pages/ProjectDashboard";
import Settings from "./components/Settings";
import Layout from "./components/Layout";

function App() {
  const { authUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route 
          path="/login" 
          element={!authUser ? <LoginPage /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/signup" 
          element={!authUser ? <SignUpPage /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/dashboard" 
          element={authUser ? (
            <Layout>
              <ProjectDashboard />
            </Layout>
          ) : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/projects" 
          element={<Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/projects/:projectId" 
          element={authUser ? (
            <Layout>
              <ProjectDetailPage />
            </Layout>
          ) : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/settings" 
          element={authUser ? (
            <Layout>
              <Settings />
            </Layout>
          ) : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/" 
          element={authUser ? (
            <Layout>
              <ProjectDashboard />
            </Layout>
          ) : <Navigate to="/login" replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
