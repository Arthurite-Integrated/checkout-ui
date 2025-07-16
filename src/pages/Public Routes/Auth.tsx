// import { useState, useEffect } from "react";
// import logo from "./../../assets/checkout.png";
// import Github from "./../../assets/github.svg";
// import Server from "../../server";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useAuthStore } from "../../store";
// import { toast } from "react-toastify";

// // Simulating React Hook Form functionality
// const useForm = (defaultValues = {}) => {
//   const [values, setValues] = useState(defaultValues);
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});

//   const register = (name, validationRules = {}) => ({
//     name,
//     value: values[name] || "",
//     onChange: (e) => {
//       const value = e.target.value;
//       setValues((prev) => ({ ...prev, [name]: value }));

//       // Clear error when user starts typing
//       if (errors[name]) {
//         setErrors((prev) => ({ ...prev, [name]: "" }));
//       }
//     },
//     onBlur: () => {
//       setTouched((prev) => ({ ...prev, [name]: true }));
//       validateField(name, values[name], validationRules);
//     },
//   });

//   const validateField = (name, value, rules) => {
//     let error = "";

//     if (rules.required && (!value || value.trim() === "")) {
//       error = rules.required.message || `${name} is required`;
//     } else if (rules.pattern && value && !rules.pattern.value.test(value)) {
//       error = rules.pattern.message || `Invalid ${name} format`;
//     } else if (
//       rules.minLength &&
//       value &&
//       value.length < rules.minLength.value
//     ) {
//       error =
//         rules.minLength.message ||
//         `${name} must be at least ${rules.minLength.value} characters`;
//     }

//     setErrors((prev) => ({ ...prev, [name]: error }));
//     return error;
//   };

//   const validateForm = (validationSchema) => {
//     const newErrors = {};
//     let isValid = true;

//     Object.keys(validationSchema).forEach((fieldName) => {
//       const error = validateField(
//         fieldName,
//         values[fieldName],
//         validationSchema[fieldName]
//       );
//       if (error) {
//         newErrors[fieldName] = error;
//         isValid = false;
//       }
//     });

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleSubmit =
//     (onSubmit: (data: any) => Promise<void>, validationSchema = {}) =>
//     (e: any) => {
//       e.preventDefault();
//       const isValid = validateForm(validationSchema);
//       if (isValid) {
//         onSubmit(values);
//       }
//     };

//   const reset = (newValues = {}) => {
//     setValues(newValues);
//     setErrors({});
//     setTouched({});
//   };

//   return {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isValid: Object.keys(errors).length === 0 },
//     watch: (name) => values[name],
//     setValue: (name, value) =>
//       setValues((prev) => ({ ...prev, [name]: value })),
//   };
// };

// const loginValidationSchema = {
//   email: {
//     required: { message: "Email is required" },
//     pattern: {
//       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//       message: "Please enter a valid email address",
//     },
//   },
//   password: {
//     required: { message: "Password is required" },
//     minLength: {
//       value: 6,
//       message: "Password must be at least 6 characters",
//     },
//   },
// };

// const registerValidationSchema = {
//   ...loginValidationSchema,
//   firstName: {
//     required: { message: "First name is required" },
//     minLength: {
//       value: 2,
//       message: "First name must be at least 2 characters",
//     },
//   },
//   lastName: {
//     required: { message: "Last name is required" },
//     minLength: {
//       value: 2,
//       message: "Last name must be at least 2 characters",
//     },
//   },
// };

// export default function Auth() {
//   const [isLogin, setIsLogin] = useState(true);
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   }: { formState: { errors: any }, register: any, handleSubmit: any, reset: any } = useForm();
//   const { login, register: reg } = useAuthStore();
//   const navigate = useNavigate();

//   const onSubmit = async (data: any) => {
//     if (isLogin) {
//       const { success } = await login(data.email, data.password);
//       if (success) {
//         navigate("/dashboard", { replace: true });
//       }
//     } else {
//       const { success } = await reg(
//         data.firstName,
//         data.lastName,
//         data.email,
//         data.password
//       );
//       console.log(success);
//       if (success) {
//         reset();
//         setIsLogin(true);
//       }
//       setIsLogin(false);
//     }
//   };

