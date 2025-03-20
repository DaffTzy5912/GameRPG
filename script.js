let userProfile = JSON.parse(localStorage.getItem("userProfile")) || null;
let inventaris = JSON.parse(localStorage.getItem("inventaris")) || {};
const chatBox = document.getElementById("chat-box");

function sendMessage() {
    let inputField = document.getElementById("user-input");
    let text = inputField.value.trim();

    if (!text) return;

    addMessage(text, "user");
    processUserInput(text.toLowerCase());

    inputField.value = "";
}

function processUserInput(input) {
    setTimeout(() => {
        // Respon otomatis untuk "Hai"
        if (input === "hai") {
            addMessage("Hai juga 😊", "bot");
            return;
        }

        // Respon otomatis untuk pertanyaan tentang owner
        if (input.includes("owner")) {
            addMessage("Saya DiBuat Oleh Developer Saya Yaitu XdpzQ", "bot");
            return;
        }

        if (!userProfile) {
            if (input.startsWith("daftar ")) {
                registerUser(input);
            } else {
                addMessage("⚠️ Kamu belum mendaftar! Ketik 'daftar [nama].[umur]'", "bot");
            }
            return;
        }

        if (input === "menu") showMenu();
        else if (input === "inventory") showInventory();
        else if (input === "berburu") berburu();
        else if (input === "memancing") memancing();
        else if (input === "cari umpan") cariUmpan();
        else if (input === "shop") showShop();
        else if (input.startsWith("beli ")) beliItem(input.replace("beli ", ""));
        else if (input.startsWith("jual ")) jualItem(input.replace("jual ", ""));
        else if (input === "my profile") showProfile();
        else addMessage("⚠️ Perintah tidak dikenal. Ketik 'menu' untuk melihat daftar perintah.", "bot");
    }, 500);
}

function registerUser(input) {
    let data = input.replace("daftar ", "").split(".");
    if (data.length !== 2 || data[0].trim() === "" || isNaN(data[1])) {
        addMessage("⚠️ Format salah! Gunakan 'daftar [nama].[umur]'", "bot");
        return;
    }

    userProfile = {
        nama: data[0].trim(),
        umur: parseInt(data[1].trim()),
        uang: 1000
    };
    saveGameData();
    addMessage(`✅ Pendaftaran berhasil!\n👤 Nama: ${userProfile.nama}\n👤 Umur: ${userProfile.umur}\n💵 Uang: ${userProfile.uang}`, "bot");
}

function saveGameData() {
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    localStorage.setItem("inventaris", JSON.stringify(inventaris));
}

function addMessage(text, sender, imgUrl = null) {
    let msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");
    
    if (imgUrl) {
        let img = document.createElement("img");
        img.src = imgUrl;
        img.classList.add("chat-image");
        msgDiv.appendChild(img);
    }

    let textNode = document.createElement("p");
    textNode.innerText = text;
    msgDiv.appendChild(textNode);

    chatBox.appendChild(msgDiv);

    // **Tunggu sejenak biar DOM update, lalu paksa scroll ke bawah**
    setTimeout(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 10);
}

function showMenu() {
    addMessage("📜 Menu:\n1️⃣ Berburu\n2️⃣ Memancing\n3️⃣ Cari Umpan\n4️⃣ Shop\n5️⃣ Inventory\n6️⃣ Jual Barang\n7️⃣ My Profile", "bot", "https://files.catbox.moe/zyqoit.jpg");
}

function showProfile() {
    if (!userProfile) {
        addMessage("⚠️ Kamu belum mendaftar! Ketik 'daftar [nama].[umur]'", "bot");
        return;
    }

    addMessage(`👤 Nama: ${userProfile.nama}\n👤 Umur: ${userProfile.umur}\n💵 Uang: ${userProfile.uang}`, "bot", "https://files.catbox.moe/zyqoit.jpg");
}

