"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/SessionProvider";
import { toast } from "react-toastify";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { user, setUser, goToConsole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/console");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.status === true) {
      toast.success("Logged in successfully");
      localStorage.setItem("authToken", data.token);
      
      // Correctly update global context state
      setUser({ email, token: data.token });

      goToConsole();
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="md:w-96 mx-auto my-24">
      <div className="rounded-lg border text-card-foreground shadow-sm bg-background-light dark:bg-background-dark">
        <div className="flex flex-col p-6 space-y-1">
          <h3 className="font-semibold tracking-tight text-2xl">Login to your Account</h3>
          <p className="text-sm text-muted-foreground">Enter your email and password below to login</p>
        </div>
        <div className="p-6 pt-0">
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Email</label>
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
            <div className="space-y-2 mt-4">
              <label className="text-sm font-medium" htmlFor="password">Password</label>
              <input
                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                name="password"
              />
              <div className="flex justify-end items-end w-full">
                <Link href="/auth/forgot-password" className="text-gray-600 underline text-right">
                  Forgot Password
                </Link>
              </div>
            </div>
            <div className="mt-10">
              <button type="submit" className="bg-primary text-black w-full py-2 rounded-md">
                Login
              </button>
            </div>
          </form>
        </div>
        <div className="p-6 pt-0 text-center text-sm">
          Not a member? <a className="text-indigo-600 hover:text-indigo-500" href="/auth/signup">Sign up now.</a>
        </div>
      </div>
    </div>
  );
}
