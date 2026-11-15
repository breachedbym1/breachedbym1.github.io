/*
  Everything the homepage shows lives in this file.

  To add an update: copy one entry in `updates`, paste it at the TOP of the
  list, and change the date and text. Dates use YYYY-MM-DD.

  To add a project: copy the object in `projects` and fill in the fields.
  Paths like "bankroll-risk-model/" are relative to the site root.
*/
window.SITE = {
  // Change these two if the GitHub username or repo ever changes.
  // (The Open Graph image URLs in index.html and bankroll-risk-model/index.html
  //  also need the new address, because link previews can't run this file.)
  baseUrl: "https://breachedbym1.github.io",
  repoUrl: "https://github.com/breachedbym1/breachedbym1.github.io",

  name: "Diego Reed",
  school: "Finance · James Madison University",
  intro:
    "I'm a junior studying finance at JMU. I build models in Excel and Python to answer questions about risk and capital, like how much money you need to survive a bad run.",
  lookingFor:
    "Looking for Summer 2027 internships in finance, FP&A or analytics",

  links: [
    { label: "LinkedIn", handle: "diego-reed", url: "https://www.linkedin.com/in/diego-reed-625485384/", icon: "linkedin" },
    { label: "GitHub", handle: "@breachedbym1", url: "https://github.com/breachedbym1", icon: "github" },
    { label: "Email", handle: "reed2dt@dukes.jmu.edu", url: "mailto:reed2dt@dukes.jmu.edu", icon: "mail" },
    // Set url to null to hide the link.
    { label: "Resume", handle: "PDF", url: "resume.pdf", icon: "file" }
  ],

  projects: [
    {
      title: "Monte Carlo Bankroll Risk Model",
      year: 2026,
      status: "In progress",
      summary:
        "How much capital does a winning poker player need so bad luck doesn't wipe them out first? I simulated 10,000 players in Python and 500 in Excel to find out.",
      thumbnail: "bankroll-risk-model/assets/poster.jpg",
      thumbnailAlt:
        "Split-screen replay of two simulated poker players with the same skill and opposite bankroll paths",
      tools: ["Excel", "Python", "NumPy", "pandas", "SciPy", "Matplotlib"],
      page: "bankroll-risk-model/",
      code: "tree/main/bankroll-risk-model", // added to repoUrl
      video: "bankroll-risk-model/Poker_Bankroll_Simulation.mp4"
    }
  ],

  // Newest first.
  updates: [
    { date: "2026-11-15", project: "Bankroll model", text: "Rewrote the project README and filled in project details on the site." },
    { date: "2026-11-12", project: "Bankroll model", text: "Launched the project site on GitHub Pages." },
    { date: "2026-11-11", project: "Bankroll model", text: "Made an animated replay of two simulated players with the same edge and opposite outcomes." },
    { date: "2026-11-11", project: "Bankroll model", text: "Rebuilt the model in Python with 10,000 paths and validated it against the closed-form math." },
    { date: "2026-11-11", project: "Bankroll model", text: "Built the first version of the bankroll risk model in Excel." }
  ],

  skills: [
    { group: "Finance & modeling", items: ["Excel", "Monte Carlo simulation", "Risk modeling", "Sensitivity analysis"] },
    { group: "Python & data", items: ["Python", "NumPy", "pandas", "SciPy", "Matplotlib", "Jupyter"] },
    { group: "Web", items: ["HTML", "CSS", "GitHub Pages"] }
  ]
};
