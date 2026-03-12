import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactUs } from './schemas/contactUs.schema';
import { CreateContactUsDto } from './dto/contactUs.dto';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectModel(ContactUs.name, 'SECONDARY_DB')
    private contactUsModel: Model<ContactUs>,
  ) {}

  async createContact(data: CreateContactUsDto) {
    const contact = new this.contactUsModel(data);
    return contact.save();
  }

  async getAllContacts() {
    return this.contactUsModel.find().sort({ createdAt: -1 });
  }
}
