import Joi from "joi";

export const registerSchema = Joi.object()
  .keys({
    fullName: Joi.string().required(),
    userName: Joi.string().required(),
    email: Joi.string().trim().lowercase().required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    confirm_password: Joi.ref("password"),
  })
  .with("password", "confirm_password");


  export const options = {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  };