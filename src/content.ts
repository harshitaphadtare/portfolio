export const profile = {
  name: "Harshita Phadtare",
  firstName: "Harshita",
  role: "AI Engineer",
  location: "Melbourne, AU",
  email: "harshita.codewiz@gmail.com",
  resume: "/Harshita_Phadtare.pdf",
  now: "MS Artificial Intelligence @ RMIT",
  intro:
    "I build AI-powered products that solve real problems and hold up once they're in production. I use AI to move fast, then apply system design, architecture and security to make what I ship last.",
  about: [
    "I'm an engineer who got hooked on the moment a messy, real-world problem turns into a system that just works. That might be leads slipping through the cracks across seven brands, notes you'll forget by exam week, or thousands of reviews nobody has time to read.",
    "I keep up with how fast the field moves and use AI aggressively in how I build: agents, LLMs and voice in the product, and AI-assisted tooling in my workflow. Speed is only half of it, though. Every system gets the same treatment: clear architecture, sensible boundaries, failure modes thought through and security considered from the first commit.",
    "After a B.Tech in Information Technology at K J Somaiya in Mumbai, I moved to Melbourne in July 2026 to do a Master's in Artificial Intelligence at RMIT.",
  ],
};

export const socials = [
  { label: "LinkedIn", url: "https://www.linkedin.com/in/harshitaphadtare" },
  { label: "GitHub", url: "https://github.com/harshitaphadtare" },
  { label: "Medium", url: "https://medium.com/@hphadtare02" },
];

export const principles = [
  {
    k: "01",
    title: "Problem first",
    body: "I start with the person who's stuck, not the model. If a spreadsheet solves it, I'll tell you. If it needs an agent, it gets one.",
  },
  {
    k: "02",
    title: "AI-accelerated, engineer-verified",
    body: "LLMs, agents and AI tooling let me prototype in days. Tests, reviews and evaluations decide what actually ships.",
  },
  {
    k: "03",
    title: "Architecture that scales",
    body: "Queues, workers, caching and clean service boundaries. Systems are designed to grow past the demo.",
  },
  {
    k: "04",
    title: "Secure by default",
    body: "Auth, role-based access, secrets handling and input validation are part of the design, not a cleanup task.",
  },
];

export type Project = {
  id: string;
  index: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  tags: string[];
  stack: string[];
  image: string;
  gallery?: (string | { src: string; caption: string })[];
  video?: string;
  live?: string;
  github?: string;
  article?: string;
  metrics: { value: string; label: string }[];
  pipeline: string[];
  overview: string[];
  contribution: string[];
  challenges: string[];
};

