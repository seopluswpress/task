import { Dialog } from "@headlessui/react";
import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import Textbox from "./Textbox";
import Button from "./Button";
import { toast } from "sonner";

const ForgotPasswordModal = ({ open, setOpen }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetLink("");
    if (!email) {
      toast.error("Please enter your email address.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to send reset link");
      toast.success(result.message || "If the email is registered, a reset link has been sent.");
      if (result.resetLink) setResetLink(result.resetLink); // Show the reset link if present
      else setOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit} className="space-y-6 w-80">
        <Dialog.Title
          as="h3"
          className="text-lg font-bold leading-6 text-gray-900 mb-2"
        >
          Forgot Password
        </Dialog.Title>
        <Textbox
          placeholder="Enter your email address"
          type="email"
          name="email"
          label="Email"
          className='w-full rounded-full'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="flex gap-2 justify-end">
          <Button
            type="submit"
            label={loading ? "Sending..." : "Send Reset Link"}
            className="bg-blue-600 text-white px-6"
            disabled={loading}
          />
          <Button
            type="button"
            label="Cancel"
            className="bg-white border px-6"
            onClick={() => setOpen(false)}
          />
        </div>
        {resetLink && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-300 rounded text-blue-900 text-sm break-all">
            <strong>Reset Link (dev only):</strong>
            <br />
            <a href={resetLink} target="_blank" rel="noopener noreferrer" className="underline text-blue-700">{resetLink}</a>
          </div>
        )}
      </form>
    </ModalWrapper>
  );
};

export default ForgotPasswordModal;
