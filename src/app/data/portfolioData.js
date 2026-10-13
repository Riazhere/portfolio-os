export const developerProfile = {
  firstName: "RIAZ",
  lastName: "IJAZ",
  title: "Computer Scientist & Software Engineer",
  tagline: "FROM MODELS TO INTERFACES",
  intro: "Deep learning and full-stack development, from training the model to shipping the UI around it.",
  location: "Pakistan",
  email: "riazijazuet@gmail.com",
  availability: "Open to roles · Remote / Worldwide",
  cv: "/Riaz%20Ijaz%20CV.pdf", // matches the file name in /public
  certPath: "/",          // certificates live directly in /public
  thumbPath: "/thumbs/",  // thumbnails live in /public/thumbs
  portrait: "/riaz-cutout.png", // see the profile picture guide
  links: {
    linkedin: "https://www.linkedin.com/in/riaz-ijaz-452225399/",
    github: "https://github.com/Riazhere",
  },
  specialties: ["Python", "React", "FastAPI", "TensorFlow", "SQL", "Unity"],
  about: [
    "I'm a Computer Science graduate of UET Taxila (CGPA 3.66 / 4.0) who likes building things end to end: the model, the API, and the interface people actually use.",
    "My final year project, a skin-lesion diagnosis system, won 1st position among all competing projects in the department. Alongside it I've built NLP pipelines, a Unity game, an LSTM predictor and full-stack web apps, and interned as a front-end developer.",
  ],
  stats: [
    { to: 1, suffix: "st", label: "Position, final year project" },
    { to: 89.22, dec: 2, suffix: "%", label: "Skin-lesion Top-2 accuracy" },
    { to: 7, suffix: "", label: "Course certificates earned" },
  ],

  tech: [
    // [name, role, used in, one-line description]. Edit "used in" to match what you really did.
    ["Python", "LANGUAGE", ["Skin Disease Detection", "Text-to-SQL", "Engine Efficiency Analyzer"], "My main language for ML models, data pipelines and APIs."],
    ["TensorFlow", "DEEP LEARNING", ["Skin Disease Detection"], "Training and benchmarking CNN and ConvNeXt classifiers."],
    ["React", "WEB UI", ["Skin Disease Detection", "Haashes internship"], "Responsive interfaces, from a diagnostic web app to cross-browser pages."],
    ["FastAPI", "BACKEND", ["Skin Disease Detection"], "Serving trained models through fast, typed REST endpoints."],
    ["SQL", "DATABASE", ["Text-to-SQL", "E-Commerce Website"], "Relational schemas and queries, and the output language of my NLP pipeline."],
    ["JavaScript", "LANGUAGE", ["Haashes internship"], "Interactive interfaces and build tooling with Webpack and Gulp."],
    ["OpenCV", "VISION", ["Computer Vision coursework"], "Image preprocessing and computer-vision fundamentals."],
    ["Pandas", "DATA", ["Skin Disease Detection"], "Exploring, cleaning and reshaping datasets before modelling."],
    ["Unity", "GAME ENGINE", ["Unity Survival Shooter"], "Gameplay loops, colliders and state management."],
    ["C#", "LANGUAGE", ["Unity Survival Shooter"], "Gameplay logic and UI state for Unity projects."],
    ["C++", "LANGUAGE", ["University coursework"], "Data structures, algorithms and systems fundamentals."],
    ["Git", "DELIVERY", ["All projects"], "Version control and collaboration."],
  ],

  // The stack, drawn as layers (top = closest to the user)
  layers: [
    { name: "Interface", blurb: "What people see and touch", items: ["React.js", "JavaScript", "HTML & CSS", "Responsive Design", "Webpack", "Gulp"] },
    { name: "Services", blurb: "APIs that connect models to apps", items: ["Python", "FastAPI", "SQL", "MySQL"] },
    { name: "Intelligence", blurb: "Models that learn from data", items: ["Deep Learning", "CNNs", "ConvNeXt", "Transformers (T5)", "LSTM", "NLP", "TensorFlow", "OpenCV"] },
    { name: "Data", blurb: "Pipelines that make data usable", items: ["Pandas", "NumPy", "Data Analysis", "Data Visualization", "ETL Processes", "Data Warehousing", "Excel Dashboards"] },
    { name: "Interactive", blurb: "Games and real-time experiences", items: ["Unity", "C#", "Physics Colliders", "Playtesting", "Collision Testing", "Bug Reproduction"] },
    { name: "Delivery", blurb: "How work ships reliably", items: ["Git", "Agile Development", "Cross-Platform Testing", "Log Analysis", "Project Management"] },
  ],

  skillGroups: {
    "Programming": ["Python", "C++", "Java", "JavaScript", "HTML & CSS", "SQL", "C#"],
    "AI / ML": ["Deep Learning", "CNNs", "Transformers", "ConvNeXt", "TensorFlow", "NLP", "OpenCV", "LSTM"],
    "Data & Analytics": ["Pandas", "NumPy", "Data Analysis", "Data Visualization", "ETL Processes", "Data Warehousing", "Excel Dashboards"],
    "Web & APIs": ["React.js", "FastAPI", "Webpack", "Gulp", "Responsive Design", "MySQL"],
    "Game & QA": ["Unity", "Physics Colliders", "Playtesting", "Bug Reproduction", "Collision Testing", "Log Analysis"],
    "Practice": ["Git", "Agile Development", "Project Management", "Cross-Platform Testing"],
  },

  // Position of the robot face overlay, as % of the portrait square. Tweak to line it up with your face.
  face: { cx: 50, eyeY: 32, eyeGap: 10.3, top: 19, chin: 59 },

  services: [
    { code: "01", title: "AI & Machine Learning", text: "Image classification, NLP and sequence models, from the data pipeline to evaluation.", proof: ["Skin Disease Detection (1st position)", "Text-to-SQL (T5)", "Engine Efficiency LSTM"] },
    { code: "02", title: "Full-Stack Web Apps", text: "Responsive React interfaces backed by FastAPI and SQL.", proof: ["FYP diagnostic web app", "E-Commerce website", "Haashes internship"] },
    { code: "03", title: "Model-to-Product Delivery", text: "Turning a trained model into an API and an interface people can actually use.", proof: ["FastAPI + React app", "ConvNeXt Tiny, 89.22% Top-2"] },
    { code: "04", title: "Game Prototypes & QA", text: "Playable Unity prototypes with tested collisions and state logic.", proof: ["Unity Survival Shooter", "Collision and playtesting"] },
  ],

  caseStudy: {
    kicker: "Featured case study · Final year project",
    title: "Why accuracy alone lied, and how the model got fixed.",
    lead: "A 3-person team benchmarked five deep learning architectures for 7-class skin lesion classification on HAM10000, then shipped the best one as a web app.",
    steps: [
      ["01", "Dataset", "HAM10000: 10,015 dermatoscopic images across 7 lesion classes."],
      ["02", "Preprocess", "Resizing, normalisation and a stratified train/val/test split."],
      ["03", "Augment", "Rotation, zoom and flip, shared across all five models."],
      ["04", "Benchmark", "Five architectures trained and compared on the same data."],
      ["05", "Diagnose", "Baseline CNNs hit 78.38% accuracy but missed the rare, potentially malignant classes."],
      ["06", "Rework", "Categorical Focal Loss to weight the rare classes."],
      ["07", "Select", "ConvNeXt Tiny: 76.09% accuracy and 89.22% Top-2 accuracy."],
      ["08", "Deploy", "A FastAPI inference service with a React interface."],
    ],
    bars: [["Baseline CNN · accuracy", 78.38, false], ["ConvNeXt Tiny · accuracy", 76.09, false], ["ConvNeXt Tiny · Top-2 accuracy", 89.22, true]],
    note: "The baseline looked better on raw accuracy but missed the rare, potentially malignant classes. That pushed the team to Categorical Focal Loss and to judge models on more than one number.",
  },

  modules: [
    ["AI", "AI / ML", "Deep learning · NLP"],
    ["WEB", "FULL STACK", "React · FastAPI"],
    ["DAT", "DATA", "SQL · Pandas · ETL"],
    ["GME", "GAME DEV", "Unity · C#"],
    ["NET", "NETWORKING", "Huawei ICT courses"],
  ],

  education: {
    degree: "BS Computer Science",
    school: "University of Engineering and Technology, Taxila",
    period: "Sep 2022 – Aug 2026",
    cgpa: "3.66 / 4.0",
    sgpa: [3.64, 3.57, 3.83, 3.32, 3.91, 3.68, 3.62, 3.75], // semesters 1-8, from transcript
    earlier: [
      ["FSc Pre-Engineering", "The Scholars Science College, Wah Cantt · 2021", "760 / 1100"],
      ["Matriculation (Science)", "Pioneer Islamic Public School, Wah Cantt · 2019", "882 / 1100"],
    ],
    coursework: [
      "Data Structures & Algorithms", "Operating Systems", "Database Systems", "Software Engineering",
      "Artificial Intelligence", "Artificial Neural Networks", "Natural Language Processing", "Computer Vision",
      "Big Data Analytics", "Parallel & Distributed Computing", "Information Security", "Cryptography",
      "Data Communication & Networks", "Compiler Construction", "Web Engineering", "Game Programming",
    ],
  },

  // Unified timeline: work, education, projects, certificates
  journey: [
    { type: "Certificates", title: "Huawei ICT Academy & NESTGEN courses", org: "Huawei ICT Academy · Nestlé needs YOUth", period: "JUL – OCT 2026",
      points: ["Completed three Huawei networking courses, including HCIA-Datacom V1.0.", "Completed three NESTGEN masterclasses: Computer Engineering, Power Brand and Purpose-Driven Marketing."] },
    { type: "Project", title: "Skin Disease Detection (Final Year Project)", org: "UET Taxila · 1st Position", period: "APR 2025 – JUN 2026",
      points: ["Benchmarked five deep learning architectures on HAM10000 (10,015 images, 58:1 class imbalance).", "Owned the data pipeline and augmentation; co-authored the final report.", "Best model, ConvNeXt Tiny, reached 76.09% accuracy and 89.22% Top-2, deployed with FastAPI and React."] },
    { type: "Certificates", title: "Supervised Learning", org: "Deeplearning.AI / Stanford Online", period: "DEC 2025",
      points: ["Completed the Supervised Learning course, a foundation for the classification work in my final year project."] },
    { type: "Work", title: "Front-End Web Developer Intern", org: "Haashes · IT Department", period: "JUN – AUG 2025",
      points: ["Built responsive, cross-browser web applications with HTML, CSS and JavaScript.", "Streamlined front-end build workflows using Webpack and Gulp.", "Worked with design and backend teams to turn mock-ups into working interfaces."] },
    { type: "Project", title: "Full-Stack E-Commerce Website", org: "University project", period: "JAN – MAY 2025",
      points: ["Built a full-stack e-commerce site backed by a relational SQL database."] },
    { type: "Project", title: "Unity Survival Shooter & Engine Efficiency Analyzer", org: "University projects", period: "AUG – DEC 2024",
      points: ["Shipped a Unity/C# survival shooter with obstacles, projectiles and a three-life state system.", "Deployed an LSTM network that predicts engine efficiency from crankshaft-angle data."] },
    { type: "Project", title: "Text-to-SQL Translation", org: "University project", period: "JAN – MAY 2024",
      points: ["Fine-tuned a T5 transformer to translate English questions into SQL."] },
    { type: "Education", title: "BS Computer Science", org: "UET Taxila · CGPA 3.66 / 4.0", period: "SEP 2022 – AUG 2026",
      points: ["Degree completed in eight semesters, passed in a single attempt."] },
    { type: "Education", title: "FSc Pre-Engineering", org: "The Scholars Science College, Wah Cantt", period: "2020 – 2021", points: ["760 / 1100 marks."] },
  ],

  projects: [
    {
      id: "P / 01", title: "Skin Disease Detection", category: "DEEP LEARNING · FYP", award: "1st Position", image: "/projects/skin.png",
      summary: "7-class skin lesion classifier on HAM10000, deployed as a full-stack diagnostic web app.",
      tags: ["ConvNeXt Tiny", "TensorFlow", "FastAPI", "React"],
      metrics: [["76.09%", "Accuracy"], ["89.22%", "Top-2 accuracy"], ["58:1", "Class imbalance"]],
      role: "Data pipeline owner and co-author of the final report (3-person team).",
      challenge: "HAM10000 has a 58:1 class imbalance. Baseline CNNs hit 78.38% raw accuracy but missed rare, potentially malignant classes, which pushed the team to Categorical Focal Loss.",
      highlights: ["Benchmarked ResNet50, DenseNet121, EfficientNetB3, ViT-B16 and ConvNeXt Tiny", "Preprocessing, stratified splits and augmentation shared across all five models", "ConvNeXt Tiny: 76.09% accuracy, 89.22% Top-2 accuracy", "Served through FastAPI with a React front end"],
    },
    {
      id: "P / 02", title: "Text-to-SQL Translation", category: "NLP",
      summary: "A fine-tuned T5 pipeline that turns English questions into working SQL.",
      tags: ["T5 Transformer", "NLP", "SQL"],
      role: "Built the pipeline.", challenge: "Mapping free-form English onto valid, executable SQL.", // TODO: add your own detail
      highlights: ["Fine-tuned T5 for query generation", "English in, SQL out"],
    },
    {
      id: "P / 03", title: "Unity Survival Shooter", category: "GAME DEVELOPMENT",
      summary: "A survival shooter with continuous flight, dynamic obstacles, projectiles and a three-life system.",
      tags: ["Unity", "C#", "Physics Colliders"],
      role: "Designed, built and playtested the game.",
      challenge: "Making hit detection between projectiles, falling obstacles and the player accurate and reliable.",
      highlights: ["Debugged physics colliders", "Verified score increments on obstacle destruction", "Verified the game-over sequence after three collisions"],
    },
    {
      id: "P / 04", title: "Engine Efficiency Analyzer", category: "DEEP LEARNING",
      summary: "An LSTM model that predicts engine efficiency from crankshaft-angle data.",
      tags: ["LSTM", "Python", "Excel datasets"],
      role: "Built and trained the model.", challenge: "Learning efficiency patterns from sequential crankshaft-angle readings.", // TODO: edit
      highlights: ["LSTM sequence model", "Excel-based datasets"],
    },
    {
      id: "P / 05", title: "Full-Stack E-Commerce Website", category: "WEB DEVELOPMENT",
      summary: "An online store with a relational SQL database behind it.",
      tags: ["SQL", "Full-stack"],
      role: "Built the front end and backend.", challenge: "Keeping products, users and orders consistent in a relational schema.", // TODO: add stack + features
      highlights: ["Relational SQL schema", "End-to-end shopping flow"],
    },
    // Add your other university projects here. Copy any block above and edit it.
  ],

  certificates: [
    { title: "HCIA-Datacom V1.0 Course", issuer: "Huawei ICT Academy", date: "12 Oct 2026", id: "EBG20261012046580", file: "huawei-hcia-datacom.png", thumb: "huawei-hcia-datacom.webp" },
    { title: "General Knowledge of Computer Networks", issuer: "Huawei ICT Academy", date: "12 Oct 2026", id: "ICT20261012000342", file: "huawei-general-networks.png", thumb: "huawei-general-networks.webp" },
    { title: "Computer Network", issuer: "Huawei ICT Academy", date: "12 Oct 2026", id: "ICT20261012000246", file: "huawei-computer-network.png", thumb: "huawei-computer-network.webp" },
    { title: "Manufacturing & Engineering Masterclass", issuer: "NESTGEN · Nestlé needs YOUth", date: "22 Jul 2026", id: "Computer Engineering and Technology", file: "nestgen-computer-engineering.pdf", thumb: "nestgen-computer-engineering.webp" },
    { title: "Digital & Marketing: Power Brand", issuer: "NESTGEN · Nestlé needs YOUth", date: "21 Jul 2026", id: "Cultural relevance", file: "nestgen-power-brand.pdf", thumb: "nestgen-power-brand.webp" },
    { title: "Digital & Marketing: Purpose-Driven", issuer: "NESTGEN · Nestlé needs YOUth", date: "21 Jul 2026", id: "Sustainability marketing", file: "nestgen-purpose-driven.pdf", thumb: "nestgen-purpose-driven.webp" },
    { title: "Supervised Learning", issuer: "Deeplearning.AI / Stanford Online", date: "18 Dec 2025", id: "Stanford Online", file: "Supervised Learning.jpeg", thumb: "Supervised Learning.webp" },
  ],
  experienceLetter: { title: "Experience letter · Front-End Intern", issuer: "Haashes", date: "Jun – Aug 2025", id: "Signed by the Co-Founder", file: "haashes-letter.jpeg", thumb: "haashes-letter.webp" },
};