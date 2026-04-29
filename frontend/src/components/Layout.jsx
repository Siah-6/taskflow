import React, { useState } from "react";
import Sidebar from "./Sidebar";
import CreateProject from "./CreateProject";
import Footer from "./Footer";

function Layout({ children }) {
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);

  const handleCreateProject = () => {
    setShowCreateProjectModal(true);
  };

  const handleCloseCreateProject = () => {
    setShowCreateProjectModal(false);
  };

  const handleProjectSuccess = (newProject) => {
    // Refresh projects by calling the child's refresh method if available
    // This will be handled by the ProjectsPage component
    setShowCreateProjectModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <Sidebar onCreateProject={handleCreateProject} />
        <div className="flex-1 ml-64 bg-gray-50">
          {children}
        </div>
      </div>
      
      <Footer />
      
      {/* Create Project Modal */}
      {showCreateProjectModal && (
        <CreateProject
          onClose={handleCloseCreateProject}
          onSuccess={handleProjectSuccess}
        />
      )}
    </div>
  );
}

export default Layout;
