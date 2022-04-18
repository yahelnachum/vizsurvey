import { Button } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ChoiceType } from "../features/ChoiceType";
import { POST_SURVEY_QUESTIONS } from "../features/postsurveyquestions";

const divCenterContentStyle1 = {
  position: "absolute",
  left: "50%",
  width: "500px",
  marginRight: "-50%",
  transform: "translate(-50%, 0%)",
};

export function PostSurvey() {
  //const dispatch = useDispatch();
  const questions = POST_SURVEY_QUESTIONS;
  return (
    <div id="home-text" style={divCenterContentStyle1}>
      <Formik
        initialValues={questions.reduce((result, currentObj, index) => {
          result["choice" + index] = ChoiceType.unitialized;
          return result;
        }, {})}
        validate={(values) => {
          return questions.reduce((errors, currentObj, index) => {
            const key = "choice" + index;
            if (!values[key] || values[key] === ChoiceType.unitialized) {
              errors[key] = "Please choose a selection to continue.";
            }
            return errors;
          }, {});
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setTimeout(() => {
            /*dispatch(
              answer({
                choice: values.choice,
                choiceTimestamp: DateTime.now(),
              })
            );*/
            setSubmitting(false);
            resetForm();
          }, 400);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {questions.map(({ question, options }, index) => (
              <div key={index}>
                <div
                  role={"group" + index}
                  aria-labelledby={"my-radio-group" + index}
                  className="radio-choice-label"
                >
                  <p>{question}</p>
                  {options.map((option, index1) => (
                    <div key={index1}>
                      <label>
                        <Field
                          type="radio"
                          name={"choice" + index}
                          value={"value" + index1}
                        />
                        &nbsp;{option}
                      </label>
                      <br />
                    </div>
                  ))}
                  <label>
                    <Field
                      type="radio"
                      name={"choice" + index}
                      value="unsure"
                    />
                    &nbsp;Do not know
                  </label>
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    <ErrorMessage name={"choice" + index} component="div" />
                  </span>
                </div>
                <br />
                <div className="post-survey-separator"></div>
                <br />
              </div>
            ))}
            <Button type="submit" disabled={isSubmitting}>
              Submit
            </Button>
            <br />
            <br />
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default PostSurvey;
