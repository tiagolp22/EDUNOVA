import styles from "./Menu.module.css";
import MenuLink from "../MenuLink";
import logo from "../../assets/imgs/logo_site.png";

export default function Menu() {
  return (
    <header>
      <div className={styles.container_header}>
        <MenuLink to="http://claraquintela.com">
          <img
            src={logo}
            alt="Logo Clara Quintela"
            className={styles.logo_header}
          />
        </MenuLink>

        <nav className={styles.navegacao}>
          <MenuLink to="/">Home</MenuLink>
          <MenuLink to="/about">About</MenuLink>
        </nav>
      </div>
    </header>
  );
}
