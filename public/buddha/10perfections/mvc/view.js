export default function Paramitas(paramitas) {
    return `
        <div class="paramitas">
            ${Object.entries(paramitas)
                .map(
                    ([key, { pali, suttas }]) => `
                        <div class="paramita">
                            <h2>${key}</h2>
                            <h3>
                                <em>${pali}</em>
                            </h3>
                            ${suttas
                                .map(
                                    (sutta) => `
                                        <a href="https://suttacentral.net/${sutta.id}/en/sujato" target="_blank">
                                            <strong>${sutta.pali}</strong>
                                            <br />
                                            <em>${sutta.title}</em>
                                        </a>
                                        <p><em>${sutta.summary}</em></p>
                                    `,
                                )
                                .join("")}
                        </div>
                    `,
                )
                .join("<hr />")}
        </div>
    `;
}