//   const switchMode = () => {
//     setIsLogin(!isLogin);
//     reset();
//   };

//   useEffect(() => {
//     reset();
//   }, [isLogin]);

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center p-4"
//       style={{
//         background: "#1f2020",
//       }}
//     >
//       <div className="w-full max-w-md">
//         {/* Logo Section */}
//         <div className="flex justify-center flex-col items-center mb-10">
//           <img src={logo} className="h-auto w-[50%] mb-1" />
//           <p className="text-gray-400 text-sm">Secure. Fast. Reliable.</p>
//         </div>

//         {/* Main Container */}
//         <div className="bg-[#1f2020] backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1">
//           {/* Toggle Buttons */}
//           <div className="flex bg-gray-800/50 rounded-2xl p-1 mb-8">
//             <button
//               onClick={() => setIsLogin(true)}
//               className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
//                 isLogin
//                   ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg"
//                   : "text-gray-400 hover:text-white"
//               }`}
//             >
//               Login
//             </button>
//             <button
//               onClick={() => setIsLogin(false)}
//               className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
//                 !isLogin
//                   ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg"
//                   : "text-gray-400 hover:text-white"
//               }`}
//             >
//               Register
//             </button>
//           </div>

//           {/* Form */}
//           <div className="space-y-6">
//             {/* Register-only fields */}
//             {!isLogin && (
//               <div className="grid grid-cols-2 gap-4 animate-fadeIn">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-300">
//                     First Name
//                   </label>
//                   <input
//                     {...register(
//                       "firstName",
//                       registerValidationSchema.firstName
//                     )}
//                     type="text"
//                     className={`w-full px-4 py-3 bg-gray-800/30 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
//                       errors.firstName
//                         ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
//                         : "border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
//                     }`}
//                     placeholder="John"
//                   />
//                   {errors.firstName && (
//                     <p className="text-red-400 text-xs mt-1 animate-fadeIn">
//                       {errors.firstName}
//                     </p>
//                   )}
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-300">
//                     Last Name
//                   </label>
//                   <input
//                     {...register("lastName", registerValidationSchema.lastName)}
//                     type="text"
//                     className={`w-full px-4 py-3 bg-gray-800/30 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
//                       errors.lastName
//                         ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
//                         : "border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
//                     }`}
//                     placeholder="Doe"
//                   />
//                   {errors.lastName && (
//                     <p className="text-red-400 text-xs mt-1 animate-fadeIn">
//                       {errors.lastName}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Email Field */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-300">Email</label>
//               <input
//                 {...register(
//                   "email",
//                   isLogin
//                     ? loginValidationSchema.email
//                     : registerValidationSchema.email
//                 )}
//                 type="email"
//                 className={`w-full px-4 py-3 bg-gray-800/30 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
//                   errors.email
//                     ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
//                     : "border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
//                 }`}
//                 placeholder="spectra@checkout.com"
//               />
//               {errors.email && (
//                 <p className="text-red-400 text-xs mt-1 animate-fadeIn">
//                   {errors.email}
//                 </p>
//               )}
//             </div>

//             {/* Password Field */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-300">
//                 Password
//               </label>
//               <input
//                 {...register(
//                   "password",
//                   isLogin
//                     ? loginValidationSchema.password
//                     : registerValidationSchema.password
//                 )}
//                 type="password"
//                 className={`w-full px-4 py-3 bg-gray-800/30 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
//                   errors.password
//                     ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
//                     : "border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
//                 }`}
//                 placeholder="••••••••"
//               />
//               {errors.password && (
//                 <p className="text-red-400 text-xs mt-1 animate-fadeIn">
//                   {errors.password}
//                 </p>
//               )}
//             </div>

//             {/* Forgot Password - Login only */}
//             {isLogin && (
//               <div className="text-right">
//                 <button
//                   type="button"
//                   className="text-sm text-white hover:text-amber-300 transition-colors duration-200"
//                 >
//                   Forgot password?
//                 </button>
//               </div>
//             )}

