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

const mainPage = document.getElementById('content');

const quizService = interpret(quizMachine);

const startButton = document.getElementById('start-quiz');
startButton.onclick = () => {
  quizService.send({ type: 'START' });
};

quizService.onTransition((state) => {
  const ctx = state.context;
  console.log(ctx);

  if (state.matches('idle')) {
    mainPage.innerHTML = '';
    mainPage.appendChild(startButton);
  }

  if (state.matches('end')) {
    mainPage.innerHTML = `<div>
    <div>You Lost</div>
    <div>Your total score is ${ctx.score}</div>
    </div>`;
    const restartButton = document.createElement('button');
    restartButton.innerText = 'Restart';
    restartButton.onclick = () => quizService.send({ type: 'RESTART' });
    mainPage.appendChild(restartButton);
  }
  if (state.matches('playing.loaded')) {
    mainPage.innerHTML = '';
    const questionCard = document.createElement('question-card') as QuestionCard;
    questionCard.question = ctx.question;
    questionCard.clickEvent = (e) => {
      if (!(e.target instanceof HTMLButtonElement)) return;
      const isCorrect = e.target.value === ctx.question.correctAnswer;
      quizService.send({ type: 'SELECT', value: isCorrect });
    };
    mainPage.appendChild(questionCard);

    const gameStateEl = `<div>
      <div>Score: ${ctx.score}</div>
      <div>Timer: ${ctx.countdown}</div>
      </div>`;
    mainPage.insertAdjacentHTML('afterbegin', gameStateEl);
  }
});

quizService.onChange((ctx) => {});

quizService.start();
