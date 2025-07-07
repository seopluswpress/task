import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { FaFolderPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useGetProjectsQuery, useCreateProjectMutation } from "../redux/slices/api/projectApiSlice";

import { Link } from "react-router-dom";

const Projects = () => {
  const { user } = useSelector((state) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const { data: projectsData, isLoading: loading, error } = useGetProjectsQuery();
  const [createProject, { isLoading: creating }] = useCreateProjectMutation();

  const projects = projectsData || [];

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createProject(form).unwrap();
      setForm({ name: "", description: "" });
      setShowForm(false);
    } catch (err) {
      // error will be handled by RTK Query error
    }
  };


  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      
      {/* Main Content */}
      <div className="flex-1 px-2 md:px-0">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold" style={{fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif'}}>Projects</h2>
        <button
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 hover:from-blue-500 hover:to-cyan-400 transition-all font-bold tracking-wide text-lg flex items-center gap-2" style={{fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif'}}
          onClick={() => setShowForm(true)}
        >
          <FaFolderPlus className="text-2xl" /> Add Project
        </button>
      </div>

      {/* Modal for creating a project */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">Create New Project</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create Project'}
              </button>
              {error && <div className="text-red-500 mt-2">{typeof error === 'string' ? error : error?.data?.message || 'Failed to load projects'}</div>}
            </form>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1,2,3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-32" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && projects.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          <div className="text-6xl mb-4">📁</div>
          <div className="text-lg">No projects found. Create your first project!</div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="relative backdrop-blur-xl bg-white/40 border border-blue-200/60 shadow-xl rounded-2xl p-6 flex flex-col transition hover:shadow-2xl hover:scale-[1.02] border-2 border-transparent hover:border-blue-400 overflow-hidden"
            style={{fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif'}}
          >
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{background: 'linear-gradient(120deg, rgba(34,193,195,0.10) 0%, rgba(45,121,253,0.08) 100%)'}}></div>
            <div className="flex-1 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <h3 className="text-lg font-semibold line-clamp-1 text-gray-900">{project.name}</h3>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2 mb-2">{project.description}</p>
            </div>

            {project.team && project.team.length > 0 && (
              <div className="flex items-center mt-2">
                <span className="text-xs text-gray-400 mr-2">Team:</span>
                <div className="flex -space-x-2">
                  {project.team.slice(0,4).map((member, idx) => (
                    <div key={member._id || idx} className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-700" title={member.name}>
                      {member.name?.[0]?.toUpperCase()}
                    </div>
                  ))}
                  {project.team.length > 4 && (
                    <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-700">
                      +{project.team.length-4}
                    </div>
                  )}
                </div>
              </div>
            )}
            <button
              className="mt-4 py-1 px-3 bg-blue-50 hover:bg-blue-100 rounded text-blue-700 text-xs font-semibold self-end transition"
              onClick={() => window.location.href = `/project/${project._id}`}
            >
              View Project
            </button>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default Projects;
