import React, { Component } from "react";
import { Formik, Form, Field } from "formik";
import { Button } from "react-bootstrap";

class MELForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Formik
          initialValues={{
            picked: "",
          }}
          onSubmit={async (values) => {
            await new Promise((r) => setTimeout(r, 500));
            alert(JSON.stringify(values, null, 2));
          }}
        >
          {({ values }) => (
            <Form>
              <div id="my-radio-group">Picked</div>
              <div role="group" aria-labelledby="my-radio-group">
                <label>
                  <Field type="radio" name="picked" value="$5 now" />
                  $5 now
                </label>
                &nbsp;
                <label>
                  <Field
                    type="radio"
                    name="picked"
                    value="$10 two weeks from now"
                  />
                  $10 two weeks from now
                </label>
                <div>Picked: {values.picked}</div>
              </div>

              <Button type="submit">Submit</Button>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default MELForm;
