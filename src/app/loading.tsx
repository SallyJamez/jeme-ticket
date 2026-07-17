"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../assets/icons/logo.png";

// If loading persists this long, assume something's stuck and send the
// user somewhere useful instead of leaving them staring at a spinner.
const REDIRECT_SECONDS = 8;

export default function Loading() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) {
      router.push("/");
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, router]);


  return (
    <main className=" flex items-center justify-center  bg-slate-50 h-screen w-screen loader bg-[#16A34A]/20 ">
      <Image src={logo} alt="Loading graphic" className="h-30 w-30" />
    </main>
  );
}
