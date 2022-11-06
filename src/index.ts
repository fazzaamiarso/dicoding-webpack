import "./style.css";
import "regenerator-runtime/runtime.js";


type Api = {
  name: string;
};
const API_ENDPOINT: Api["name"] =
  "https://the-trivia-api.com/api/questions?limit=5";
const getQuestions = async () => {
  const res = await fetch(API_ENDPOINT, { method: "GET" });
  if (!res.ok) alert("Fetch Failed!");
  return await res.json();
};

getQuestions().then(console.log);
