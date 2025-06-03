import React, { useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "../layout/Index";
import AboutUs from "../pages/user-manage/AboutUs/AboutUs";
import Gallery from "../pages/Gallery/Gallery";
import OurMission from "../pages/OurMission/OurMission";
import Overview from "../pages/Overview/Overview";
import OurValues from "../pages/OurValues/Ourvalues";
import FutureLeaders from "../pages/FutureLeaders/FutureLeaders";
import ScopeBanner from "../pages/ScopeBanner/ScopeBanner";
import ScopeOverview from "../pages/ScopeOverview/ScopeOverview";
import Scholarship from "../pages/Scholarship/Scholarship";
import Institutions from "../pages/ScopeInstitutions/Institutions";
import ScholarshipOverview from "../pages/ScholarshipOverview/ScholarshipOverview";
import AppProcess from "../pages/ApplicationProcess/AppProcess";
import AppTimeline from "../pages/AppTimeline/AppTimeline";
import ScholarshipDoc from "../pages/ScholarshipDoc/ScholarshipDoc";
import Notification from "../pages/Notification/Notification";
import ScholarshipAwardees from "../pages/ScholarshipAwardees/ScholarshipAwardees";
import OurInspirations from "../pages/OurInspiration/OurInspiration";
import OurGoal from "../pages/OurGoal/OurGoal";
import InstitutionsAbout from "../pages/InstitutionsAbout/InstitutionsAbout";
import OurModel from "../pages/OurModel/OurModel";
import OurInstitutions from "../pages/OurInstitutions/OurInstitutions";
import AcademyHistory from "../pages/AcademyHistory/AcademyHistory";
import LeadershipTeam from "../pages/LeadershipTeam/LeadershipTeam";
import Achievements from "../pages/Achievements/Achievements";
import Grade from "../pages/Grade/Grade";
import HowToApply from "../pages/HowToApply/HowToApply";
import Facilities from "../pages/Facilities/Facilities";
import ContactInfo from "../pages/ContactInfo/ContactInfo";
import VidhyaVanamHistory from "../pages/VidhyaVanamHistory/VidhyaVanamHistory";
import VidhyaVanamAchievements from "../pages/VidhyaVanamAchievements/VidhyaVanamAchievements";
import VidhyaVanamGrade from "../pages/VidhyaVanamGrade/VidhyaVanamGrade";
import VidhyaVanamApply from "../pages/VidhyaVanamApply/VidhyaVanamApply";
import VidhyavanamLeadership from "../pages/VidhyavanamLeadership/VidhyavanamLeadership";
import VidhyaVanamFacilities from "../pages/VidhyaVanamFacilities/VidhyaVanamFacilities";
import VidhyaVanamContact from "../pages/VidhyaVanamContact/VidhyaVanamContact";
import Contact from "../pages/Contact/Contact";
import AboutDonate from "../pages/AboutDonate/AboutDonate";
import Contribution from "../pages/Contribution/Contribution";
import DonateAchievements from "../pages/DonateAchievements/DonateAchievements";
import MasterBanner from "../pages/MasterBanner/MasterBanner";
import Quotes from "../pages/Quotes/Quotes";
import DonateNow from "../pages/DonateNow/DonateNow";
import Testimonials from "../pages/Testimonials/Testimonials";
import SocialMediaLinks from "../pages/SocialMedia/SocialMedia";
import NewsAndEvents from "../pages/NewsAndEvents/NewsAndEvents";
import ContactForm from "../pages/ContactForm/ContactForm";
import Dashboard from "../pages/Dashboard/Dashboard";
import ApplicationDocument from "../pages/ApplicationDocument/ApplicationDocument";
import Success from "../pages/auth/Success";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import PrivateRoute from "./PrivateRoute";
import HomeBanner from "../pages/user-manage/UserListDefault";
import ChangePassword from "../pages/auth/ChangePassword";

const Router = () => {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Routes>
      {/*Panel */}

      <Route path='auth-success' element={<Success />}></Route>
      <Route path='auth-reset' element={<ForgotPassword />}></Route>
      <Route path='auth-register' element={<Register />}></Route>
      <Route path='change-password' element={<ChangePassword />}></Route>

      <Route path='login' element={<Login />}></Route>
      <Route element={<PrivateRoute />}>
        <Route path={`${process.env.PUBLIC_URL}`} element={<Layout />}>
          {/*Dashboards*/}
          <Route index element={<Dashboard />}></Route>
          {/* <Route path='about-us' element={<AboutUs />}></Route> */}
          {/* <Route index element={<Homepage />}></Route> */}

            <Route path='banner' element={<HomeBanner />}></Route>
            <Route path='about-us' element={<AboutUs />}></Route>     
            <Route path='gallery' element={<Gallery />}></Route>
            <Route path='our-mission' element={<OurMission />}></Route>
       
          {/* About Us page */}
            <Route path='overview' element={<Overview />}></Route>
            <Route path='ourValues' element={<OurValues />}></Route>
            <Route path='ourInspirations' element={<OurInspirations />}></Route>
            <Route path='future-leaders' element={<FutureLeaders />}></Route>

          {/* ourScope page */}
            <Route path='scope-banner' element={<ScopeBanner />}></Route>
            <Route path='scope-overview' element={<ScopeOverview />}></Route>
            <Route path='scholarship' element={<Scholarship />}></Route>
            <Route path='scope-institutions' element={<Institutions />}></Route>
            
          {/* Scholarships page */}
           <Route path='scholarship-overview' element={<ScholarshipOverview />}> </Route>
           <Route path='app-process' element={<AppProcess />}></Route>
           <Route path='app-timeline' element={<AppTimeline />}></Route>
           <Route path='app-content' element={<ApplicationDocument />}></Route>
           <Route path='scholarship-documents' element={<ScholarshipDoc />}></Route>
           <Route path='notification' element={<Notification />}></Route>
           <Route path='scholarship-awardees' element={<ScholarshipAwardees />}></Route>
           <Route path='our-goal' element={<OurGoal />}></Route>

          {/* Institutions page */}
            <Route path='institutions-about' element={<InstitutionsAbout />}></Route>
            <Route path='our-model' element={<OurModel />}></Route>
            <Route path='our-institutions' element={<OurInstitutions />}></Route>

          {/* Manas Academy Page */}
            <Route path='academy-history' element={<AcademyHistory />}></Route>
            <Route path='leadershipTeam' element={<LeadershipTeam />}></Route>
          <Route path='achievements' element={<Achievements />}></Route>
            <Route path='grade' element={<Grade />}></Route>
            <Route path='how-to-apply' element={<HowToApply />}></Route>
            <Route path='facilities' element={<Facilities />}></Route>
            <Route path='contact-info' element={<ContactInfo />}></Route>

          {/* Vidhya vanam Page*/}
            <Route path='vidhyavanam-history' element={<VidhyaVanamHistory />}></Route>
            <Route path='vidhyvanam-leadershipTeam' element={<VidhyavanamLeadership />}></Route>
            <Route path='vidhyvanam-achievements' element={<VidhyaVanamAchievements />}></Route>
            <Route path='vidhyvanam-grade' element={<VidhyaVanamGrade />}></Route>
            <Route path='vidhyvanam-how-to-apply' element={<VidhyaVanamApply />}></Route>
            <Route path='vidhyvanam-facilities' element={<VidhyaVanamFacilities />}></Route>
            <Route path='vidhyvanam-contact-info' element={<VidhyaVanamContact />}></Route>

          {/* Contact Us page */}
            <Route path='contact-us' element={<Contact />}></Route>

          {/* Donate  page */}
         
            <Route path='about-donate' element={<AboutDonate />}></Route>
            <Route path='contribution' element={<Contribution />}></Route>
            <Route path='donate-achievements' element={<DonateAchievements />}></Route>

          {/* Master Page */}
            <Route path='master-banner' element={<MasterBanner />}></Route>
            <Route path='quotes' element={<Quotes />}></Route>
            <Route path='donate-now' element={<DonateNow />}></Route>
            <Route path='socialMedia-links' element={<SocialMediaLinks />}></Route>

          {/* Testimonials Page */}
            <Route path='testimonials' element={<Testimonials />}></Route>

          {/* NEWS & EVENTS Page */}
            <Route path='news-and-events' element={<NewsAndEvents />}></Route>

          {/* Contact Form Page */}
            <Route path='contact-form' element={<ContactForm />}></Route>
          </Route>
      </Route>
    </Routes>
  );
};
export default Router;