//             {/* Submit Button */}
//             <button
//               onClick={handleSubmit(
//                 onSubmit,
//                 isLogin ? loginValidationSchema : registerValidationSchema
//               )}
//               className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-amber-500/25"
//             >
//               {isLogin ? "Sign In" : "Create Account"}
//             </button>
//           </div>

//           {/* Divider */}
//           <div className="flex items-center my-8">
//             <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
//             <span className="px-4 text-sm text-gray-400">or</span>
//             <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
//           </div>

//           {/* Social Login */}
//           <div className="space-y-3">
//             <button className="w-full py-3 bg-gray-800/50 border border-gray-600 text-white font-medium rounded-xl hover:bg-gray-700/50 transition-all duration-200 flex items-center justify-center space-x-2">
//               <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
//                 <path
//                   d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                   fill="#4285F4"
//                 />
//                 <path
//                   d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                   fill="#34A853"
//                 />
//                 <path
//                   d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                   fill="#FBBC05"
//                 />
//                 <path
//                   d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                   fill="#EA4335"
//                 />
//               </svg>
//               <span>Continue with Google</span>
//             </button>

//             <button className="w-full py-3 bg-gray-800/50 border border-gray-600 text-white font-medium rounded-xl hover:bg-gray-700/50 transition-all duration-200 flex items-center justify-center space-x-2">
//               <img
//                 src={Github}
//                 className="h-5 w-auto"
//                 style={{ filter: "brightness(0) invert(1)" }}
//               />
//               <span>Continue with GitHub</span>
//             </button>
//           </div>

//           {/* Footer Text */}
//           <p className="text-center text-sm text-gray-400 mt-8">
//             {isLogin ? "Don't have an account? " : "Already have an account? "}
//             <button
//               onClick={switchMode}
//               className="text-white hover:text-white/30 font-medium transition-colors duration-200"
//             >
//               {isLogin ? "Sign up" : "Sign in"}
//             </button>
//           </p>
//         </div>
//       </div>

//       <style>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }


import { useState, useEffect, type ChangeEvent, type FocusEvent } from "react";
import logo from "./../../assets/checkout.png";
import Github from "./../../assets/github.svg";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store";

// Simulating React Hook Form functionality
type ValidationRule = {
  required?: { message?: string };
  pattern?: { value: RegExp; message?: string };
  minLength?: { value: number; message?: string };
};

type ValidationSchema = {
  [key: string]: ValidationRule;
};

type FormErrors = {
  [key: string]: string;
};

