import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectList from "../components/ProjectList";

function ProjectsPage() {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    // Navigate to project detail page
    navigate(`/projects/${project._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectList onProjectSelect={handleProjectSelect} />
      </div>
    </div>
  );
}

export default ProjectsPage;