export const projects: Project[] = [
  {
    id: "cram",
    index: "01",
    title: "Cram",
    tagline: "A one-stop study workspace that turns your notes into quizzes and knows what you're about to forget.",
    year: "2026",
    role: "Solo · product, design & engineering",
    tags: ["LLM", "Full Stack", "Spaced Repetition"],
    stack: ["Next.js 16", "TypeScript", "Server Actions", "Tailwind CSS", "shadcn/ui", "Prisma", "Supabase Postgres", "Supabase Auth", "Supabase Storage", "BlockNote", "Gemini API", "Resend", "Vercel"],
    image: "/cram/landing.jpg",
    gallery: [
      { src: "/cram/dashboard.jpg", caption: "Home: daily goal ring, streak with freezes, next step and achievements" },
      { src: "/cram/folder.jpg", caption: "Subjects with per-page mastery, a to-do list and a roadmap" },
      { src: "/cram/quizzes.jpg", caption: "Quiz history and retention by subject, weakest first" },
      { src: "/cram/pomodoro.jpg", caption: "A focus timer that keeps running across the app" },
      { src: "/cram/planner.jpg", caption: "A planner that understands 'tomorrow' and 'every day'" },
      { src: "/cram/search.jpg", caption: "Ctrl/Cmd+K search across pages, folders and note content" },
    ],
    live: "https://cram-eta.vercel.app",
    github: "https://github.com/harshitaphadtare/Cram",
    metrics: [
      { value: "Notes → Quiz", label: "Gemini generates quizzes from your own pages, with every wrong answer linked back to its source" },
      { value: "Spaced review", label: "Per-page mastery scores schedule each page's next review" },
      { value: "3 roles", label: "Shared folders with viewer, editor and admin permissions" },
    ],
    pipeline: ["Write", "Quiz (Gemini)", "Mastery", "Schedule review", "Streak + XP"],
    overview: [
      "Studying usually means five tabs: notes in one app, flashcards in another, a timer, a to-do list and a calendar. Cram puts all of it in one calm place and adds the part most tools skip, which is remembering things long-term.",
      "You write in a Notion-style editor organised by subject. One click turns any set of pages into an AI quiz at three difficulty levels. Each result updates a mastery score for that page, and Cram schedules its next review: strong recall stretches the interval, weak recall brings it back tomorrow. A Pomodoro timer, a natural-language planner, per-subject roadmaps and a streak/XP system keep you coming back every day.",
    ],
    contribution: [
      "Designed and built the whole product solo on Next.js 16 (App Router and Server Actions), with Prisma on Supabase Postgres.",
      "Integrated Gemini for quiz generation from selected pages, linking every wrong answer back to the page it came from.",
      "Built the spaced-repetition and gamification engine: mastery scores, review scheduling, streaks with freezes, XP, levels and 17 achievements.",
      "Added collaboration through shared folders with viewer, editor and admin roles, while keeping quizzes, streaks and XP personal.",
      "Shipped timezone-aware reminder emails, a product tour for new accounts and a Ctrl/Cmd+K search across page titles and note content.",
    ],
    challenges: [
      "Security from day one: Supabase Auth with Google and email sign-in, plus a strong-password policy enforced both in the UI and in Supabase. A proxy layer refreshes sessions and protects routes, and the current user comes from a local JWT check cached per request.",
      "Latency. The database lives in Sydney, so server functions are pinned to the nearest Vercel region (syd1). A region mismatch adds roughly 200 ms to every query.",
      "Keeping motivation honest: focus sessions, quizzes and note-writing all count toward the streak, and streak freezes protect a busy day without letting people game the system.",
    ],
  },
  {
    id: "wander",
    index: "02",
    title: "Wander",
    tagline: "A personal explore map that remembers where you go and nudges you somewhere new.",
    year: "2026",
    role: "Solo · product, design & engineering",
    tags: ["Local-first", "PWA", "AI", "Geospatial"],
    stack: ["React", "TypeScript", "Vite PWA", "MapLibre GL", "OpenFreeMap", "Dexie / IndexedDB", "Turf.js", "Supabase", "Cloudflare Workers", "openrouteservice", "Overpass API", "Open-Meteo", "SunCalc", "Gemini API", "Motion"],
    image: "/wander/hero.jpg",
    gallery: ["/wander/checkin.jpg", "/wander/privacy.jpg", "/wander/features.jpg"],
    live: "https://wander-one-eta.vercel.app",
    github: "https://github.com/harshitaphadtare/Wander",
    metrics: [
      { value: "$0", label: "Monthly running cost, with no API keys needed for the core app" },
      { value: "AES-256-GCM", label: "Synced data is encrypted on the device before upload, and photos never leave it" },
      { value: "Offline-first", label: "IndexedDB is the source of truth, and sync runs in the background" },
    ],
    pipeline: ["Check in", "IndexedDB", "Encrypt", "Sync", "Explore picks"],
    overview: [
      "I love exploring new places on my own, especially since moving to Melbourne, so I built the app I wanted for it. Wander remembers the cafés, parks and corners you keep going back to, turns repeat visits into favourites, and finds somewhere new when you're bored.",
      "It's a PWA built for the iPhone home screen that also works on a laptop. It covers one-tap check-ins, a walk planner that knows which cafés will be open when you pass them, leave-by timing around sunset and the hourly forecast, a visits heatmap, a journal, a fog-of-war 'explored %' and Explore by mood.",
    ],
    contribution: [
      "Designed a local-first architecture where every write lands in IndexedDB instantly and an optional Supabase sync engine pushes changed rows and pulls by a server cursor.",
      "Derived visit counts from the visits table instead of storing them, so check-ins logged on two devices merge without conflicts. The generic sync table means new features need no database migrations.",
      "Built the walk planner: walking routes through a Cloudflare Worker that keeps the routing key server-side, cafés within 150 m sorted by detour, and opening hours evaluated for the time you'd actually walk past.",
      "Built Explore by mood, which ranks three to five real nearby places by novelty, opening hours, weather and time to sunset. AI only writes the reasons, so it can't invent a place.",
    ],
    challenges: [
      "Privacy as a feature: synced records are sealed with AES-256-GCM on the device, so the server only ever sees ciphertext, and photos never leave the phone.",
      "Resilient place data on free infrastructure: results appear instantly from the map's vector tiles, then get upgraded by Overpass queries raced across mirrors, with a keyless routing fallback if the primary router is down.",
      "Grounding the AI: the model never chooses places, it only explains a ranking built from real map data. That rules out hallucinated cafés by design.",
    ],
  },
  {
    id: "revu",
    index: "03",
    title: "Revu",
    tagline: "Turning thousands of scattered customer reviews into business intelligence.",
    year: "2025",
    role: "Lead engineer · end-to-end",
    tags: ["LLM", "NLP", "MLOps"],
    stack: ["Python", "FastAPI", "Playwright", "BeautifulSoup", "Apify", "Gemini API", "Redis", "MongoDB", "React", "Docker", "GitHub Actions", "Pytest"],
    image: "/revu/revu.png",
    video: "/revu/revu-demo-1762035753892.mp4",
    github: "https://github.com/harshitaphadtare/Revu",
    metrics: [
      { value: "LLM + TextRank", label: "Hybrid summarisation with an offline fallback" },
      { value: "CI/CD", label: "GitHub Actions and Pytest across the API and workers" },
      { value: "Dockerised", label: "Containerised services, reproducible deploys" },
    ],
    pipeline: ["Scrape", "Clean", "Sentiment", "Summarise", "Dashboard"],
    overview: [
      "E-commerce teams drown in feedback spread across Amazon, Flipkart and elsewhere. Reading and tagging it by hand is slow and inconsistent. Revu collects, analyses and summarises those reviews automatically, so teams see themes and sentiment at a glance.",
      "Reviews are gathered with Playwright and BeautifulSoup, with Apify handling proxy rotation for reliable large-scale scraping. Summaries come from Gemini, with a deterministic TextRank path as a fast offline fallback. A FastAPI backend and worker modules handle processing, and a React dashboard surfaces the trends.",
    ],
    contribution: [
      "Designed and built the full system, from backend APIs and the scraping engine to the NLP pipeline and the React dashboard.",
      "Integrated Gemini behind a configurable interface, so the system degrades gracefully to TextRank when the LLM isn't available.",
      "Containerised everything with Docker and set up CI/CD in GitHub Actions, with Pytest suites guarding the API and worker modules.",
    ],
    challenges: [
      "Large-scale scraping kept tripping rate limits and IP bans. Moving proxy rotation and headless browsing onto Apify made the pipeline stable.",
      "Review styles vary wildly between categories. Combining deterministic TextRank with LLM summaries balanced precision, speed and interpretability.",
    ],
  },
  {
    id: "gopredict",
    index: "04",
    title: "GoPredict",
    tagline: "Predicting urban travel times better than distance ever could.",
    year: "2025",
    role: "Lead engineer · open source",
    tags: ["Machine Learning", "Geospatial", "Open Source"],
    stack: ["Python", "XGBoost", "Scikit-learn", "FastAPI", "React", "Google Maps API", "Meteostat API"],
    image: "/gopredict/gopredict.png",
    video: "/gopredict/gopredict-1762027007945.mp4",
    github: "https://github.com/harshitaphadtare/GoPredict",
    article:
      "https://medium.com/@hphadtare02/how-machine-learning-predicts-trip-duration-just-like-uber-zomato-91f7db6e9ce9",
    metrics: [
      { value: "R² 0.85+", label: "On held-out NYC and SF trip data" },
      { value: "+15–20%", label: "Improvement over distance-based baselines" },
      { value: "15", label: "Open-source contributors · 21 forks" },
    ],
    pipeline: ["Trips", "Weather + Routes", "Features", "XGBoost", "ETA"],
    overview: [
      "Two trips of the same distance can take wildly different times depending on the hour, the weather and the route. GoPredict is a full-stack ML application that predicts travel times in New York City and San Francisco from historical taxi data, enriched with real-world context.",
      "The pipeline engineers features like Manhattan distance, time of day, day of week, origin–destination hotspot clusters and precipitation, then trains a tuned XGBoost regressor. A React front-end lets you explore 'what-if' trips interactively.",
    ],
    contribution: [
      "Led the full workflow: data ingestion, feature engineering, modelling, API and front-end.",
      "Integrated Google Maps and Meteostat to enrich trips with routing and weather context.",
      "Open-sourced it with docs, tests and contribution guidelines, and grew it to 15 contributors.",
    ],
    challenges: [
      "Capturing the variability of city traffic took temporal features, hotspot clustering and external weather and routing signals.",
      "I kept the feature pipeline modular and transparent, so a high-accuracy model stayed explainable to stakeholders.",
    ],
  },
];

