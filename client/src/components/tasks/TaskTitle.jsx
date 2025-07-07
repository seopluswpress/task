import { MdOutlineAddTask, MdOutlinePendingActions, MdTaskAlt } from "react-icons/md";
import TaskColor from "./TaskColor";

const TaskTitle = ({ label, className, onClick }) => {
  return (
    <div className='w-full h-10 md:h-12 px-2 md:px-4 rounded bg-white dark:bg-[#1f1f1f] flex items-center justify-between'>
      <div className='flex gap-2 items-center'>
        <TaskColor className={className} />
        <p className='text-sm md:text-base text-gray-600 dark:text-white'>
          {label}
        </p>
      </div>

      <button
        onClick={onClick}
        className='hidden md:block focus:outline-none focus:ring-2 focus:ring-blue-400 rounded'
        aria-label={`Add task to ${label}`}
        tabIndex={0}
      >
        {label === 'To Do' && <MdOutlineAddTask className='text-lg text-black dark:text-white' />}
        {label === 'In Progress' && <MdOutlinePendingActions className='text-lg text-black dark:text-white' />}
        {label === 'Completed' && <MdTaskAlt className='text-lg text-black dark:text-white' />}
      </button>
    </div>
  );
};

export default TaskTitle;
