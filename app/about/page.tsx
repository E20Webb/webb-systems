export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-20 space-y-20">

      {/* Identity Block */}
      <section className="flex flex-col items-center text-center space-y-6">

        <img
          src="/about/elliott.jpg"
          alt="Elliott Webb"
          className="w-40 h-40 object-cover border border-neutral-800 shadow-lg rounded-md"
        />

        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-white">
          Elliott Webb
        </h1>

        <p className="text-neutral-400 max-w-prose leading-relaxed text-base md:text-lg">
          Systems architect. Cultural thinker. Platform-level designer.
        </p>
      </section>

      {/* Authorial Bio */}
      <section className="space-y-6 text-neutral-300 leading-relaxed max-w-prose">
        <p>
          I design systems that sit above products — frameworks, taxonomies, and architectures that
          reshape how people build, create, and interact. My work spans cultural essays, platform
          strategy, and large-scale conceptual projects like the Neural Computer and Forge: systems
          that explore identity, cognition, creativity, and the future of human-computer interaction.
        </p>

        <p>
          My focus is on worldmaking — the pipelines, primitives, and conceptual foundations that
          allow complex interactive worlds to emerge. I’m interested in how culture evolves, how
          systems shape behavior, and how new mediums redefine the way people think, create, and
          collaborate.
        </p>
      </section>

      {/* Contact */}
      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
          Contact
        </h2>

        <p className="text-neutral-400 leading-relaxed max-w-prose text-base md:text-lg">
          For collaboration, project inquiries, or access to full repos:
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