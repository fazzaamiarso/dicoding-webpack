import Toastify from 'toastify-js';

const isStorageSupported = () => {
  if (typeof Storage === undefined) {
    Toastify({ text: "LocalStorage not supported, highscore won't be saved" }).showToast();
    return false;
  }
  return true;
};

const STORAGE_KEY = 'high-score';

const createScoreStorage = () => {
  const getHighScore = () => {
    if (!isStorageSupported) return 0;
    const savedHighScore = localStorage.getItem(STORAGE_KEY);
    return Number(savedHighScore || 0);
  };

  const saveHighScore = (val: number) => {
    if (!isStorageSupported) return;
    localStorage.setItem(STORAGE_KEY, val.toString());
  };
  return { getHighScore, saveHighScore };
};
export default createScoreStorage;
