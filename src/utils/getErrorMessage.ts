import { AxiosError } from 'axios';

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError || error instanceof Error) return error.message;
  return JSON.stringify(error);
};

export default getErrorMessage;
