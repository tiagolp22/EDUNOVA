import { useNavigate } from "react-router-dom";

export default function Button({ onClick, type, children, to }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (type !== "submit") {
      e.preventDefault();
    }
    if (to) {
      navigate(to);
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className="bg-[--azul-medio] font-soustitre hover:bg-[--amarelo] text-white font-bold py-2 px-4 rounded-lg  mx-[1rem] my-[1rem] transition duration-300 ease-in-out"
      onClick={handleClick}
      type={type || "button"}
    >
      {children}
    </button>
  );
}
