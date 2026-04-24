import React from "react";
import { useNavigate } from "react-router-dom";
import ProjectList from "../components/ProjectList";

function ProjectsPage({ onCreateProject, onProjectCreated }) {
  const navigate = useNavigate();

  const handleProjectSelect = (project) => {
    // Navigate to project detail page
    navigate(`/projects/${project._id}`);
  };

  return (
    <div className="py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <ProjectList 
          onProjectSelect={handleProjectSelect}
          onCreateProject={onCreateProject}
          onProjectCreated={onProjectCreated}
        />
      </div>
    </div>
  );
}

export default ProjectsPage;
