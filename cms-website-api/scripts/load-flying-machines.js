require("dotenv").config();

async function createFlyingMachine(num) {
const res = await fetch("http://127.0.0.1:1337/api/flying-machines", {
    method: "POST",
    body: JSON.stringify({
        data: {
            Name: "Model " + num,
            Description: "lorem ipsum dolor, sit amet consectetur"
        }
    }),
    headers: {
        Authorization: "bearer " + process.env.STRAPI_API_TOKEN,
        "Content-Type": "application/json"
    }
})
if (res.ok) {
    console.log("succes")
} else {
    const json = await res.json();
    console.error(json);
}
}

async function main() {
    for(let i = 1; i <= 20; i++) {
        await createFlyingMachine(i);
    }
}

main();