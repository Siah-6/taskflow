import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Settings() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "",
    email: ""
  });
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch user data from backend on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await API.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setProfileData({
          name: response.data.name || "User",
          email: response.data.email || ""
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setMessage("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSaveProfile = async () => {
    if (!profileData.name.trim()) {
      setMessage("Name is required");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await API.put(
        "/api/auth/profile",
        { name: profileData.name },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update localStorage with new data
      localStorage.setItem("userName", response.data.name);
      
      setMessage("Profile updated successfully!");
      setProfileData(prev => ({
        ...prev,
        name: response.data.name
      }));
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        {/* Loading State */}
        {loading && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
            Loading profile data...
          </div>
        )}

        {/* Message Display */}
        {message && !loading && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes("success") 
              ? "bg-green-50 text-green-800 border border-green-200" 
              : "bg-red-50 text-red-800 border border-red-200"
          }`}>
            {message}
          </div>
        )}

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
          
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="w-full h-11 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="w-full h-11 px-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                placeholder="Enter your email"
                readOnly
              />
              <p className="mt-1 text-xs text-slate-500">
                Email cannot be changed
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSaveProfile}
                disabled={saving || loading}
                className="h-11 px-6 bg-[#6F00FF] hover:bg-[#5a00cc] text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Theme
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setTheme("light")}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    theme === "light"
                      ? "bg-[#6F00FF] text-white border-[#6F00FF]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    theme === "dark"
                      ? "bg-[#6F00FF] text-white border-[#6F00FF]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Dark
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Theme selection (functionality coming soon)
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Settings;
