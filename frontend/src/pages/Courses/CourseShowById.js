import { useParams } from "react-router-dom";

export default function CourseShowById({ t }) {
  const parametro = useParams();
  console.log("parametro ", parametro);

  return (
    <div>
      <h1>Hello Curso {parametro.id} teste</h1>
      <p>hdgajhdafedsffffffd</p>
    </div>
  );
}
