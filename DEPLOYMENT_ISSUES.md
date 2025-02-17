[13:24:45.834] Running build in Washington, D.C., USA (East) – iad1
[13:24:46.046] Cloning github.com/skno27/reciplease (Branch: main, Commit: f61d147)
[13:24:46.848] Cloning completed: 802.000ms
[13:24:47.017] Previous build cache not available
[13:24:48.107] Running "vercel build"
[13:24:49.940] Vercel CLI 41.1.3
[13:24:50.706] Installing dependencies...
[13:25:17.526]
[13:25:17.526] added 703 packages in 27s
[13:25:17.526]
[13:25:17.526] 184 packages are looking for funding
[13:25:17.526] run `npm fund` for details
[13:25:17.594] Detected Next.js version: 15.1.4
[13:25:17.595] Running "npx prisma generate && next build" // generate prisma client and build the app. we are failing on build
[13:25:18.976] Prisma schema loaded from prisma/schema.prisma
[13:25:19.463]
[13:25:19.464] ✔ Generated Prisma Client (v6.2.1) to ./node_modules/@prisma/client in 195ms
[13:25:19.464]
[13:25:19.464] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[13:25:19.465]
[13:25:19.465] Tip: Curious about the SQL queries Prisma ORM generates? Optimize helps you enhance your visibility: https://pris.ly/tip-2-optimize
[13:25:19.465]
[13:25:20.248] Attention: Next.js now collects completely anonymous telemetry regarding usage.
[13:25:20.249] This information is used to shape Next.js' roadmap and prioritize features.
[13:25:20.249] You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
[13:25:20.250] https://nextjs.org/telemetry
[13:25:20.250]
[13:25:20.348] ▲ Next.js 15.1.4
[13:25:20.349]
[13:25:20.376] Creating an optimized production build ...
[13:25:48.165] ⚠ Compiled with warnings
[13:25:48.165]
[13:25:48.165] ./node_modules/bcryptjs/index.js
[13:25:48.165] A Node.js module is loaded ('crypto' at line 32) which is not supported in the Edge Runtime.
[13:25:48.165] Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime
[13:25:48.165]
[13:25:48.165] Import trace for requested module: // i believe this is related to the need for nodejs env to run bcrypt's dependency "crypto"
[13:25:48.165] ./node_modules/bcryptjs/index.js
[13:25:48.165] ./src/app/api/services/authService.ts
[13:25:48.165] ./src/app/api/middlewares/loginAuth.ts
[13:25:48.166]
[13:25:48.166] ./node_modules/bcryptjs/index.js
[13:25:48.166] A Node.js API is used (process.nextTick at line: 340) which is not supported in the Edge Runtime.
[13:25:48.166] Learn more: https://nextjs.org/docs/api-reference/edge-runtime
[13:25:48.166]
[13:25:48.166] Import trace for requested module:
[13:25:48.166] ./node_modules/bcryptjs/index.js
[13:25:48.166] ./src/app/api/services/authService.ts
[13:25:48.166] ./src/app/api/middlewares/loginAuth.ts
[13:25:48.166]
[13:25:48.166] ./node_modules/bcryptjs/index.js
[13:25:48.166] A Node.js API is used (setImmediate at line: 341) which is not supported in the Edge Runtime.
[13:25:48.166] Learn more: https://nextjs.org/docs/api-reference/edge-runtime
[13:25:48.166]
[13:25:48.166] Import trace for requested module:
[13:25:48.166] ./node_modules/bcryptjs/index.js
[13:25:48.166] ./src/app/api/services/authService.ts
[13:25:48.166] ./src/app/api/middlewares/loginAuth.ts
[13:25:48.166]
[13:25:48.166] ./node_modules/bcryptjs/index.js
[13:25:48.166] A Node.js API is used (setImmediate at line: 342) which is not supported in the Edge Runtime.
[13:25:48.166] Learn more: https://nextjs.org/docs/api-reference/edge-runtime
[13:25:48.166]
[13:25:48.166] Import trace for requested module:
[13:25:48.166] ./node_modules/bcryptjs/index.js
[13:25:48.166] ./src/app/api/services/authService.ts
[13:25:48.166] ./src/app/api/middlewares/loginAuth.ts
[13:25:48.166]
[13:25:48.166] ./node_modules/bcryptjs/index.js
[13:25:48.167] A Node.js API is used (process.nextTick at line: 343) which is not supported in the Edge Runtime.
[13:25:48.167] Learn more: https://nextjs.org/docs/api-reference/edge-runtime
[13:25:48.167]
[13:25:48.167] Import trace for requested module:
[13:25:48.167] ./node_modules/bcryptjs/index.js
[13:25:48.167] ./src/app/api/services/authService.ts
[13:25:48.167] ./src/app/api/middlewares/loginAuth.ts
[13:25:48.167]
[13:25:48.173] Linting and checking validity of types ...
[13:25:59.665] Failed to compile.
[13:25:59.665]
[13:25:59.665] src/app/api/auth/[...nextauth]/route.ts // im not sure about this error at all. im totally new to nextauth and oauth in general
[13:25:59.665] Type error: Route "src/app/api/auth/[...nextauth]/route.ts" does not match the required types of a Next.js Route.
[13:25:59.665] "authOptions" is not a valid Route export field.
[13:25:59.665]
[13:25:59.699] Static worker exited with code: 1 and signal: null
[13:25:59.752] Error: Command "npx prisma generate && next build" exited with 1
[13:26:00.074]
