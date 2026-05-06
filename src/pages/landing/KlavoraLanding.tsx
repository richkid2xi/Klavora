import { FunctionComponent, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './KlavoraLanding.module.css';
import Icon from '../../components/common/Icon';

const KlavoraLanding: FunctionComponent = () => {
  const navigate = useNavigate();

  const onGetStartedClick = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const onSeeHowItClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='sectionContainer3']");
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  const onLinkFeaturesClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='sectionContainer4']");
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  const onLinkAboutClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='sectionContainer2']");
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  const onLinkTeamClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='sectionContainer1']");
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  const onContactClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='sectionContainer']");
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.revealVisible);
        }
      });
    }, { threshold: 0.1 });

    const revealedElements = document.querySelectorAll(`.${styles.reveal}`);
    revealedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.klavoraLanding}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.link4}>
          <img className={styles.klavoraIcon2} alt="Klavora Logo" src="/logo.jpeg" />
          <b className={styles.klavora2}>Klavora</b>
        </div>
        <div className={styles.navLinks}>
          <div className={styles.linkFeatures} onClick={onLinkFeaturesClick}>Features</div>
          <div className={styles.linkHow} onClick={onSeeHowItClick}>How It Works</div>
          <div className={styles.linkAbout} onClick={onLinkAboutClick}>About</div>
          <div className={styles.linkTeam} onClick={onLinkTeamClick}>Team</div>
          <div className={styles.linkContact2} onClick={onContactClick}>Contact</div>
        </div>
        <div className={`${styles.link5} ${styles.hoverScale}`} onClick={onGetStartedClick}>
          Get Started
        </div>
      </nav>

      <main className={styles.background}>
        {/* Hero Section */}
        <section className={`${styles.section2} ${styles.reveal}`}>
          <div className={styles.heroContent}>
            <div className={styles.pharmacyInventorySystem}>Pharmacy Inventory System</div>
            <h1 className={styles.heading1Container}>
              Take Control of<br />
              <span className={styles.pharmacyInventory}>Your Pharmacy Inventory</span>
            </h1>
            <p className={styles.neverLoseMoney}>
              Never lose money to expired drugs or blind stock again.
              Klavora gives Ghanaian pharmacies the visibility they
              need to manage inventory with confidence.
            </p>
            <div className={styles.heroButtons}>
              <div className={`${styles.link} ${styles.hoverScale}`} onClick={onGetStartedClick}>Get Started Free</div>
              <div className={`${styles.link2} ${styles.hoverScale}`} onClick={onSeeHowItClick}>See How It Works</div>
            </div>
          </div>
          <div className={styles.section3}>
            <img className={styles.sectionIcon} alt="Dashboard Mockup" src="/dashboard_mockup.png" />
            <div className={styles.gradient} />
          </div>
        </section>

        {/* The Reality Section */}
        <section className={`${styles.section} ${styles.reveal}`}>
          <div className={styles.frameParent}>
            <div className={styles.theReality}>The Reality</div>
            <h2 className={styles.heading2}>Pharmacies Lose Money Daily</h2>
            <p className={styles.everyMonthPharmacies}>
              Every month, pharmacies across Ghana discard thousands of cedis worth of expired medication because there is no reliable way to track shelf life. Drugs sit in storerooms forgotten until they turn into losses.
            </p>
            <p className={styles.everyMonthPharmacies}>
              Stock counts are done on paper or in scattered spreadsheets that nobody trusts. Managers cannot tell what is available, what is running low, or what has already gone bad.
            </p>
            <p className={styles.everyMonthPharmacies}>
              When discrepancies appear, there is no record of who did what. Staff accountability is nearly impossible without a system that logs every move.
            </p>
          </div>
        </section>

        {/* Core Capabilities Section */}
        <section className={`${styles.section4} ${styles.reveal}`} data-scroll-to="sectionContainer4">
          <div className={styles.frameDiv}>
            <div>
              <div className={styles.coreCapabilities}>Core Capabilities</div>
              <h2 className={styles.heading22}>Everything You Need</h2>
            </div>
            <div className={styles.capabilitiesGrid}>
              <div className={styles.backgroundborderParent}>
                <img className={`${styles.backgroundborderIcon} ${styles.hoverScale}`} alt="Batch Tracking" src="/batch_tracking.png" />
                <div>
                  <h3 className={styles.heading3}>Batch Tracking</h3>
                  <p className={styles.everyDrugBatch}>Every drug batch is logged with its unique identifier, supplier, and entry date. Know exactly which batch is on which shelf without guessing.</p>
                </div>
              </div>
              <div className={styles.backgroundborderParent}>
                <img className={`${styles.backgroundborderIcon} ${styles.hoverScale}`} alt="Expiry Alerts" src="/expiry_alerts.png" />
                <div>
                  <h3 className={styles.heading3}>Expiry Alerts</h3>
                  <p className={styles.everyDrugBatch}>Receive automatic alerts before drugs expire. Set custom thresholds so you never get caught off guard by close-dated stock.</p>
                </div>
              </div>
              <div className={styles.backgroundborderParent}>
                <img className={`${styles.backgroundborderIcon} ${styles.hoverScale}`} alt="Staff Accountability" src="/staff_accountability.png" />
                <div>
                  <h3 className={styles.heading3}>Staff Accountability</h3>
                  <p className={styles.everyDrugBatch}>Track who dispensed what, when, and in what quantity. Every action is tied to a user so discrepancies are traceable.</p>
                </div>
              </div>
              <div className={styles.backgroundborderParent}>
                <img className={`${styles.backgroundborderIcon} ${styles.hoverScale}`} alt="Inventory Visibility" src="/inventory_visibility.png" />
                <div>
                  <h3 className={styles.heading3}>Inventory Visibility</h3>
                  <p className={styles.everyDrugBatch}>See your entire stock in one view. Search by name, filter by batch, and understand what is moving and what is sitting idle.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Simple Process Section */}
        <section className={`${styles.section5} ${styles.reveal}`} data-scroll-to="sectionContainer3">
          <h2 className={styles.heading23}>Simple Process</h2>
          <p className={styles.getStartedIn}>Get started in minutes</p>
          <div className={styles.processGrid}>
            <div className={styles.paragraphbackground}>
              <div className={styles.div}>01</div>
              <h3 className={styles.heading35}>Set Up Your Pharmacy</h3>
              <p className={styles.createYourPharmacy}>Create your pharmacy profile, add your staff members, and configure your stock categories. Takes under 10 minutes.</p>
            </div>
            <div className={styles.paragraphbackground2}>
              <div className={styles.div2}>02</div>
              <h3 className={styles.heading36}>Add Your Stock</h3>
              <p className={styles.scanOrManually}>Scan or manually enter drug batches with their expiry dates. Klavora builds your live inventory automatically.</p>
            </div>
            <div className={styles.paragraphbackground3}>
              <div className={styles.div3}>03</div>
              <h3 className={styles.heading37}>Track and Manage</h3>
              <p className={styles.monitorExpiryAlerts}>Monitor expiry alerts, dispense drugs with full accountability, and get real-time reports on your stock health.</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className={`${styles.section6} ${styles.reveal}`} data-scroll-to="sectionContainer2">
          <div className={styles.aboutHeader}>
            <div className={styles.aboutKlavora}>About Klavora</div>
            <h2 className={styles.heading24}>Built for Ghana's Pharmacies</h2>
          </div>
          <div className={styles.aboutText}>
            <p>Klavora is a pharmacy inventory management system designed from the ground up for the realities of running a pharmacy in Ghana. We understand the daily pressure of balancing stock, expiry dates, prescriptions, and staff oversight.</p>
            <p>We built Klavora because we saw too many independent pharmacies operating without visibility. Spreadsheets get lost, memory fails, and the cost of expired stock quietly eats into profits that could have been saved.</p>
            <p>Our mission is simple: give every pharmacy in Ghana the tools to know exactly what they have, when it expires, and who is responsible for every item that moves through their doors.</p>
          </div>
        </section>

        {/* Team Section */}
        <section className={`${styles.section7} ${styles.reveal}`} data-scroll-to="sectionContainer1">
          <h2 className={styles.heading25}>Meet the Team</h2>
          <div className={styles.teamGrid}>
            <div className={`${styles.background2} ${styles.hoverScale}`}>
              <img className={styles.backgroundIcon} alt="Richard A. Elikem" src="/team_richard.png" />
              <h3 className={styles.heading38}>Richard A. Elikem</h3>
              <div className={styles.founderCeo}>Founder & CEO</div>
              <p className={styles.productDesignerAnd}>Product Designer and Software Engineer with passion for building working systems</p>
            </div>
            <div className={`${styles.background3} ${styles.hoverScale}`}>
              <img className={styles.backgroundIcon} alt="Andy Y. Nkrumah" src="/team_andy.png" />
              <h3 className={styles.heading38}>Andy Y. Nkrumah</h3>
              <div className={styles.founderCeo}>Founder & CEO</div>
              <p className={styles.productDesignerAnd}>Product Designer and Software Engineer with passion for building working systems</p>
            </div>
            <div className={`${styles.background4} ${styles.hoverScale}`}>
              <img className={styles.backgroundIcon} alt="Akoto Bright" src="/team_bright.png" />
              <h3 className={styles.heading38}>Bright Akoto</h3>
              <div className={styles.founderCeo}>Founder & CEO</div>
              <p className={styles.productDesignerAnd}>Product Designer and Software Engineer with passion for building working systems</p>
            </div>
            <div className={`${styles.background5} ${styles.hoverScale}`}>
              <img className={styles.backgroundIcon} alt="Lawson Mensah" src="/team_lawson.png" />
              <h3 className={styles.heading38}>Lawson Mensah</h3>
              <div className={styles.founderCeo}>Founder & CEO</div>
              <p className={styles.productDesignerAnd}>Product Designer and Software Engineer with passion for building working systems</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`${styles.section8} ${styles.reveal}`}>
          <h2 className={styles.heading26}>Stop Losing Money to Poor Inventory</h2>
          <p className={styles.joinPharmaciesAlready}>Join pharmacies already saving with Klavora. Your first month is completely free.</p>
          <div className={`${styles.link3} ${styles.hoverScale}`} onClick={onGetStartedClick}>
            Get Started Free
          </div>
          <p className={styles.noCreditCard}>No credit card required</p>
        </section>

        {/* Contact Section */}
        <section className={`${styles.section9} ${styles.reveal}`} data-scroll-to="sectionContainer">
          <div className={styles.contactInfo}>
            <h2 className={styles.heading27}>Get in Touch</h2>
            <p className={styles.weRespondWithin}>We respond within 24 hours</p>
            
            <div className={styles.contactItem}>
              <div className={styles.iconWrapper}>
                <Icon src="/contact_email.png" alt="Email" />
              </div>
              <div className={styles.contactText}>
                <span className={styles.email}>Email</span>
                <span className={styles.infoklavoragmailcom}>info.klavora@gmail.com</span>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.iconWrapper}>
                <Icon src="/contact_phone.png" alt="Phone" />
              </div>
              <div className={styles.contactText}>
                <span className={styles.phone}>Phone</span>
                <span className={styles.div4}>+233 20 360 4957</span>
              </div>
            </div>
          </div>

          <div className={styles.background6}>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.labelFull}>Full Name</label>
                <input className={styles.input} type="text" placeholder="Your full name" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.labelPharmacy}>Pharmacy Name</label>
                <input className={styles.input} type="text" placeholder="Your pharmacy name" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.labelPhone}>Phone Number</label>
                <input className={styles.input} type="tel" placeholder="+233 XX XXX XXXX" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.labelMessage}>Message</label>
                <textarea className={styles.textarea} placeholder="How can we help you?"></textarea>
                <span className={styles.max500Characters}>Max 500 characters</span>
              </div>
              <div className={`${styles.button} ${styles.hoverScale}`}>Send Message</div>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogoContainer}>
              <img className={styles.klavoraIcon} alt="Klavora Logo" src="/logo.jpeg" />
              <b className={styles.klavora}>Klavora</b>
            </div>
            <p className={styles.modernPharmacyInventory}>Modern pharmacy inventory</p>
          </div>
          
          <div className={styles.footerLinks}>
            <div className={styles.footerLinkItem}>Privacy Policy</div>
            <div className={styles.footerLinkItem}>Terms of Service</div>
            <div className={styles.footerLinkItem} onClick={onContactClick}>Contact</div>
          </div>

          <div className={styles.footerCopyright}>
            © 2026 Klavora. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default KlavoraLanding;
