import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContactUsService } from './contactus.service';
import { CreateContactUsDto } from './dto/contactUs.dto';

@Controller('/v1/contactus')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  async createContact(@Body() body: CreateContactUsDto) {
    return this.contactUsService.createContact(body);
  }

  @Get()
  async getAllContacts() {
    return this.contactUsService.getAllContacts();
  }
}
