/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import './style.scss';
import './reset.css';
import 'regenerator-runtime/runtime';
import './components/question-card';
import { interpret } from 'xstate';
import autoAnimate from '@formkit/auto-animate';
import type QuestionCard from './components/question-card';
import quizMachine, { MAX_WRONG_ANSWERS } from './lib/quizMachine';
import { QuestionDifficulty } from './lib/trivia';

function changePage(page: 'home' | 'question' | 'end') {
  const questionPage = document.getElementById('question-page');
  const homePage = document.getElementById('home-page');
  const endPage = document.getElementById('end-page');

  homePage.style.display = page === 'home' ? 'block' : 'none';
  questionPage.style.display = page === 'question' ? 'block' : 'none';
  endPage.style.display = page === 'end' ? 'block' : 'none';
}

const scoreEl = document.getElementById('score');
const countdownEl = document.getElementById('countdown');
const questionCard = document.getElementById('question-card') as QuestionCard;
const finalScoreEl = document.getElementById('final-score');
const restartButton = document.getElementById('restart');
const healthEl = document.getElementById('health');
const form = document.getElementById('game') as HTMLFormElement;

autoAnimate(healthEl);

const heartIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
<path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
</svg>
`;

let isMachineStarted = false;
form.addEventListener(
  'submit',
  (event) => {
    event.preventDefault();
    if (isMachineStarted) return;

    const formData = new FormData(form);
    const difficulty = formData.get('difficulty');

    const machine = quizMachine(difficulty as QuestionDifficulty);
    const quizService = interpret(machine);

    quizService.start();
    isMachineStarted = true;

    Array(MAX_WRONG_ANSWERS)
      .fill('0')
      .forEach(() => {
        const lifeEl = `<div class="life">${heartIcon}</div>`;
        healthEl.innerHTML += lifeEl;
      });

    quizService.onTransition((state) => {
      const ctx = state.context;

      if (state.matches('end')) {
        changePage('end');
        healthEl.innerHTML = '';
        finalScoreEl.innerText = ctx.score.toString();
        restartButton.onclick = () => {
          quizService.stop();
          isMachineStarted = false;
        };
      }
      if (state.matches('playing.loaded')) {
        changePage('question');
      }
    });

    quizService.onChange((ctx, prev) => {
      if (!quizService.initialized) return;

      scoreEl.innerText = prev.score ? ctx.score.toString() : '0';
      countdownEl.innerText = prev.countdown
        ? ctx.countdown.toString()
        : quizService.initialState.context.countdown.toString();

      if (ctx.wrongAnswers > 0 && ctx.wrongAnswers !== prev?.wrongAnswers) {
        healthEl.firstChild.remove();
      }

      if (ctx.question?.id !== prev?.question?.id) {
        questionCard.question = ctx.question;
        questionCard.clickEvent = (selected) => {
          const isCorrect = selected === ctx.question.correctAnswer;
          quizService.send({ type: 'SELECT', isCorrect });
          return isCorrect;
        };
      }
    });

    quizService.onStop(() => {
      changePage('home');
    });
  },
  false
);
