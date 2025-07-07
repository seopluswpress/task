import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { Button, Loading, Textbox } from "../components";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [registerUser, { isLoading }] = useRegisterMutation();

  const handleRegister = async (data) => {
    try {
      const res = await registerUser(data).unwrap();
      dispatch(setCredentials(res));
      toast.success("Registered successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };


  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-[#302943] dark:via-slate-900 dark:to-black'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            <span className='flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base dark:border-gray-700 dark:text-blue-400 border-gray-300 text-gray-600 bg-white/80 dark:bg-slate-800/50 shadow'>
              Start your journey with us!
            </span>
            <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center dark:text-gray-300 text-blue-800 drop-shadow'>
              <span>Register Account</span>
              <span className='text-lg md:text-2xl font-medium text-blue-500 dark:text-blue-300 tracking-tight mt-2'>Empower your workflow today.</span>
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
            <form
              onSubmit={handleSubmit(handleRegister)}
              className='form-container w-full flex flex-col gap-y-8 bg-white dark:bg-slate-900 px-8 pt-16 pb-12 rounded-2xl shadow-xl border border-blue-100 dark:border-slate-800 relative z-10'
              autoComplete="off"
            >
            <div>
              <p className='text-blue-700 dark:text-blue-400 text-3xl font-extrabold text-center mb-1'>
                Create your account
              </p>
              <p className='text-center text-base text-gray-700 dark:text-gray-400 mb-2'>
                Fill in your information to get started.
              </p>
            </div>

            <div className='flex flex-col gap-y-5'>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.21 0 4.304.534 6.121 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </span>
                <Textbox
                  placeholder='Your Name'
                  type='text'
                  name='name'
                  label='Name'
                  className='w-full rounded-full pl-10'
                  register={register("name", {
                    required: "Name is required!",
                  })}
                  error={errors.name?.message}
                />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 01-8 0" /></svg>
                </span>
                <Textbox
                  placeholder='Your Title'
                  type='text'
                  name='title'
                  label='Title'
                  className='w-full rounded-full pl-10'
                  register={register("title", {
                    required: "Title is required!",
                  })}
                  error={errors.title?.message}
                />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 018 0v2" /></svg>
                </span>
                <Textbox
                  placeholder='Your Role'
                  type='text'
                  name='role'
                  label='Role'
                  className='w-full rounded-full pl-10'
                  register={register("role", {
                    required: "Role is required!",
                  })}
                  error={errors.role?.message}
                />
              </div>


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
                  error={errors.email?.message}
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
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  error={errors.password?.message}
                />
              </div>
            </div>

            {isLoading ? (
              <Loading />
            ) : (
              <Button
                type='submit'
                label={isLoading ? 'Registering...' : 'Register'}
                className='w-full h-11 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-full font-semibold shadow hover:from-blue-800 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2'
                disabled={isLoading}
              />
            )}
          </form>
          <div className="mt-4 text-center">
            <span className="text-gray-600 dark:text-gray-400">Already have an account?</span>
            <button
              type="button"
              className="ml-2 text-blue-700 dark:text-blue-400 font-semibold hover:underline hover:text-blue-900 dark:hover:text-blue-200 transition-colors"
              onClick={() => navigate('/log-in')}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Register;
