import Button from "components/Button/Button";
import { Link } from "react-router-dom";

export default function Card({ t, id, image, title, subtitle, price }) {
  return (
    <Link to={`course/${id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src={`/imgs/${image}`}
          alt="wheat flour grinding"
          className="w-full h-64 object-cover"
        />
        <div className="p-6 text-center">
          <h3 className="text-xl font-medium text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-700 text-base">{subtitle}</p>
        </div>
        <Button type="submit" to={`/course/${id}`}>
          + Info
        </Button>
      </div>
    </Link>
  );
}
