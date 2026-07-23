const truths = {
    "Four Noble Truths": [
        {
            statement: "Suffering is unavoidable",
            suttas: [
                {
                    id: "sn56.11",
                    topic: "The Nature of Suffering",
                    passage: { from: "sn56.11:4.1", to: "sn56.11:4.2" },
                },
                {
                    id: "sn22.59",
                    topic: "The Five Aggregates",
                    passage: { from: "sn22.59:6.1", to: "sn22.59:6.18" },
                },
            ],
        },
        {
            statement: "Suffering is caused by desire",
            suttas: [
                {
                    id: "sn56.11",
                    topic: "The Origin of Suffering",
                    passage: { from: "sn56.11:4.3", to: "sn56.11:4.5" },
                },
            ],
            seals: [
                {
                    statement: "All emotions are desire",
                    subpoints: [
                        "Desire to feel good",
                        "Desire to not feel bad",
                    ],
                    suttas: [
                        {
                            id: "mn148",
                            topic: "Emotions and the Three Poisons",
                            passage: { from: "mn148:39.1", to: "mn148:39.8" },
                        },
                    ],
                },
            ],
        },
        {
            statement: "Suffering ends by overcoming desire",
            suttas: [
                {
                    id: "sn56.11",
                    topic: "The Cessation of Suffering",
                    passage: { from: "sn56.11:4.6", to: "sn56.11:4.7" },
                },
            ],
            seals: [
                {
                    statement: "All compounded phenomena are impermanent",
                    suttas: [
                        {
                            id: "sn22.12",
                            topic: "Impermanence",
                            passage: { from: "sn22.12:1.4", to: "sn22.12:1.7" },
                        },
                    ],
                    passage_refs: ["The Five Aggregates"],
                },
                {
                    statement: "No compounded phenomenon inherently exists",
                    subpoints: ["It is a sum of its infinite parts"],
                    passage_refs: ["The Five Aggregates"],
                },
            ],
        },
        {
            statement: "Suffering ends with the Eightfold Path",
            suttas: [
                {
                    id: "sn56.11",
                    topic: "The Eightfold Path",
                    passage: { from: "sn56.11:4.8", to: "sn56.11:4.10" },
                },
            ],
            seals: [
                {
                    statement: "Full enlightenment is beyond concepts",
                },
            ],
        },
    ],
};

export { truths };
