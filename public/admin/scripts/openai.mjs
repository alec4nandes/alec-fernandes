/**
 * OpenAI Buffered Response:
 * Buffered responses provide more reliable JSON.
 *
 * @async
 * @function openAiBuffered
 * @param {object} req The request's data for Chat-GPT's response.
 * @param {string} [req.systemContent] Optional instructions for Chat-GPT's
 *     response.
 * @param {string} req.prompt The text for Chat-GPT to analyze.
 * @param {object} [req.jsonSchema] An optional object as a template for a
 *     JSON response.
 * @param {number} [req.temperature] An optional number between 0-1 that
 *    sets the level of Chat-GPT's creativity.
 * @param {Element} [req.displayElem] An optional document element that
 *     shows the streamed response chunk by chunk.
 * @param {Element} req.token A token from a signed-in user on Google Firebase.
 * @returns {Promise<(object|string|null)>} An object if there's a jsonSchema,
 *     a string if not, and null if there's an error.
 */

async function openAiBuffered({
    systemContent,
    prompt,
    jsonSchema,
    temperature,
    displayElem,
    message = { start: "Getting response..." },
    token,
}) {
    try {
        displayElem && (displayElem.textContent = message.start);
        const endpoint =
                "https://22bgimafvhroblvxfwaicex73e0khmzb.lambda-url.us-east-2.on.aws/",
            response = await getStreamResponse({
                endpoint,
                systemContent,
                prompt,
                jsonSchema,
                temperature,
                token,
            });
        const { content } = (await response.json()).choices[0].message;
        displayElem && (displayElem.textContent = content);
        return jsonSchema ? JSON.parse(content) : content;
    } catch (err) {
        displayElem && (displayElem.textContent = err.message);
        console.error(err);
        return null;
    }
}

/**
 * OpenAI Streamed Response:
 *
 * @async
 * @function openAiStreamed
 * @param {object} req The request's data for Chat-GPT's response.
 * @param {string} [req.systemContent] Optional instructions for Chat-GPT's
 *     response.
 * @param {string} req.prompt The text for Chat-GPT to analyze.
 * @param {object} [req.jsonSchema] An optional object as a template for a
 *     JSON response.
 * @param {number} [req.temperature] An optional number between 0-1 that
 *    sets the level of Chat-GPT's creativity.
 * @param {Element} [req.displayElem] An optional document element that
 *     shows the streamed response chunk by chunk.
 * @param {Element} req.token A token from a signed-in user on Google Firebase.
 * @returns {Promise<(object|string|null)>} An object if there's a jsonSchema,
 *     a string if not, and null if there's an error.
 */
async function openAiStreamed({
    systemContent,
    prompt,
    jsonSchema,
    temperature,
    displayElem,
    message = { start: "Getting response..." },
    token,
}) {
    try {
        displayElem && (displayElem.textContent = message.start);
        const endpoint =
                "https://qkhc7ig77yaaly33hd6i2he6yi0ydqdx.lambda-url.us-east-2.on.aws/",
            response = await getStreamResponse({
                endpoint,
                systemContent,
                prompt,
                jsonSchema,
                temperature,
                token,
            });
        const stream = response.body,
            content = await readStream({ stream, displayElem });
        return jsonSchema ? JSON.parse(content) : content;
    } catch (err) {
        displayElem && (displayElem.textContent = err.message);
        console.error(err);
        return null;
    }
}

async function getStreamResponse({
    endpoint,
    systemContent,
    prompt,
    jsonSchema,
    temperature,
    token,
}) {
    const body = getFetchBody({
            systemContent,
            prompt,
            jsonSchema,
            temperature,
            token,
        }),
        response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
        });
    if (!response.ok) {
        throw Error(await response.json());
    }
    return response;
}

function getFetchBody({
    systemContent,
    prompt,
    jsonSchema,
    temperature,
    token,
}) {
    if (!token) {
        throw Error(
            "You are not authorized to make this request. Please log in."
        );
    }
    // ensure system knows to return JSON if jsonSchema is provided.
    // in testing, this highly reinforced the schema
    systemContent =
        (systemContent || "") + (jsonSchema ? `\nReturn a JSON response.` : "");
    const body = {
        model: "gpt-4o-mini",
        messages: [
            systemContent && { role: "system", content: systemContent },
            { role: "user", content: prompt },
        ].filter(Boolean),
        projectId: "BLOG",
        ...fullJSONSchema(jsonSchema),
        ...(temperature ? { temperature } : {}),
        token,
    };
    return JSON.stringify(body);
}

function fullJSONSchema(jsonSchema) {
    if (!jsonSchema) {
        return {};
    }
    return {
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "schema",
                strict: true,
                schema: {
                    type: "object",
                    properties: jsonSchema,
                    required: Object.keys(jsonSchema),
                    additionalProperties: false,
                },
            },
        },
    };
}

/**
 * Streams the OpenAI response, displaying it chunk by chunk if
 * there is a display element.
 *
 * @async
 * @function readStream
 * @param {object} params The params for streaming Chat-GPT's response.
 * @param {ReadableStream} params.stream Chat-GPT's streamed response.
 * @param {Element} [params.displayElem] An optional document element that
 *     shows the streamed response chunk by chunk.
 * @param {string} [params.str=""] An optional string that appends the entire
 *     Chat-GPT response.
 * @returns {Promise<string>} A string with Chat-GPT's completed response. This string
 *     will be unparsed JSON code if a JSON schema accompanied the request.
 */
async function readStream({ stream, displayElem, str = "" }) {
    displayElem && (displayElem.textContent = "");
    const reader = stream.getReader();
    // read() returns a promise that fulfills
    // when a value has been received
    return await reader.read().then(function processText({ done, value }) {
        // Result objects contain two properties:
        // done  - true if the stream has already given you all its data.
        // value - some data. Always undefined when done is true.
        if (done) {
            console.log("Stream complete!");
        } else {
            const decoded = new TextDecoder().decode(value);
            displayElem && (displayElem.textContent += decoded);
            str += decoded;
        }
        // Read some more, and call this function again
        return done ? str : reader.read().then(processText);
    });
}

/* SPECIAL FUNCTIONS */

/**
 * Omitting the optional lineDescription param will allow
 * the AI to decide for itself what kind of topics to list
 * from the unstructured prompt.
 *
 * @async
 * @function structureStringArray
 * @param {object} data
 * @param {string} data.prompt
 * @param {string} [data.lineDescription]
 * @returns {Promise<Array>}
 */
async function structureStringArray({ prompt, lineDescription, token }) {
    return await structureArray({
        prompt,
        type: "string",
        itemDescription: lineDescription,
        token,
    });
}

/**
 * Structures a flat array from an unstructured prompt.
 */
async function structureArray({ prompt, type, itemDescription, token }) {
    const { array } = await openAiBuffered({
        prompt,
        jsonSchema: jsonSchemaSingleArray({
            type,
            description: itemDescription,
        }),
        token,
    });
    return array;
}

/*
    JSON SCHEMA TEMPLATES
    Use these JSON schemas for consistently formatted
    JSON responses.
*/

function jsonSchemaSingleArray({ type, description }) {
    return {
        array: {
            type: "array",
            items: description ? { type, description } : { type },
            /*
                https://openai.com/index/introducing-structured-outputs-in-the-api/

                type: "object",
                properties: { prop1: {type, description} },
                required: ["prop1"],
                additionalProperties: false,
            */
        },
    };
}

export {
    openAiBuffered,
    openAiStreamed,
    structureStringArray,
    structureArray,
    jsonSchemaSingleArray,
};
