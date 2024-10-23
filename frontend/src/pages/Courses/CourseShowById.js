import { useParams } from "react-router-dom";

export default function CourseShowById({ t }) {
  const parametro = useParams();
  console.log("parametro ", parametro);

  return (
    <div>
      <h1>Hello Curso {parametro.id}</h1>
      <p>caralho!!!!!!
        
      </p>
    </div>
  );
}
