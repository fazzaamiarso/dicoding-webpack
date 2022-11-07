import './style.css';
import 'regenerator-runtime/runtime';
import './components/question-card';
import triviaClient, { Question } from './lib/trivia';

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return JSON.stringify(error);
};

const getQuestions = async () => {
  try {
    const res = await triviaClient.get('/questions?limit=5');
    return res.data as Question[];
  } catch (err) {
    console.error(getErrorMessage(err));
  }
};

getQuestions().then((data) => {
  data.forEach((q) => {
    const questionCard = document.createElement('question-card');
    questionCard.question = q;
    document.body.appendChild(questionCard);
  });
});
