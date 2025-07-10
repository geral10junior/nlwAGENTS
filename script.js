const apiKeyInput = document.getElementById("apiKey");
const gameSelect = document.getElementById("gameSelect");
const questionInput = document.getElementById("questionInput");
const askButton = document.getElementById("askButton");
const aiResponse = document.getElementById("aiResponse");
const form = document.getElementById("form");

const markDownToHTML = (text) => {
  const converter = new showdown.Converter();
  return converter.makeHtml(text);
};

//AIzaSyCZcwz_cMQ4XsgqA1FVdjzMqQXsv4DLPDk
const perguntarAI = async (question, game, apiKey) => {
  const model = "gemini-2.0-flash";
  const geminiURL = `
 https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}
  `;

  const ask = `
    olha, tenho esse jogo ${game} e queria saber ${question}
  `;
  const contents = [
    {
      parts: [
        {
          text: ask,
        },
      ],
    },
  ];

  const response = await fetch(geminiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents,
    }),
  });
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

const sendForm = async (event) => {
  event.preventDefault();
  const apiKey = apiKeyInput.value;
  const game = gameSelect.value;
  const question = questionInput.value;

  if (apiKey == "" || game == "" || question == "") {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  askButton.disabled = true;
  askButton.textContent = "Perguntando...";
  askButton.classList.add("loading");

  try {
    //perguntar para a IA
    const text = await perguntarAI(question, game, apiKey);
    aiResponse.querySelector(".response-content").innerHTML =
      markDownToHTML(text);
  } catch (error) {
    console.log("Erro", error);
  } finally {
    askButton.disabled = false;
    askButton.textContent = "Perguntar";
    askButton.classList.remove("loading");
  }
};

form.addEventListener("submit", sendForm);
