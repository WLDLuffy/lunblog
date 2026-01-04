import { Typography, Divider } from 'antd';
import Title from 'antd/es/typography';
import Paragraph from 'antd/es/typography';
import Text from 'antd/es/typography';


export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <article className="article-content">
        <Title style={{
          fontFamily: 'Merriweather, Georgia, serif',
          fontSize: '3.5rem',
          marginBottom: 48,
          lineHeight: 1.2
        }}>
          About Me
        </Title>

        <Paragraph style={{ fontSize: 20, marginBottom: 32 }}>
          Welcome to my personal tech blog! I'm a software engineer passionate about
          building scalable web applications and sharing insights about the latest
          trends in technology.
        </Paragraph>

        <Divider />

        <Title style={{ marginTop: 48, marginBottom: 24 }}>My Journey</Title>
        <Paragraph style={{ fontSize: 16, marginBottom: 24 }}>
          With years of experience in full-stack development, I've worked on diverse
          projects ranging from startups to enterprise applications. My expertise
          includes modern web frameworks, cloud infrastructure, and agile development
          practices.
        </Paragraph>

        <Title style={{ marginTop: 48, marginBottom: 24 }}>What I Write About</Title>
        <ul style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
          <li style={{ marginBottom: 12 }}>
            <Text>Web development best practices and patterns</Text>
          </li>
          <li style={{ marginBottom: 12 }}>
            <Text>Deep dives into JavaScript, TypeScript, and modern frameworks</Text>
          </li>
          <li style={{ marginBottom: 12 }}>
            <Text>Cloud architecture and deployment strategies</Text>
          </li>
          <li style={{ marginBottom: 12 }}>
            <Text>Reflections on the evolving tech landscape</Text>
          </li>
          <li style={{ marginBottom: 12 }}>
            <Text>Practical tutorials and code examples</Text>
          </li>
        </ul>

        <Title style={{ marginTop: 48, marginBottom: 24 }}>Get In Touch</Title>
        <Paragraph style={{ fontSize: 16 }}>
          I love connecting with fellow developers and tech enthusiasts. Feel free
          to reach out if you have questions, want to collaborate, or just want to
          chat about technology!
        </Paragraph>
      </article>
    </div>
  );
}
