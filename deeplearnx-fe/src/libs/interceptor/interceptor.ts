import { setupAuthInterceptor } from "./auth.interceptor";
import { setupDeduplicationInterceptor } from "./deduplication.interceptor";

setupDeduplicationInterceptor();
setupAuthInterceptor();
