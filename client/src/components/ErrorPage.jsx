import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="error">
      <h1>Oh no, something went wrong!</h1>
      <Link to="/">
        You can go back to the home page by clicking here, though!
      </Link>
    </div>
  );
};

export default ErrorPage;
