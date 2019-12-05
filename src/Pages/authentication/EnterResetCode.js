import React, { useState } from "react";
import api from '../../backend/backend';

export default function EnterResetCode(props) {
  const [code, setCode] = useState("");
  let [error, setError] = useState("");

  // Gets email from local storage
  let email = window.localStorage.getItem('passResetEmail');
  
  function handleSubmit(event) {
    event.preventDefault();
    
    const user = {
      email : email,
      resetToken: code
    }

    fetch(api + "/resetpassword/enterResetCode", {

      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user)
    }).then(response => {
      response.json().then((data) => {
        console.log("data!")
        console.log(data);
        if(!data["error"]){

          console.log(data["error"])
          console.log(data["message"])
          props.history.push('/resetPassword');
        }
        else{
          setError(data["message"]);
        }
      });
    })
    
  }
    
  return (
    <div className="flex items-center justify-center w-full  h-full md:mt-0 mt-6 ">
      <div className="w-full max-w-md">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <label className="block font-bold font-sans-pro text-grey-700 text-2xl rounded font-bold md:text-center mb-1 md:mb-6 pr-4" for="inline-full-name">Enter code</label>
          <label className="block font-sans-pro text-grey-darker text-l rounded md:text-left mb-1 md:mb-6 pr-4" for="inline-full-name">{`Enter the code emailed to ${email} to reset your password.`}</label>
          <div className="md:flex md:items-center mb-8">
            <div className="md:w-1/3">
              <label className="block font-bold font-sans-pro text-grey-darker text-xl rounded font-bold md:text-left mb-1 md:mb-0 pr-4" for="inline-full-name">5 Digit Code:</label>
            </div>
            {/*  CODE  */}
            <div className="md:w-2/3">
              < input className="shadow appearance-none rounded w-full py-3 px-4 text-xl font-sans-pro font-bold text-gray-700 leading-tight"
                id="code"
                type="text"
                onChange={e => setCode(e.target.value)}
                value={code}
                placeholder="_ _ _ _ _"
                required/>
            </div>
          </div>
          {error.length !== 0 &&
            <p className="text-red-400">{error}</p>
          }

          {/*  BUTTONS  */}
          <div className="flex items-center justify-between mt-8">
            <button className="bg-bookie-grey hover:bg-red text-white text-xl font-bold py-2 px-4 rounded"
              type="button"
              onClick={handleSubmit}>
              Send
              </button>
            <a className="inline-block align-baseline font-bold text-md text-blue-500 hover:text-blue-800" href="/login">
              Remembered?
              </a>
          </div>
        </form>
      </div>
    </div>
  )
}