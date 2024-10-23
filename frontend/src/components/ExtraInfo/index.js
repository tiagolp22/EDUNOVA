import styles from "./ExtraInfo.module.css";
import computer from "assets/imgs/computer.png";

export default function ExtraInfo({ t }) {
  // O i18next retornará o array de highlights
  const highlights = t("extrainfo.highlights", { returnObjects: true });

  return (
    <section className={styles.extra_info_container}>
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold text-[--amarelo] mb-8 text-center">
              {t("extrainfo.title")}
            </h2>

            {/* Lista de destaques */}
            <ul className="space-y-4">
              {highlights.map((highlight, index) => (
                <li key={index} className="flex items-start text-white text-lg">
                  <span className="mr-2">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            {/* Nota sobre taxas */}
            <p className="mt-6 text-sm text-white/80 italic">
              {t("extrainfo.note")}
            </p>
          </div>

          <div className="mt-12 md:mt-0">
            <img
              src={computer}
              alt={t("extrainfo.imageAlt")}
              className="object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
