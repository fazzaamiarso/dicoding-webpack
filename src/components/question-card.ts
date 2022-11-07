/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable no-underscore-dangle */
import styles from './question-card.styles.scss';
import { Question } from '../lib/trivia';

class QuestionCard extends HTMLElement {
  shadow: ShadowRoot;

  private _question: Question;

  private _clickEvent: (e: Event) => void;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  set question(val: Question) {
    this._question = val;
    this.render();
  }

  set clickEvent(val: (e: Event) => void) {
    this._clickEvent = val;
  }

  private createAnswers() {
    const { incorrectAnswers, correctAnswer } = this._question;
    const answers = incorrectAnswers.concat(correctAnswer);
    const container = document.createElement('ul');

    answers.forEach((answer) => {
      const answerEl = document.createElement('li');
      const button = document.createElement('button');
      button.innerText = answer;
      button.value = answer;
      button.onclick = this._clickEvent;

      answerEl.appendChild(button);
      container.appendChild(answerEl);
    });
    return container;
  }

  private render() {
    this.shadow.innerHTML = '';
    const el = document.createRange().createContextualFragment(`
    <div>
    <h2>${this._question.question}</h2>
    </div>`);

    const style = document.createElement('style');
    style.textContent = styles;
    this.shadow.appendChild(style);

    el.append(this.createAnswers());
    this.shadow.appendChild(el);
  }
}
customElements.define('question-card', QuestionCard);

export default QuestionCard;
