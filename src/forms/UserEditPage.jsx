import React, { useEffect } from "react";
import { set, useForm } from "react-hook-form";
import z from "zod";
import { customZodResolver } from "../utils/customZodResolver";

export const UserEditPage = () => {
  const { userData, fetchUserData, updateUserData, error, loading } =
    useUserData();

  React.useEffect(() => fetchUserData(), []);

  return (
    <>
      {userData && (
        <UserEditForm defaultValues={userData} onSubmit={updateUserData} />
      )}
      {loading && <p>Loading...</p>}
      {error && <p role="alert">Error fetching user data</p>}
    </>
  );
};

const schema = z.object({
  id: z.number().min(1).max(10),
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

const UserEditForm = ({
  defaultValues,
  onSubmit = (data) => console.log(data),
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm({
    defaultValues,
    resolver: customZodResolver(schema),
  });

  const onFormSubmit = async (data) => {
    return await onSubmit(data);
  };

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
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

      <input
        type="submit"
        value={
          !isDirty ? "No Changes" : isSubmitting ? "Updating..." : "Update User"
        }
        disabled={!isDirty}
      />
    </form>
  );
};

const useUserData = (initialData) => {
  const [userData, setUserData] = React.useState(initialData);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  async function fetchUserData() {
    const id = getStoredId();
    setLoading(true);

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`
      );
      const data = await response.json();

      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateUserData(data) {
    setLoading(true);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${data.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();

      setUserData(result);
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
      setLoading(false);
      return true; // returning something for useForm() to know and set `isSubmitting` state
    }
  }

  return { userData, error, loading, fetchUserData, updateUserData };
};

function getStoredId() {
  const id = Number(localStorage.getItem("reactHookForm_practice")) || 1;

  //update stored id such that on new session (on refreshing page), a new default user is fetched
  localStorage.setItem("reactHookForm_practice", id === 10 ? 1 : id + 1); // max number of users present is "10" from typicode API

  return id;
}
