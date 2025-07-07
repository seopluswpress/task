import clsx from "clsx";
import { useState } from "react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { toast } from "sonner";
import { useTrashTastMutation } from "../redux/slices/api/taskApiSlice.js";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../utils/index.js";

import { Button, ConfirmatioDialog, UserInfo } from "./index";
import { AddTask, TaskAssets, TaskColor } from "./tasks";
import { Link } from "react-router-dom";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = ({ tasks }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const [deleteTask] = useTrashTastMutation();

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClickHandler = (el) => {
    setSelected(el);
    setOpenEdit(true);
  };

  const deleteHandler = async () => {
    try {
      const res = await deleteTask({
        id: selected,
        isTrashed: "trash",
      }).unwrap();

      toast.success(res?.message);

      setTimeout(() => {
        setOpenDialog(false);
        window.location.reload();
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const TableHeader = () => (
    <thead className='w-full border-b border-gray-300 dark:border-gray-600'>
      <tr className='w-full text-black dark:text-white  text-left'>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2 line-clamp-1'>Created At</th>
        <th className='py-2'>Assets</th>
        <th className='py-2'>Team</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-300/10 md:table-row block md:rounded-none rounded-2xl bg-white/60 md:bg-transparent mb-4 md:mb-0 shadow-sm md:shadow-none' style={{fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif'}}>
      <td className='py-2 md:table-cell block px-4 pt-4 md:px-0 md:pt-0'>
        <span className='md:hidden font-semibold text-xs text-gray-500 block mb-1'>Task Title</span>
        <Link to={`/task/${task._id}`}>
          <div className='flex items-center gap-2'>
            <TaskColor className={TASK_TYPE[task.stage]} />
            <p className='w-full line-clamp-2 text-base text-black'>
              {task?.title}
            </p>
          </div>
        </Link>
      </td>
      <td className='py-2 md:table-cell block px-4'>
        <span className='md:hidden font-semibold text-xs text-gray-500 block mb-1'>Priority</span>
        <div className={"flex gap-1 items-center"}>
          <span className={clsx("text-lg", PRIOTITYSTYELS[task?.priority])}>
            {ICONS[task?.priority]}
          </span>
          <span className='capitalize line-clamp-1'>
            {task?.priority} Priority
          </span>
        </div>
      </td>
      <td className='py-2 md:table-cell block px-4'>
        <span className='md:hidden font-semibold text-xs text-gray-500 block mb-1'>Created At</span>
        <span className='text-sm text-gray-600'>
          {formatDate(new Date(task?.date))}
        </span>
      </td>
      <td className='py-2 md:table-cell block px-4'>
        <span className='md:hidden font-semibold text-xs text-gray-500 block mb-1'>Assets</span>
        <TaskAssets
          activities={task?.activities?.length}
          subTasks={task?.subTasks}
          assets={task?.assets?.length}
        />
      </td>
      <td className='py-2 md:table-cell block px-4'>
        <span className='md:hidden font-semibold text-xs text-gray-500 block mb-1'>Team</span>
        <div className='flex flex-wrap gap-1'>
          {task?.team?.map((m, index) => (
            <div
              key={m._id}
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                BGS[index % BGS?.length]
              )}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>
      <td className='py-2 flex gap-2 md:gap-4 justify-end md:table-cell block px-4 pb-4 md:pb-0'>
        <span className='md:hidden font-semibold text-xs text-gray-500 block mb-1'>Actions</span>
        <div className='flex gap-2'>
          <Button
            className='text-blue-600 hover:text-blue-500 px-3 py-2 rounded-lg bg-blue-50 md:bg-transparent text-xs md:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all'
            label='Edit'
            type='button'
            onClick={() => editClickHandler(task)}
          />
          <Button
            className='text-red-700 hover:text-red-500 px-3 py-2 rounded-lg bg-red-50 md:bg-transparent text-xs md:text-base focus:outline-none focus:ring-2 focus:ring-red-400 transition-all'
            label='Delete'
            type='button'
            onClick={() => deleteClicks(task._id)}
          />
        </div>
      </td>
    </tr>
  );

  return (
    <div className='bg-white  px-2 md:px-4 pt-4 pb-9 shadow-md rounded'>
      <div className='overflow-x-auto'>
        <div className='relative backdrop-blur-xl bg-white/40 border border-blue-200/60 shadow-xl rounded-2xl overflow-x-auto' style={{fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif'}}>
  <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{background: 'linear-gradient(120deg, rgba(34,193,195,0.10) 0%, rgba(45,121,253,0.08) 100%)'}}></div>
  <table className='w-full min-w-[600px] md:min-w-0 mb-0 relative z-10'>
    <TableHeader />
            <tbody>
              {tasks.map((task, index) => (
                <TableRow key={index} task={task} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={selected}
        key={new Date().getTime()}
      />
    </div>
  );
};

export default Table;