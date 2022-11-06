import './style.css';
import 'regenerator-runtime/runtime';
import axios from 'axios';

const TRIVIA_API_ENDPOINT = 'https://the-trivia-api.com/api';
const triviaClient = axios.create({
  baseURL: TRIVIA_API_ENDPOINT,
});

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return JSON.stringify(error);
};

const getQuestions = async () => {
  try {
    const res = await triviaClient.get('/questions?limit=5');
    document.body.textContent = res.data;
  } catch (err) {
    console.error(getErrorMessage(err));
  }
};

getQuestions().then(console.log);
