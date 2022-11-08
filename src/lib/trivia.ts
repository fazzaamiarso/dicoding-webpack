/* eslint-disable no-console */
import axios from 'axios';
import getErrorMessage from '../utils/getErrorMessage';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export interface Question {
  category: string;
  id: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  question: string;
  tags: string[];
  type: string;
  difficulty: QuestionDifficulty;
  regions: string[];
}

const TRIVIA_API_ENDPOINT = 'https://the-trivia-api.com/api';

const triviaClient = axios.create({
  baseURL: TRIVIA_API_ENDPOINT,
});

export const getSingleQuestion = async (difficulty: QuestionDifficulty) => {
  try {
    const res = await triviaClient.get(`/questions?limit=1&difficulty=${difficulty}`);
    return res.data[0] as Question;
  } catch (err) {
    console.error(getErrorMessage(err));
  }
};

export default triviaClient;
