"use client";

import { useUser } from "@clerk/nextjs";

export const WelcomeMsg = () => {
  const { user, isLoaded } = useUser();

  return (
    <div className="mb-4 mt-50 space-y-2">
      <h2 className="text-2xl font-medium lg:text-4xl">
        Welcome back {isLoaded ? ", " : " "}
        {user?.firstName} 👋
      </h2>
      <p className="text-sm lg:text-base text-slate-600">
        This is your financial overview report.
      </p>
    </div>
  );
};
