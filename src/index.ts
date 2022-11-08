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

function changePage(page: 'home' | 'question' | 'end') {
  const questionPage = document.getElementById('question-page');
  const homePage = document.getElementById('home-page');
  const endPage = document.getElementById('end-page');

  homePage.style.display = page === 'home' ? 'block' : 'none';
  questionPage.style.display = page === 'question' ? 'block' : 'none';
  endPage.style.display = page === 'end' ? 'block' : 'none';
}

const startButton = document.getElementById('start-quiz');
const scoreEl = document.getElementById('score');
const countdownEl = document.getElementById('countdown');
const questionCard = document.getElementById('question-card') as QuestionCard;

startButton.onclick = () => {
  const selectDifficultyEl = document.getElementById('select-difficulty') as HTMLSelectElement;
  const machine = quizMachine(selectDifficultyEl.value as 'easy' | 'medium' | 'hard');
  const quizService = interpret(machine);

  quizService.start();

  quizService.onTransition((state) => {
    const ctx = state.context;

    if (state.matches('end')) {
      changePage('end');

      const finalScoreEl = document.getElementById('final-score');
      finalScoreEl.innerText = ctx.score.toString();

      const restartButton = document.getElementById('restart');
      restartButton.onclick = () => quizService.stop();
    }
    if (state.matches('playing.loaded')) {
      changePage('question');
    }
  });

  quizService.onChange((ctx, prev) => {
    scoreEl.innerText = prev.score ? ctx.score.toString() : '0';

    if (ctx.countdown !== prev?.countdown) {
      countdownEl.innerText = ctx.countdown.toString();
    }
    if (ctx.question?.id !== prev?.question?.id) {
      questionCard.question = ctx.question;
      questionCard.clickEvent = (e) => {
        if (!(e.target instanceof HTMLButtonElement)) return;
        const isCorrect = e.target.value === ctx.question.correctAnswer;
        quizService.send({ type: 'SELECT', value: isCorrect });
      };
    }
  });

  quizService.onStop(() => {
    changePage('home');
  });
};
