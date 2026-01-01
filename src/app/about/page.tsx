export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <article className="article-content">
        <h1 className="text-5xl md:text-6xl font-bold mb-12 leading-tight" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
          About Me
        </h1>

        <p className="text-xl leading-relaxed mb-8">
          Welcome to my personal tech blog! I'm a software engineer passionate about
          building scalable web applications and sharing insights about the latest
          trends in technology.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>My Journey</h2>
        <p className="leading-relaxed mb-6">
          With years of experience in full-stack development, I've worked on diverse
          projects ranging from startups to enterprise applications. My expertise
          includes modern web frameworks, cloud infrastructure, and agile development
          practices.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>What I Write About</h2>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start">
            <span className="mr-3 mt-2">•</span>
            <span>Web development best practices and patterns</span>
          </li>
          <li className="flex items-start">
            <span className="mr-3 mt-2">•</span>
            <span>Deep dives into JavaScript, TypeScript, and modern frameworks</span>
          </li>
          <li className="flex items-start">
            <span className="mr-3 mt-2">•</span>
            <span>Cloud architecture and deployment strategies</span>
          </li>
          <li className="flex items-start">
            <span className="mr-3 mt-2">•</span>
            <span>Reflections on the evolving tech landscape</span>
          </li>
          <li className="flex items-start">
            <span className="mr-3 mt-2">•</span>
            <span>Practical tutorials and code examples</span>
          </li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>Get In Touch</h2>
        <p className="leading-relaxed">
          I love connecting with fellow developers and tech enthusiasts. Feel free
          to reach out if you have questions, want to collaborate, or just want to
          chat about technology!
        </p>
      </article>
    </div>
  );
}
