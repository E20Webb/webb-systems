export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 md:py-20">

      {/* Identity */}
      <section className="flex flex-col items-center text-center space-y-6 mb-24">
        <img
          src="/about/elliott.jpg"
          alt="Elliott Webb"
          className="w-40 h-40 object-cover border border-neutral-800 shadow-lg rounded-md"
        />

        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-white">
          Elliott Webb
        </h1>

        <p className="text-neutral-400 max-w-2xl leading-relaxed text-base md:text-lg">
          Systems architect. Cultural thinker. Platform-level designer.
          <br />
          I productize emerging capability through systems architecture.
        </p>
      </section>

      {/* Why I Build */}
      <section className="border-t border-neutral-700 pt-14 mb-20">
        <p className="text-sm uppercase tracking-[0.18em] text-neutral-500 mb-6">
          Why I Build
        </p>

        <div className="border-l-4 border-emerald-400 pl-8 py-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-medium leading-snug text-white">
            I look for the gap between what technology can already do
            and what we have actually built with it.
          </h2>

          <p className="mt-5 text-neutral-400 text-base md:text-lg leading-relaxed max-w-3xl">
            My work is about turning that gap into coherent systems,
            products, platforms, and possibilities that weren&apos;t obvious
            from the individual pieces.
          </p>
        </div>
      </section>

      {/* Approach */}
      <section className="border-t border-neutral-700 pt-14 mb-20">
        <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight mb-10">
          How I Approach Problems
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="border border-neutral-800 rounded-lg p-7 min-h-64 flex flex-col">
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-500 mb-5">
              01
            </p>

            <h3 className="text-xl md:text-2xl font-medium text-white mb-4">
              See the System
            </h3>

            <p className="text-neutral-400 leading-relaxed">
              Identify the structure beneath the problem: constraints,
              dependencies, incentives, behaviors, failure points, and
              assumptions that have hardened into convention.
            </p>
          </div>

          <div className="border border-neutral-800 rounded-lg p-7 min-h-64 flex flex-col">
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-500 mb-5">
              02
            </p>

            <h3 className="text-xl md:text-2xl font-medium text-white mb-4">
              Recompose the Pieces
            </h3>

            <p className="text-neutral-400 leading-relaxed">
              Look at what already exists and ask whether the same technologies,
              capabilities, and structures could be arranged around a different
              product premise.
            </p>
          </div>

          <div className="border border-neutral-800 rounded-lg p-7 min-h-64 flex flex-col">
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-500 mb-5">
              03
            </p>

            <h3 className="text-xl md:text-2xl font-medium text-white mb-4">
              Build With Others
            </h3>

            <p className="text-neutral-400 leading-relaxed">
              Treat the first coherent architecture as a starting point —
              something to be tested, challenged, refined, and improved through
              engineering, creative, business, and cultural expertise.
            </p>
          </div>
        </div>
      </section>

      {/* How I Work */}
      <section className="border-t border-neutral-700 pt-14 mb-20">
        <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight mb-8">
          How I Work
        </h2>

        <div className="max-w-3xl space-y-6 text-neutral-300 leading-relaxed text-base md:text-lg">
          <p>
            Give me a problem and my instinct is to architect it.
          </p>

          <p>
            I want to understand what exists, what is missing, what depends on
            what, where the real constraints live, and what a coherent solution
            would require.
          </p>

          <p>
            I design systems that sit above products — frameworks, taxonomies,
            and architectures that reshape how people build, create, and
            interact.
          </p>

          <p>
            The goal is not novelty for its own sake. It is finding a structure
            that makes something previously fragmented, difficult, or
            overlooked possible.
          </p>
        </div>
      </section>

      {/* Method / Site Architecture */}
      <section className="border-t border-neutral-700 pt-14 mb-20">
        <p className="text-sm uppercase tracking-[0.18em] text-neutral-500 mb-8">
          From Problem to Possibility
        </p>

        <div className="border border-neutral-800 rounded-lg px-6 py-10 md:px-10 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center">
            <span className="text-lg md:text-xl font-medium text-white">
              Problem
            </span>

            <span className="hidden md:block text-neutral-600">→</span>

            <span className="text-lg md:text-xl font-medium text-white">
              System
            </span>

            <span className="hidden md:block text-neutral-600">→</span>

            <span className="text-lg md:text-xl font-medium text-white">
              Architecture
            </span>

            <span className="hidden md:block text-neutral-600">→</span>

            <span className="text-lg md:text-xl font-medium text-white">
              Product Possibility
            </span>
          </div>

          <div className="border-t border-neutral-800 mt-10 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-white font-medium mb-2">Essays</p>
                <p className="text-neutral-500 text-sm">Diagnose.</p>
              </div>

              <div>
                <p className="text-white font-medium mb-2">Architecture</p>
                <p className="text-neutral-500 text-sm">Structure.</p>
              </div>

              <div>
                <p className="text-white font-medium mb-2">Projects</p>
                <p className="text-neutral-500 text-sm">Demonstrate.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Broader Focus */}
      <section className="border-t border-neutral-700 pt-14 mb-20">
        <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight mb-8">
          What I&apos;m Interested In
        </h2>

        <div className="max-w-3xl space-y-6 text-neutral-300 leading-relaxed text-base md:text-lg">
          <p>
            My work spans cultural essays, platform strategy, and large-scale
            systems architectures exploring identity, creativity, interaction,
            discovery, persistence, and the future of digital platforms.
          </p>

          <p>
            I&apos;m especially interested in worldmaking — the pipelines,
            primitives, institutions, and conceptual foundations that allow
            complex interactive worlds and communities to emerge.
          </p>

          <p>
            The recurring question is simple: what becomes possible when the
            underlying system is designed differently?
          </p>
        </div>
      </section>

      {/* Collaboration */}
      <section className="border-t border-neutral-700 pt-14 mb-20">
        <div className="border border-neutral-800 rounded-lg p-8 md:p-10">
          <p className="text-sm uppercase tracking-[0.18em] text-neutral-500 mb-5">
            Collaboration
          </p>

          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight mb-6">
            Architecture is a beginning, not a monument.
          </h2>

          <div className="max-w-3xl space-y-5 text-neutral-300 leading-relaxed text-base md:text-lg">
            <p>
              Good architecture establishes a coherent starting point. Better
              architecture emerges when it encounters engineering reality,
              creative expertise, business constraints, cultural perspective,
              and people who see things the original architect did not.
            </p>

            <p>
              The work on Webb Systems is meant to be challenged, extended,
              refined, and — when useful — built.
            </p>

            <p>
              I&apos;m interested in collaborating with people working on
              difficult problems, ambitious platforms, new forms of interactive
              media, or technologies whose full product potential has not yet
              been realized.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-neutral-700 pt-14">
        <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight mb-6">
          Contact
        </h2>

        <p className="text-neutral-400 leading-relaxed max-w-2xl text-base md:text-lg mb-7">
          If something here intersects with a problem you&apos;re trying to
          solve, I&apos;d like to hear about it.
        </p>

        <div className="space-y-2 text-neutral-300">
          <p>
            <span className="text-neutral-500">Email:</span>{" "}
            <a
              href="mailto:elliott@webb.systems"
              className="text-blue-400 hover:underline"
            >
              elliott@webb.systems
            </a>
          </p>

          <p>
            <span className="text-neutral-500">LinkedIn:</span>{" "}
            <a
              href="https://www.linkedin.com/in/elliott-webb-56b906226/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              LinkedIn Profile
            </a>
          </p>
        </div>
      </section>

    </main>
  );
}