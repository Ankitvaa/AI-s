import React from "react";
import "./signIn.scss"
import { SignIn } from "@clerk/clerk-react";

const SignInpage = () => {
  return <div className="signIn">
    <SignIn path="/sign-in" signUpUrl="sign-up"/>
  </div>;
};

export default SignInpage;
