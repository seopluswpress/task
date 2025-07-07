import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ProjectTasks from "./ProjectTasks";

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`/api/project/${id}`, { withCredentials: true });
        setProject(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;
  if (!project) return null;
  if (redirect) {
    window.location.href = "/projects";
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <Link to="/projects" className="text-blue-600 hover:underline text-sm">← Back to Projects</Link>
      <div className="backdrop-blur-xl bg-white/30 border border-blue-200/60 shadow-xl rounded-2xl p-10 mt-6 relative glass-card-gradient font-sans antialiased">
        <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{background: 'linear-gradient(135deg, rgba(34,193,195,0.12) 0%, rgba(45,121,253,0.10) 100%)'}}></div>
        <h2 className="text-4xl font-black tracking-tight mb-2 text-blue-800 drop-shadow-sm leading-tight" style={{fontFamily: 'Times New Roman, Times, serif'}}> {project.name} </h2>
        <div className="text-blue-900/80 mb-4 text-lg font-semibold tracking-wide" style={{fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif'}}>{project.description || "No description provided."}</div>
        {project.team && project.team.length > 0 && (
          <div className="mb-4">
            <span className="font-semibold text-gray-700">Team:</span>
            <div className="flex mt-2 -space-x-2">
              {project.team.map((member, idx) => (
                <div key={member._id || idx} className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-700" title={member.name}>
                  {member.name?.[0]?.toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-8 flex gap-4">
          <button
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 hover:from-blue-500 hover:to-cyan-400 transition-all font-bold tracking-wide text-base" style={{fontFamily: 'Poppins, Inter, Roboto, sans-serif'}}
            onClick={() => setEditOpen(true)}
          >
            ✏️ Edit Project
          </button>
          <button
            className="bg-gradient-to-r from-pink-400 to-red-400 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 hover:from-red-500 hover:to-pink-500 transition-all font-bold tracking-wide text-base" style={{fontFamily: 'Poppins, Inter, Roboto, sans-serif'}}
            onClick={() => setDeleteOpen(true)}
          >
            🗑️ Delete Project
          </button>
        </div>
      </div>
      {/* Project Tasks Section */}
      <ProjectTasks projectId={project._id} />

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="backdrop-blur-xl bg-white/30 border border-blue-200/60 shadow-2xl rounded-2xl p-8 w-full max-w-md relative">
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{background: 'linear-gradient(135deg, rgba(34,193,195,0.20) 0%, rgba(45,121,253,0.15) 100%)'}}></div>
            <h3 className="text-lg font-bold mb-4">Edit Project</h3>
            <input
              className="w-full border px-3 py-2 rounded mb-3"
              placeholder="Name"
              value={editForm.name}
              onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
            />
            <textarea
              className="w-full border px-3 py-2 rounded mb-3"
              placeholder="Description"
              value={editForm.description}
              onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
            />
            {actionError && <div className="text-red-500 text-sm mb-2">{actionError}</div>}
            <div className="flex gap-2 justify-end">
              <button
                className="px-4 py-2 bg-gray-100 rounded"
                onClick={() => setEditOpen(false)}
                disabled={actionLoading}
              >Cancel</button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={async () => {
                  setActionLoading(true);
                  setActionError("");
                  try {
                    const res = await axios.patch(`/api/project/${id}`, editForm, { withCredentials: true });
                    setProject(res.data);
                    setEditOpen(false);
                  } catch (err) {
                    setActionError(err.response?.data?.message || "Failed to update project");
                  } finally {
                    setActionLoading(false);
                  }
                }}
                disabled={actionLoading}
              >{actionLoading ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="backdrop-blur-xl bg-white/30 border border-pink-200/60 shadow-2xl rounded-2xl p-8 w-full max-w-md relative">
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{background: 'linear-gradient(135deg, rgba(253,45,121,0.13) 0%, rgba(255,120,120,0.10) 100%)'}}></div>
            <h3 className="text-lg font-bold mb-4">Delete Project?</h3>
            <p className="mb-4">Are you sure you want to delete this project? This action cannot be undone.</p>
            {actionError && <div className="text-red-500 text-sm mb-2">{actionError}</div>}
            <div className="flex gap-2 justify-end">
              <button
                className="px-4 py-2 bg-gray-100 rounded"
                onClick={() => setDeleteOpen(false)}
                disabled={actionLoading}
              >Cancel</button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={async () => {
                  setActionLoading(true);
                  setActionError("");
                  try {
                    await axios.delete(`/api/project/${id}`, { withCredentials: true });
                    setRedirect(true);
                  } catch (err) {
                    setActionError(err.response?.data?.message || "Failed to delete project");
                  } finally {
                    setActionLoading(false);
                  }
                }}
                disabled={actionLoading}
              >{actionLoading ? "Deleting..." : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
