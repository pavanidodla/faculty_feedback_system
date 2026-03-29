import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        
        {/* About Section */}
        <div style={styles.section}>
          <h3 style={styles.heading}>🎓 Faculty Feedback System</h3>
          <p style={styles.text}>
            Empowering students to provide constructive feedback
            to enhance teaching quality and academic excellence.
          </p>
        </div>

        {/* Contact Section */}
        <div style={styles.section}>
          <h4 style={styles.heading}>Contact Us</h4>
          <p style={styles.text}>📍 RGUKT RK Valley</p>
          <p style={styles.text}>📞 +91 98765 43210</p>
          <p style={styles.text}>📧 support@facultyfeedback.com</p>
        </div>

        {/* Social Section */}
        <div style={styles.section}>
          <h4 style={styles.heading}>Follow Us</h4>
          <div style={styles.socialIcons}>
            <a href="#" style={styles.icon}><FaFacebookF /></a>
            <a href="#" style={styles.icon}><FaTwitter /></a>
            <a href="#" style={styles.icon}><MdEmail /></a>
            <a href="#" style={styles.icon}><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      <div style={styles.bottom}>
        © {new Date().getFullYear()} Faculty Feedback System | Designed by RGUKT
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
    color: "white",
    padding: "50px 20px 20px 20px",
  },

  container: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    maxWidth: "1200px",
    margin: "0 auto",
    gap: "40px",
  },

  section: {
    flex: "1",
    minWidth: "250px",
  },

  heading: {
    marginBottom: "15px",
    fontWeight: "600",
  },

  text: {
    opacity: 0.9,
    marginBottom: "8px",
  },

  socialIcons: {
    display: "flex",
    gap: "15px",
    fontSize: "20px",
  },

  icon: {
    background: "rgba(255,255,255,0.2)",
    padding: "10px",
    borderRadius: "50%",
    color: "white",
    transition: "all 0.3s ease",
    textDecoration: "none",
  },

  bottom: {
    marginTop: "40px",
    borderTop: "1px solid rgba(255,255,255,0.3)",
    paddingTop: "15px",
    textAlign: "center",
    fontSize: "14px",
    opacity: 0.85,
  },
};