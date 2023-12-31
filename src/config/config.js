import {config} from "dotenv";
import os from "os";  
config();

export default {
  MODO: process.env.MODO || "FORK",
  URLMongo: process.env.URLMONGO,
  PORT: process.env.PORT || 8080,
  DATABASE: process.env.DATABASE || "mongoDB",
  SESSION_TIME: process.env.SESSION_TIME,
  TEST_MAIL: process.env.TEST_MAIL,
  PASS_MAIL: process.env.PASS_MAIL,
  twilioAccountSid: process.env.twilioAccountSid,
  twilioAuthToken: process.env.twilioAuthToken,
  twilioSMSFrom: process.env.twilioSMSFrom,
  twilioSMSTo: process.env.twilioSMSTo,
  processInfo: {
    args: process.argv.slice(2),
    platform: process.platform,
    version: process.version,
    rss: process.memoryUsage.rss(),
    path: process.argv[0],
    pid: process.pid,
    folder: process.argv[1],
    cpus: os.cpus().length
  }
}