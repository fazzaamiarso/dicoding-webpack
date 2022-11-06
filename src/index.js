import "./style.css";
import "regenerator-runtime/runtime.js";

const API_ENDPOINT = "https://the-trivia-api.com/api/questions?limit=5";
const getQuestions = async () => {
  const res = await fetch(API_ENDPOINT, { method: "GET" });
  if (!res.ok) alert("Fetch Failed!");
  return await res.json();
};

getQuestions().then(console.log);
