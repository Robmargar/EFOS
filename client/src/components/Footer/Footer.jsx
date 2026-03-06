import "./Footer.css";
import logo from "/LogoPCS.svg";

export const Footer = () => {
  return (
    <div className="footer">
      <div className="namePCS">
        <img src={logo} className="logo" alt="Logo Pixel Code Solutions" />
        <h2> Pixel Code Solutions</h2>
      </div>
      <span className="footerSpan footDesactive">
        Pixel Code Solutions es una agencia especializada en diseño, desarrollo
        y Posicionamiento Web SEO, ofreciendo soluciones digitales integrales
        para impulsar la presencia en línea de negocios y profesionales.
      </span>
      <span className="footerSpan">
        Copyright © 2024 Pixel Code Solutions Política de Privacidad Sitemap
      </span>
    </div>
  );
};
