import { assign, createMachine } from 'xstate';
import getErrorMessage from '../utils/getErrorMessage';
import triviaClient, { Question } from './trivia';

const getQuestions = async () => {
  try {
    const res = await triviaClient.get('/questions?limit=1');
    return res.data as Question[];
  } catch (err) {
    console.error(getErrorMessage(err));
  }
};

interface QuizContext {
  score: number;
  wrongAnswers: number;
  countdown: number;
  question: Question;
}

type QuizEvents = { type: 'SELECT'; value: boolean } | { type: 'START' };

const quizMachine = createMachine<QuizContext, QuizEvents>({
  id: 'quiz',
  predictableActionArguments: true,
  initial: 'idle',
  context: {
    score: 0,
    wrongAnswers: 0,
    countdown: 20,
    question: null,
  },
  states: {
    idle: {
      on: { START: 'playing' },
    },
    playing: {
      initial: 'loading',
      states: {
        loading: {
          invoke: {
            id: 'getQuestion',
            src: getQuestions,
            onDone: {
              target: 'loaded',
              actions: assign({
                question: (ctx, ev) => ev.data[0],
              }),
            },
            onError: 'failed',
          },
        },
        loaded: {
          on: {
            SELECT: {
              target: 'loading',
              actions: assign({
                wrongAnswers: (ctx, ev) => (ev.value ? ctx.wrongAnswers : ctx.wrongAnswers + 1),
                score: (ctx, ev) => (ev.value ? ctx.score + 1 : ctx.score),
              }),
            },
          },
        },
        failed: {},
      },
    },
    end: {},
  },
});

export default quizMachine;
