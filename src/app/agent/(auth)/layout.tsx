import Image from "next/image";
import backgroundImage from "@/assets/images/jemeBG.png";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden  lg:block">
        <Image
          src={backgroundImage}
          alt="Background"
          fill
          className="object-cover"
        />
      </div>
      {children}
    </section>
  );
}
