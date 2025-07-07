import React, { useEffect, useState } from "react";
import axios from "axios";
import BoardView from "../components/tasks/BoardView";
import Loading from "../components/Loading";

const ProjectTasks = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`/api/task?project=${projectId}`, { withCredentials: true });
        setTasks(res.data?.tasks || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [projectId]);

  if (loading) return <div className="py-8 text-center"><Loading /></div>;
  if (error) return <div className="py-8 text-red-500 text-center">{error}</div>;
  if (!tasks.length) return <div className="py-8 text-center text-gray-400">No tasks found for this project.</div>;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Project Tasks</h3>
      <BoardView tasks={tasks} />
    </div>
  );
};

export default ProjectTasks;
