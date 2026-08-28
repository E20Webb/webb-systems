import Link from "next/link";

export default function NCFoundationIndex() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-20 space-y-12">

      {/* PROJECT INTRO */}
      <section className="not-prose mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          NC — A Proposed Architectural Direction for Long‑Horizon Intelligent Systems
        </h1>

        <p className="text-lg text-gray-300 leading-relaxed">
          NC explores the environment intelligence needs to persist, coordinate, govern itself
          safely, and operate across time. It is not a model, agent, or runtime — it is the
          place intelligence lives. A governed substrate for long‑horizon intelligent systems
          built for continuity, identity, accountability, and safe autonomy.
        </p>

        <p className="text-gray-400 leading-relaxed">
          This work is currently in controlled distribution. A deeper version — including
          architectural primitives, substrate exploration, and operating model detail — is
          available only through direct conversation.
        </p>

        <p className="text-gray-400 leading-relaxed">
          <strong>Access:</strong> By request  
          <br />
          <strong>Contact:</strong> Elliott@Webb.Systems
        </p>
      </section>

      {/* CONTROLLED ACCESS NOTICE */}
      <section className="border-t pt-8">
        <p className="text-neutral-500 text-base md:text-lg">
          NC Foundation is not publicly accessible within the Vault.  
          Full documents are available only through direct conversation.
        </p>
      </section>

    </main>
  );
}
