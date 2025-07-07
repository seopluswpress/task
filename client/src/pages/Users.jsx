import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { FaUserPlus } from "react-icons/fa";
import { toast } from "sonner";
import {
  AddUser,
  Button,
  ConfirmatioDialog,
  Loading,
  Title,
  UserAction,
} from "../components";
import {
  useGetTeamListsQuery,
  useDeleteUserMutation,
  useUserActionMutation,
} from "../redux/slices/api/userApiSlice";
import { getInitials } from "../utils/index";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Users = () => {
  const { user } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const [searchTerm] = useState(searchParams.get("search") || "");

  if (!user?.isAdmin) {
    return (
      <div className="py-10 text-center text-red-500">
        You must be an admin to view team members.
      </div>
    );
  }

  const { data, isLoading, error, refetch } = useGetTeamListsQuery({ search: searchTerm });
  const [deleteUser] = useDeleteUserMutation();
  const [userAction] = useUserActionMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    setSelected(el);
    setOpen(true);
  };

  const userStatusClick = (el) => {
    setSelected(el);
    setOpenAction(true);
  };

  const deleteHandler = async () => {
    try {
      const res = await deleteUser(selected);
      refetch();
      toast.success(res?.data?.message);
      setSelected(null);
      setTimeout(() => setOpenDialog(false), 500);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const userActionHandler = async () => {
    try {
      const res = await userAction({
        isActive: !selected?.isActive,
        id: selected?._id,
      });
      refetch();
      toast.success(res?.data?.message);
      setSelected(null);
      setTimeout(() => setOpenAction(false), 500);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleSuccess = () => {
    refetch();
    setOpen(false);
    setSelected(null);
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-300 dark:border-gray-600'>
      <tr className='text-black dark:text-white  text-left'>
        <th className='py-2'>Full Name</th>
        <th className='py-2'>Title</th>
        <th className='py-2'>Email</th>
        <th className='py-2'>Role</th>
        <th className='py-2'>Active</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='p-2' style={{fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif'}}>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow-md flex items-center justify-center text-base font-bold' style={{fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif'}}>
            <span className='text-white'>{getInitials(user.name)}</span>
          </div>
          <span className='font-semibold text-gray-900'>{user.name}</span>
        </div>
      </td>
      <td className='p-2'>{user.title}</td>
      <td className='p-2'>{user.email}</td>
      <td className='p-2'>{user.role}</td>
      <td>
        <button
          onClick={() => userStatusClick(user)}
          className={clsx(
            "w-fit px-4 py-1 rounded-full",
            user?.isActive ? "bg-blue-200" : "bg-yellow-100"
          )}
        >
          {user?.isActive ? "Active" : "Disabled"}
        </button>
      </td>
      <td className='p-2 flex gap-4 justify-end'>
        <Button
          className='text-blue-600 hover:text-blue-500 font-semibold sm:px-0'
          label='Edit'
          type='button'
          onClick={() => editClick(user)}
        />
        <Button
          className='text-red-700 hover:text-red-500 font-semibold sm:px-0'
          label='Delete'
          type='button'
          onClick={() => deleteClick(user?._id)}
        />
      </td>
    </tr>
  );

  return isLoading ? (
    <div className='py-10'>
      <Loading />
    </div>
  ) : error ? (
    <div className='py-10 text-center text-red-500'>
      {error?.status === 401 || error?.status === 403
        ? 'You must be an admin to view team members.'
        : error?.data?.message || 'Failed to fetch team members.'}
    </div>
  ) : (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
         <div className='flex items-center justify-between mb-8'>
          <Title title='  Team Members' />
          <Button
            label='Add New User'
            icon={<FaUserPlus className='text-2xl' />}
            className='flex flex-row-reverse gap-2 items-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 hover:from-blue-500 hover:to-cyan-400 transition-all font-bold tracking-wide text-lg'
            style={{fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif'}}
            onClick={() => setOpen(true)}
          />
        </div>
        <div className='backdrop-blur-xl bg-white/40 border border-blue-200/60 shadow-xl rounded-2xl px-2 md:px-6 py-6 relative' style={{overflow: 'hidden'}}>
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{background: 'linear-gradient(120deg, rgba(34,193,195,0.10) 0%, rgba(45,121,253,0.08) 100%)'}}></div>
          <div className='overflow-x-auto'>
            <table className='w-full mb-5'>
              <TableHeader />
              <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((user, index) => (
                    <TableRow key={user._id || index} user={user} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className='text-center py-4 text-gray-400'>
                      No team members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        onSuccess={handleSuccess}
      />
      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      />
    </>
  );
};

export default Users;
