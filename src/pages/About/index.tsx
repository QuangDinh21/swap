import packageJson from '../../../package.json';

function About() {
  return (
    <div>
      <h1>About</h1>
      <p>Version: {packageJson.version}</p>
    </div>
  );
}

export default About;
