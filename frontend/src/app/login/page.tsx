"use client";
import Loading from "@/components/Loading";
import { useAppData, user_service } from "@/context/AppContext";
import axios from "axios";
import { Check, Loader2 } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const { isAuth, loading: userLoading } = useAppData();

  const handleSubmit = async (
    e: React.FormEvent<HTMLElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${user_service}/api/v1/login`, {
        email,
      });

      toast.success(data.message);
      router.push(`/verify?email=${email}`);
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        toast.error(error.response?.data?.message || "Unable to send code");
      } else {
        toast.error("Unable to send code");
      }
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) return <Loading />;
  if (isAuth) return redirect("/chat");
  return (
    <div className="min-h-screen bg-black text-white px-4 pt-10 flex items-center justify-center">
      <div className="mx-auto w-full max-w-4xl ">
        <div className="mx-auto w-full max-w-2xl rounded-2xl border border-[#2b2b2b] p-8 md:p-10 ">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-extrabold uppercase tracking-wide text-[#ff0b8a]">
              WELCOME  TO 
              <span className="text-white"> PIN</span>
              <span className="text-[#93D420]">GN</span>
              <span className="text-[#ff0b8a]">EST</span>
            </h1>
            <p className="text-sm text-gray-400">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-6">
            <div>
              <h3 className="mb-1 text-center text-2xl font-semibold">Enter Your Email</h3>
              <p className="mb-4 text-center text-sm text-gray-500">
                We&apos;ll send you a verification code to confirm your identity
              </p>

              <div className="flex items-center rounded-md border border-[#93D420] bg-black px-3 py-3">
                <input
                  type="text"
                  id="email"
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Check className="h-4 w-4 text-[#93D420]" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-[#93D420] py-3 text-sm font-semibold text-black transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Verification Code...
                </div>
              ) : (
                "Send Verification Code"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
