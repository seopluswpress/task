import React from 'react'

const TaskDetails = () => {
  // Assume task is fetched by ID; pseudo-code for brevity
  // const { task } = useSelector(state => state.tasks) or fetch by useEffect
  const task = {} // Replace with actual task fetching logic

  return (
    <div>
      <h2>Task Details</h2>
      <div><strong>Project:</strong> {task?.project?.name || task?.project || 'No Project'}</div>
      <div><strong>Start Date:</strong> {task?.startDate ? new Date(task.startDate).toLocaleDateString() : 'N/A'}</div>
      <div><strong>End Date:</strong> {task?.endDate ? new Date(task.endDate).toLocaleDateString() : 'N/A'}</div>
      {/* ...other details... */}
    </div>
  )
}

export default TaskDetails;