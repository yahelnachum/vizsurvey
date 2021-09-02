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
        <h1>$5 now or $10 two weeks from now?</h1>
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
                  <Field type="radio" name="picked" value="early" />
                  $5 now
                </label>
                <label>
                  <Field type="radio" name="picked" value="later" />
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
