import React from "react";
import { useFormContext, useForm } from "react-hook-form";
import z from "zod";
import { customZodResolverAsync } from "../utils/customZodResolverAsync";

export const SignUpForm = () => {
  const onSubmit = (d) => console.log("Submitted", d);
  const onError = (err) => console.log("Submit err", err);
  const checkNameExist = React.useCallback(async (name) => {
    const res = await fetch(
      `https://echo.free.beeceptor.com/username=${name}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    return !res.ok; // manually alter booleans here, as res.ok is always true. Returning false means name doesn't exist ✅
  }, []);

  const schema = z.strictObject({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must be less than 20 characters")
      .refine(async (val) => {
        const exists = await checkNameExist(val);
        return !exists; // ✅ passes validation if username does NOT exist
      }, "Username already exists"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
    },
    resolver: customZodResolverAsync(schema),
    mode: "onBlur",
    reValidateMode: "onBlur", // after first submit failure, it is better not to revalidate onChange due to API calls
  });

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <fieldset>
        <legend>Sign up</legend>

        <input type="text" {...register("username")} placeholder="Username" />
        {errors.username && <p role="alert">{errors.username.message}</p>}
      </fieldset>

      <input type="submit" value="Sign Up" />
    </form>
  );
};
