import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  points: 5, 
  duration: 60, 
});

export const applyRateLimit = async (ip: string) => {
  try {

    await rateLimiter.consume(ip); 
  } catch (rejRes: unknown) {

    const res = rejRes as RateLimiterRes;

    const retryAfter = Math.ceil(res.msBeforeNext / 1000); // Convert to seconds
    const retryInMinutes = Math.ceil(retryAfter / 60); // Convert to minutes

    throw new Error(`Too many requests, please try again after ${retryInMinutes} minute(s).`);
  }
};
