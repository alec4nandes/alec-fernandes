// TODO: sync data w/ quiz somehow (http endpoint?)

const noble8 = {
    "Wisdom Group": {
        pali: "Prajna",
        summary: "What's the correct view?",
        paths: {
            "Right View": {
                pali: "Sammā Diṭṭhi",
                summary: "or Right Understanding",
                description:
                    "Understanding the Four Noble Truths and the law of cause and effect (karma).",
                lists: [
                    "The Four Noble Truths",
                    "The Three Kinds of Suffering",
                    "The Three Kinds of Craving",
                    "The Four Attachments",
                    "The Eight Vicissitudes (or Worldly Dharmas)",
                    "The Five Aggregates",
                ],
                suttas: ["mn9", "mn141"],
                behaviors: {
                    good: [
                        {
                            example:
                                "Recognizing the impermanence of life and striving for spiritual growth.",
                            suttas: ["sn12.15"],
                        },
                    ],
                    bad: [
                        {
                            example:
                                "Believing that happiness comes solely from material possessions or denying the consequences of one's actions.",
                            suttas: ["mn135"],
                        },
                    ],
                },
            },
            "Right Intention": {
                pali: "Sammā Saṅkappa",
                summary: "or Right Thought",
                description:
                    "Cultivating thoughts of renunciation, loving-kindness, and harmlessness.",
                lists: ["The Three Wholesome Intentions"],
                suttas: ["mn19"],
                behaviors: {
                    good: [
                        {
                            example:
                                "Developing an intention to be kind and let go of attachments.",
                            suttas: ["mn20"],
                        },
                    ],
                    bad: [
                        {
                            example:
                                "Harboring thoughts of ill-will or desiring harm to others.",
                            suttas: ["an7.60"],
                        },
                    ],
                },
            },
        },
    },
    "Morality Group": {
        pali: "Sila",
        summary: "Which actions should I avoid?",
        paths: {
            "Right Speech": {
                pali: "Sammā Vācā",
                description: "Speaking truthfully, kindly, and constructively.",
                lists: ["The Four Unwholesome Forms of Speech"],
                suttas: ["mn58", "an5.198"],
                behaviors: {
                    good: [
                        {
                            example:
                                "Speaking honestly and avoiding lies or exaggeration.",
                            suttas: ["mn21"],
                        },
                    ],
                    bad: [
                        {
                            example:
                                "Spreading rumors, using hurtful language, or lying.",
                            suttas: ["dn33"],
                        },
                    ],
                },
            },
            "Right Action": {
                pali: "Sammā Kammanta",
                description: "Behaving ethically and non-violently.",
                lists: ["The Five Precepts", "The Ten Wholesome Conducts"],
                suttas: ["mn114"],
                behaviors: {
                    good: [
                        {
                            example: "Helping others and living peacefully.",
                            suttas: ["sn2.14"],
                        },
                    ],
                    bad: [
                        {
                            example:
                                "Stealing, harming others, or engaging in misconduct.",
                            suttas: ["mn135"],
                        },
                    ],
                },
            },
            "Right Livelihood": {
                pali: "Sammā Ājīva",
                description: "Choosing a profession that does not harm others.",
                lists: ["The Five Unwholesome Livelihoods"],
                behaviors: {
                    good: [
                        {
                            example:
                                "Choosing ethical professions such as teaching or healing.",
                            suttas: ["dn31"],
                        },
                    ],
                    bad: [
                        {
                            example:
                                "Engaging in professions that exploit others or harm the environment.",
                            suttas: ["an5.177"],
                        },
                    ],
                },
            },
        },
    },
    "Concentration Group": {
        pali: "Samadhi",
        summary: "How can I focus?",
        paths: {
            "Right Effort": {
                pali: "Sammā Vāyāma",
                description:
                    "Making a persistent effort to abandon unwholesome states and develop wholesome ones.",
                lists: ["The Four Right Exertions", "The Ten Perfections"],
                behaviors: {
                    good: [
                        {
                            example:
                                "Consistently striving to develop kindness and mindfulness.",
                            suttas: ["sn45.8"],
                        },
                    ],
                    bad: [
                        {
                            example:
                                "Allowing oneself to become complacent or indulging in harmful habits.",
                            suttas: ["mn41"],
                        },
                    ],
                },
            },
            "Right Mindfulness": {
                pali: "Sammā Sati",
                summary:
                    "Right Mindfulness is broad, non-judgmental awareness of all experiences. Right Mindfulness is being aware of when the mind wanders, and Right Concentration brings it back to the chosen object.",
                description:
                    "Maintaining awareness of the body, feelings, mind, and mental objects.",
                lists: [
                    "Three Feeling Tones",
                    "The Six Wholesome (vs. Unwholesome) Roots of Mind",
                    "The Six External (and Internal) Sense Doors",
                    "The Seven Constituents of Awakening (vs. The Five Hinderances)",
                ],
                suttas: ["dn22"],
                behaviors: {
                    good: [
                        {
                            example:
                                "Practicing mindfulness by observing one's breath or emotions without judgment.",
                            suttas: ["mn10"],
                        },
                    ],
                    bad: [
                        {
                            example:
                                "Being absent-minded or overly distracted by unimportant concerns.",
                            suttas: ["mn119"],
                        },
                    ],
                },
            },
            "Right Concentration": {
                pali: "Sammā Samādhi",
                summary:
                    "Right Concentration, or Right Meditation, is the focused attention on a single object, like the breath, to stabilize the mind. Right Mindfulness is being aware of when the mind wanders, and Right Concentration brings it back to the chosen object.",
                description:
                    "Developing deep states of meditative absorption (jhānas) through focused mental discipline.",
                lists: [
                    "The Four Brahma-Viharas",
                    "The Seven Constituents of Awakening (vs. The Five Hinderances)",
                    "The Seven Points of Posture",
                    "The Four Metta Phrases",
                    "The Six Stages of Metta",
                    "The Four Meditative Absorptions",
                ],
                suttas: ["dn2"],
                behaviors: {
                    good: [
                        {
                            example:
                                "Regularly meditating and cultivating one-pointed focus leading to peace and insight.",
                            suttas: ["an9.36"],
                        },
                    ],
                    bad: [
                        {
                            example:
                                "Allowing the mind to become scattered and indulging in distractions instead of meditating.",
                            suttas: ["an4.41"],
                        },
                    ],
                },
            },
        },
    },
};

export { noble8 };
