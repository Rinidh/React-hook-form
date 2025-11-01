import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { customZodResolver } from "../utils/customZodResolver";

export const UserEditPage = () => {
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
    fetchUserData().then((data) => setUserData(data));
  }, []);

  return <>{userData && <UserEditForm defaultValues={userData} />}</>;
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

const UserEditForm = ({ defaultValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
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

async function fetchUserData() {
  const id = 1; // JSONPlaceholder user ID ranges from 1 to 10

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  const data = await response.json();

  return data;
}
