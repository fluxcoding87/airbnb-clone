/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import useSearchModal from "@/hooks/useSearchModal";
import Modal from "./Modal";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";
import qs from "query-string";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import { formatISO } from "date-fns";
import Heading from "../Heading";
import Calender from "../inputs/Calender";
import Counter from "../inputs/Counter";
import Loader from "../Loader";
enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}

const SarchModal = () => {
  const searchModal = useSearchModal();
  const router = useRouter();
  const params = useSearchParams();
  const [location, setLocation] = useState<CountrySelectValue>();
  const [step, setStep] = useState(STEPS.LOCATION);
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
  );
  const onBack = useCallback(() => {
    setStep((curr) => curr - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((curr) => curr + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }
    let currentQuery = {};
    if (params) {
      currentQuery = qs.parse(params.toString());
    }
    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount,
    };
    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }
    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl(
      {
        url: "",
        query: updatedQuery,
      },
      { skipNull: true }
    );
    setStep(STEPS.LOCATION);
    searchModal.onClose();
    router.push(url);
  }, [
    step,
    searchModal,
    location,
    router,
    guestCount,
    roomCount,
    bathroomCount,
    dateRange,
    onNext,
    params,
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return "Search";
    }
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }
    return "Back";
  }, [step]);

  let bodyContent = (
    <Suspense fallback={<Loader />}>
      <div className="flex flex-col gap-8">
        <Heading
          title="Where do you want to go?"
          subtitle="Find the perfect location."
        />
        <CountrySelect
          value={location}
          onChange={(value) => setLocation(value as CountrySelectValue)}
        />
        <hr />
        <Map center={location?.latlng} />
      </div>
    </Suspense>
  );
  if (step === STEPS.DATE) {
    bodyContent = (
      <Suspense fallback={<Loader />}>
        <div className="flex flex-col gap-8">
          <Heading
            title="When do you plan to go?"
            subtitle="Make sure everyone is free!"
          />
          <Calender
            value={dateRange}
            onChange={(value) => setDateRange(value.selection)}
          />
        </div>
      </Suspense>
    );
  }
  if (step === STEPS.INFO) {
    bodyContent = (
      <Suspense fallback={<Loader />}>
        <div className="flex flex-col gap-8">
          <Heading
            title="More information"
            subtitle="Find your perfect place."
          />
          <Counter
            title="Guests"
            subtitle="How many guests are coming?"
            value={guestCount}
            onChange={(value) => setGuestCount(value)}
          />
          <Counter
            title="Rooms"
            subtitle="How many rooms do you need?"
            value={roomCount}
            onChange={(value) => setRoomCount(value)}
          />
          <Counter
            title="Bathrooms"
            subtitle="How many bathrooms do you need?"
            value={bathroomCount}
            onChange={(value) => setBathroomCount(value)}
          />
        </div>
      </Suspense>
    );
  }
  return (
    <Suspense fallback={<Loader />}>
      <Modal
        isOpen={searchModal.isOpen}
        onClose={searchModal.onClose}
        onSubmit={onSubmit}
        title="Filters"
        actionLabel={actionLabel}
        secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
        secondaryActionLabel={secondaryActionLabel}
        body={bodyContent}
      />
    </Suspense>
  );
};

export default SarchModal;
