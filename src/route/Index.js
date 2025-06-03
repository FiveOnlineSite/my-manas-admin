import React, { useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
// import { CustomerProvider } from "../pages/panel/e-commerce/customer/CustomerContext";
// import { ProductContextProvider } from "../pages/pre-built/products/ProductContext";
// import { UserContextProvider } from "../pages/pre-built/user-manage/UserContext";

// import Homepage from "../pages/Homepage";
// import Component from "../pages/components/Index";
// import Accordian from "../pages/components/Accordions";
// import Alerts from "../pages/components/Alerts";
// import Avatar from "../pages/components/Avatar";
// import Badges from "../pages/components/Badges";
// import Breadcrumbs from "../pages/components/Breadcrumbs";
// import ButtonGroup from "../pages/components/ButtonGroup";
// import Buttons from "../pages/components/Buttons";
// import Cards from "../pages/components/Cards";
// import Carousel from "../pages/components/Carousel";
// import Dropdowns from "../pages/components/Dropdowns";
// import FormElements from "../pages/components/forms/FormElements";
// import FormLayouts from "../pages/components/forms/FormLayouts";
// import FormValidation from "../pages/components/forms/FormValidation";
// import DataTablePage from "../pages/components/table/DataTable";
// import DateTimePicker from "../pages/components/forms/DateTimePicker";
// import CardWidgets from "../pages/components/widgets/CardWidgets";
// import ChartWidgets from "../pages/components/widgets/ChartWidgets";
// import RatingWidgets from "../pages/components/widgets/RatingWidgets";
// import SlickPage from "../pages/components/misc/Slick";
// import SweetAlertPage from "../pages/components/misc/SweetAlert";
// import BeautifulDnd from "../pages/components/misc/BeautifulDnd";
// import DualListPage from "../pages/components/misc/DualListbox";
// import GoogleMapPage from "../pages/components/misc/GoogleMap";
// import Modals from "../pages/components/Modals";
// import Pagination from "../pages/components/Pagination";
// import Popovers from "../pages/components/Popovers";
// import Progress from "../pages/components/Progress";
// import Spinner from "../pages/components/Spinner";
// import Tabs from "../pages/components/Tabs";
// import Toast from "../pages/components/Toast";
// import Tooltips from "../pages/components/Tooltips";
// import Typography from "../pages/components/Typography";
// import CheckboxRadio from "../pages/components/forms/CheckboxRadio";
// import AdvancedControls from "../pages/components/forms/AdvancedControls";
// import InputGroup from "../pages/components/forms/InputGroup";
// import FormUpload from "../pages/components/forms/FormUpload";
// import NumberSpinner from "../pages/components/forms/NumberSpinner";
// import NouiSlider from "../pages/components/forms/nouislider";
// import WizardForm from "../pages/components/forms/WizardForm";
// import UtilBorder from "../pages/components/UtilBorder";
// import UtilColors from "../pages/components/UtilColors";
// import UtilDisplay from "../pages/components/UtilDisplay";
// import UtilEmbeded from "../pages/components/UtilEmbeded";
// import UtilFlex from "../pages/components/UtilFlex";
// import UtilOthers from "../pages/components/UtilOthers";
// import UtilSizing from "../pages/components/UtilSizing";
// import UtilSpacing from "../pages/components/UtilSpacing";
// import UtilText from "../pages/components/UtilText";
// import Faq from "../pages/others/Faq";
// import Regularv1 from "../pages/others/Regular-1";
// import Regularv2 from "../pages/others/Regular-2";
// import Terms from "../pages/others/Terms";
// import BasicTable from "../pages/components/table/BasicTable";
// import SpecialTablePage from "../pages/components/table/SpecialTable";
// import ChartPage from "../pages/components/charts/Charts";
// import EmailTemplate from "../pages/components/email-template/Email";
// import NioIconPage from "../pages/components/crafted-icons/NioIcon";
// import SVGIconPage from "../pages/components/crafted-icons/SvgIcons";

// import ReactToastify from "../pages/components/misc/ReactToastify";

// import JsTreePreview from "../pages/components/misc/JsTree";
// import QuillPreview from "../pages/components/forms/rich-editor/QuillPreview";
// import TinymcePreview from "../pages/components/forms/rich-editor/TinymcePreview";
// import KnobPreview from "../pages/components/charts/KnobPreview";

// import Error404Classic from "../pages/error/404-classic";
// import Error404Modern from "../pages/error/404-modern";
// import Error504Modern from "../pages/error/504-modern";
// import Error504Classic from "../pages/error/504-classic";

// import Login from "../pages/auth/Login";
// import Register from "../pages/auth/Register";
// import ForgotPassword from "../pages/auth/ForgotPassword";
// import Success from "../pages/auth/Success";

import Layout from "../layout/Index";
// import LayoutNoSidebar from "../layout/Index-nosidebar";
import UserListDefaultPage from "../pages/user-manage/UserListDefault";
import { UserContextProvider } from "../pages/user-manage/UserContext";
import AboutUs from "../pages/user-manage/AboutUs/AboutUs";
import { AboutContextProvider } from "../pages/user-manage/AboutUs/AboutContext";
import { GalleryContextProvider } from "../pages/Gallery/GalleryContext";
import Gallery from "../pages/Gallery/Gallery";
import { OurMissionContextProvider } from "../pages/OurMission/OurMissionContext";
import OurMission from "../pages/OurMission/OurMission";
import { OverviewContextProvider } from "../pages/Overview/OverviewContext";
import Overview from "../pages/Overview/Overview";
import OurValues from "../pages/OurValues/Ourvalues";
import { OurValuesContextProvider } from "../pages/OurValues/OurValuesContext";
import { FutureLeadersContextProvider } from "../pages/FutureLeaders/FutureLeadersContext";
import FutureLeaders from "../pages/FutureLeaders/FutureLeaders";
import { ScopeBannerContextProvider } from "../pages/ScopeBanner/ScopeBannerContext";
import ScopeBanner from "../pages/ScopeBanner/ScopeBanner";
import { ScopeOverviewContextProvider } from "../pages/ScopeOverview/ScopeOverviewContext";
import ScopeOverview from "../pages/ScopeOverview/ScopeOverview";
import { ScholarshipContextProvider } from "../pages/Scholarship/ScholarshipContext";
import Scholarship from "../pages/Scholarship/Scholarship";
import Institutions from "../pages/ScopeInstitutions/Institutions";
import { InstitutionsContextProvider } from "../pages/ScopeInstitutions/InstitutionsContext";
import {
  ScholarshipOverviewContext,
  ScholarshipOverviewContextProvider,
} from "../pages/ScholarshipOverview/ScholarshipOverviewContext";
import ScholarshipOverview from "../pages/ScholarshipOverview/ScholarshipOverview";
import AppProcess from "../pages/ApplicationProcess/AppProcess";
import { AppProcessContextProvider } from "../pages/ApplicationProcess/AppProcessContext";
import { AppTimelineContextProvider } from "../pages/AppTimeline/AppTimelineContext";
import AppTimeline from "../pages/AppTimeline/AppTimeline";
import {
  ScholarshipDocContext,
  ScholarshipDocContextProvider,
} from "../pages/ScholarshipDoc/ScholarshipDocContext";
import ScholarshipDoc from "../pages/ScholarshipDoc/ScholarshipDoc";
import { NotificationContextProvider } from "../pages/Notification/NotificationContext";
import Notification from "../pages/Notification/Notification";
import { ScholarshipAwardeesContextProvider } from "../pages/ScholarshipAwardees/ScholarshipAwardeesContext";
import ScholarshipAwardees from "../pages/ScholarshipAwardees/ScholarshipAwardees";
import { OurInspirationContextProvider } from "../pages/OurInspiration/OurInspirationContext";
import OurInspirations from "../pages/OurInspiration/OurInspiration";
import { OurGoalContextProvider } from "../pages/OurGoal/OurGoalContext";
import OurGoal from "../pages/OurGoal/OurGoal";
import { InstitutionsAboutContextProvider } from "../pages/InstitutionsAbout/InstitutionsAboutContext";
import InstitutionsAbout from "../pages/InstitutionsAbout/InstitutionsAbout";
import { OurModelContextProvider } from "../pages/OurModel/OurModelContext";
import OurModel from "../pages/OurModel/OurModel";
import { OurInstitutionsContextProvider } from "../pages/OurInstitutions/OurInstitutionsContext";
import OurInstitutions from "../pages/OurInstitutions/OurInstitutions";
import { AcademyHistoryContextProvider } from "../pages/AcademyHistory/AcademyHistoryContext";
import AcademyHistory from "../pages/AcademyHistory/AcademyHistory";
import { LeadershipTeamContextProvider } from "../pages/LeadershipTeam/LeadershipTeamContext";
import LeadershipTeam from "../pages/LeadershipTeam/LeadershipTeam";
import Achievements from "../pages/Achievements/Achievements";
import { GradeContextProvider } from "../pages/Grade/GradeContext";
import Grade from "../pages/Grade/Grade";
import { HowToApplyContextProvider } from "../pages/HowToApply/HowToApplyContext";
import HowToApply from "../pages/HowToApply/HowToApply";
import { FacilitiesContextProvider } from "../pages/Facilities/FacilitiesContext";
import Facilities from "../pages/Facilities/Facilities";
import { ContactInfoContextProvider } from "../pages/ContactInfo/ContactInfoContext";
import ContactInfo from "../pages/ContactInfo/ContactInfo";
import { VidhyaVanamHistoryContextProvider } from "../pages/VidhyaVanamHistory/VidhyaVanamHistoryContext";
import VidhyaVanamHistory from "../pages/VidhyaVanamHistory/VidhyaVanamHistory";
import VidhyavanamLeadeship from "../pages/VidhyavanamLeadership/VidhyavanamLeadership";
import { VidhyavanamLeadershipContextProvider } from "../pages/VidhyavanamLeadership/VidhyavanamLeadershipContext";
import {
  VidhyaVanamAchievementsContext,
  VidhyaVanamAchievementsContextProvider,
} from "../pages/VidhyaVanamAchievements/VidhyaVanamAchievementsContext";
import VidhyaVanamAchievements from "../pages/VidhyaVanamAchievements/VidhyaVanamAchievements";
import VidhyaVanamGrade from "../pages/VidhyaVanamGrade/VidhyaVanamGrade";
import { VidhyaVanamGradeContextProvider } from "../pages/VidhyaVanamGrade/VidhyaVanamGradeContext";
import { VidhyaVanamApplyContextProvider } from "../pages/VidhyaVanamApply/VidhyaVanamApplyContext";
import VidhyaVanamApply from "../pages/VidhyaVanamApply/VidhyaVanamApply";
import VidhyavanamLeadership from "../pages/VidhyavanamLeadership/VidhyavanamLeadership";
import { VidhyaVanamFacilitiesContextProvider } from "../pages/VidhyaVanamFacilities/VidhyaVanamFacilitiesContext";
import VidhyaVanamFacilities from "../pages/VidhyaVanamFacilities/VidhyaVanamFacilities";
import { VidhyaVanamContactContextProvider } from "../pages/VidhyaVanamContact/VidhyaVanamContactContext";
import VidhyaVanamContact from "../pages/VidhyaVanamContact/VidhyaVanamContact";
import { ContactContextProvider } from "../pages/Contact/ContactContext";
import Contact from "../pages/Contact/Contact";
import { AboutDonateContextProvider } from "../pages/AboutDonate/AboutDonateContext";
import AboutDonate from "../pages/AboutDonate/AboutDonate";
import { ContributionContextProvider } from "../pages/Contribution/ContributionContext";
import Contribution from "../pages/Contribution/Contribution";
import { DonateAchievementsContextProvider } from "../pages/DonateAchievements/DonateAchievementsContext";
import DonateAchievements from "../pages/DonateAchievements/DonateAchievements";
import { MasterBannerContextProvider } from "../pages/MasterBanner/MasterBannerContext";
import MasterBanner from "../pages/MasterBanner/MasterBanner";
import {
  QuotesContextProvider,
  QutoesContextProvider,
} from "../pages/Quotes/QuotesContext";
import Quotes from "../pages/Quotes/Quotes";
import { DonateNowContextProvider } from "../pages/DonateNow/DonateNowContext";
import DonateNow from "../pages/DonateNow/DonateNow";
import { TestimonialsContextProvider } from "../pages/Testimonials/TestimonialsContext";
import Testimonials from "../pages/Testimonials/Testimonials";
import { SocialMediaLinksContextProvider } from "../pages/SocialMedia/SocialMediaContext";
import SocialMediaLinks from "../pages/SocialMedia/SocialMedia";
import { NewsAndEventsContextProvider } from "../pages/NewsAndEvents/NewsAndEventsContext";
import NewsAndEvents from "../pages/NewsAndEvents/NewsAndEvents";
import { ContactFormContextProvider } from "../pages/ContactForm/ContactFormContext";
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

          <Route element={<UserContextProvider />}>
            <Route path='banner' element={<HomeBanner />}></Route>
            {/* <Route path='about-us' element={<AboutUs />}></Route> */}
          </Route>
          <Route element={<AboutContextProvider />}>
            <Route path='about-us' element={<AboutUs />}></Route>
          </Route>
          <Route element={<GalleryContextProvider />}>
            <Route path='gallery' element={<Gallery />}></Route>
          </Route>
          <Route element={<OurMissionContextProvider />}>
            <Route path='our-mission' element={<OurMission />}></Route>
          </Route>
          {/* About Us page */}
          <Route element={<OverviewContextProvider />}>
            <Route path='overview' element={<Overview />}></Route>
          </Route>
          <Route element={<OurValuesContextProvider />}>
            <Route path='ourValues' element={<OurValues />}></Route>
          </Route>
          <Route element={<OurInspirationContextProvider />}>
            <Route path='ourInspirations' element={<OurInspirations />}></Route>
          </Route>
          <Route element={<FutureLeadersContextProvider />}>
            <Route path='future-leaders' element={<FutureLeaders />}></Route>
          </Route>
          {/* ourScope page */}
          <Route element={<ScopeBannerContextProvider />}>
            <Route path='scope-banner' element={<ScopeBanner />}></Route>
          </Route>
          <Route element={<ScopeOverviewContextProvider />}>
            <Route path='scope-overview' element={<ScopeOverview />}></Route>
          </Route>
          <Route element={<ScholarshipContextProvider />}>
            <Route path='scholarship' element={<Scholarship />}></Route>
          </Route>
          <Route element={<InstitutionsContextProvider />}>
            <Route path='scope-institutions' element={<Institutions />}></Route>
          </Route>
          {/* Scholarships page */}
          <Route element={<ScholarshipOverviewContextProvider />}>
            <Route
              path='scholarship-overview'
              element={<ScholarshipOverview />}
            ></Route>
          </Route>
          <Route element={<AppProcessContextProvider />}>
            <Route path='app-process' element={<AppProcess />}></Route>
          </Route>
          <Route element={<AppTimelineContextProvider />}>
            <Route path='app-timeline' element={<AppTimeline />}></Route>
          </Route>

          <Route path='app-content' element={<ApplicationDocument />}></Route>
          <Route element={<ScholarshipDocContextProvider />}>
            <Route
              path='scholarship-documents'
              element={<ScholarshipDoc />}
            ></Route>
          </Route>
          <Route element={<NotificationContextProvider />}>
            <Route path='notification' element={<Notification />}></Route>
          </Route>
          <Route element={<ScholarshipAwardeesContextProvider />}>
            <Route
              path='scholarship-awardees'
              element={<ScholarshipAwardees />}
            ></Route>
          </Route>
          <Route element={<OurGoalContextProvider />}>
            <Route path='our-goal' element={<OurGoal />}></Route>
          </Route>
          {/* Institutions page */}
          <Route element={<InstitutionsAboutContextProvider />}>
            <Route
              path='institutions-about'
              element={<InstitutionsAbout />}
            ></Route>
          </Route>
          <Route element={<OurModelContextProvider />}>
            <Route path='our-model' element={<OurModel />}></Route>
          </Route>
          <Route element={<OurInstitutionsContextProvider />}>
            <Route
              path='our-institutions'
              element={<OurInstitutions />}
            ></Route>
          </Route>
          {/* Manas Academy Page */}
          <Route element={<AcademyHistoryContextProvider />}>
            <Route path='academy-history' element={<AcademyHistory />}></Route>
          </Route>
          <Route element={<LeadershipTeamContextProvider />}>
            <Route path='leadershipTeam' element={<LeadershipTeam />}></Route>
          </Route>
          <Route path='achievements' element={<Achievements />}></Route>
          <Route element={<GradeContextProvider />}>
            <Route path='grade' element={<Grade />}></Route>
          </Route>
          <Route element={<HowToApplyContextProvider />}>
            <Route path='how-to-apply' element={<HowToApply />}></Route>
          </Route>
          <Route element={<FacilitiesContextProvider />}>
            <Route path='facilities' element={<Facilities />}></Route>
          </Route>
          <Route element={<ContactInfoContextProvider />}>
            <Route path='contact-info' element={<ContactInfo />}></Route>
          </Route>
          {/* Vidhya vanam Page*/}
          <Route element={<VidhyaVanamHistoryContextProvider />}>
            <Route
              path='vidhyavanam-history'
              element={<VidhyaVanamHistory />}
            ></Route>
          </Route>
          <Route element={<VidhyavanamLeadershipContextProvider />}>
            <Route
              path='vidhyvanam-leadershipTeam'
              element={<VidhyavanamLeadership />}
            ></Route>
          </Route>
          <Route element={<VidhyaVanamAchievementsContextProvider />}>
            <Route
              path='vidhyvanam-achievements'
              element={<VidhyaVanamAchievements />}
            ></Route>
          </Route>
          <Route element={<VidhyaVanamGradeContextProvider />}>
            <Route
              path='vidhyvanam-grade'
              element={<VidhyaVanamGrade />}
            ></Route>
          </Route>
          <Route element={<VidhyaVanamApplyContextProvider />}>
            <Route
              path='vidhyvanam-how-to-apply'
              element={<VidhyaVanamApply />}
            ></Route>
          </Route>
          <Route element={<VidhyaVanamFacilitiesContextProvider />}>
            <Route
              path='vidhyvanam-facilities'
              element={<VidhyaVanamFacilities />}
            ></Route>
          </Route>
          <Route element={<VidhyaVanamContactContextProvider />}>
            <Route
              path='vidhyvanam-contact-info'
              element={<VidhyaVanamContact />}
            ></Route>
          </Route>

          {/* Contact Us page */}
          <Route element={<ContactContextProvider />}>
            <Route path='contact-us' element={<Contact />}></Route>
          </Route>

          {/* Donate  page */}
          <Route element={<AboutDonateContextProvider />}>
            <Route path='about-donate' element={<AboutDonate />}></Route>
          </Route>
          <Route element={<ContributionContextProvider />}>
            <Route path='contribution' element={<Contribution />}></Route>
          </Route>
          <Route element={<DonateAchievementsContextProvider />}>
            <Route
              path='donate-achievements'
              element={<DonateAchievements />}
            ></Route>
          </Route>

          {/* Master Page */}
          <Route element={<MasterBannerContextProvider />}>
            <Route path='master-banner' element={<MasterBanner />}></Route>
          </Route>
          <Route element={<QuotesContextProvider />}>
            <Route path='quotes' element={<Quotes />}></Route>
          </Route>
          <Route element={<DonateNowContextProvider />}>
            <Route path='donate-now' element={<DonateNow />}></Route>
          </Route>
          <Route element={<SocialMediaLinksContextProvider />}>
            <Route
              path='socialMedia-links'
              element={<SocialMediaLinks />}
            ></Route>
          </Route>

          {/* Testimonials Page */}
          <Route element={<TestimonialsContextProvider />}>
            <Route path='testimonials' element={<Testimonials />}></Route>
          </Route>

          {/* NEWS & EVENTS Page */}
          <Route element={<NewsAndEventsContextProvider />}>
            <Route path='news-and-events' element={<NewsAndEvents />}></Route>
          </Route>

          {/* Contact Form Page */}
          <Route element={<ContactFormContextProvider />}>
            <Route path='contact-form' element={<ContactForm />}></Route>
          </Route>
        </Route>

        {/* <Route element={<ProductContextProvider />}> */}
        {/* <Route path="product-list" element={<ProductList />}></Route>
          <Route path="product-card" element={<ProductCard />}></Route>
          <Route path="product-details/:productId" element={<ProductDetails />}></Route> */}
      </Route>
      {/* </Route> */}

      {/* <Route path={`${process.env.PUBLIC_URL}`} element={<LayoutNoSidebar />}>
        <Route path="auth-success" element={<Success />}></Route>
        <Route path="auth-reset" element={<ForgotPassword />}></Route>
        <Route path="auth-register" element={<Register />}></Route>
        <Route path="auth-login" element={<Login />}></Route>

        <Route path="errors">
          <Route path="404-modern" element={<Error404Modern />}></Route>
          <Route path="404-classic" element={<Error404Classic />}></Route>
          <Route path="504-modern" element={<Error504Modern />}></Route>
          <Route path="504-classic" element={<Error504Classic />}></Route>
        </Route>
        <Route path="*" element={<Error404Modern />}></Route>
      </Route> */}
    </Routes>
  );
};
export default Router;
