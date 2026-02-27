// pages/AutomobilePage.tsx

import BenefitsSection from "@/components/Automobile/BenefitsSection";
import BookingModal from "@/components/Automobile/BookingModal";

import DetailedServices from "@/components/Automobile/DetailedServices";
import HeroSection from "@/components/Automobile/HeroSelection";
import MainServices from "@/components/Automobile/MainService";
import PackagesSection from "@/components/Automobile/PackagesSection";
import ServicePromoBanner from "@/components/Automobile/ServicePromoBanner";
import StatsSection from "@/components/Automobile/StatSection";

import { useState } from "react";


const AutomobilePage = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);

  return (
    <>
      <HeroSection onBook={() => setShowBookingForm(true)} />
      <StatsSection />
      <MainServices />
      <ServicePromoBanner onBook={() => setShowBookingForm(true)} />
      <DetailedServices />
      <PackagesSection onBook={() => setShowBookingForm(true)} />
      <BenefitsSection onBook={() => setShowBookingForm(true)} />



      {showBookingForm && (
        <BookingModal onClose={() => setShowBookingForm(false)} />
      )}
    </>
  );
};

export default AutomobilePage;