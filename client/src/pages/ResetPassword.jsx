import { useParams } from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button";
import Textbox from "../components/Textbox";
import { toast } from "sonner";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [cpass, setCpass] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [strength, setStrength] = useState("");

  // Password strength checker
  const checkStrength = (pwd) => {
    if (!pwd) return "";
    if (pwd.length < 6) return "Too short";
    let score = 0;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (pwd.length >= 12) score++;
    if (score <= 1) return "Weak";
    if (score === 2) return "Medium";
    if (score >= 3) return "Strong";
    return "";
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setStrength(checkStrength(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !cpass) {
      toast.error("Please fill all fields");
      return;
    }
    if (password !== cpass) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const response = await fetch(`/api/users/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmPassword: cpass }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to reset password");
      toast.success(result.message || "Password reset successfully!");
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to reset password");
      toast.error(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-[#181818]">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#232323] p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        {error && <div className="text-red-600 text-sm mb-2 text-center">{error}</div>}
        {success ? (
          <div className="text-green-600 text-center font-semibold">Password reset successfully! You may now <a href="/log-in" className="underline">log in</a>.</div>
        ) : (
          <>
            <Textbox
              label="New Password"
              type="password"
              className='w-full rounded-full'
              value={password}
              onChange={handlePasswordChange}
            />
            {password && (
              <div className={`text-xs mb-2 text-center ${strength === 'Strong' ? 'text-green-600' : strength === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                Password strength: {strength}
              </div>
            )}
            <Textbox
              label="Confirm Password"
              type="password"
              className='w-full rounded-full'
              value={cpass}
              onChange={(e) => setCpass(e.target.value)}
            />
            <Button
              type="submit"
              label={loading ? "Resetting..." : "Reset Password"}
              className="w-full h-10 bg-blue-700 text-white rounded-full mt-4"
              disabled={loading}
            />
          </>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
