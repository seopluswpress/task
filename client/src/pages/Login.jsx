import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button, Loading, Textbox } from "../components";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import { useLoginMutation } from "../redux/slices/api/authApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { useEffect, useState } from "react";

const Login = () => {
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (data) => {
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials(res));
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    user && navigate("/dashboard");
  }, [user]);

  // Add state and modal for Forgot Password
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-[#302943] dark:via-slate-900 dark:to-black'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            <span className='flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base dark:border-gray-700 dark:text-blue-400 border-gray-300 text-gray-600 bg-white/80 dark:bg-slate-800/50 shadow'>
              Welcome to your productivity hub
            </span>
            <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center dark:text-gray-300 text-blue-800 drop-shadow'>
              <span>Task Manager</span>
              <span className='text-lg md:text-2xl font-medium text-blue-500 dark:text-blue-300 tracking-tight mt-2'>Organize. Track. Succeed.</span>
            </p>

            <div className='cell'>
              <div className='circle rotate-in-up-left'></div>
            </div>
          </div>
        </div>

        <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
          <div className="relative w-full md:w-[420px] mx-auto animate-fade-in mt-16">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 shadow-lg flex items-center justify-center z-20 border-4 border-white dark:border-slate-900">
              <img src="/ayt.jpg" alt="Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="form-container w-full flex flex-col gap-y-8 bg-white dark:bg-slate-900 px-8 pt-16 pb-12 rounded-2xl shadow-xl border border-blue-100 dark:border-slate-800 relative z-10">
              <form onSubmit={handleSubmit(handleLogin)} autoComplete="off">
                <div>
                  <p className='text-blue-700 dark:text-blue-400 text-3xl font-extrabold text-center mb-1'>
                    Sign in to your account
                  </p>
                  <p className='text-center text-base text-gray-700 dark:text-gray-400 mb-2'>
                    Enter your details below to access your workspace.
                  </p>
                </div>
                <div className='flex flex-col gap-y-5'>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m0 0v4m0-4V8m0 4h8" /></svg>
                    </span>
                    <Textbox
                      placeholder='you@example.com'
                      type='email'
                      name='email'
                      label='Email Address'
                      className='w-full rounded-full pl-10'
                      register={register("email", {
                        required: "Email Address is required!",
                      })}
                      error={errors.email ? errors.email.message : ""}
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0-6v2m-6 4v-4a6 6 0 0112 0v4" /></svg>
                    </span>
                    <Textbox
                      placeholder='Password'
                      type='password'
                      name='password'
                      label='Password'
                      className='w-full rounded-full pl-10'
                      register={register("password", {
                        required: "Password is required!",
                      })}
                      error={errors.password ? errors.password?.message : ""}
                    />
                  </div>
                  <span
                    className='text-sm text-blue-600 hover:underline cursor-pointer transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded'
                    onClick={() => setShowForgotPassword(true)}
                    tabIndex={0}
                  >
                    Forgot your password?
                  </span>
                </div>
                {isLoading ? (
                  <Loading />
                ) : (
                  <Button
                    type='submit'
                    label={isLoading ? 'Signing In...' : 'Sign In'}
                    className='w-full h-11 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-full font-semibold shadow hover:from-blue-800 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2'
                    disabled={isLoading}
                  />
                )}
              </form>
              {/* Register button for users without an account */}
              <div className="mt-4 text-center">
                <span className="text-gray-600 dark:text-gray-400">Don't have an account?</span>
                <button
                  type="button"
                  className="ml-2 text-blue-700 dark:text-blue-400 font-semibold hover:underline hover:text-blue-900 dark:hover:text-blue-200 transition-colors"
                  onClick={() => navigate('/register')}
                >
                  Create one
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <ForgotPasswordModal open={showForgotPassword} setOpen={setShowForgotPassword} />
      )}
    </div>
  );
};

export default Login;
