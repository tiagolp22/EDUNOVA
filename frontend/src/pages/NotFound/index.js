import styles from "./NotFound.module.css";
import erro404 from "assets/imgs/erro_404.png";
import Button from "components/Button/Button";
import { useNavigate } from "react-router-dom";

export default function NotFound({ t }) {
  const navegar = useNavigate();

  return (
    <div>
      <div className={styles.conteudoContainer}>
        <span className={styles.texto404}>404</span>

        <h1 className={styles.titulo}>{t("notfound_title")}</h1>

        <p className={styles.paragrafo}>{t("notfound_p1")}</p>

        <div className={styles.container_button}>
          <div className={styles.botaoContainer} onClick={() => navegar(-1)}>
            <Button tamanho="lg">{t("btn_back")}</Button>
          </div>

          <img
            className={styles.imagemCachorro}
            src={erro404}
            alt="Cachorro de óculos e vestido como humano"
          />
        </div>
      </div>
      <div className={styles.espacoEmBranco}></div>
    </div>
  );
}
