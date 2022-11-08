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
import { QuestionDifficulty } from './lib/trivia';

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
const finalScoreEl = document.getElementById('final-score');
const restartButton = document.getElementById('restart');
const selectDifficultyEl = document.getElementById('select-difficulty') as HTMLSelectElement;

startButton.onclick = () => {
  const machine = quizMachine(selectDifficultyEl.value as QuestionDifficulty);
  const quizService = interpret(machine);

  quizService.start();

  quizService.onTransition((state) => {
    const ctx = state.context;

    if (state.matches('end')) {
      changePage('end');
      finalScoreEl.innerText = ctx.score.toString();
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
        const selectedAnswerEl = e.target;
        if (!(selectedAnswerEl instanceof HTMLButtonElement)) return;
        const isCorrect = selectedAnswerEl.value === ctx.question.correctAnswer;
        quizService.send({ type: 'SELECT', isCorrect });
      };
    }
  });

  quizService.onStop(() => {
    changePage('home');
  });
};
