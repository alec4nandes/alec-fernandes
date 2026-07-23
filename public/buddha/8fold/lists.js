// TODO: display all lists in study/guide/lists

const lists = {
    "The Four Noble Truths": {
        summary:
            "This was the Buddha's first and fundamental teaching about the nature of our experience and spiritual potential.",
        items: [
            "the existence of suffering",
            "the origin of suffering (desire)",
            "the cessation of suffering (ending desire)",
            "the path for the cessation of suffering (The Noble Eightfold Path)",
        ],
    },
    "The Three Kinds of Suffering": {
        summary:
            "The Buddha taught that we can understand different kinds of suffering through these three categories.",
        items: [
            "the suffering of pain",
            "the suffering of change",
            "the suffering of conditioned existence",
        ],
    },
    "The Three Kinds of Craving": {
        summary: 'Pali uses the word "tanha" (thirst) to describe craving.',
        items: ["sense pleasures", "existence", "non-existence"],
    },
    "The Four Attachments": {
        summary: "These are the attachments which lead to unsatisfactoriness.",
        items: [
            "self-image clinging",
            "wrong-view clinging",
            "rites-and-rituals clinging",
            "sense-pleasure clinging",
        ],
    },
    "The Eight Vicissitudes (or Worldly Dharmas)": {
        summary:
            "According to the Buddha, we will experience these vicissitudes throughout our lives no matter our intentions or actions.",
        items: [
            "pleasure and pain",
            "gain and loss",
            "praise and blame",
            "fame and disrepute",
        ],
    },
    "The Five Aggregates": {
        summary:
            "These temporary conditioned phenomena create the illusion of self.",
        items: [
            "form, matter",
            "feelings, sensations",
            "perceptions",
            "mental formations, volition",
            "consciousness",
        ],
    },
    "The Three Wholesome Intentions": {
        summary:
            "These mental commitments foster wholesome thoughts and motivations.",
        items: ["renunciation", "loving-kindness", "harmlessness"],
    },
    "The Four Unwholesome Forms of Speech": {
        summary: "Avoid communicating in these ways.",
        items: [
            "false speech",
            "harsh speech",
            "divisive speech",
            "idle speech",
        ],
    },
    "The Five Precepts": {
        summary: "An ethical life is founded on these standards of conduct.",
        items: [
            "no killing",
            "no stealing",
            "no sexual misconduct",
            "no false, harsh, divisive, or idle speech",
            "no intoxicants that cloud the mind",
        ],
    },
    "The Ten Wholesome Conducts": {
        summary:
            "These levels of action are grouped into those of the body, speech, and mind.",
        items: {
            "body group": ["no killing", "no stealing", "no sexual misconduct"],
            "speech group": [
                "no false speech",
                "no harsh speech",
                "no divisive speech",
                "no idle speech",
            ],
            "mind group": [
                "no greedy thoughts",
                "no anger",
                "no unwholesome views",
            ],
        },
    },
    "The Five Unwholesome Livelihoods": {
        summary: "Avoid working in these professions.",
        items: [
            "dealing in weapons",
            "dealing in human beings",
            "dealing in meat",
            "dealing in intoxicants",
            "dealing in poisons",
        ],
    },
    "The Four Right Exertions": {
        summary: "Refine your mental states in these ways.",
        items: [
            "prevent unwholesome states from arising",
            "extinguish unwholesome states that have already arisen",
            "cultivate wholesome states that have not yet arisen",
            "strengthen wholesome states that have already arisen",
        ],
    },
    "The Ten Perfections": {
        summary:
            "These are the qualities a bodhisattva cultivates on the path to enlightenment.",
        items: [
            "generosity",
            "ethical conduct",
            "renunciation",
            "wisdom",
            "energy",
            "patience",
            "truthfulness",
            "determination",
            "loving-kindness",
            "equanimity",
        ],
    },
    "Three Feeling Tones": {
        summary: "Experience is felt as one of three tones.",
        items: ["pleasant", "unpleasant", "neutral"],
    },
    "The Six Wholesome (vs. Unwholesome) Roots of Mind": {
        summary:
            "The mind is always under the influence of one of these states. The unwholesome states are also called The Three Poisons.",
        items: [
            "generosity (vs. greed)",
            "love (vs. hatred)",
            "wisdom (vs. delusion)",
        ],
        unordered: true,
    },
    "The Six External (and Internal) Sense Doors": {
        summary: "Everything we experience comes through these portals.",
        items: [
            "eye (seeing)",
            "ear (hearing)",
            "nose (smelling)",
            "tongue (tasting)",
            "body (touching)",
            "mind (thinking)",
        ],
    },
    "The Four Brahma-Viharas": {
        summary:
            'These four "best abodes" reflect the mind state of enlightenment.',
        items: ["loving-kindness", "compassion", "joy, rapture", "equanimity"],
    },
    "The Seven Constituents of Awakening (vs. The Five Hinderances)": {
        summary: "These mental qualities lead to liberation, or hinder it.",
        items: [
            "mindfulness",
            "investigation (vs. doubt)",
            "energy, determination (vs. sleepiness, sloth)",
            "joy, rapture (vs. aversion, anger, hatred)",
            "tranquility (vs. restlessness, worry)",
            "concentration",
            "equanimity (vs. desire, clinging, craving)",
        ],
    },
    "The Seven Points of Posture": {
        summary:
            "Attend to each in turn when you first take your meditation seat. If you become uncomfortable while sitting, you may go through these points again.",
        items: ["legs", "back", "eyes", "hands", "shoulders", "tongue", "head"],
    },
    "The Four Metta Phrases": {
        summary:
            "Send loving-kindness to yourself and others by using these phrases or words that have personal meaning for you.",
        items: [
            "May I be free from danger.",
            "May I be happy.",
            "May I be healthy.",
            "May I live with ease.",
        ],
    },
    "The Six Stages of Metta": {
        summary:
            "Expand your circle of loving-kindness by starting with yourself and moving gradually outward.",
        items: [
            "yourself",
            "a good friend",
            "a neutral person",
            "a difficult person",
            "all four",
            "the entire universe",
        ],
    },
    "The Six Realms of Existence": {
        summary:
            "Analogies for conditioned experiences within samsara where beings are reborn.",
        items: {
            "higher experiences": ["heaven", "asura", "human"],
            "lower experiences": ["animal", "hungry ghost", "hell"],
        },
    },
    "The Four Meditative Absorptions": {
        summary: "Evolving states of meditation.",
        items: [
            "aloof from sense desires and unwholesome thoughts, resulting in applied and sustained thought, joy and bliss.",
            "replacing applied and sustained thought with single-pointedness of mind, tranquility, joy and bliss.",
            "replacing mental joy with equanimity, mindfulness and bodily bliss.",
            "beyond joy and bliss, suffering, and sorrow: total equanimity and mindfulness.",
        ],
        suttas: [{ id: "an9.36" }],
    },
};

