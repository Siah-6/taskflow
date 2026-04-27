import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectDashboard from "./pages/ProjectDashboard";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={
          <Layout>
            <ProjectDashboard />
          </Layout>
        } />
        <Route path="/projects" element={
          <Layout>
            <ProjectsPage />
          </Layout>
        } />
        <Route path="/projects/:projectId" element={
          <Layout>
            <ProjectDetailPage />
          </Layout>
        } />
        <Route path="/" element={
          <Layout>
            <ProjectDashboard />
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
