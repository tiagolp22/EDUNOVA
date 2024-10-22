import Card from "components/Card";
import { useEffect, useState } from "react";

export default function Catalogue({ t, language }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("database/courses.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Converter campos: title, subtitle, description de string JSON para objeto JavaScript
        const updatedCourses = data.map((course) => ({
          ...course,
          title: JSON.parse(course.title),
          subtitle: JSON.parse(course.subtitle),
          description: JSON.parse(course.descriptiom), // Note a correção do erro de digitação aqui
        }));

        setCourses(updatedCourses);
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    fetchCourses();
  }, [language]);

  return (
    <section className="py-10" id="services">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-[--azul-escuro] mb-8 text-center">
          {t("home_catalogue_title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card
              t={t}
              key={course.id}
              image={course.image}
              title={course.title[language]}
              subtitle={course.subtitle[language]}
              price={course.price}
              id={course.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
