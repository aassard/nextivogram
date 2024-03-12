"use client";

import { calSans } from "@/app/fonts";
import { signIn } from "next-auth/react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export default function LoginForm() {
  return (
    <div className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 text-center">
        <h1 className={` mb-3 text-2xl dark:text-black ${calSans.className}`}>
          Bienvenue sur ivogram, le réseau social qui rassemble les Ivoiriens du
          monde entier ! 🌍🇨🇮
        </h1>
        <h2 className={` mb-2 text-xl dark:text-black ${calSans.className}`}>
          🔥 Rejoignez la communauté dès maintenant ! 🔥 Connectez-vous pour
          partager vos expériences, échanger avec d’autres Ivoiriens, et
          découvrir des contenus passionnants. 🤝
        </h2>

        <div className=" flex flex-row justify-center text-5xl ">
          <div className="  text-orange-700">ivo</div>
          <div className=" text-slate-300">g</div>
          <div className=" text-green-700">ram</div>
        </div>

        <LoginButton />
      </div>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="mt-4 w-full text-green-400"
      variant={"secondary"}
      aria-disabled={pending}
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    >
      Connectez-vous avec Google
    </Button>
  );
}
