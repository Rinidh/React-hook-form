import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { customZodResolver } from "../utils/customZodResolver";

export const UserEditPage = () => {
  return (
    <>
      <UserEditForm />
    </>
  );
};

const schema = z.strictObject({
  id: z.uuid(),
  name: z.string().nonempty("Name is required"),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(
      /^\+?[0-9\s\-()]{5,20}$/, // smallest number with min 4 phone number digits + 1 country code digit. Largest number with 17 phone number digits + 3 country code digits
      "Please enter a valid telephone number including country code"
    )
    .optional(),
});

const UserEditForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: customZodResolver(schema),
  });

  const onFormSubmit = (data) => {
    console.log("Submitted", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit, (err) =>
        console.error("Submit error:", err)
      )}
    >
      <input type="hidden" {...register("id")} />

      <label>
        Name:
        <input {...register("name")} />
        {errors.name && <span>{errors.name.message}</span>}
      </label>

      <label>
        Email:
        <input {...register("email")} />
        {errors.email && <span>{errors.email.message}</span>}
      </label>

      <label>
        Phone:
        <input {...register("phone")} />
        {errors.phone && <span>{errors.phone.message}</span>}
      </label>

      <input type="submit" />
    </form>
  );
};
