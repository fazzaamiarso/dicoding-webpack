import './style.css';
import 'regenerator-runtime/runtime';
import './components/question-card';
import type QuestionCard from './components/question-card';
import triviaClient, { Question } from './lib/trivia';
import getErrorMessage from './utils/getErrorMessage';

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
    const questionCard = document.createElement('question-card') as QuestionCard;
    questionCard.question = q;
    document.body.appendChild(questionCard);
  });
});
