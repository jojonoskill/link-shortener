import React, {useState} from 'react';
import {nanoid} from 'nanoid';
import {getDatabase, child, ref, set, get} from 'firebase/database';
import {isWebUri} from 'valid-url';
import {OverlayTrigger} from 'react-bootstrap';
import {Tooltip} from 'react-bootstrap';


function Form () {
  const [formData, setFormData] = useState({
    longURL: '',
    preferedAlias: '',
    generatedURL: '',
    loading: false,
    errors: [],
    errorMessage: {},
    toolTipMessage: 'Copy to clipboard',
  });

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };


  const checkKeyExists = () => {
    const dbRef = ref(getDatabase());
    return get(child(dbRef, `/${formData.preferedAlias}`)).catch((error) => {
      return false;
    })
  }

  const validateInput = async () => {
    const errors = [];
    const errorMessages = formData.errorMessage;
    if(formData.longURL.length === 0){
      errors.push('longUrl');
      errorMessages['longUrl'] = 'Please enter your URL!';
    }else if(!isWebUri(formData.longURL)) {
      errors.push('longUrl');
      errorMessages['longUrl'] = 'Please valid URL';
    }

    if(formData.preferedAlias !== ''){
      if(formData.preferedAlias > 7) {
        errors.push('suggestedAlias');
        errorMessages['suggestedAlias'] = 'Please enter alias less than 7 charachters';
      } else if(formData.preferedAlias.indexOf(' ') >= 0){
        errors.push('suggestedAlias');
        errorMessages['suggestedAlias'] = 'Spaces are not allowed';
      }
    }

    const keyExists = await checkKeyExists();
    if(keyExists.exists()) {
      errors.push('suggestedAlias');
      errorMessages['suggestedAlias'] = 'This link already exists';
    }


    setFormData(prevState => ({
      ...prevState,
      errors: errors,
      errorMessage: errorMessages,
      loading: false,
    }))

    if (errors.length > 0) return false;
    return true;
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormData((prevState) =>({
      ...prevState,
      loading: true,
      generatedURL: '',
    }))

    const isFormValid = await validateInput();
    if (isFormValid === false) {
      return;
    }

    let generatedKey = nanoid(5);
    let generatedURL = 'NameofTheSite.com/' + generatedKey; //@TODO dont forget about site

    if(formData.preferedAlias !== ''){
      generatedKey = formData.preferedAlias;       //@TODO i dont like this method maybe some rewriting would be good
      generatedURL = 'NameofTheSite.com/' + generatedKey; //@TODO dont forget about site
    }
    const db = getDatabase();

    set(ref(db, '/' + generatedKey), {
      generatedKey: generatedKey,
      longURL: formData.longURL,
      preferedAlias : formData.preferedAlias,
      generatedURL: generatedURL
    }).then((result) => {
      setFormData((prevState) => ({
        ...prevState,
        generatedURL: generatedURL,
        loading: false,
      }))
    }).catch(e => {
      alert(e);
    })
  }

  const hasError = (key) => {
    return formData.errors.indexOf(key) !== -1;
  }


  const copyToClipBoard = () => {
    navigator.clipboard.writeText(formData.generatedURL);
    setFormData(prevState => ({
      ...prevState,
      toolTipMessage: 'Copied!',
    }))
  }

  return (
      <div className="container">
        <form autoComplete="off">
          <h3>Mini Link It!</h3>

          <div className="form-group">
            <label>Enter Your Long URL</label>
            <input
                id="longURL"
                onChange={handleChange}
                value={formData.longURL}
                type="url"
                required
                className={
                  hasError("longURL")
                      ? "form-control is-invalid"
                      : "form-control"
                }
                placeholder="https://www..."
            />
          </div>
          <div
              className={
                hasError("longURL") ? "text-danger" : "visually-hidden"
              }
          >
            {formData.errorMessage.longURL}
          </div>

          <div className="form-group">
            <label htmlFor="basic-url">Your Mini URL</label>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">minilinkit.com/</span>
              </div>
              <input
                  id="preferedAlias"
                  onChange={handleChange}
                  value={formData.preferedAlias}
                  className={
                    hasError("preferedAlias")
                        ? "form-control is-invalid"
                        : "form-control"
                  }
                  type="text" placeholder="eg. 3fwias (Optional)"
              />
            </div>
            <div
                className={
                  hasError("suggestedAlias") ? "text-danger" : "visually-hidden"
                }
            >
              {formData.errorMessage.suggestedAlias}
            </div>
          </div>


          <button className="btn btn-primary" type="button" onClick={onSubmit}>
            {
              formData.loading ?
                  <div>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  </div> :
                  <div>
                    <span className="visually-hidden spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Mini Link It</span>
                  </div>
            }

          </button>

          {
            formData.generatedURL === '' ?
                <div></div>
                :
                <div className="generatedurl">
                  <span>Your generated URL is: </span>
                  <div className="input-group mb-3">
                    <input disabled type="text" value={formData.generatedURL} className="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                    <div className="input-group-append">
                      <OverlayTrigger
                          key={'top'}
                          placement={'top'}
                          overlay={
                            <Tooltip id={`tooltip-${'top'}`}>
                              {formData.toolTipMessage}
                            </Tooltip>
                          }
                      >
                        <button onClick={() => copyToClipBoard()} data-toggle="tooltip" data-placement="top" title="Tooltip on top" className="btn btn-outline-secondary" type="button">Copy</button>

                      </OverlayTrigger>

                    </div>
                  </div>
                </div>
          }

        </form>
      </div>
  );

}

export default Form;
