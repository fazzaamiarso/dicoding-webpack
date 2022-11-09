/* eslint-disable @typescript-eslint/no-unused-vars */
import { assign, createMachine } from 'xstate';
import { getSingleQuestion, Question, QuestionDifficulty } from './trivia';

export const MAX_WRONG_ANSWERS = 3;

interface QuizContext {
  score: number;
  wrongAnswers: number;
  countdown: number;
  question: Question;
  difficulty: QuestionDifficulty;
}

type QuizEvents =
  | { type: 'DIFFICULTY'; select: QuestionDifficulty }
  | { type: 'SELECT'; isCorrect: boolean }
  | { type: 'STOP' }
  | { type: 'TICK' };

const quizMachine = (difficulty: QuestionDifficulty) =>
  createMachine<QuizContext, QuizEvents>(
    {
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
          always: [
            { target: 'end', cond: 'isLost' },
            { target: '.loading', actions: 'selectAnswer', cond: 'isTimesUp' },
          ],
          states: {
            loading: {
              invoke: {
                id: 'getQuestion',
                src: (ctx) => getSingleQuestion(ctx.difficulty),
                onDone: {
                  target: 'loaded',
                  actions: 'setQuestion',
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
                  actions: 'decrementCountdown',
                },
                SELECT: {
                  target: 'loading',
                  actions: 'selectAnswer',
                  in: '#quiz.playing.loaded',
                },
              },
            },
            failed: {},
          },
        },
        end: {},
      },
    },
    {
      guards: {
        isLost: (ctx) => ctx.wrongAnswers === MAX_WRONG_ANSWERS,
        isTimesUp: (ctx) => ctx.countdown === 0,
      },
      actions: {
        decrementCountdown: assign({ countdown: (ctx) => ctx.countdown - 1 }),
        setQuestion: assign({
          question: (_, ev: any) => ev.data,
        }),
        selectAnswer: assign({
          // For some reason, XState wants all method have the same number of parmaters defined all though not used.
          wrongAnswers: (ctx, ev: any) => (ev.isCorrect ? ctx.wrongAnswers : ctx.wrongAnswers + 1),
          score: (ctx, ev: any) => (ev.isCorrect ? ctx.score + 1 : ctx.score),
          countdown: (ctx, ev) => 20,
        }),
      },
    }
  );

export default quizMachine;
