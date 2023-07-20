export { default } from "next-auth/middleware"

export const config = { matcher: ["/", "/create", "/order", "/inventory", "/create-order", "/create-product"] }