import Banner from "components/Banner";
import Catalogue from "components/Catalogue";

export default function Home({ t, language }) {
  return (
    <div>
      <Banner t={t} />
      <Catalogue t={t} language={language}/>
    </div>
  );
}
