import Button from "components/Button/Button";
import { useState } from "react";

function CourseCreate({
  onSubmit = () => {},
  loading = false,
  error = null,
  t,
}) {
  const [formData, setFormData] = useState({
    title: { en: "", pt: "" },
    subtitle: { en: "", pt: "" },
    description: { en: "", pt: "" },
    price: "",
    status_id: "",
    teacher_id: "",
  });

  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    if (dataset.lang) {
      setFormData((prev) => ({
        ...prev,
        [name]: { ...prev[name], [dataset.lang]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[] mx-auto p-8 bg-white shadow-lg rounded-lg"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        {t("course_create_page_title")}
      </h2>

      {error && (
        <div className="mb-6 p-4 text-red-700 bg-red-100 rounded-lg text-center">
          {error}
        </div>
      )}

      {["title", "subtitle", "description"].map((field) => (
        <div key={field} className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t(`course_${field}_en`)}
          </label>
          <input
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            type="text"
            name={field}
            data-lang="en"
            value={formData[field].en}
            onChange={handleChange}
          />

          <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
            {t(`course_${field}_pt`)}
          </label>
          <input
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            type="text"
            name={field}
            data-lang="pt"
            value={formData[field].pt}
            onChange={handleChange}
          />
        </div>
      ))}

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("course_price")}
        </label>
        <input
          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("course_teacher_id")}
        </label>
        <input
          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          type="number"
          name="teacher_id"
          value={formData.teacher_id}
          onChange={handleChange}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold text-white text-lg transition duration-200 ${
          loading
            ? "bg-gray-400"
            : "bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500"
        }`}
      >
        {loading ? t("creating_course") : t("create_course")}
      </Button>
    </form>
  );
}

export default CourseCreate;