function showShop() {
    addMessage("🛒 Shop:\n- 🪵 (50)\n- 🪨 (50)\n- ⛓️ (100)\n- 🕸️ (75)\n- 🎣 (250)\n- 🏹 (300)\n- 🗡️ (400)\n- ♥️ (500)\n\nKetik 'beli [item]' untuk membeli.", "bot");
}

function jualItem(item) {
    let hargaJual = {
        "🐙": 120, "🦑": 110, "🐠": 90, "🐟": 85, "🐬": 150,
        "🦅": 130, "🦉": 125, "🦇": 100, "🐗": 140, "🐍": 160, "🐊": 200, "🐅": 250
    };

    if (inventaris[item] && hargaJual[item]) {
        inventaris[item] -= 1;
        userProfile.uang += hargaJual[item];

        if (inventaris[item] === 0) {
            delete inventaris[item];
        }

        addMessage(`✅ Kamu menjual ${item} seharga 💰${hargaJual[item]}. Saldo sekarang: 💰${userProfile.uang}`, "bot");
        showInventory();
    } else {
        addMessage("⚠️ Kamu tidak punya item itu atau item tidak bisa dijual!", "bot");
    }
}

function beliItem(item) {
    let prices = { "🪵": 50, "🪨": 50, "⛓️": 100, "🕸️": 75, "🎣": 250, "🏹": 300, "🗡️": 400, "♥️": 500 };
    if (prices[item] && userProfile.uang >= prices[item]) {
        userProfile.uang -= prices[item];
        addToInventory(item);
        addMessage(`✅ Kamu membeli ${item}. Sisa uang: 💰${userProfile.uang}`, "bot");
    } else {
        addMessage("⚠️ Uang tidak cukup atau item tidak ditemukan!", "bot");
    }
}

function berburu() {
    if (!inventaris["🏹"] && !inventaris["🗡️"]) {
        addMessage("⚠️ Kamu butuh senjata untuk berburu!", "bot");
        return;
    }

    let hewanBerburu = ["🦅", "🦉", "🦇", "🐗", "🐍", "🐊", "🐅"];
    let hewan = hewanBerburu[Math.floor(Math.random() * hewanBerburu.length)];

    addToInventory(hewan);
    addMessage(`✅ Kamu mendapatkan ${hewan}!`, "bot");

    showInventory();
}

function memancing() {
    if (!inventaris["🎣"]) {
        addMessage("⚠️ Kamu butuh pancingan!", "bot");
        return;
    }

    if (!inventaris["🪱"] && !inventaris["🐛"]) {
        addMessage("⚠️ Kamu butuh umpan!", "bot");
        return;
    }

    let ikan = ["🐙", "🦑", "🐠", "🐟", "🐬"];
    let hasil = ikan[Math.floor(Math.random() * ikan.length)];
    addToInventory(hasil);
    addMessage(`🎣 Kamu menangkap ${hasil}!`, "bot");

    showInventory();
}

function cariUmpan() {
    let umpan = ["🪱", "🐛"];
    let hasil = umpan[Math.floor(Math.random() * umpan.length)];
    addToInventory(hasil);
    addMessage(`🔎 Kamu menemukan ${hasil}!`, "bot");

    showInventory();
}

function addToInventory(item) {
    if (inventaris[item]) {
        inventaris[item] += 1;
    } else {
        inventaris[item] = 1;
    }
}

function showInventory() {
    if (Object.keys(inventaris).length === 0) {
        addMessage("📦 Inventory kosong.", "bot");
        return;
    }

    let inventoryText = "📦 Inventory:\n";
    for (let item in inventaris) {
        inventoryText += `${item} x${inventaris[item]}\n`;
    }
    addMessage(inventoryText, "bot");
}

document.addEventListener("DOMContentLoaded", () => {
    addMessage("🤖 Selamat datang! Ketik 'daftar [nama].[umur]' untuk mulai bermain.", "bot");
});