type UseFormReturn = {
  register: (
    name: string,
    validationRules?: ValidationRule
  ) => {
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  };
  handleSubmit: (
    onSubmit: (data: Record<string, any>) => Promise<void>,
    validationSchema?: ValidationSchema
  ) => (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => void;
  reset: (newValues?: Record<string, any>) => void;
  formState: {
    errors: FormErrors;
    isValid: boolean;
  };
  watch: (name: string) => any;
  setValue: (name: string, value: any) => void;
};

const useForm = (defaultValues: Record<string, any> = {}): UseFormReturn => {
  const [values, setValues] = useState<Record<string, any>>(defaultValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const register = (name: string, validationRules: ValidationRule = {}) => ({
    name,
    value: values[name] || "",
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValues((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    onBlur: () => {
      validateField(name, values[name], validationRules);
    },
  });

  const validateField = (name: string, value: any, rules: ValidationRule) => {
    let error = "";

    if (rules.required && (!value || value.trim() === "")) {
      error = rules.required.message || `${name} is required`;
    } else if (rules.pattern && value && !rules.pattern.value.test(value)) {
      error = rules.pattern.message || `Invalid ${name} format`;
    } else if (rules.minLength && value && value.length < rules.minLength.value) {
      error =
        rules.minLength.message ||
        `${name} must be at least ${rules.minLength.value} characters`;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const validateForm = (validationSchema: ValidationSchema) => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validationSchema).forEach((fieldName) => {
      const error = validateField(
        fieldName,
        values[fieldName],
        validationSchema[fieldName]
      );
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit =
    (
      onSubmit: (data: Record<string, any>) => Promise<void>,
      validationSchema: ValidationSchema = {}
    ) =>
    (
      e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
    ) => {
      e.preventDefault();
      const isValid = validateForm(validationSchema);
      if (isValid) {
        onSubmit(values);
      }
    };

  const reset = (newValues: Record<string, any> = {}) => {
    setValues(newValues);
    setErrors({});
  };

  return {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid: Object.keys(errors).length === 0 },
    watch: (name: string) => values[name],
    setValue: (name: string, value: any) =>
      setValues((prev) => ({ ...prev, [name]: value })),
  };
};

const loginValidationSchema: ValidationSchema = {
  email: {
    required: { message: "Email is required" },
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Please enter a valid email address",
    },
  },
  password: {
    required: { message: "Password is required" },
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters",
    },
  },
};

const registerValidationSchema: ValidationSchema = {
  ...loginValidationSchema,
  firstName: {
    required: { message: "First name is required" },
    minLength: {
      value: 2,
      message: "First name must be at least 2 characters",
    },
  },
  lastName: {
    required: { message: "Last name is required" },
    minLength: {
      value: 2,
      message: "Last name must be at least 2 characters",
    },
  },
};

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { login, register: reg } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: Record<string, any>) => {
    if (isLogin) {
      const { success } = await login(data.email, data.password);
      if (success) {
        navigate("/dashboard", { replace: true });
      }
    } else {
      const { success } = await reg(
        data.firstName,
        data.lastName,
        data.email,
        data.password
      );
      if (success) {
        reset();
        setIsLogin(true);
      }
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  useEffect(() => {
    reset();
  }, [isLogin]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "#1f2020",
      }}
    >

            <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex justify-center flex-col items-center mb-10">
          <img src={logo} className="h-auto w-[50%] mb-1" />
          <p className="text-gray-400 text-sm">Secure. Fast. Reliable.</p>
        </div>

        {/* Main Container */}
        <div className="bg-[#1f2020] backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1">
          {/* Toggle Buttons */}
          <div className="flex bg-gray-800/50 rounded-2xl p-1 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                isLogin
                  ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                !isLogin
                  ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Register-only fields */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    First Name
                  </label>
                  <input
                    {...register(
                      "firstName",
                      registerValidationSchema.firstName
                    )}
                    type="text"
                    className={`w-full px-4 py-3 bg-gray-800/30 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                      errors.firstName
                        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-xs mt-1 animate-fadeIn">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Last Name
                  </label>
                  <input
                    {...register("lastName", registerValidationSchema.lastName)}
                    type="text"
                    className={`w-full px-4 py-3 bg-gray-800/30 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                      errors.lastName
                        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-xs mt-1 animate-fadeIn">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <input
                {...register(
                  "email",
                  isLogin
                    ? loginValidationSchema.email
                    : registerValidationSchema.email
                )}
                type="email"
                className={`w-full px-4 py-3 bg-gray-800/30 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                }`}
                placeholder="spectra@checkout.com"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 animate-fadeIn">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                {...register(
                  "password",
                  isLogin
                    ? loginValidationSchema.password
                    : registerValidationSchema.password
                )}
                type="password"
                className={`w-full px-4 py-3 bg-gray-800/30 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 animate-fadeIn">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password - Login only */}
            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-white hover:text-amber-300 transition-colors duration-200"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit(
                onSubmit,
                isLogin ? loginValidationSchema : registerValidationSchema
              )}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-amber-500/25"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            <span className="px-4 text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button className="w-full py-3 bg-gray-800/50 border border-gray-600 text-white font-medium rounded-xl hover:bg-gray-700/50 transition-all duration-200 flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button className="w-full py-3 bg-gray-800/50 border border-gray-600 text-white font-medium rounded-xl hover:bg-gray-700/50 transition-all duration-200 flex items-center justify-center space-x-2">
              <img
                src={Github}
                className="h-5 w-auto"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              <span>Continue with GitHub</span>
            </button>
          </div>

          {/* Footer Text */}
          <p className="text-center text-sm text-gray-400 mt-8">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={switchMode}
              className="text-white hover:text-white/30 font-medium transition-colors duration-200"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
