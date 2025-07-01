const articles = {
    "human-remains-aboard-memorial-space-flight-lost-at-sea":
        "Human Remains Aboard Memorial Space Flight Lost at Sea",
    "beekeeper-sics-swarm-on-police-during-traffic-stop":
        "Beekeeper Sics Swarm on Police During Traffic Stop",
    "area-51-cover-story-raises-more-questions-than-answers":
        "Area 51 Cover Story Raises More Questions than Answers",
    "watch-border-patrol-agent-reports-witnessing-ufos-in-arizona":
        "Watch: Border Patrol Agent Reports Witnessing UFOs in Arizona",
    "mysterious-hum-torments-scottish-islands":
        "Mysterious Hum Torments Scottish Islanders",
    "watch-bright-light-and-glowing-ring-spotted-over-texas":
        "Watch: Bright Light and Glowing Ring Spotted over Texas",
    "new-report-claims-kenya-space-junk-has-more-mysterious-origin":
        "New Report Claims Kenya 'Space Junk' Has More Mysterious Origin",
    "possible-tic-tac-craft-spotted-in-images-from-mars":
        "Possible Tic-Tac Craft Spotted in Images from Mars",
    "video-teen-with-werewolf-syndrome-sets-record-for-hairiest-face":
        "Video: Teen with 'Werewolf Syndrome' sets Record for Hairiest Face",
    "watch-ufo-whistleblower-describes-recovery-of-egg-shaped-craft":
        "Watch: UFO Whistleblower Describes Recovery of Egg-shaped Craft",
    "untouched-trees-from-la-wildfires-ignite-conspiracy-theories":
        "Untouched Trees from LA Wildfires Ignite Conspiracy Theories",
    "watch-la-news-chopper-films-ufo-above-wildfires":
        "Watch: LA News Chopper Films UFO Above Wildfires",
    "man-running-from-police-gets-stuck-in-chimney":
        "Man Running from Police Gets Stuck in Chimney",
    "watch-drones-as-large-as-suvs-spotted-over-staten-island":
        "Watch: Drones 'as Large as SUVs' Spotted over Staten Island",
    "watch-photo-and-video-show-strange-lights-above-washington-dc":
        "Watch: Photo and Video Show Strange Lights Above Washington, DC",
    "watch-mysterious-object-breaks-apart-in-night-sky-over-texas":
        "Watch: Mysterious Object Breaks Apart in Night Sky over Texas",
    "historian-unveils-royal-familys-many-ghost-encounters":
        "Historian Unveils Royal Family's Many Ghost Encounters",
    "video-bats-face-off-in-beauty-competition":
        "Video: Bats Face Off in Beauty Competition",
    "watch-indiana-residents-report-multiple-ufo-sightings-within-weeks":
        "Watch: Indiana Residents Report Multiple UFO Sightings within Weeks",
    "watch-comet-passes-by-earth-for-first-time-in-80000-years":
        "Watch: Comet Passes by Earth for First Time in 80,000 Years",
    "video-chinese-zoo-proudly-displays-painted-dogs-as-pandas":
        "Video: Chinese Zoo Proudly Displays Dogs Painted as Pandas",
    "video-light-anomaly-appears-inside-washington-state-museum":
        "Video: 'Light Anomaly' Appears Inside Washington State Museum",
    "police-chiefs-focus-on-uap-in-new-official-handbook":
        "Police Chiefs Focus on UAP in New Official Handbook",
    "watch-mushroom-growing-inside-robot-controls-its-movements":
        "Watch: Mushroom Growing Inside Robot Controls Its Movements",
    "video-several-ufos-spotted-in-southern-california":
        "Video: Several UFOs Spotted in Southern California",
    "watch-robot-smiles-with-living-human-skin":
        "Watch: Robot Smiles with Living Human Skin",
    "ancient-carvings-may-depict-comet-and-worlds-first-calendar":
        "Ancient Carvings May Depict Comet and World's First Calendar",
    "watch-massive-swarm-of-dragonflies-engulfs-beachgoers":
        "Watch: Massive Swarm of Dragonflies Engulfs Beachgoers",
    "watch-strange-rings-over-berlin-stir-up-rumors-of-aliens":
        "Strange Rings Over Berlin Stir Up Rumors of Aliens",
    "most-haunted-house-in-new-orleans-up-for-sale":
        "Most Haunted House in New Orleans Up for Sale",
    "two-psychic-animals-correctly-identify-winning-soccer-team":
        "Two Psychic Animals Pick Winning Soccer Team",
    "stars-mysterious-signal-surprises-scientists":
        "Star's Mysterious Signal Surprises Scientists",
};