export const experience = [
  {
    company: "AllHome",
    role: "Software Engineering Intern",
    period: "Jan 2026 – Jul 2026",
    points: [
      "Architected Hermes, a custom middleware layer that unifies enquiry channels across 7 AllHome brands into one structured pipeline. It consolidates 40+ daily leads that were previously scattered, lost or left without a response.",
      "Built a telephony automation layer where an AI voice agent screens inbound calls, replacing manual first response so no lead drops because nobody was available.",
    ],
    stack: ["Python", "n8n", "Zoho", "Meta APIs", "ElevenLabs", "Twilio"],
  },
  {
    company: "GirlScript Summer of Code",
    role: "Open Source Contributor",
    period: "Sep 2025 – Nov 2025",
    points: [
      "Shipped UI and accessibility improvements to Neonest.",
      "Designed and built a PDF export of feeding logs, vaccination records and memories, with authenticated data fetching and structured generation.",
    ],
    stack: ["React", "Node.js", "Express", "PDFKit"],
  },
  {
    company: "LUBUS",
    role: "WordPress Development Intern",
    period: "Jun 2024 – Sep 2024",
    points: [
      "Improved dashboard navigation and block-based design workflows.",
      "Built custom themes with Full Site Editing and template hierarchies for scalable content management.",
    ],
    stack: ["WordPress", "Gutenberg", "FSE", "React"],
  },
];

