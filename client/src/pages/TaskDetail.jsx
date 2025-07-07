import clsx from "clsx";
import moment from "moment";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { FaBug, FaSpinner, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
  MdTaskAlt,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button, Loading, Tabs } from "../components";
import { TaskColor } from "../components/tasks";
import {
  useChangeSubTaskStatusMutation,
  useGetSingleTaskQuery,
  usePostTaskActivityMutation,
} from "../redux/slices/api/taskApiSlice";
import {
  PRIOTITYSTYELS,
  TASK_TYPE,
  getCompletedSubTasks,
  getInitials,
} from "../utils";

const assets = [
  "https://images.pexels.com/photos/2418664/pexels-photo-2418664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/8797307/pexels-photo-8797307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/2534523/pexels-photo-2534523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/804049/pexels-photo-804049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor = {
  high: "bg-red-200",
  medium: "bg-yellow-200",
  low: "bg-blue-200",
};

const TABS = [
  { title: "Task Detail", icon: <FaTasks /> },
  { title: "Activities/Timeline", icon: <RxActivityLog /> },
];

const TASKTYPEICON = {
  commented: (
    <div className='w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white'>
      <MdOutlineMessage />,
    </div>
  ),
  started: (
    <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white'>
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className='w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white'>
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className='text-red-600'>
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className='w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white'>
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  "in progress": (
    <div className='w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white'>
      <GrInProgress size={16} />
    </div>
  ),
};

const act_types = [
  "Started",
  "Completed",
  "In Progress",
  "Commented",
  "Bug",
  "Assigned",
];

const Activities = ({ activity, id, refetch, task }) => {
  const [selected, setSelected] = useState("Started");
  const [text, setText] = useState("");
  const [showMention, setShowMention] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionList, setMentionList] = useState([]);
  const textareaRef = useRef(null);

  // Memoize teamMembers to avoid infinite loop
  const teamMembers = useMemo(() => {
    return task?.team || [];
  }, [task]);

  useEffect(() => {
    if (mentionQuery.length > 0) {
      setMentionList(
        teamMembers.filter((member) =>
          (member?.name || member?.username || "")
            .toLowerCase()
            .includes(mentionQuery.toLowerCase())
        )
      );
    } else {
      setMentionList(teamMembers);
    }
  }, [mentionQuery, teamMembers]);

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    setText(value);
    // Detect @ and show mention dropdown
    const cursorPos = e.target.selectionStart;
    const lastAt = value.lastIndexOf("@", cursorPos - 1);
    if (lastAt !== -1) {
      const afterAt = value.slice(lastAt + 1, cursorPos);
      if (/^[\w]*$/.test(afterAt)) {
        setMentionQuery(afterAt);
        setShowMention(true);
        return;
      }
    }
    setShowMention(false);
    setMentionQuery("");
  };

  const handleMentionClick = (member) => {
    if (!textareaRef.current) return;
    const cursorPos = textareaRef.current.selectionStart;
    const value = text;
    const lastAt = value.lastIndexOf("@", cursorPos - 1);
    if (lastAt !== -1) {
      const before = value.slice(0, lastAt + 1);
      const after = value.slice(cursorPos);
      const newText = before + (member.name || member.username) + " " + after;
      setText(newText);
      setShowMention(false);
      setMentionQuery("");
      setTimeout(() => {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = before.length + (member.name || member.username).length + 1;
        textareaRef.current.focus();
      }, 0);
    }
  };

  const highlightMentions = (text) => {
    return text.replace(/@(\w+)/g, '<span class="text-blue-600 font-semibold">@$1</span>');
  };

  const [postActivity, { isLoading }] = usePostTaskActivityMutation();

  const handleSubmit = async () => {
    if (!selected || !text.trim()) {
      toast.error("Please select a type and enter activity details.");
      return;
    }
    try {
      const data = {
        type: selected?.toLowerCase(),
        activity: text,
      };
      const res = await postActivity({
        data,
        id,
      }).unwrap();
      setText("");
      toast.success(res?.message);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Failed to post activity.");
    }
  };

  const Card = ({ item }) => {
    return (
      <div className="flex space-x-4 mb-8">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full">
            <span className="text-xl text-gray-500">{TASKTYPEICON[item?.type] || <FaUser />}</span>
          </div>
          <div className="h-full flex items-center">
            <div className="w-0.5 bg-gray-300 h-full"></div>
          </div>
        </div>
        <div className="flex flex-col gap-y-1">
          <p className="font-semibold">{item?.by?.name || item?.by?.username}</p>
          <div className="text-gray-500 space-x-2">
            <span className="capitalize">{item?.type}</span>
            <span className="text-sm">{moment(item?.date).fromNow()}</span>
          </div>
          <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: highlightMentions(item?.activity || "") }} />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Timeline/Activities List */}
      <div className="flex-1">
        <h2 className="font-semibold text-lg mb-4">Activities</h2>
        {activity?.length ? activity.map((item, idx) => (
          <Card key={item._id || idx} item={item} />
        )) : (
          <div className="text-gray-400">No activities yet.</div>
        )}
      </div>
      {/* Add Activity Form */}
      <div className="w-full md:w-1/3">
        <h2 className="font-semibold text-lg mb-4">Add Activity</h2>
        <div className="mb-2 flex flex-wrap gap-2">
          {act_types.map((type) => (
            <label key={type} className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selected === type}
                onChange={() => setSelected(type)}
                className="accent-blue-600"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextareaChange}
            rows={5}
            className="w-full border border-gray-300 rounded p-2 focus:outline-blue-400 resize-none"
            placeholder="Type ......"
          />
          {/* Mention dropdown */}
          {showMention && mentionList.length > 0 && (
            <div className="absolute z-10 left-0 top-full mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-40 overflow-y-auto">
              {mentionList.map((member) => (
                <div
                  key={member._id || member.id || member.name}
                  className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => handleMentionClick(member)}
                >
                  @{member.name || member.username}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

const TaskDetail = () => {
  const { id } = useParams();
  const { data, isLoading, refetch } = useGetSingleTaskQuery(id);
  const [subTaskAction, { isLoading: isSubmitting }] =
    useChangeSubTaskStatusMutation();

  const [selected, setSelected] = useState(0);
  const task = data?.task || [];

  const handleSubmitAction = async (el) => {
    try {
      const data = {
        id: el.id,
        subId: el.subId,
        status: !el.status,
      };
      const res = await subTaskAction({
        ...data,
      }).unwrap();

      toast.success(res?.message);
      refetch();
    } catch (err) {

      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading)
    <div className='py-10'>
      <Loading />
    </div>;

  const percentageCompleted =
    task?.subTasks?.length === 0
      ? 0
      : (getCompletedSubTasks(task?.subTasks) / task?.subTasks?.length) * 100;

  return (
    <div className='w-full flex flex-col gap-3 mb-4 overflow-y-hidden'>
      {/* task detail */}
      <h1 className='text-2xl text-gray-600 font-bold'>{task?.title}</h1>
      <Tabs tabs={TABS} setSelected={setSelected}>
        {selected === 0 ? (
          <>
            {/* Task detail card */}
            <div className='w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow rounded-md px-8 py-8 overflow-y-auto'>
              <div className='w-full md:w-1/2 space-y-8'>
                <div className='flex items-center gap-5'>
                  <div
                    className={clsx(
                      "flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full",
                      PRIOTITYSTYELS[task?.priority],
                      bgColor[task?.priority]
                    )}
                  >
                    <span className='text-lg'>{ICONS[task?.priority]}</span>
                    <span className='uppercase'>{task?.priority} Priority</span>
                  </div>

                  <div className={clsx("flex items-center gap-2")}>
                    <TaskColor className={TASK_TYPE[task?.stage]} />
                    <span className='text-black uppercase'>{task?.stage}</span>
                  </div>
                </div>

                <p className='text-gray-500'>
                  Created At: {new Date(task?.date).toDateString()}
                </p>

                <div className='flex items-center gap-8 p-4 border-y border-gray-200'>
                  <div className='space-x-2'>
                    <span className='font-semibold'>Assets :</span>
                    <span>{task?.assets?.length}</span>
                  </div>
                  <span className='text-gray-400'>|</span>
                  <div className='space-x-2'>
                    <span className='font-semibold'>Sub-Task :</span>
                    <span>{task?.subTasks?.length}</span>
                  </div>
                </div>

                <div className='space-y-4 py-6'>
                  <p className='text-gray-500 font-semibold text-sm'>
                    TASK TEAM
                  </p>
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {Array.isArray(task?.team) && task.team.length > 0 ? (
                      task.team.map((member) => (
                        <span
                          key={member._id || member.id || member.name}
                          className='inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium'
                        >
                          {member.name || member.username || member.email || 'Unnamed'}
                        </span>
                      ))
                    ) : (
                      <span className='text-gray-400'>No team members assigned.</span>
                    )}
                  </div>
                </div>
                {task?.subTasks?.length > 0 && (
                  <div className='space-y-4 py-6'>
                    <div className='flex items-center gap-5'>
                      <p className='text-gray-500 font-semibold text-sm'>
                        SUB-TASKS
                      </p>
                      <div
                        className={`w-fit h-8 px-2 rounded-full flex items-center justify-center text-white ${
                          percentageCompleted < 50
                            ? "bg-rose-600"
                            : percentageCompleted < 80
                            ? "bg-amber-600"
                            : "bg-emerald-600"
                        }`}
                      >
                        <p>{percentageCompleted.toFixed(2)}%</p>
                      </div>
                    </div>
                    <div className='space-y-8'>
                      {task?.subTasks?.map((el, index) => (
                        <div key={index + el?._id} className='flex gap-3'>
                          <div className='w-10 h-10 flex items-center justify-center rounded-full bg-violet-200'>
                            <MdTaskAlt className='text-violet-600' size={26} />
                          </div>

                          <div className='space-y-1'>
                            <div className='flex gap-2 items-center'>
                              <span className='text-sm text-gray-500'>
                                {new Date(el?.date).toDateString()}
                              </span>

                              <span className='px-2 py-0.5 text-center text-sm rounded-full bg-violet-100 text-violet-700 font-semibold lowercase'>
                                {el?.tag}
                              </span>

                              <span
                                className={`px-2 py-0.5 text-center text-sm rounded-full font-semibold ${
                                  el?.isCompleted
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-amber-50 text-amber-600"
                                }`}
                              >
                                {el?.isCompleted ? "done" : "in progress"}
                              </span>
                            </div>
                            <p className='text-gray-700 pb-2'>{el?.title}</p>

                            <>
                              <button
                                disabled={isSubmitting}
                                className={`text-sm outline-none bg-gray-100 text-gray-800 p-1 rounded ${
                                  el?.isCompleted
                                    ? "hover:bg-rose-100 hover:text-rose-800"
                                    : "hover:bg-emerald-100 hover:text-emerald-800"
                                } disabled:cursor-not-allowed`}
                                onClick={() =>
                                  handleSubmitAction({
                                    status: el?.isCompleted,
                                    id: task?._id,
                                    subId: el?._id,
                                  })
                                }
                              >
                                {isSubmitting ? (
                                  <FaSpinner className='animate-spin' />
                                ) : el?.isCompleted ? (
                                  " Mark as Undone"
                                ) : (
                                  " Mark as Done"
                                )}
                              </button>
                            </>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className='w-full md:w-1/2 space-y-3'>
                {task?.description && (
                  <div className='mb-10'>
                    <p className='text-lg font-semibold'>TASK DESCRIPTION</p>
                    <div className='w-full'>{task?.description}</div>
                  </div>
                )}

                {task?.assets?.length > 0 && (
                  <div className='pb-10'>
                    <p className='text-lg font-semibold'>ASSETS</p>
                    <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {task?.assets?.map((el, index) => (
                        <img
                          key={index}
                          src={el}
                          alt={index}
                          className='w-full rounded h-auto md:h-44 2xl:h-52 cursor-pointer transition-all duration-700 md:hover:scale-125 hover:z-50'
                        />
                      ))}
                    </div>
                  </div>
                )}

                {task?.links?.length > 0 && (
                  <div className=''>
                    <p className='text-lg font-semibold'>SUPPORT LINKS</p>
                    <div className='w-full flex flex-col gap-4'>
                      {task?.links?.map((el, index) => (
                        <a
                          key={index}
                          href={el}
                          target='_blank'
                          className='text-blue-600 hover:underline'
                        >
                          {el}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <Activities activity={task?.activities} id={id} refetch={refetch} task={task} />
        )}
      </Tabs>
    </div>
  );
};

export default TaskDetail;
