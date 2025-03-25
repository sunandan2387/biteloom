"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [signUp, setSignup] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  // Password validation function
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

  // Function for sign-up
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate password before making request
    const validationError = validatePassword(password);
    if (validationError) {
      setPasswordError(validationError);
      toast.error(validationError);
      setLoading(false);
      return;
    }

    setPasswordError(""); 

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (data.status === true) {
      setLoading(false);
      toast.success("Signup successful. Verification code sent!");
      
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/resend_verification_code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setSignup(true);
    } else if (data.message === "User already exists.") {
      setLoading(false);
      toast.error("User already exists");
    }
  };

  // Function for verification code
  const sendVerification = async () => {
    setLoading(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verify_email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: verificationCode }),
    });
    const data = await response.json();
    if (data.status === true) {
      setLoading(false);
      toast.success("User verified successfully, please login.");
      router.push("/auth/login");
    } else {
      setLoading(false);
      toast.error("Invalid verification code");
    }
  };

  return (
    <div className="md:w-96 mx-auto my-24">
      <div className="rounded-lg border text-card-foreground shadow-sm bg-background-light dark:bg-background-dark">
        <div className="flex flex-col p-6 space-y-1">
          <h3 className="font-semibold tracking-tight text-2xl">Create your Account</h3>
          <p className="text-sm text-muted-foreground">Enter your details below to create your account</p>
        </div>
        <div className="p-6 pt-0">
          <div>
            <form onSubmit={handleSubmit}>
              {!signUp ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <input
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="Enter Name"
                      type="text"
                      name="name"
                      disabled={signUp}
                    />
                  </div>
                  <div className="space-y-2 mt-4">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="Email"
                      type="text"
                      name="email"
                      disabled={signUp}
                    />
                  </div>
                  <div className="space-y-2 mt-4">
                    <label className="text-sm font-medium">Password</label>
                    <input
                      className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                        passwordError ? "border-red-500" : ""
                      }`}
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      type="password"
                      name="password"
                      disabled={signUp}
                    />
                    {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                  </div>
                  <div className="mt-10">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-primary text-black w-full py-2 rounded-md"
                    >
                      {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2 mt-4">
                    <label className="text-sm font-medium">Verification Code</label>
                    <input
                      onChange={(e) => setVerificationCode(e.target.value)}
                      value={verificationCode}
                      className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="OTP"
                      type="text"
                      name="code"
                    />
                  </div>
                  <div className="mt-10">
                    <button
                      type="button"
                      onClick={sendVerification}
                      className="bg-primary text-black w-full py-2 rounded-md"
                    >
                      {loading ? "Verifying..." : "Verify"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
        <div className="flex items-center p-6 pt-0">
          <div className="text-center text-sm text-gray-500">
            Already a member?{" "}
            <a className="text-indigo-600 hover:text-indigo-500" href="/auth/login">
              Sign in.
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
