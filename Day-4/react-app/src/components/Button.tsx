import "../App.css";
interface Props {
    onClick:()=>void;
}

const Button = ({onClick}:Props) => {
  return (
    <>
      <button type="button" onClick={onClick} className="btn btn-primary custom-button">
        Primary
      </button>
    </>
  );
};

export default Button;

