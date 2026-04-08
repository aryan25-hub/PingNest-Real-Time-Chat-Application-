"use client";
import { useAppData, user_service } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import { ArrowLeft, Save, User, UserCircle } from "lucide-react";

const ProfilePage = () => {
  const { user, isAuth, loading, setUser } = useAppData();

  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState<string | undefined>("");

  const router = useRouter();

  const editHandler = () => {
    setIsEdit(!isEdit);
    setName(user?.name);
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();
    const token = Cookies.get("token");
    try {
      const { data } = await axios.post(
        `${user_service}/api/v1/update/user`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Cookies.set("token", data.token, {
        expires: 15,
        secure: false,
        path: "/",
      });

      toast.success(data.message);
      setUser(data.user);
      setIsEdit(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (!isAuth && !loading) {
      router.push("/login");
    }
  }, [isAuth, router, loading]);

  if (loading) return <Loading />;
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push("/chat")}
            className="p-3 border border-[#2b2b2b] hover:border-[#93D420] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-300" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold uppercase tracking-wide text-[#ff0b8a]">Profile Settings</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Manage your account information
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#2b2b2b]">
          <div className="p-8 border-b border-[#2b2b2b]">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-[#0d0d0d] border border-[#2b2b2b] flex items-center justify-center">
                  <UserCircle className="w-12 h-12 text-gray-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#93D420] rounded-full border-2 border-black"></div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {user?.name || "User"}
                </h2>
                <p className="text-[#93D420] text-sm">Active now</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-3">
                  Display Name
                </label>

                {isEdit ? (
                  <form onSubmit={submitHandler} className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-black border border-[#93D420] rounded-md text-white placeholder-gray-500 focus:outline-none"
                      />
                      <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-3 bg-[#93D420] hover:opacity-95 text-black font-semibold rounded-md transition-opacity"
                      >
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={editHandler}
                        className="flex items-center gap-2 px-6 py-3 border border-[#2b2b2b] hover:border-[#93D420] text-white font-semibold rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-4 border border-[#2b2b2b] rounded-md">
                    <span className="text-white font-medium text-lg">
                      {user?.name || "Not set"}
                    </span>
                    <button
                      onClick={editHandler}
                      className="flex items-center gap-2 px-5 py-2 border border-[#93D420] text-[#93D420] hover:bg-[#93D420] hover:text-black font-semibold rounded-md transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
