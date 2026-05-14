import React, { useState } from "react";
import Sidebar from "./Sidebar";
import CreateProject from "./CreateProject";
import Footer from "./Footer";
import { Menu } from "lucide-react";

function Layout({ children }) {
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  const handleMobileSidebarToggle = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const handleMobileSidebarClose = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img 
            src="/taskflow.png"
            alt="TaskFlow"
            className="w-6 h-6 object-contain"
          />
          <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
        </div>
        <button
          onClick={handleMobileSidebarToggle}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex flex-1">
        <Sidebar 
          onCreateProject={handleCreateProject}
          isMobile={mobileSidebarOpen}
          onMobileClose={handleMobileSidebarClose}
        />
        <div className="flex-1 min-w-0 bg-gray-50 md:ml-64">
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
