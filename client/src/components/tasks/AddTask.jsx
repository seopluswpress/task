import { Dialog } from "@headlessui/react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { BiImages } from "react-icons/bi";
import { toast } from "sonner";

import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import { dateFormatter } from "../../utils";
import { app } from "../../utils/firebase";
import Button from "../Button";
import axios from "axios";
import Loading from "../Loading";
import ModalWrapper from "../ModalWrapper";
import SelectList from "../SelectList";
import Textbox from "../Textbox";
import UserList from "./UsersSelect";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const uploadedFileURLs = [];

const uploadFile = async (file) => {
  const storage = getStorage(app);

  const name = new Date().getTime() + file.name;
  const storageRef = ref(storage, name);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log("Uploading");
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            uploadedFileURLs.push(downloadURL);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      }
    );
  });
};

const AddTask = ({ open, setOpen, task }) => {
  const { user } = useSelector((state) => state.auth);
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(task?.project || "");

  useEffect(() => {
    // Fetch all projects for the dropdown
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/api/project", { withCredentials: true });
        setProjects(res.data);
      } catch (err) {
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  const defaultValues = {
    title: task?.title || "",
    startDate: task?.startDate ? dateFormatter(task.startDate) : "",
    endDate: task?.endDate ? dateFormatter(task.endDate) : "",
    team: [],
    stage: "",
    priority: "",
    assets: [],
    description: "",
    links: "",
    tags: task?.tags || [],
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [team, setTeam] = useState(task?.team || []);
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || PRIORIRY[2]
  );
  const [assets, setAssets] = useState([]);
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo || user?._id);
  const [uploading, setUploading] = useState(false);
  const [tags, setTags] = useState(task?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [singleTag, setSingleTag] = useState("");

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const URLS = task?.assets ? [...task.assets] : [];

  const handleOnSubmit = async (data) => {
    for (const file of assets) {
      setUploading(true);
      try {
        await uploadFile(file);
      } catch (error) {
        console.error("Error uploading file:", error.message);
        return;
      } finally {
        setUploading(false);
      }
    }

    try {
      // Add singleTag to tags if not empty and not already present
      let tagsToSubmit = tags;
      if (singleTag && !tags.includes(singleTag)) {
        tagsToSubmit = [...tags, singleTag];
      }
      const newData = {
        ...data,
        startDate: data.startDate,
        endDate: data.endDate,
        assets: [...URLS, ...uploadedFileURLs],
        team,
        stage,
        priority,
        assignedTo,
        project,
        tags: tagsToSubmit,
      };
      // Remove 'date' if present
      if (newData.date) delete newData.date;

      console.log(data, newData);
      const res = task?._id
        ? await updateTask({ ...newData, _id: task._id }).unwrap()
        : await createTask(newData).unwrap();

      toast.success(res.message);

      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleSelect = (e) => {
    setAssets(e.target.files);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            {task ? "UPDATE TASK" : "ADD TASK"}
          </Dialog.Title>

          <div className='mt-2 flex flex-col gap-6'>
            {/* Single Tag Input Section (like SubTask) */}
            <div className='w-full'>
              <label className='block text-gray-700 text-sm font-bold mb-2'>Tag</label>
              <input
                type='text'
                value={singleTag}
                onChange={e => setSingleTag(e.target.value)}
                placeholder='Enter a tag'
                className='w-full rounded border border-gray-300 px-3 py-2 mb-1'
              />
            </div>

            <div>
              <label className='block text-gray-700 text-sm font-bold mb-2'>Project</label>
              <select
                className='w-full rounded border border-gray-300 px-3 py-2'
                value={project}
                onChange={e => setProject(e.target.value)}
              >
                <option value=''>-- Select Project --</option>
                {projects.map(proj => (
                  <option key={proj._id} value={proj._id}>{proj.name}</option>
                ))}
              </select>
            </div>

            <Textbox
              placeholder='Task title'
              type='text'
              name='title'
              label='Task Title'
              className='w-full rounded'
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />
            {user?.isAdmin ? (
              <UserList setTeam={(val) => {
                setTeam(val);
                setAssignedTo(val[0]?._id || "");
              }} team={team} />
            ) : null}
            {!user?.isAdmin ? (
              <div className='mb-2'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>Assign To:</label>
                <input type='text' value={user?.name} readOnly className='w-full rounded bg-gray-100 px-3 py-2' />
              </div>
            ) : null}
            <div className='flex gap-4'>
              <SelectList
                label='Task Stage'
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />
              <SelectList
                label='Priority Level'
                lists={PRIORIRY}
                selected={priority}
                setSelected={setPriority}
              />
            </div>
            <div className='flex gap-4'>
              <div className='w-full'>
                <Textbox
                  placeholder='Start Date'
                  type='date'
                  name='startDate'
                  label='Start Date'
                  className='w-full rounded'
                  register={register("startDate", {
                    required: "Start date is required!",
                  })}
                  error={errors.startDate ? errors.startDate.message : ""}
                />
              </div>
              <div className='w-full'>
                <Textbox
                  placeholder='End Date'
                  type='date'
                  name='endDate'
                  label='End Date'
                  className='w-full rounded'
                  register={register("endDate", {
                    required: "End date is required!",
                  })}
                  error={errors.endDate ? errors.endDate.message : ""}
                />
              </div>
              <div className='w-full flex items-center justify-center mt-4'>
                <label
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4'
                  htmlFor='imgUpload'
                >
                  <input
                    type='file'
                    className='hidden'
                    id='imgUpload'
                    onChange={(e) => handleSelect(e)}
                    accept='.jpg, .png, .jpeg'
                    multiple={true}
                  />
                  <BiImages />
                  <span>Add Assets</span>
                </label>
              </div>
            </div>

            <div className='w-full'>
              <p>Task Description</p>
              <textarea
                name='description'
                {...register("description")}
                className='w-full bg-transparent px-3 py-1.5 2xl:py-3 border border-gray-300
            dark:border-gray-600 placeholder-gray-300 dark:placeholder-gray-700
            text-gray-900 dark:text-white outline-none text-base focus:ring-2
            ring-blue-300'
              ></textarea>
            </div>

            <div className='w-full'>
              <p>
                Add Links{" "}
                <span className='text- text-gray-600'>
                  seperated by comma (,)
                </span>
              </p>
              <textarea
                name='links'
                {...register("links")}
                className='w-full bg-transparent px-3 py-1.5 2xl:py-3 border border-gray-300
            dark:border-gray-600 placeholder-gray-300 dark:placeholder-gray-700
            text-gray-900 dark:text-white outline-none text-base focus:ring-2
            ring-blue-300'
              ></textarea>
            </div>
          </div>

          {isLoading || isUpdating || uploading ? (
            <div className='py-4'>
              <Loading />
            </div>
          ) : (
            <div className='bg-gray-50 mt-6 mb-4 sm:flex sm:flex-row-reverse gap-4'>
              <button
                type='submit'
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 hover:from-blue-500 hover:to-cyan-400 transition-all font-bold tracking-wide text-lg flex items-center gap-2"
                style={{fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif'}}
              >
                <span className="text-2xl">＋</span> Create Task
              </button>

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => setOpen(false)}
                label='Cancel'
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddTask;
