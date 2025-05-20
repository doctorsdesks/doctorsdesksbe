import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as Twilio from 'twilio';

@Injectable()
export class MessageService {
  private client: Twilio.Twilio;
  private serviceSid: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.serviceSid = process.env.TWILIO_SERVICE_SID;

    if (!accountSid || !authToken || !this.serviceSid) {
      throw new Error(
        'Twilio credentials are not set properly in environment variables.',
      );
    }

    this.client = Twilio(accountSid, authToken);
  }

  async sendOtp(phoneNumber: string): Promise<{ success: boolean }> {
    try {
      await this.client.verify.v2
        .services(this.serviceSid)
        .verifications.create({ to: phoneNumber, channel: 'sms' });

      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async verifyOtp(
    phoneNumber: string,
    code: string,
  ): Promise<{ verified: boolean }> {
    try {
      const verificationCheck = await this.client.verify.v2
        .services(this.serviceSid)
        .verificationChecks.create({ to: phoneNumber, code });

      return { verified: verificationCheck.status === 'approved' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