export const recognition = [
  { title: "Hacktoberfest 2025", detail: "One of 10,000 global contributors · 6 PRs across 5+ repos", year: "2025" },
  { title: "Smart India Hackathon", detail: "Finalist, top 30 at university level · motion amplification for vibration analysis, Ministry of Defence", year: "2023" },
  { title: "Microsoft Learn Student Ambassador", detail: "Alpha-level ambassador", year: "2024" },
  { title: "Swasth Tech Champs", detail: "Top 50 in India · built Robust, a mental-wellness app", year: "2021" },
  { title: "BloomBox E-Cell, KJSCE", detail: "Finance Secretary · previously Corporate Relations", year: "2023–26" },
];

export const education = [
  {
    school: "RMIT University",
    place: "Melbourne",
    degree: "Master of Artificial Intelligence",
    period: "Jul 2026 – Present",
    note: "In progress",
  },
  {
    school: "K J Somaiya College of Engineering",
    place: "Mumbai",
    degree: "B.Tech, Information Technology",
    period: "2022 – 2026",
    note: "GPA 8 / 10",
  },
];

export const certifications = [
  "Supervised Machine Learning: Regression & Classification · Stanford",
  "Advanced Learning Algorithms · Stanford",
  "Probability & Statistics for Data Science",
  "The Complete Web Development Bootcamp · London App Brewery",
];

export const toolkit = [
  { group: "AI / ML", items: ["TensorFlow", "Keras", "Scikit-learn", "XGBoost", "NumPy", "Pandas", "OpenCV", "NLP"] },
  { group: "LLMs & Agents", items: ["Claude", "Gemini", "Codex", "ElevenLabs", "n8n", "Twilio"] },
  { group: "Backend & Systems", items: ["FastAPI", "Node.js", "Express", "Redis", "WebSockets", "Docker", "GitHub Actions"] },
  { group: "Data", items: ["PostgreSQL", "MySQL", "MongoDB", "Power BI"] },
  { group: "Frontend", items: ["React", "TypeScript", "JavaScript", "Tailwind"] },
  { group: "Languages", items: ["Python", "JavaScript", "C++", "C"] },
];

export const marquee = [
  "LLM integrations",
  "AI agents",
  "Voice automation",
  "ML pipelines",
  "System design",
  "Secure by default",
  "Real-world problems",
];
