import { randomInt } from "d3";
import { StatusType } from "./StatusType";
import { TitrationType } from "./TitrationType";
import { Answer } from "./Answer";
import { TitrationStateType } from "./TitrationStateType";
import { ChoiceType } from "./ChoiceType";

export class QuestionEngine {
  constructor() {}

  allQuestions(state) {
    return state.questions.QandA;
  }

  currentQuestion(state) {
    return state.QandA[state.currentQuestionIdx].answers[
      state.currentQuestionTitrateIdx
    ];
  }

  currentAnswerArray(state) {
    return state.QandA[state.currentQuestionIdx].answers;
  }

  currentAnswer(state) {
    return this.currentAnswerArray(state)[state.currentQuestionTitrateIdx];
  }

  currentChoiceEarlier(state) {
    return this.currentAnswer(state).choice === ChoiceType.earlier;
  }

  currentChoiceLater(state) {
    return this.currentAnswer(state).choice === ChoiceType.later;
  }

  firstAnswer(state) {
    return state.QandA[0].answers;
  }

  isTitrationAtMinAmount(state) {
    return state.currentQuestionTitrateIdx === this.currentAnswerArray.length;
  }

  isTitrationAtMaxAmount(state) {
    return state.currentQuestionTitrateIdx === 0;
  }

  titrationAtMinOrMax(state) {
    return (
      state.currentQuestionTitrateIdx === this.currentAnswerArray.length ||
      state.currentQuestionTitrateIdx === 0
    );
  }

  countChoiceSwitches(answers) {
    const choices = answers.filter((e) => e.choice !== ChoiceType.unitialized);
    var transitionCount = 0;
    for (var i = 1; i < choices.length; i++) {
      if (choices[i - 1].choice !== choices[i]) {
        transitionCount++;
      }
    }
    return transitionCount;
  }

  generateAnswerArray(q) {
    const answerAry = Array();
    if (q.titration === TitrationType.none) {
      answerAry.push(
        Answer.create(
          q.amountEarlier,
          q.timeEarlier,
          q.dateEarlier,
          q.amountLater,
          q.timeLater,
          q.dateLater,
          ChoiceType.unitialized
        )
      );
    } else {
      for (var i = 1; i <= q.noTitration; i++) {
        answerAry.push(
          new Answer(
            (q.amountLater / q.noTitration) * i,
            q.timeEarlier,
            q.dateEarlier,
            q.amountLater,
            q.timeLater,
            q.dateLater,
            ChoiceType.unitialized
          )
        );
      }
    }
    return answerAry;
  }

  startSurvey(state) {
    state.currentQuestionIdx = 0;
    state.currentQuestionTitrateIdx = 0;
    state.titrationState = TitrationStateType.uninitialized;
    for (const q of state.QandA) {
      q.answers = this.generateAnswerArray(q);
    }
  }

  setCurrentQuestionShown(state, action) {
    this.currentAnswer(state).shownTimestamp = action.payload;
  }

  setAnswerCurrentQuestion(state, action) {
    this.currentQuestion(state).answers[
      state.currentQuestionTitrateIdx
    ].choice = action.payload.choice;
    this.currentAnswer(state).answerTime =
      action.payload.choiceTimestamp.toFormat("MM/dd/yyyy H:mm:ss:SSS ZZZZ");
    if (this.currentQuestion(state).titration === TitrationType.none) {
      if (state.currentQuestionIdx === state.QandA.length - 1) {
        state.status = StatusType.Complete;
      } else {
        state.currentQuestionIdx += 1;
      }
    } else {
      switch (state.titrationState) {
        case TitrationStateType.uninitialized:
          state.currentQuestionTitrateIdx = randomInt(
            0,
            this.currentAnswerArray.length
          )();
          state.titrationState = TitrationStateType.start;
          break;
        case TitrationStateType.start:
          // detect and handle edge cases of at the largest soonest amount and choice is later or
          // smallest sooner amount and choice is earlier
          // if (isTitrationAtMinAmount(state) && this.currentChoiceEarlier(state))
          //   this.titrationAtMinOrMax(state) &&
          //   (this.currentAnswer(state).choice === ChoiceType.earlier ||
          //     this.currentAnswer(state).choice === ChoiceType.later)
          // ) {
          //   alert("TODO: handle this condition!");
          // } else {
          //   if (this.currentChoiceEarlier(state)) {
          //     state.
          //   } else if (this.currentChoiceLater(state)) {
          //   }
          // }

          break;
        case TitrationStateType.topOrBottom:
          break;
        case TitrationStateType.titrate:
          break;
        case TitrationStateType.last:
          break;
      }
    }
  }
}
