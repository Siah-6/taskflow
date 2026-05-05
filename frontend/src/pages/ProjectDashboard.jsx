import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

function ProjectDashboard({ selectedProject }) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalMembers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch projects
        const projectsResponse = await axiosInstance.get("/projects");
        
        // Fetch tasks
        const tasksResponse = await axiosInstance.get("/tasks");
        
        const projects = projectsResponse.data;
        const tasks = tasksResponse.data;
        
        // Calculate stats
        const completedTasks = tasks.filter(task => 
          task.status === "Completed" || task.status === "Done"
        ).length;
        
        // Count unique users across all projects
        const uniqueUserIds = new Set();
        
        projects.forEach(project => {
          // Add project owner
          if (project.owner?._id) {
            uniqueUserIds.add(project.owner._id.toString());
          }
          
          // Add collaborators
          if (project.collaboratorUsers && Array.isArray(project.collaboratorUsers)) {
            project.collaboratorUsers.forEach(collaborator => {
              if (collaborator._id) {
                uniqueUserIds.add(collaborator._id.toString());
              }
            });
          }
        });
        
        const totalMembers = uniqueUserIds.size;
        
        setStats({
          totalProjects: projects.length,
          totalTasks: tasks.length,
          completedTasks,
          totalMembers,
        });
        
        setProjects(projects);
        
        // Generate activity items from projects and tasks
        const activities = [];
        
        // Add project creation activities
        projects.forEach(project => {
          activities.push({
            type: 'project_created',
            message: `Created project "${project.name}"`,
            timestamp: new Date(project.createdAt),
            icon: '📁'
          });
        });
        
        // Add task activities
        tasks.forEach(task => {
          // Task creation
          activities.push({
            type: 'task_created',
            message: `Added task "${task.title}"`,
            timestamp: new Date(task.createdAt),
            icon: '📝'
          });
          
          // Task completion
          if (task.status === 'Completed' || task.status === 'Done') {
            activities.push({
              type: 'task_completed',
              message: `Completed task "${task.title}"`,
              timestamp: new Date(task.updatedAt || task.createdAt),
              icon: '✅'
            });
          }
          
          // Task updates (if updatedAt exists and is different from createdAt)
          if (task.updatedAt && task.updatedAt !== task.createdAt && task.status !== 'Completed' && task.status !== 'Done') {
            activities.push({
              type: 'task_updated',
              message: `Updated task "${task.title}"`,
              timestamp: new Date(task.updatedAt),
              icon: '🔄'
            });
          }
        });
        
        // Sort activities by timestamp (most recent first) and take top 5
        const sortedActivities = activities
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 5)
          .map(activity => ({
            ...activity,
            time: getRelativeTime(activity.timestamp)
          }));
        
        setRecentActivity(sortedActivities);
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Listen for project deletion and update events
    const handleProjectDeleted = () => {
      fetchDashboardData();
    };
    
    const handleProjectUpdated = () => {
      fetchDashboardData();
    };
    
    window.addEventListener('projectDeleted', handleProjectDeleted);
    window.addEventListener('projectUpdated', handleProjectUpdated);
    
    return () => {
      window.removeEventListener('projectDeleted', handleProjectDeleted);
      window.removeEventListener('projectUpdated', handleProjectUpdated);
    };
  }, []);

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  // Helper function to get relative time
  const getRelativeTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Project Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your projects and activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
                <button
                  onClick={() => navigate("/projects")}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/projects/${project._id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: project.boards?.[0]?.color || "#3B82F6" }}
                      >
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-600">
                          {(() => {
                            console.log('Project object in Dashboard:', project);
                            console.log('Project.collaborators:', project.collaborators);
                            console.log('Project.collaboratorUsers:', project.collaboratorUsers);
                            console.log('Project.members:', project.members);
                            console.log('Project.owner:', project.owner);
                            
                            // Count only valid collaborators (exclude invalid/null entries)
                            const collaboratorCount = Array.isArray(project.collaboratorUsers) 
                              ? project.collaboratorUsers.filter(user => 
                                  user && user._id && user.name && user.email
                                ).length 
                              : (Array.isArray(project.collaborators) 
                                  ? project.collaborators.filter(email => 
                                      email && email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                                    ).length 
                                    : 0);
                            
                            const memberCount = 1 + collaboratorCount;
                            console.log('Final member count:', memberCount);
                            
                            return `${memberCount} ${memberCount === 1 ? 'member' : 'members'}`;
                          })()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        Updated {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {projects.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No projects yet</p>
                    <button
                      onClick={() => navigate("/projects")}
                      className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Create your first project
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity & Completion Rate */}
          <div className="space-y-6">
            {/* Completion Rate */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Completion Rate</h2>
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="36"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="36"
                      stroke="#10B981"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - completionRate / 100)}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute">
                    <span className="text-2xl font-bold text-gray-900">{completionRate}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {stats.completedTasks} of {stats.totalTasks} tasks completed
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="text-lg">{activity.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No recent activity yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDashboard;
