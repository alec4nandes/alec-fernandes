const IS_DEV = true;

const root = IS_DEV
        ? "http://localhost:5000/alec-fernandes/us-central1"
        : "https://us-central1-alec-fernandes.cloudfunctions.net",
    endpoints = {
        chat: `${root}/chat`,
    };

export { endpoints };
