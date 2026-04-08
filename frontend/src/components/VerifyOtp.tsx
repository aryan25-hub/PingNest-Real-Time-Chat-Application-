"use client";
import axios from "axios";
import { ArrowRight, ChevronLeft, Loader2, Lock } from "lucide-react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useAppData, user_service } from "@/context/AppContext";
import Loading from "./Loading";
import toast from "react-hot-toast";

const VerifyOtp = () => {
  const {
    isAuth,
    setIsAuth,
    setUser,
    loading: userLoading,
    fetchChats,
    fetchUsers,
  } = useAppData();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string>("");
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();

  const searchParams = useSearchParams();

  const email: string = searchParams.get("email") || "";

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);
  
  const handleInputChange = (index: number, value: string): void => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLElement>
  ): void => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const patedData = e.clipboardData.getData("text");
    const digits = patedData.replace(/\D/g, "").slice(0, 6);
    if (digits.length === 6) {
      const newOtp = digits.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please Enter all 6 digits");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${user_service}/api/v1/verify`, {
        email,
        otp: otpString,
      });
      toast.success(data.message);
      Cookies.set("token", data.token, {
        expires: 15,
        secure: false,
        path: "/",
      });
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setUser(data.user);
      setIsAuth(true);
      fetchChats();
      fetchUsers();
    } catch (error: any) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${user_service}/api/v1/login`, {
        email,
      });
      toast.success(data.message);
      setTimer(60);
    } catch (error: any) {
      setError(error.response.data.message);
    } finally {
      setResendLoading(false);
    }
  };

  if (userLoading) return <Loading />;

  if (isAuth) redirect("/chat");
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="border border-[#2b2b2b] rounded-2xl p-8">
          <div className="text-center mb-8 relative">
            <button
              className="absolute top-0 left-0 p-2 text-gray-400 hover:text-[#93D420] transition-colors"
              onClick={() => router.push("/login")}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="mx-auto w-16 h-16 bg-[#93D420] rounded-xl flex items-center justify-center mb-5">
              <Lock size={32} className="text-black" />
            </div>
            <h1 className="text-3xl font-extrabold uppercase tracking-wide text-[#ff0b8a] mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-400 text-sm">
              We have sent a 6-digit code to
            </p>
            <p className="text-[#93D420] font-medium text-sm mt-1">{email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-4 text-center">
                Enter your 6-digit OTP below
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el: HTMLInputElement | null) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-[#2b2b2b] focus:border-[#93D420] rounded-lg bg-black text-white outline-none transition-colors"
                  />
                ))}
              </div>
            </div>
            {error && (
              <div className="border border-red-700/50 rounded-lg p-3 bg-red-950/30">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-[#93D420] text-black py-3 px-6 rounded-md font-semibold hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Verify</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm mb-3">
              Didn&apos;t receive the code?
            </p>
            {timer > 0 ? (
              <p className="text-gray-500 text-sm">
                Resend code in{" "}
                <span className="text-[#93D420] font-medium">{timer}s</span>
              </p>
            ) : (
              <button
                className="text-[#93D420] hover:opacity-80 font-medium text-sm disabled:opacity-50 transition-opacity"
                disabled={resendLoading}
                onClick={handleResendOtp}
              >
                {resendLoading ? "Sending..." : "Resend Code"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
