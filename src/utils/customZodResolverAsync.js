export const customZodResolverAsync = (schema) => {
  return async (values) => {
    try {
      const result = await schema.safeParseAsync(values);
      if (result.success) {
        return {
          values: result.data,
          errors: {},
        };
      } else {
        return {
          errors: zodToHookFormError(result.error),
          values: {},
        };
      }
    } catch (err) {
      console.error("Resolver Error: ", err);
      return {
        values: {},
        errors: {
          root: {
            type: "unknown",
            message: "An unknown error occured during async validation by zod",
          },
        },
      };
    }
  };
};

export function zodToHookFormError(zodError) {
  let errors = {};

  for (const issue of zodError.issues) {
    const path = issue.path.join(".");
    errors[path] = {
      type: issue.code,
      message: issue.message,
    };
  }

  return errors;
}
