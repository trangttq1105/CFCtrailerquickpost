const SHEET_ID = "1_lFX9-CHK9nBBUIBMcgDGiYkefakGx27SrsHfaBCHhw";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

let sheetData = [];

// Load Google Sheet data
fetch(SHEET_URL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));
    sheetData = json.table.rows;
  });

// Helper: random items
function getRandomItems(arr, n) {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
}

document.getElementById("generateBtn").onclick = () => {
  const topicIndex = document.getElementById("topicSelect").value;
  const customText = document.getElementById("customText").value.trim();
  const link = document.getElementById("linkSelect").value;

  if (!customText) {
    alert("Custom text is required (max 10 characters)");
    return;
  }

  const hashtags = Array.from(
    document.querySelectorAll("input[type=checkbox]:checked")
  )
    .map(cb => cb.value)
    .join(" ");

  const columnSentences = sheetData
    .map(row => row.c[topicIndex]?.v)
    .filter(Boolean);

  const selected = getRandomItems(columnSentences, 25);

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  selected.forEach(sentence => {
    // Build text with line breaks
    let fullText = `${sentence} ${customText}\n\n#CatForCash`;

    if (hashtags) {
      fullText += `\n${hashtags}`;
    }

    if (link) {
      fullText += `\n${link}`;
    }

    const tweetUrl =
      "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent(fullText);

    const div = document.createElement("div");
    div.className = "post";

    // Replace \n with <br> for preview only
    const previewText = fullText.replace(/\n/g, "<br>");

    div.innerHTML = `
      <p>${previewText}</p>
      <a href="${tweetUrl}" target="_blank" rel="noopener">
        <button>Post to X</button>
      </a>
    `;

    resultDiv.appendChild(div);

  });
};

// ===== Dark mode toggle =====
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    // đổi icon
    themeToggle.textContent =
      document.body.classList.contains("dark") ? "☀️" : "🌙";
  });
}

