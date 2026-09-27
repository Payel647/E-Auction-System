"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GuestOnly({ children }) {
  const router = useRouter();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("access")) {
      router.replace("/dashboard");
      return;
    }

    setCanRender(true);
  }, [router]);

  if (!canRender) {
    return null;
  }

  return children;
}