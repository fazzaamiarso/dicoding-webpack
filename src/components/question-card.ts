/* eslint-disable no-underscore-dangle */
import styles from './question-card.styles.scss';
import { Question } from '../lib/trivia';

class QuestionCard extends HTMLElement {
  shadow: ShadowRoot;

  _question: Question;

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

  private render() {
    this.shadow.innerHTML = `
    <div>
    <h2>${this._question.question}</h2>
    <ul id="answers"></ul>
    </div>`;

    const style = document.createElement('style');
    style.textContent = styles;
    this.shadow.appendChild(style);

    const { incorrectAnswers, correctAnswer } = this._question;
    const answers = incorrectAnswers.concat(correctAnswer);
    answers.forEach((a) => {
      const liElement = document.createElement('li');
      const button = document.createElement('button');
      button.innerText = a;
      liElement.appendChild(button);
      this.shadow.getElementById('answers').appendChild(liElement);
    });
  }
}
customElements.define('question-card', QuestionCard);

export default QuestionCard;
