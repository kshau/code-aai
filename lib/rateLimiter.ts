import { RateLimiterMemory } from "rate-limiter-flexible";

export const signupRateLimiter = new RateLimiterMemory({
    points: 5,
    duration: 60,
});


export const challengeSubmitRateLimit = new RateLimiterMemory({
    points: 6,
    duration: 10,
});
