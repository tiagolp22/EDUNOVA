import React, { useState, useEffect } from "react";
import translations from "../../assets/js/translation/languages/aboutus.json";

const About = ({ language }) => {
  const [currentLanguage, setCurrentLanguage] = useState("PT"); // Começamos com "PT" maiúsculo

  useEffect(() => {
    // Convertemos para maiúsculo ao pegar do localStorage
    const storedLanguage = (localStorage.getItem("chosenLanguage") || "PT").toUpperCase();
    setCurrentLanguage(storedLanguage);
  }, []);

  useEffect(() => {
    if (language) {
      // Convertemos o language prop para maiúsculo
      const upperLanguage = language.toUpperCase();
      setCurrentLanguage(upperLanguage);
      localStorage.setItem("chosenLanguage", upperLanguage);
    }
  }, [language]);

  const content = translations[currentLanguage];

  if (!content) {
    return (
      <div className="p-4">
        <p>Carregando... (Debug info abaixo)</p>
        <pre className="mt-4 p-2 bg-gray-100 rounded">
          Language: {currentLanguage}
          Available translations: {Object.keys(translations || {}).join(', ')}
        </pre>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {content.title}
        </h1>

        <p className="text-lg leading-relaxed text-gray-700">{content.intro}</p>

        {Object.entries(content.sections).map(([key, section]) => (
          <div key={key} className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {section.title}
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              {section.items.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
            {section.note && (
              <p className="text-sm text-gray-600 italic mt-2">
                {section.note}
              </p>
            )}
          </div>
        ))}

        <p className="text-lg leading-relaxed text-gray-700 mt-8">
          {content.footer}
        </p>
      </div>
    </div>
  );
};

export default About;