/* eslint-disable no-underscore-dangle */
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

    this._question.incorrectAnswers.forEach((a) => {
      const liElement = document.createElement('li');
      liElement.innerText = a;
      this.shadow.appendChild(liElement);
    });
  }
}

customElements.define('question-card', QuestionCard);
