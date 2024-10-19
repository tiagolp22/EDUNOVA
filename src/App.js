import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Home from "pages/Home";
import About from "pages/About";
import Menu from "components/Menu";
import Button from "components/Button/Button";
import Banner from "components/Banner";

const lngs = [
  { code: "en", native: "EN" },
  { code: "pt", native: "PT" },
];

function App() {
  const [language, setLanguage] = useState("en");
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedLanguage = sessionStorage.getItem("chosenLanguage") || "pt";
    i18n.changeLanguage(savedLanguage).then(() => {
      setLanguage(savedLanguage);
      setIsLoading(false);
    });
  }, [i18n]);

  const handleTrans = (code) => {
    i18n.changeLanguage(code).then(() => {
      setLanguage(code);
      sessionStorage.setItem("chosenLanguage", code);
    });
  };

  if (isLoading) {
    return <div>Loading translations...</div>;
  }



  return (
    <BrowserRouter>
      <Menu  t={t}  handleTrans={ handleTrans} language={language}/>
      <Routes>
        <Route path="/" element={<Home t={t} />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<div>page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
