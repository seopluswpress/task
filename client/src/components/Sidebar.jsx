import clsx from "clsx";
import React from "react";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
  MdFolderSpecial,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

const linkData = [
  {
    label: "Dashboard",
    link: "dashboard",
    icon: <MdDashboard />,
  },
  {
    label: "Projects",
    link: "projects",
    icon: <MdFolderSpecial />,
  },
  {
    label: "Tasks",
    link: "tasks",
    icon: <FaTasks />,
  },
  {
    label: "Completed",
    link: "completed/completed",
    icon: <MdTaskAlt />,
  },
  {
    label: "In Progress",
    link: "in-progress/in progress",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "To Do",
    link: "todo/todo",
    icon: <MdOutlineAddTask />,
  },
  {
    label: "Team",
    link: "team",
    icon: <FaUsers />,
  },
  {
    label: "Status",
    link: "status",
    icon: <IoCheckmarkDoneOutline />,
  },
  {
    label: "Trash",
    link: "trashed",
    icon: <FaTrashAlt />,
  },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const NavLink = ({ el }) => {
    return (
      <Link
        onClick={closeSidebar}
        to={el.link}
        className={clsx(
          "flex gap-2 px-4 py-2 rounded-xl items-center text-gray-800 dark:text-gray-200 text-base font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-400 shadow-sm",
          path === el.link.split("/")[0]
            ? "bg-gradient-to-r from-blue-500/80 to-cyan-400/60 text-white shadow-lg"
            : "hover:bg-blue-100/40 hover:text-blue-700 focus:bg-blue-200/40",
        )}
        style={{fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif'}}
      >
        <span className="text-xl">{el.icon}</span>
        <span>{el.label}</span>
      </Link>
    );
  };

  return (
    <div className='w-full h-full flex flex-col gap-6 p-5 backdrop-blur-xl bg-white/40 border border-blue-200/60 shadow-xl rounded-2xl relative overflow-hidden md:max-w-xs' style={{fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif'}}>
      <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{background: 'linear-gradient(120deg, rgba(34,193,195,0.10) 0%, rgba(45,121,253,0.08) 100%)'}}></div>
      <h1 className='flex gap-2 items-center relative z-10'>
        <span className='bg-gradient-to-br from-blue-600 to-cyan-400 p-2 rounded-full shadow-md'>
          <MdOutlineAddTask className='text-white text-2xl font-black' />
        </span>
        <span className='text-2xl font-extrabold text-gray-900 dark:text-white tracking-wide' style={{letterSpacing: '0.04em'}}>Task Manager</span>
      </h1>

      <div className='flex-1 flex flex-col gap-y-3 py-8 relative z-10'>
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </div>

      <div className='relative z-10'>
        <Link to="/settings">
          <button className='w-full flex gap-2 p-2 items-center text-lg text-gray-800 dark:text-white rounded-xl hover:bg-blue-100/40 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all'>
            <MdSettings />
            <span>Settings</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
