/*
  Everything the homepage shows lives in this file.

  To add an update: copy one entry in `updates`, paste it at the TOP of the
  list, and change the date and text. Dates use YYYY-MM-DD. The page groups
  updates by month and only shows the month, not the day.

  To add a project: copy the object in `projects` and fill in the fields.
  Paths like "bankroll-risk-model/" are relative to the site root.

  Sticker names you can use for `icon` in `about`:
  chart, sheet, receipt, key, chip, code, calc, coffee
*/
window.SITE = {
  // Change these two if the GitHub username or repo ever changes.
  // (The Open Graph image URLs in index.html and bankroll-risk-model/index.html
  //  also need the new address, because link previews can't run this file.)
  baseUrl: "https://breachedbym1.github.io",
  repoUrl: "https://github.com/breachedbym1/breachedbym1.github.io",

  name: "Diego Reed",
  location: "Ashburn, VA",
  timeZone: "America/New_York",
  school: "Finance · James Madison University",
  tagline: "Finance student who likes to model things.",
  intro:
    "I'm a junior at James Madison University studying finance. I'm most interested in financial modeling and data analytics: building models in Excel and Python, testing the assumptions behind them, and figuring out what the numbers actually say.",
  lookingFor:
    "Looking for Summer 2027 internships in finance, FP&A or analytics",

  // The "Good morning / afternoon / evening" section. {b}...{/b} makes text bold.
  about: [
    { icon: "chart", text: "{b}I'm Diego, a finance junior at JMU.{/b} I transferred in after earning my associate's in business administration at Northern Virginia Community College." },
    { icon: "receipt", text: "{b}At CarMax I worked in the business office,{/b} auditing sales paperwork, working with finance companies and keeping records in Excel. I also trained new associates." },
    { icon: "key", text: "{b}Now I manage residential properties{/b} while I'm in school: tenants, vendors, scheduling and the admin that keeps it all running." },
    { icon: "chip", text: "{b}I play poker,{/b} which is where my first model came from: how much money does a winning player need to survive a bad run?" },
    { icon: "code", text: "{b}Right now I'm getting better at Python{/b} so my models can do more than a spreadsheet can." }
  ],

  links: [
    { label: "LinkedIn", handle: "diego-reed", url: "https://www.linkedin.com/in/diego-reed-625485384/", icon: "linkedin" },
    { label: "GitHub", handle: "@breachedbym1", url: "https://github.com/breachedbym1", icon: "github" },
    { label: "Email", handle: "reed2dt@dukes.jmu.edu", url: "mailto:reed2dt@dukes.jmu.edu", icon: "mail", copy: "reed2dt@dukes.jmu.edu" },
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
    { group: "Finance", items: ["Financial analysis", "Financial statement analysis", "Capital budgeting", "Time value of money"] },
    { group: "Modeling", items: ["Data modeling", "Monte Carlo simulation", "Risk modeling", "Sensitivity analysis", "Forecasting", "Regression"] },
    { group: "Data & tools", items: ["Data analysis", "Microsoft Excel", "Python", "NumPy", "pandas", "SciPy", "Matplotlib", "Jupyter"] },
    { group: "Web", items: ["HTML", "CSS", "GitHub Pages"] }
  ]
};
