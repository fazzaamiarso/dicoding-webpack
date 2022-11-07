import axios from 'axios';

export interface Question {
  category: string;
  id: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  question: string;
  tags: string[];
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  regions: string[];
}

const TRIVIA_API_ENDPOINT = 'https://the-trivia-api.com/api';

const triviaClient = axios.create({
  baseURL: TRIVIA_API_ENDPOINT,
});

export default triviaClient;
