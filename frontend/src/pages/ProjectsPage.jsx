import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectList from "../components/ProjectList";

function ProjectsPage({ selectedProject }) {
  const navigate = useNavigate();
  const [localSelectedProject, setLocalSelectedProject] = useState(null);

  const handleProjectSelect = (project) => {
    setLocalSelectedProject(project);
    // Navigate to project detail page
    navigate(`/projects/${project._id}`);
  };

  return (
    <div className="py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <ProjectList onProjectSelect={handleProjectSelect} />
      </div>
    </div>
  );
}

export default ProjectsPage;
