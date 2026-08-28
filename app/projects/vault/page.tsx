"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VaultLogin() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const router = useRouter();

  // Auto‑redirect if already unlocked
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("vault") === "open") {
        router.push("/projects/vault/index");
      }
    }
  }, [router]);

  function submit(e: React.FormEvent) {
    e.preventDefault();

    const allowed = process.env.NEXT_PUBLIC_VAULT_PASSWORD?.split(",");

    if (allowed?.includes(password)) {
      localStorage.setItem("vault", "open"); // persist session
      router.push("/projects/vault/index");
    } else {
      alert("Incorrect password.");
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16 md:py-24 space-y-12">
      <h1 className="text-2xl md:text-3xl font-medium mb-6 md:mb-8">
        Projects Vault
      </h1>

      <form onSubmit={submit} className="space-y-6">

        {/* Dark theme password input with Show/Hide toggle */}
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            className="border border-neutral-700 bg-neutral-900 text-neutral-100 px-4 py-3 w-full rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400 hover:text-neutral-200 transition"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-3 w-full rounded"
        >
          Enter Vault
        </button>
      </form>
    </main>
  );
}
