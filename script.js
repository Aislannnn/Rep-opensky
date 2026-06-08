const clockEl = document.getElementById("clock");
const statusEl = document.getElementById("status");
const outEl = document.getElementById("out");

function tick() {
  clockEl.textContent = new Date().toLocaleTimeString("pt-BR");
}
tick();
setInterval(tick, 1000);

/* ── status online/offline ── */
function updateStatus() {
  statusEl.textContent = navigator.onLine ? "🟢 Online" : "🔴 Offline";
  statusEl.className = navigator.onLine ? "ok" : "err";
}
updateStatus();
window.addEventListener("online", updateStatus);
window.addEventListener("offline", updateStatus);

/* ── GET — clima (Open-Meteo, sem chave) ── */
document.getElementById("btnGet").addEventListener("click", async () => {
  outEl.textContent = "Buscando…";
  try {
    // 1) geocoding: Curitiba → lat/lon
    const geo = await fetch(
      "https://geocoding-api.open-meteo.com/v1/search?name=Curitiba&count=1&language=pt&format=json",
    ).then((r) => r.json());

    const { latitude: lat, longitude: lon, name } = geo.results[0];

    // 2) forecast com as coordenadas
    const wx = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`,
    ).then((r) => r.json());

    outEl.textContent = JSON.stringify(
      {
        cidade: name,
        latitude: lat,
        longitude: lon,
        ...wx.current,
      },
      null,
      2,
    );
  } catch (e) {
    outEl.textContent = `Erro: ${e.message}`;
  }
});

/* ── POST — simulado (JSONPlaceholder) ── */
document.getElementById("btnPost").addEventListener("click", async () => {
  outEl.textContent = "Enviando…";
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Hello Cloud",
        body: "Semana 2",
        userId: 1,
      }),
    });
    const data = await res.json();
    outEl.textContent = `HTTP ${res.status}\n` + JSON.stringify(data, null, 2);
  } catch (e) {
    outEl.textContent = `Erro: ${e.message}`;
  }
});
