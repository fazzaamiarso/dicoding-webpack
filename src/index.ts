/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import './style.scss';
import './reset.css';
import 'regenerator-runtime/runtime';
import './components/question-card';
import { interpret } from 'xstate';
import type QuestionCard from './components/question-card';
import quizMachine from './lib/quizMachine';

const quizService = interpret(quizMachine);

quizService.onTransition((state) => {
  const ctx = state.context;
  console.log(ctx);

  if (state.matches('playing.loaded')) {
    document.body.innerHTML = '';
    const questionCard = document.createElement('question-card') as QuestionCard;
    questionCard.question = ctx.question;
    questionCard.clickEvent = (e) => {
      if (!(e.target instanceof HTMLButtonElement)) return;
      const isCorrect = e.target.value === ctx.question.correctAnswer;
      quizService.send({ type: 'SELECT', value: isCorrect });
    };
    document.body.appendChild(questionCard);
  }
});

quizService.onChange((ctx) => {});

quizService.start();

const startButton = document.getElementById('start-quiz');
startButton.onclick = () => {
  quizService.send({ type: 'START' });
};
