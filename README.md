# Diego Reed · Portfolio

Live at https://breachedbym1.github.io

Finance student at James Madison University. This repo is my portfolio site: plain HTML, CSS and JavaScript served by GitHub Pages, with no build step.

## Projects

- [Monte Carlo Bankroll Risk Model](bankroll-risk-model/): how much capital a winning poker player needs to survive bad luck, simulated in Excel and Python. Write-up in [bankroll-risk-model/README.md](bankroll-risk-model/README.md).

## How the site is organized

| File | What it does |
|---|---|
| `data.js` | All homepage content: intro, links, projects, updates, skills |
| `index.html` | Homepage layout |
| `main.js` | Builds the homepage from `data.js` |
| `styles.css` | Shared styles for every page |
| `home.css` | Homepage-only styles |
| `bankroll-risk-model/` | Project page and its files |

## Adding an update

Open `data.js`, copy one line in `updates`, paste it at the top of the list and edit it:

```js
{ date: "2026-11-20", project: "Bankroll model", text: "Added a move-down-in-stakes rule." },
```

The list, the activity grid and the "Last updated" date in the footer all update on their own.

## Adding a project

Copy the object in `projects` in `data.js` and fill in the fields. Put the project's files in their own folder (like `bankroll-risk-model/`) and set `page` to that folder.

## If the GitHub username changes

Search the repo for `breachedbym1`. It appears in `data.js` (`baseUrl`, `repoUrl`), in the Open Graph tags of both `index.html` files (link previews need full URLs), and in a few direct GitHub links.
