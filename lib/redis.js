import Redis from "ioredis";

const redis = new Redis(
  "redis://:Guro6197!@redis-12654.c273.us-east-1-2.ec2.cloud.redislabs.com:12654"
);

export default redis;
