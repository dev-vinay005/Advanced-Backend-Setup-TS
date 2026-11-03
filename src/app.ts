import { ApiError } from "./core/ApiError.js";
import { decode, encode, JwtPayload, validate } from "./core/JWT.js";
// const errHandler = async () => {
//   try {
//     const payload = new JwtPayload(
//       "my-app", // issuer (iss)
//       "my-api", // audience (aud)
//       "user-123", // subject (sub)
//       JSON.stringify({
//         // custom payload (prm)
//         role: "admin",
//         name: "John Doe",
//         email: "john@example.com",
//       }),
//       3600, // validity: 1 hour in seconds
//     );

//     // console.log("logging payload", JSON.parse(payload.prm));

//     const token = await encode(payload, "dfasfsdaf");
//     console.log(token);
//   } catch (err) {
//     console.log(err);
//   }
// };

// const tokenDecode = async () => {
//   const value = decode(
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJteS1hcGkiLCJzdWIiOiJ1c2VyLTEyMyIsImlzcyI6Im15LWFwcCIsImlhdCI6MTc4OTExODQxNywiZXhwIjoxNzg5MTIyMDE3LCJwcm0iOiJ7XCJyb2xlXCI6XCJhZG1pblwiLFwibmFtZVwiOlwiSm9obiBEb2VcIixcImVtYWlsXCI6XCJqb2huQGV4YW1wbGUuY29tXCJ9In0.dhxqNUkBk2nSZm1K5PVopruz_CV2V8y6qp5iZLqyhBU",
//   );

//   return value;
// };

const validateToken = async () => {
  try {
    const t =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJteS1hcGkiLCJzdWIiOiJ1c2VyLTEyMyIsImlzcyI6Im15LWFwcCIsImlhdCI6MTc4OTE5NjEyMCwiZXhwIjoxNzg5MTk5NzIwLCJwcm0iOiJ7XCJyb2xlXCI6XCJhZG1pblwiLFwibmFtZVwiOlwiSm9obiBEb2VcIixcImVtYWlsXCI6XCJqb2huQGV4YW1wbGUuY29tXCJ9In0.O0qgOwItI2rYpklHkd32TjU6VAMXkPJFgZETqXrgCZc";
    const data = await validate(t, "dfasfsdaf");
    console.log("logging token data :", data);
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      console.log("error while validation the token:", err.message);
    }
  }
};

validateToken();

// console.log(data.statusCode);

// errHandler();
