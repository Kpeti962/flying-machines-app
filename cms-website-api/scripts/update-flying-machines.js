require("dotenv").config();

function getRandomScore() {
    return Math.floor(Math.random() * 5) + 1;
}

async function main() {
    console.log("Adatok lekérése...");
    const res = await fetch("http://127.0.0.1:1337/api/flying-machines", {
        method: "GET",
        headers: {
            // A "Bearer " utáni szóköz és a nagybetűs forma a biztos
            "Authorization": "Bearer " + process.env.STRAPI_API_TOKEN 
        }
    });

    if (!res.ok) {
        const json = await res.json();
        console.error("Lekérési hiba:", json);
        return;
    }

    const json = await res.json();
    const data = json.data;
    
    let imgId = 1;

    for (let machine of data) {
        // FONTOS: Strapi v5-ben az URL-be a documentId kell!
        const docId = machine.documentId;
        console.log(`Update folyamatban: ${machine.Name} (DocID: ${docId})`);

        const updateRes = await fetch("http://127.0.0.1:1337/api/flying-machines/" + docId, {
            method: "PUT",
            body: JSON.stringify({
                data: {
                    // Itt ügyelj a kis/nagybetűkre! 
                    // Ha az adminban "Image" néven hoztad létre a Media mezőt, akkor itt is az kell.
                    Image: imgId, 
                    Attack: getRandomScore(),
                    Speed: getRandomScore(),
                    Capacity: getRandomScore(),
                    Defense: getRandomScore(),
                    Agility: getRandomScore()
                }
            }),
            headers: {
                "Authorization": "Bearer " + process.env.STRAPI_API_TOKEN,
                "Content-Type": "application/json"
            }
        });

        if (!updateRes.ok) {
            const errJson = await updateRes.json();
            console.error(`Hiba a frissítésnél (${docId}):`, errJson.error);
            continue;
        }

        console.log(`Siker: ${machine.Name} frissítve.`);
        imgId++;
    }
}

main();