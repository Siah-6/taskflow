import React, { useState } from "react";
import Sidebar from "./Sidebar";
import CreateProject from "./CreateProject";

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
    <div className="flex">
      <Sidebar onCreateProject={handleCreateProject} />
      <div className="flex-1 ml-64 bg-gray-50 min-h-screen">
        {React.cloneElement(children, { 
          onCreateProject: handleCreateProject,
          onProjectCreated: handleProjectSuccess
        })}
      </div>
      
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
