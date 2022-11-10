/* eslint-disable no-console */
import axios from 'axios';
import qs from 'qs';
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
  timeout: 1,
});

export const getSingleQuestion = async (difficulty: QuestionDifficulty) => {
  const queryString = qs.stringify({
    limit: 1,
    difficulty,
  });
  try {
    const res = await triviaClient.get(`/questions?${queryString}`);
    return res.data[0] as Question;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
};

export default triviaClient;
