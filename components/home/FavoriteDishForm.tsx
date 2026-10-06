"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Send, Utensils } from "lucide-react";

import { supabase } from "@/lib/supabase";

type FavoriteDishFormProps = {
  hotelId: number;
  hotelName: string;
};

export default function FavoriteDishForm({
  hotelId,
  hotelName,
}: FavoriteDishFormProps) {
  const [dishName, setDishName] = useState("");
  const [customerName, setCustomerName] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const cleanedDishName =
      dishName.trim();

    const cleanedCustomerName =
      customerName.trim();

    // Dish name is required
    if (!cleanedDishName) {
      setErrorMessage(
        "Please enter your favorite dish."
      );

      return;
    }

    // Prevent extremely long input
    if (cleanedDishName.length > 150) {
      setErrorMessage(
        "Dish name must be 150 characters or less."
      );

      return;
    }

    if (
      cleanedCustomerName.length > 100
    ) {
      setErrorMessage(
        "Name must be 100 characters or less."
      );

      return;
    }

    try {
      setIsSubmitting(true);

      const {
        error,
      } = await supabase
        .from("favorite_dishes")
        .insert({
          hotel_id: hotelId,
          dish_name: cleanedDishName,
          customer_name:
            cleanedCustomerName || null,
        });

      if (error) {
        console.error(
          "Favorite dish submission error:",
          error
        );

        setErrorMessage(
          "We couldn't submit your favorite dish. Please try again."
        );

        return;
      }

      setDishName("");
      setCustomerName("");

      setSuccessMessage(
        `Thanks! Your favorite dish for ${hotelName} has been submitted.`
      );
    } catch (error) {
      console.error(
        "Unexpected favorite dish error:",
        error
      );

      setErrorMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-6 mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

      {/* Header */}

      <div className="flex items-start gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c79a45]/10">
          <Utensils className="h-5 w-5 text-[#c79a45]" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            What&apos;s your favorite dish?
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Tell us which dish you love at{" "}
            <span className="font-medium text-slate-700">
              {hotelName}
            </span>
            .
          </p>
        </div>
      </div>

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5"
      >

        {/* Dish */}

        <div>
          <label
            htmlFor={`favorite-dish-${hotelId}`}
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Favorite dish
            <span className="ml-1 text-red-500">
              *
            </span>
          </label>

          <input
            id={`favorite-dish-${hotelId}`}
            type="text"
            value={dishName}
            onChange={(event) =>
              setDishName(event.target.value)
            }
            placeholder="e.g. Seafood Paella"
            maxLength={150}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#c79a45] focus:ring-2 focus:ring-[#c79a45]/20 disabled:cursor-not-allowed disabled:bg-slate-50"
          />

          <p className="mt-1.5 text-xs text-slate-400">
            {dishName.length}/150
          </p>
        </div>

        {/* Customer Name */}

        <div>
          <label
            htmlFor={`customer-name-${hotelId}`}
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Your name
            <span className="ml-1 text-xs font-normal text-slate-400">
              (optional)
            </span>
          </label>

          <input
            id={`customer-name-${hotelId}`}
            type="text"
            value={customerName}
            onChange={(event) =>
              setCustomerName(event.target.value)
            }
            placeholder="Enter your name"
            maxLength={100}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#c79a45] focus:ring-2 focus:ring-[#c79a45]/20 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </div>

        {/* Error */}

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Success */}

        {successMessage && (
          <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            <span>
              {successMessage}
            </span>
          </div>
        )}

        {/* Submit */}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#c79a45] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b88936] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <Send className="h-4 w-4" />

          {isSubmitting
            ? "Submitting..."
            : "Submit Favorite Dish"}
        </button>

      </form>
    </section>
  );
}