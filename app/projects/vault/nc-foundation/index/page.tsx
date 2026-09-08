import Link from "next/link";

export default function NCFoundationIndex() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-20 space-y-12">

      {/* PROJECT INTRO */}
      <section className="not-prose mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          NC — A Proposed Architectural Direction for Long-Horizon Intelligent Systems
        </h1>

        <p className="text-lg text-gray-300 leading-relaxed">
          NC explores the environment persistent intelligence would need to operate across
          time — maintaining continuity, identity, context, accountability, and governed
          autonomy across agents, applications, and devices.
        </p>

        <p className="text-lg text-gray-300 leading-relaxed">
          It is a proposed systems architecture for the layer around intelligent models:
          the substrate that provides durable state, memory, execution boundaries,
          coordination, safety, and continuity.
        </p>

        <p className="text-lg text-gray-300 leading-relaxed">
          It is the place intelligence lives.
        </p>

        <p className="text-gray-400 leading-relaxed">
          This work is currently in controlled distribution. A deeper version — including
          architectural primitives, substrate exploration, operating model detail, and
          system-level governance — is available only through direct conversation.
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
          <br />
          Full documents are available only through direct conversation.
        </p>
      </section>

    </main>
  );
}