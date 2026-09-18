"use client";

import { useEffect, useState } from "react";
import {
  X,
  Star,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Hotel = {
  hotel_id: number;
  hotel_name: string;
};

type WriteReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: () => void;
};

export default function WriteReviewModal({
  isOpen,
  onClose,
  onReviewSubmitted,
}: WriteReviewModalProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);

  const [hotelId, setHotelId] = useState("");
  const [reviewType, setReviewType] = useState<"dining" | "stay">(
    "dining"
  );
  const [guestName, setGuestName] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [visitDate, setVisitDate] = useState("");

  const [loadingHotels, setLoadingHotels] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // --------------------------------------------------
  // LOAD HOTELS
  // --------------------------------------------------

  useEffect(() => {
    if (!isOpen) return;

    async function loadHotels() {
      setLoadingHotels(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("hotels")
        .select("hotel_id, hotel_name")
        .order("hotel_name", { ascending: true });

      if (error) {
        console.error("Error loading hotels:", error);

        setErrorMessage(
          "Unable to load hotels. Please try again."
        );

        setHotels([]);
      } else {
        setHotels(data ?? []);
      }

      setLoadingHotels(false);
    }

    loadHotels();
  }, [isOpen]);

  // --------------------------------------------------
  // RESET FORM
  // --------------------------------------------------

  function resetForm() {
    setHotelId("");
    setReviewType("dining");
    setGuestName("");
    setRating(0);
    setReviewText("");
    setVisitDate("");
    setSuccessMessage("");
    setErrorMessage("");
  }

  // --------------------------------------------------
  // CLOSE MODAL
  // --------------------------------------------------

  function handleClose() {
    if (submitting) return;

    resetForm();
    onClose();
  }

  // --------------------------------------------------
  // SUBMIT REVIEW
  // --------------------------------------------------

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    // Validation
    if (!hotelId) {
      setErrorMessage("Please select a hotel.");
      return;
    }

    if (!guestName.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setErrorMessage("Please select a rating from 1 to 5.");
      return;
    }

    if (!reviewText.trim()) {
      setErrorMessage("Please write your review.");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from("reviews")
      .insert({
        hotel_id: Number(hotelId),
        review_type: reviewType,
        guest_name: guestName.trim(),
        rating,
        review_text: reviewText.trim(),
        visit_date: visitDate || null,
      });

    if (error) {
      console.error("Review submission error:", error);

      setErrorMessage(
        error.message ||
          "Unable to submit your review. Please try again."
      );

      setSubmitting(false);
      return;
    }

    // Success
    setSuccessMessage(
      "Your review has been submitted successfully."
    );

    setSubmitting(false);

    // Refresh reviews on parent page
    if (onReviewSubmitted) {
      onReviewSubmitted();
    }

    // Close modal after success message
    setTimeout(() => {
      resetForm();
      onClose();
    }, 1500);
  }

  // --------------------------------------------------
  // MODAL
  // --------------------------------------------------

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#091423]/70 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* HEADER */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a47a27]">
              Share Your Experience
            </p>

            <h2 className="mt-1 text-2xl font-bold text-[#091423]">
              Write a Review
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Tell other guests about your dining or stay experience.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-[#091423] disabled:cursor-not-allowed"
            aria-label="Close review form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >
          {/* SUCCESS */}
          {successMessage && (
            <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div>
                <p className="font-semibold">
                  Review submitted
                </p>

                <p className="mt-1 text-sm">
                  {successMessage}
                </p>
              </div>
            </div>
          )}

          {/* ERROR */}
          {errorMessage && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div>
                <p className="font-semibold">
                  Unable to submit review
                </p>

                <p className="mt-1 text-sm">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          {/* HOTEL */}
          <div>
            <label
              htmlFor="hotel"
              className="mb-2 block text-sm font-semibold text-[#091423]"
            >
              Select Hotel
            </label>

            <select
              id="hotel"
              value={hotelId}
              onChange={(event) =>
                setHotelId(event.target.value)
              }
              disabled={loadingHotels || submitting}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#c79a45] focus:ring-2 focus:ring-[#c79a45]/20 disabled:bg-slate-100"
            >
              <option value="">
                {loadingHotels
                  ? "Loading hotels..."
                  : "Choose a hotel"}
              </option>

              {hotels.map((hotel) => (
                <option
                  key={hotel.hotel_id}
                  value={hotel.hotel_id}
                >
                  {hotel.hotel_name}
                </option>
              ))}
            </select>
          </div>

          {/* EXPERIENCE TYPE */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#091423]">
              What are you reviewing?
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setReviewType("dining")}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  reviewType === "dining"
                    ? "border-[#c79a45] bg-[#c79a45]/10 text-[#091423]"
                    : "border-slate-300 bg-white text-slate-600 hover:border-[#c79a45]"
                }`}
              >
                Dining Experience
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => setReviewType("stay")}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  reviewType === "stay"
                    ? "border-[#c79a45] bg-[#c79a45]/10 text-[#091423]"
                    : "border-slate-300 bg-white text-slate-600 hover:border-[#c79a45]"
                }`}
              >
                Stay Experience
              </button>
            </div>
          </div>

          {/* NAME */}
          <div>
            <label
              htmlFor="guestName"
              className="mb-2 block text-sm font-semibold text-[#091423]"
            >
              Your Name
            </label>

            <input
              id="guestName"
              type="text"
              value={guestName}
              onChange={(event) =>
                setGuestName(event.target.value)
              }
              disabled={submitting}
              maxLength={100}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#c79a45] focus:ring-2 focus:ring-[#c79a45]/20 disabled:bg-slate-100"
            />
          </div>

          {/* RATING */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#091423]">
              Your Rating
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={submitting}
                    onClick={() => setRating(star)}
                    className="rounded-md p-1 transition hover:scale-110 disabled:cursor-not-allowed"
                    aria-label={`Rate ${star} out of 5`}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? "fill-[#d1a044] text-[#d1a044]"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <span className="ml-1 text-sm font-medium text-slate-500">
                {rating > 0
                  ? `${rating} out of 5`
                  : "Select a rating"}
              </span>
            </div>
          </div>

          {/* REVIEW */}
          <div>
            <label
              htmlFor="reviewText"
              className="mb-2 block text-sm font-semibold text-[#091423]"
            >
              Your Review
            </label>

            <textarea
              id="reviewText"
              value={reviewText}
              onChange={(event) =>
                setReviewText(event.target.value)
              }
              disabled={submitting}
              maxLength={1000}
              rows={6}
              placeholder="Tell us about your experience..."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#c79a45] focus:ring-2 focus:ring-[#c79a45]/20 disabled:bg-slate-100"
            />

            <div className="mt-1 text-right text-xs text-slate-400">
              {reviewText.length}/1000
            </div>
          </div>

          {/* VISIT DATE */}
          <div>
            <label
              htmlFor="visitDate"
              className="mb-2 block text-sm font-semibold text-[#091423]"
            >
              Visit Date{" "}
              <span className="font-normal text-slate-400">
                (Optional)
              </span>
            </label>

            <input
              id="visitDate"
              type="date"
              value={visitDate}
              onChange={(event) =>
                setVisitDate(event.target.value)
              }
              disabled={submitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#c79a45] focus:ring-2 focus:ring-[#c79a45]/20 disabled:bg-slate-100"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#091423] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#12233a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Submitting..."
                : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}