const mentalFormations = {
    "5 Universals": {
        score: 1,
        items: [
            "awareness of contact",
            "awareness of attention",
            "awareness of feeling",
            "awareness of perception",
            "awareness of choice",
        ],
    },
    "5 Particulars": {
        score: 2,
        items: [
            "intention",
            "determination",
            "mindfulness",
            "concentration",
            "insight",
        ],
    },
    "11 Wholesome": {
        score: 3,
        items: [
            "faith",
            "inner humility",
            "humility before others",
            "absence of craving",
            "absence of hatred",
            "absence of ignorance",
            "diligence",
            "tranquility, ease",
            "vigilance",
            "equanimity",
            "non harming",
        ],
    },
    "6 Primary Unwholesome (High)": {
        score: -3,
        items: [
            "craving, covetousness",
            "hatred",
            "ignorance, confusion",
            "arrogance",
            "doubt, suspicion",
            "wrong view",
        ],
    },
    "10 Secondary Unwholesome (High)": {
        score: -3,
        items: [
            "anger",
            "resentment, enmity",
            "concealment",
            "maliciousness",
            "jealousy",
            "selfishness, parsimony",
            "deceitfulness, fraud",
            "guile",
            "desire to harm",
            "pride",
        ],
    },
    "2 Secondary Unwholesome (Mid)": {
        score: -2,
        items: ["lack of inner humility", "lack of humility before others"],
    },
    "8 Secondary Unwholesome (Low)": {
        score: -1,
        items: [
            "restlessness",
            "drowsiness",
            "doubt, disbelief",
            "laziness",
            "negligence",
            "forgetfulness",
            "distraction",
            "lack of discernment",
        ],
    },
    "4 Indeterminate": {
        score: 0,
        items: [
            "regret, repentance",
            "sleepiness",
            "initial thought",
            "sustained thinking",
        ],
    },
};

export { lists, mentalFormations };
