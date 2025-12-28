

Gd = "FALLBACK_SALT_PLEASE_CHANGE_ME_IN_ENV",
    tj = [
        "BENIS_CLICKER_SALT_2025",
        "SUPER_SECURE_SALT_v2_NO_PEEKING_PLZ",
        "FALLBACK_SALT_PLEASE_CHANGE_ME_IN_ENV",
    ]


hash = (input) => {
    var r, o;
    const t = JSON.stringify({
        benis: input.benis,
        totalBenis: input.totalBenis,
        totalClicks: input.totalClicks,
        upgrades:
            (r = input.upgrades) == null
                ? void 0
                : r.map((s) => ({ id: s.id, owned: s.owned })),
        achievements:
            (o = input.achievements) == null
                ? void 0
                : o.map((s) => ({ id: s.id, unlocked: s.unlocked })),
        sacrificeBoost: input.sacrificeBoost,
        prestigeLevel: input.prestigeLevel,
    });
    let n = 0;
    for (let s = 0; s < t.length; s++) {
        const i = t.charCodeAt(s);
        ((n = (n << 5) - n + i), (n = n & n));
    }
    return n.toString(16);
}

encrypt = (e) => {
    try {
        const t = JSON.stringify(e);
        let n = "";
        for (let s = 0; s < t.length; s++) {
            const i = t.charCodeAt(s) ^ Gd.charCodeAt(s % Gd.length);
            n += String.fromCharCode(i);
        }
        const r = new TextEncoder().encode(n),
            o = Array.from(r, (s) => String.fromCharCode(s)).join("");
        return btoa(o);
    } catch (t) {
        return (console.error("Encryption failed:", t), "");
    }
}

decrypt = (raw_input) => {
    const salts = Array.from(new Set([Gd]));
    for (const salt of salts)
        try {
            const base64_decoded = atob(raw_input),
                uint8_arr = Uint8Array.from(base64_decoded, (l) => l.charCodeAt(0));
            s = new TextDecoder().decode(uint8_arr);
            let decrypted_text = "";
            for (let idx = 0; idx < s.length; idx++) {
                const decrypted_char = s.charCodeAt(idx) ^ salt.charCodeAt(idx % salt.length);
                decrypted_text += String.fromCharCode(decrypted_char);
            }
            return JSON.parse(decrypted_text);
        } catch (e) {
            console.log(e)
            continue;
        }
    return null;
}


function download_file(content) {
    input = JSON.parse(content)
    input.hash = hash(input)
    encrypted = encrypt(input)
    
    const blob = new Blob([encrypted], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const filename = `savefile_${date}.benis`;
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return { url, filename };

}