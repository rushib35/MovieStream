import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {

  return (

    <footer className="footer">

      <div className="footer-container">

        {/* =================================================
            BRAND
        ================================================= */}

        <div className="footer-brand">

          <Link to="/" className="footer-logo">
            🎬 Movie<span>Stream</span>
          </Link>

          <p>
            Watch movie trailers and discover your
            next favorite movie.
          </p>

        </div>


        {/* =================================================
            QUICK LINKS
        ================================================= */}

        <div className="footer-links">

          <h4>
            Quick Links
          </h4>

          <Link to="/">
            Home
          </Link>

          <Link to="/movies">
            Movies
          </Link>

          <Link to="/gold">
            ⭐ Gold Membership
          </Link>

        </div>


        {/* =================================================
            ACCOUNT
        ================================================= */}

        <div className="footer-links">

          <h4>
            Account
          </h4>

          <Link to="/login">
            Login
          </Link>

          <Link to="/register">
            Create Account
          </Link>

        </div>


        {/* =================================================
            MOVIESTREAM
        ================================================= */}

        <div className="footer-about">

          <h4>
            MovieStream
          </h4>

          <p>
            Discover movies, watch trailers,
            and unlock exclusive Gold content.
          </p>

        </div>

      </div>


      {/* =================================================
          FOOTER BOTTOM
      ================================================= */}

      <div className="footer-bottom">

        <p>
          © 2026 MovieStream. All rights reserved.
        </p>

        <p>
          Built with React & Spring Boot
        </p>

      </div>

    </footer>

  );

}

export default Footer;