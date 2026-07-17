import Image from "next/image";
import logo from "../assets/icons/logo.png";

export default function Loading() {
  return (
    <main className=" flex items-center justify-center  bg-slate-50 h-screen w-screen loader">
      <Image src={logo} alt="Loading graphic" className="h-30 w-30" />
    </main>
  );
}
