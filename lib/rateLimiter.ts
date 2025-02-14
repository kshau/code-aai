import { RateLimiterMemory } from "rate-limiter-flexible";

export const signupRateLimiter = new RateLimiterMemory({
    points: 2,
    duration: 60,
});


export const challengeSubmitRateLimit = new RateLimiterMemory({
    points: 2,
    duration: 1,
});
