/* eslint-disable @typescript-eslint/no-unused-vars */
import { assign, createMachine } from 'xstate';
import getErrorMessage from '../utils/getErrorMessage';
import triviaClient, { Question } from './trivia';

const getQuestions = async (ctx: QuizContext) => {
  try {
    const res = await triviaClient.get(`/questions?limit=1&difficulty=${ctx.difficulty}`);
    return res.data as Question[];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(getErrorMessage(err));
  }
};

interface QuizContext {
  score: number;
  wrongAnswers: number;
  countdown: number;
  question: Question;
  difficulty: 'easy' | 'medium' | 'hard' | null;
}

type QuizEvents =
  | { type: 'SELECT'; value: boolean }
  | { type: 'DIFFICULTY'; select: QuizContext['difficulty'] }
  | { type: 'START' }
  | { type: 'STOP' }
  | { type: 'RESTART' }
  | { type: 'TICK' };

const quizMachine = (difficulty: QuizContext['difficulty']) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createMachine<QuizContext, QuizEvents>({
    id: 'quiz',
    predictableActionArguments: true,
    initial: 'playing',
    context: {
      score: 0,
      wrongAnswers: 0,
      countdown: 20,
      question: null,
      difficulty,
    },
    states: {
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
      end: {},
    },
  });

export default quizMachine;
