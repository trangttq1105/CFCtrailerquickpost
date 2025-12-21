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

// Random helper
function getRandomItems(arr, count) {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
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

  const selectedSentences = getRandomItems(columnSentences, 25);

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  selectedSentences.forEach(sentence => {
    const fullText = `${sentence} ${customText} #CatForCash ${hashtags} ${link}`
      .replace(/\s+/g, " ")
      .trim();

    const tweetUrl =
      "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent(fullText);

    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <p>${fullText}</p>
      <a href="${tweetUrl}" target="_blank" rel="noopener">
        <button>Post to X</button>
      </a>
    `;

    resultDiv.appendChild(div);
  });
};
