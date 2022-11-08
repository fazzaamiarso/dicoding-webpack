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

type QuizEvents =
  | { type: 'SELECT'; value: boolean }
  | { type: 'START' }
  | { type: 'STOP' }
  | { type: 'RESTART' }
  | { type: 'TICK' };

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
      always: [{ target: 'end', cond: (ctx) => ctx.wrongAnswers === 3 || ctx.countdown === 0 }],
      states: {
        loading: {
          invoke: {
            id: 'getQuestion',
            src: getQuestions,
            onDone: {
              target: 'loaded',
              actions: assign({
                question: (_, ev) => ev.data[0],
              }),
            },
            onError: 'failed',
          },
        },
        loaded: {
          invoke: {
            src: () => (cb) => {
              const interval = setInterval(() => {
                cb('TICK');
              }, 1000);

              return () => {
                clearInterval(interval);
              };
            },
          },
          on: {
            TICK: {
              actions: assign({ countdown: (ctx) => ctx.countdown - 1 }),
            },
            SELECT: {
              target: 'loading',
              actions: assign({
                wrongAnswers: (ctx, ev) => (ev.value ? ctx.wrongAnswers : ctx.wrongAnswers + 1),
                score: (ctx, ev) => (ev.value ? ctx.score + 1 : ctx.score),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                countdown: (ctx, ev) => 20,
              }),
            },
          },
        },
        failed: {},
      },
    },
    end: {
      on: {
        RESTART: {
          target: 'idle',
          actions: assign({
            score: 0,
            wrongAnswers: 0,
            countdown: 20,
            question: null,
          }),
        },
      },
    },
  },
});

export default quizMachine;
