# Game Deck

**Game Deck** is a gaming activity tracking web application that helps players play more and track smarter. Users can log gaming sessions, manage wishlists, write reviews, and build a social gaming profile — all in one place.

* Date Created: 19 Feb 2025
* Last Modification Date: 22 Feb 2026
* GitHub URL: https://github.com/maxhayden/CSCI4177_group6-Project
* GitLab URL: https://git.cs.dal.ca/courses/2025-winter/csci-4177_5709/group6/CSCI4177_group6-Project
* Netlify URL: https://699b76dde8085eb0e78fff7e--gametime-csci4177.netlify.app/

---

## Authors

* [Krishna Tej Nanda Kumar](kr776929@dal.ca) - *(Developer)*
* [Max Hayden](mx337324@dal.ca) - *(Developer)*
* [Patric Manoharan](pt321440@dal.ca) - *(Developer)*
* [Umar Fazeer](mh261324@dal.ca) - *(Developer)*
* [Zijian Wang](zj215963@dal.ca) - *(Developer)*
* [Shiyu Huang](shiyu.huang@dal.ca) - *(Developer)*

---

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To run this project locally, you need the following installed:

* [Node.js](https://nodejs.org/) (v18 or higher)
* [npm](https://www.npmjs.com/) (v9 or higher, bundled with Node.js)
* [Git](https://git-scm.com/)

To verify your installations:

```bash
node --version
npm --version
git --version
```

### Installing

Follow these steps to get the development environment running:

1. **Clone the repository**

```bash
git clone https://git.cs.dal.ca/courses/2025-winter/csci-4177_5709/group6/CSCI4177_group6-Project.git
cd CSCI4177_group6-Project
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Open your browser** and navigate to:

```
http://localhost:5173
```

The app will hot-reload automatically as you make changes to the source files.

---

## Deployment

The application is deployed on **Netlify** via continuous deployment from the `main` branch on GitLab.

### Deploying to Netlify manually

1. Build the production bundle:

```bash
npm run build
```

2. The output is placed in the `dist/` directory. Deploy this directory to any static hosting provider.

3. For Netlify deployments, the `public/_redirects` file is included to support React Router client-side routing:

```
/* /index.html 200
```

### Netlify configuration

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |

---

## Built With

* [React 19](https://react.dev/) - Frontend UI library
* [Vite 7](https://vitejs.dev/) - Build tool and development server
* [React Router DOM v7](https://reactrouter.com/) - Client-side routing
* [react-icons v5](https://react-icons.github.io/react-icons/) - Icon library
* [AOS (Animate On Scroll) v2](https://michalsnik.github.io/aos/) - Scroll-triggered animations
* [Google Fonts](https://fonts.google.com/) - Orbitron (headings) + Inter (body)
* [Netlify](https://www.netlify.com/) - Hosting and continuous deployment

---

## Sources

The following resources were referenced during development:

* [React Router — Scroll Restoration](https://reactrouter.com/en/main/start/tutorial) — Used for understanding SPA scroll behavior and navigation
* [MDN Web Docs — ARIA: expanded state](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded) — ARIA attributes for accessible accordion components
* [MDN Web Docs — IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) — Used to trigger count-up animation on stats section
* [CSS-Tricks — A Complete Guide to CSS Grid](https://css-tricks.com/snippets/css/complete-guide-grid/) — Reference for responsive grid layouts
* [WebAIM — Contrast Checker](https://webaim.org/resources/contrastchecker/) — Verified WCAG 2.1 AA color contrast ratios
* [Netlify Docs — Redirects and rewrites](https://docs.netlify.com/routing/redirects/) — `_redirects` configuration for React Router SPA support
* [Vite Docs — Deploying a Static Site](https://vitejs.dev/guide/static-deploy.html) — Build and deployment configuration

---

## Acknowledgments

* [Orbitron Font by Matt McInerney](https://fonts.google.com/specimen/Orbitron) — Gaming-aesthetic heading font
* [Inter Font by Rasmus Andersson](https://fonts.google.com/specimen/Inter) — Readable, modern body font
* Inspiration for the dark gaming UI theme from popular gaming dashboards such as Steam and GOG Galaxy
