import { SwitchCamera } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { calSans } from "@/app/fonts";

function Logo() {
  return (
    <Link
      href={"/dashboard"}
      className={buttonVariants({
        className:
          "hidden md:flex navLink !mb-10 lg:hover:bg-transparent lg:!p-0",
        variant: "ghost",
        size: "lg",
      })}
    >
      <SwitchCamera className="h-6 w-6 shrink-0 lg:hidden" />
      <p className={`flex`}>
        <div
          className={`font-semibold text-3xl hidden lg:block text-orange-700 ${calSans.className}`}
        >
          ivo
        </div>
        <div
          className={`font-semibold text-3xl hidden lg:block text-slate-300	${calSans.className}`}
        >
          gr
        </div>
        <div
          className={`font-semibold text-3xl hidden lg:block text-green-700 ${calSans.className}`}
        >
          am
        </div>
      </p>
    </Link>
  );
}

export default Logo;
