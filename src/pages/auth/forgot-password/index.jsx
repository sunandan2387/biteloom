import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/SessionProvider";
import { toast } from "react-toastify";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [submitStatus, setSubmitStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/console");
    }
  }, [user, router]);

  const validatePassword = (password) => {
    const minLength = password.length >= 6;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!minLength) {
      return "Password must be at least 6 characters long.";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character.";
    }
    if (!hasNumber) {
      return "Password must contain at least one number.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/forgot_password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();
    if (data.status === true) {
      toast.success("Verification code sent");
      setSubmitStatus(true);
      setLoading(false);
    } else {
      toast.error("Error in sending verification code");
      setLoading(false);
    }
  };

  const createNewPassword = async () => {
    // Validate password before making request
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setPasswordError(validationError);
      toast.error(validationError);
      return;
    }

    setPasswordError(""); // Clear any previous errors
    setLoading(true);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reset_password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          code: verificationCode,
          new_password: newPassword,
        }),
      }
    );

    const data = await response.json();
    if (data.status === true) {
      toast.success("Password changed successfully. Please login to continue");
      setLoading(false);
      router.push("/auth/login");
    } else {
      toast.error("Invalid Credentials");
      setLoading(false);
    }
  };

  return (
    <div className="md:w-96 mx-auto my-24">
      <div className="rounded-lg border text-card-foreground shadow-sm bg-background-light dark:bg-background-dark">
        <div className="flex flex-col p-6 space-y-1">
          <h3 className="font-semibold tracking-tight text-2xl">
            Forgot Password
          </h3>
          <p className="text-sm text-muted-foreground">
            Enter your email below
          </p>
        </div>
        <div className="p-6 pt-0">
          <form onSubmit={handleSubmit}>
            {!submitStatus ? (
              <>
                <div className="space-y-2">
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                    placeholder="Email"
                    id="email"
                    type="text"
                    name="email"
                  />
                </div>
                <div className="mt-10">
                  <button
                    type="submit"
                    className="bg-primary text-black w-full py-2 rounded-md"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Verification Code"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="verificationCode">
                    Enter Verification Code
                  </label>
                  <input
                    onChange={(e) => setVerificationCode(e.target.value)}
                    value={verificationCode}
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                    placeholder="OTP"
                    id="verificationCode"
                    type="text"
                    name="verificationCode"
                  />
                </div>
                <div className="space-y-2 mt-4">
                  <label className="text-sm font-medium" htmlFor="newPassword">
                    Enter New Password
                  </label>
                  <input
                    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                      passwordError ? "border-red-500" : ""
                    }`}
                    placeholder="Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    value={newPassword}
                    type="password"
                    name="newPassword"
                  />
                  {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                </div>
                <div className="mt-10">
                  <button
                    onClick={createNewPassword}
                    type="button"
                    className="bg-primary text-black w-full py-2 rounded-md"
                    disabled={loading}
                  >
                    {loading ? "Setting Password..." : "Set New Password"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
