import './App.css';
import Terminal from 'terminal-in-react';

let showAboutMsg = () => `Hello, welcome to my site, my name is Faraz and I graduated from McGill University with a degree in Software Engineering. 
I'm currently working on the Scheduling team at Ceridian, an HCM company and have worked there previously as a Software Developer in Test. 

In my free time I enjoy to read, listen to music, cook and bake, go out for bike rides, and spend time in nature.

If you want to get in touch with me, you can reach me at farazoman@gmail.com or contact me on my LinkedIn

Enjoy the site!`

function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}
    >
      <Terminal
        color='green'
        backgroundColor='black'
        barColor='black'
        style={{ fontWeight: "bold", fontSize: "1em" }}
        commands={{
          linkedin: () => window.location.replace('https://ca.linkedin.com/in/farazoman'),
          aboutme: showAboutMsg,
          skills: () => 'C#, Selenium, SQL, SpecFlow, Powershell, Javascript, React, Adobe Creative Suite (Illustrator, InDesign, Photoshop)',
          contact: () => 'email: farazoman@gmail.com'
        }}
        descriptions={{
          linkedin: 'opens my linkedin profile',
          aboutme: 'learn a lil about who I am',
          skills: 'a summary of my skills',
          contact: 'get in touch!'
        }}
        startState='maximised'
        msg="Welcome to my site, I'm Faraz and I work as a Software Developer. Type 'help' to see all the available commands. Enjoy!"
      />
    </div>
  );
}

export default App;
