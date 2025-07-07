import clsx from "clsx";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  BGS,
  PRIOTITYSTYELS,
  TASK_TYPE,
  formatDate,
} from "../../utils/index.js";
import UserInfo from "../UserInfo.jsx";
import { AddSubTask, TaskAssets, TaskColor, TaskDialog } from "./index";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className='w-full h-fit bg-white dark:bg-[#1f1f1f] shadow-md p-4 rounded relative z-0'>
        <div className='w-full flex justify-between'>
          <div
            className={clsx(
              "flex flex-1 gap-1 items-center text-sm font-medium",
              PRIOTITYSTYELS[task?.priority]
            )}
          >
            <span className='text-lg'>{ICONS[task?.priority]}</span>
            <span className='uppercase'>{task?.priority} Priority</span>
          </div>
          <div className="relative z-20">
            <TaskDialog task={task} />
          </div>
        </div>
        <>
          <Link to={`/task/${task._id}`}>
            <div className="flex items-center gap-2">
              <TaskColor className={TASK_TYPE[task.stage]} />
              <h3 className="text-xl font-black mb-1 text-blue-900 dark:text-white drop-shadow-sm leading-tight" style={{fontFamily: 'Times New Roman, Times, serif'}}>{task.title}</h3>
            </div>
          </Link>
          {/* Tags Display */}
          {Array.isArray(task?.tags) && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1 mt-1">
              {task.tags.map((tag, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">{tag}</span>
              ))}
            </div>
          )}

          <span className='text-xs text-blue-600 dark:text-blue-300 block mt-1'>
            {typeof task?.project === 'object' && task?.project?.name ? (
              <Link to={'/project/' + (task.project._id || task.project)} className="underline">
                {task.project.name}
              </Link>
            ) : 'No Project'}
          </span>
           {/* Main Task Timeline */}
           <div className="my-3">
             {task?.startDate && task?.endDate ? (
               <div className="w-full">
                  <div className="flex justify-between text-xs font-semibold text-blue-800 dark:text-blue-200 mb-1">
                    <span>Start: {new Date(task.startDate).toLocaleDateString()}</span>
                    <span>End: {new Date(task.endDate).toLocaleDateString()}</span>
                  </div>
                  {/* Progress Bar */}
                  {(() => {
                    const start = new Date(task.startDate).getTime();
                    const end = new Date(task.endDate).getTime();
                    const now = new Date().getTime(); // Use current time from system
                    const total = end - start;
                    const elapsed = Math.max(0, Math.min(now - start, total));
                    const percent = total > 0 ? (elapsed / total) * 100 : 0;
                    return (
                      <div className="w-full h-3 bg-gray-200 rounded-full mb-2 relative">
                        <div
                          className="h-3 bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-blue-900 font-bold select-none">
                          {Math.round(percent)}%
                        </span>
                      </div>
                    );
                  })()}

               </div>
             ) : (
               <span className='text-xs text-gray-500 dark:text-gray-200 block'>No Timeline</span>
             )}
           </div>

           {/* Subtasks Timeline */}
           {task?.subTasks?.length > 0 ? (
             <div className="mt-4">
               <div className="font-semibold text-xs text-blue-700 mb-2">Subtasks Timeline</div>
               <div className="relative pl-6">
                 {task.subTasks.map((sub, idx) => (
                   <div key={sub._id || idx} className="mb-4 flex items-start relative">
                     <div className="absolute left-0 top-1 w-3 h-3 bg-blue-400 rounded-full border-2 border-white"></div>
                     {idx < task.subTasks.length - 1 && (
                       <div className="absolute left-1.5 top-4 w-0.5 h-6 bg-blue-200 z-0"></div>
                     )}
                     <div className="ml-4">
                       <div className="text-xs font-bold text-gray-900 dark:text-white">{sub.title}</div>
                       <div className="text-xs text-gray-500">{sub.date ? new Date(sub.date).toLocaleDateString() : ''}</div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           ) : null}
          <span className='text-xs text-gray-500 dark:text-gray-200 block'>
            {task?.startDate && task?.endDate
              ? `${new Date(task.startDate).toLocaleDateString()} - ${new Date(task.endDate).toLocaleDateString()}`
              : 'No Timeline'}
          </span>
        </>

        <div className='w-full border-t border-gray-200 dark:border-gray-700 my-2' />
        <div className='flex items-center justify-between mb-2'>
          <TaskAssets
            activities={task?.activities?.length}
            subTasks={task?.subTasks}
            assets={task?.assets?.length}
          />

          <div className='flex flex-row-reverse'>
            {task?.team?.length > 0 &&
              task?.team?.map((m, index) => (
                <div
                  key={index}
                  className={clsx(
                    "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                    BGS[index % BGS?.length]
                  )}
                >
                  <UserInfo user={m} />
                </div>
              ))}
          </div>
        </div>

        {/* subtasks */}
        {task?.subTasks?.length > 0 ? (
          <div className='py-4 border-t border-gray-200 dark:border-gray-700'>
            <h5 className='text-base line-clamp-1 text-black dark:text-gray-400'>
              {task?.subTasks[0].title}
            </h5>

            <div className='p-4 space-x-8'>
              <span className='text-sm text-gray-600 dark:text-gray-500'>
                {formatDate(new Date(task?.subTasks[0]?.date))}
              </span>
              <span className='bg-blue-600/10 px-3 py-1 rounded-full text-blue-700 font-medium'>
                {task?.subTasks[0]?.tag}
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div className='py-4 border-t border-gray-200 dark:border-gray-700'>
              <div className="text-blue-900/80 mb-2 text-base font-medium tracking-wide" style={{fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif'}}>{task.description}</div>
            </div>
          </div>
        )}

        <div className='w-full pb-2'>
          <button
            disabled={user.isAdmin ? false : true}
            onClick={() => setOpen(true)}
            className='w-full flex gap-4 items-center text-sm text-gray-500 font-semibold disabled:cursor-not-allowed disabled:text-gray-300'
          >
            <IoMdAdd className='text-lg' />
            <span>ADD SUBTASK</span>
          </button>
        </div>
      </div>

      <AddSubTask open={open} setOpen={setOpen} id={task._id} />
    </>
  );
};

export default TaskCard;
