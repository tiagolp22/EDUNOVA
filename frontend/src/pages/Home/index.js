import Banner from "components/Banner";
import Catalogue from "components/Catalogue";
import ExtraInfo from "components/ExtraInfo";
import Footer from "components/Footer/Footer";
import IconHome from "components/IconsHome/IconHome";

export default function Home({ t, language }) {
  return (
    <div>
      <Banner t={t} />
      <Catalogue t={t} language={language} />
      <ExtraInfo t={t} />
      <IconHome />
      <Footer />
    </div>
  );
}
