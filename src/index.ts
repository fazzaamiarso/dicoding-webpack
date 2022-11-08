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
const questionPage = document.getElementById('question-page');
const homePage = document.getElementById('home-page');
const endPage = document.getElementById('end-page');

const quizService = interpret(quizMachine);

const startButton = document.getElementById('start-quiz');
startButton.onclick = () => {
  quizService.send({ type: 'START' });
};

const selectDifficultyEl = document.getElementById('select-difficulty') as HTMLSelectElement;

selectDifficultyEl.onchange = (e) => {
  if (!(e.target instanceof HTMLSelectElement)) return;
  quizService.send({ type: 'DIFFICULTY', select: e.target.value as 'easy' | 'medium' | 'hard' });
};

quizService.onTransition((state) => {
  const ctx = state.context;

  if (state.matches('idle')) {
    homePage.style.display = 'block';
    questionPage.style.display = 'none';
    endPage.style.display = 'none';
  }

  if (state.matches('end')) {
    homePage.style.display = 'none';
    questionPage.style.display = 'none';
    endPage.style.display = 'block';

    const endEl = document.createRange().createContextualFragment(`<div>
    <div>You Lost</div>
    <div>Your total score is ${ctx.score}</div>
    </div>`);

    const restartButton = document.createElement('button');
    restartButton.innerText = 'Restart';
    restartButton.onclick = () => quizService.send({ type: 'RESTART' });

    endEl.appendChild(restartButton);
    endPage.appendChild(endEl);
  }
  if (state.matches('playing.loaded')) {
    homePage.style.display = 'none';
    questionPage.style.display = 'block';
    endPage.style.display = 'none';

    questionPage.innerHTML = '';
    const questionCard = document.createElement('question-card') as QuestionCard;
    questionCard.question = ctx.question;
    questionCard.clickEvent = (e) => {
      if (!(e.target instanceof HTMLButtonElement)) return;
      const isCorrect = e.target.value === ctx.question.correctAnswer;
      quizService.send({ type: 'SELECT', value: isCorrect });
    };
    questionPage.appendChild(questionCard);

    const gameStateEl = `<div>
      <div>Score: ${ctx.score}</div>
      <div>Timer: ${ctx.countdown}</div>
      </div>`;
    questionPage.insertAdjacentHTML('afterbegin', gameStateEl);
  }
});

quizService.onChange((ctx) => {
  console.log(ctx);
});

quizService.start();
