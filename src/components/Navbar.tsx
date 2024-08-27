"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user;
  const router = useRouter();
  return (
    <>
      <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <a href="/" className="text-xl font-bold mb-4 md:mb-0">
            <span>True Feedback</span>
          </a>
          {session ? (
            <>
              <span className="mr-4 text-red-400">
                Welcome , {user.username || user.email}
              </span>
              <Button
                onClick={() => signOut()}
                className="w-full md:w-auto bg-slate-100 text-black"
                variant="outline"
              >
                Logout
              </Button>
            </>
          ) : (
            // <Button
            //   className="w-full md:w-auto bg-slate-100 text-black"
            //   // variant={"outline"}
            // >
            // </Button>
            <Link
              href="/sign-in"
              className="w-full md:w-auto bg-slate-100 text-black px-2 py-1"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
