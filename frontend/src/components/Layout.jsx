import React, { useState } from "react";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  return (
    <div className="flex">
      <Sidebar selectedProject={selectedProject} onProjectSelect={handleProjectSelect} />
      <div className="flex-1 ml-64 bg-gray-50 min-h-screen">
        {React.cloneElement(children, { selectedProject })}
      </div>
    </div>
  );
}

export default Layout;