const shows = {
    "2025-06-28": "Weight Loss Secrets / Roswell & Disclosure",
    "2025-06-27": "The Medicine Wheel & Spiritual Healing / Open Lines",
    "2025-06-22": "Pain Medication Controversy / Gray Barker & UFOs",
    "2025-06-21": "Land of the Lost / Beekeeping",
    "2025-06-20": "What's in a Name? / Open Lines",
    "2025-06-18": "Gambling Addiction / Iran, Israel & Psychic Abilities",
    "2025-06-08": "Reclaiming Your Power / Dark Enlightenment",
    "2025-05-25": "Skinwalker Ranch / Hunting Astronomical Anomalies",
    "2025-05-22": "Numerology & Current Events / Dinosaurs & Dragons",
    "2025-05-15": "Geoengineering & Chemtrails / Starseed Healing",
    "2025-05-11": "JFK Jr. Death Conspiracy / The Omega Car",
    "2025-05-04": "Universe & Consciousness / UAP Disclosure",
    "2025-05-03": "Government ET Secrets / Shadow People",
    "2025-05-02": "Tarot Therapy / Open Lines",
    "2025-04-27": "UAP Wiki Wars / Vegas True Crime",
    "2025-04-17": "Fighting the Federal Reserve / Angels & Consciousness",
    "2025-04-13": "Mitchell-Hedges Crystal Skull / Murder in Central Florida",
    "2025-04-06": "Prayer & Finances / Past & Future Lives",
    "2025-03-29":
        "Antarctica & Ancient Civilizations / Mysteries of the Pyramids",
    "2025-03-28": "Astrology Forecast / Open Lines",
    "2025-03-24": "JFK Assassination Files / Spiritual Transformation",
    "2025-03-23": "Remote Viewing & OBEs / Kung Fu & Martial Arts",
    "2025-03-15": "Investigating Bigfoot / Ghost Hunting & Parapsychology",
    "2025-03-09": "Afterlife Evidence / Weather Magic",
    "2025-02-24": "Changing Gun Policy / AI & Communicating with the Dead",
    "2025-02-23":
        "National Park Disappearances / Unidentified Submerged Objects",
    "2025-02-03": "Eyeing Your Potential / NDEs & the Afterlife",
    "2025-02-02": "Exploring the Other Side / Power of the Knights Templar",
    "2025-01-30": "Quantum Physics & the Bible / ET Encounters",
    "2025-01-29": "Green Energy Breakdown / Dangerous Artificial Intelligence",
    "2025-01-26": "Grey Abilities / Ufology",
    "2025-01-23": "Digital Emergency Kits / Coincidences & Synchronicities",
    "2025-01-18": "NDEs & Transformation / Modern Health Crisis",
    "2025-01-17": "Decoding Dreams / Conspiracy Culture",
    "2025-01-12": "The Final War / Earthing & Trauma Healing",
    "2025-01-11": "The ET Abduction Experience / Open Lines",
    "2024-12-27": "Arizona's Plasma UFOs / Open Lines",
    "2024-12-22": "Biggest UFO Stories of 2024",
    "2024-12-19": "Building a Better Brain / Animal Reincarnation",
    "2024-12-18": "Death of Elvis / Channeling Higher Wisdom",
    "2024-12-14": "UFO Mass Sightings / Lost Scriptures",
    "2024-12-13": "UFO Reports / Life After Death / Open Lines",
    "2024-12-12": "Climate Shifts & Agriculture / Spirit Contact",
    "2024-12-11": "Global Tensions & Tech / Cryptozoology Review",
    "2024-12-08": "Maroon 5 & Therapy / Shamanic Energy Work",
    "2024-11-30": "Power of Gold / Dystopia & Surveillance",
    "2024-11-29": "Tiny Mistakes / Open Lines",
    "2024-11-24": "Path to Singularity / The Energy Cure",
    "2024-11-21": "Roswell & Ufology / Folklore & Exorcisms",
    "2024-11-20": "Near-Death Experience / Astrological Forecast",
    "2024-11-11": "Fuzzy Logic / Reptilians / Working with Veterans",
    "2024-11-10": "Biblical Treasures / UFO Swarms",
    "2024-10-31": "Demonic Investigations / Ghost to Ghost 2024",
    "2024-10-26": "Haunted Houses / Horror Movies",
    "2024-10-25": "ET Contactee / Open Lines",
    "2024-10-22": "Natural Remedies / Spirit Communications",
    "2024-10-21": "Challenging Climate Change / Supernatural Tales",
    "2024-10-20": "Imperiled Animals / Navajo Rangers",
    "2024-10-19": "Hauntings & Exorcisms / Dogman Encounters",
    "2024-10-18": "Global Forces / Dreams & Open Lines",
    "2024-10-13": "Feng Shui Techniques / Astrological Concepts",
    "2024-09-26": "Fearless Guidance / Black Magic",
    "2024-09-22": "Global UAP Secrets / Remote Viewing & UFO Bases",
    "2024-09-21": "Cyber Threats / Paranormal Investigations",
    "2024-09-20": "The Chocolate Business / Open Lines",
    "2024-09-08": "Alien Encounters / Energy Healing",
    "2024-09-05": "Earth's Power Grid / Paranormal Podcast Network",
    "2024-08-26": "Student Loan Crisis / Astrology Wisdom",
    "2024-08-25": "UAP Secrets / Scientist's Mysterious Death",
    "2024-08-17": "Near Death / The Metaphysical Closet",
    "2024-08-16": "Energy Healing / Open Lines",
    "2024-08-15": "Demographic Predictions / Strange Travel Tales",
    "2024-08-10": "Tapping Technique / ET Torment",
    "2024-08-09": "Protecting Bees / Open Lines",
    "2024-08-05": "Middle East Conflicts / Angelic Connection",
    "2024-08-04": "Astrological Houses / Open Lines",
    "2024-08-01": "Psychic Software / Intuition & Healing",
    "2024-07-31": "Past Lives & Angelic Realm / Psychic Abilities",
    "2024-07-30": "Natural Remedies / Afterlife Encounter",
    "2024-07-23": "Biblical Prophecy / Geoengineering",
    "2024-07-21": "UFO Disclosure / Apocalypse & Aliens",
    "2024-07-18": "Lost Civilization / The Angelic Realm",
    "2024-07-17": "Anomalous Health Incidences / Demons & Entities",
    "2024-07-13": "The UFO Paradox / Overcoming Cancer",
    "2024-07-12": "Soulmates & Angels / Open Lines",
    "2024-07-07": "Manifestation & Transformation / Energy of the Cosmos",
    "2024-06-30": "True Crime Cases / Emergency Room Spirits",
    "2024-06-28": "Arizona UFOs / Open Lines",
    "2024-06-16": "Sci-Fi and AI / Women Crime Bosses",
    "2024-06-13": "Alien Encounters / Dark Entities",
    "2024-06-12": "Astrology Forecast / Other Side Communications",
    "2024-06-09": "Legacy of Karloff / Remote Viewing Horse Races",
};

const articleSlugs = Object.keys(articles),
    showDates = Object.keys(shows);

export { articles, shows, articleSlugs, showDates };
