import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from './schemas/doctor.schema';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { ClinicService } from 'src/clinic/clinic.service';

@Injectable()
export class DoctorService {
  constructor(
    private readonly clinicService: ClinicService,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
  ) {}

  async createDoctor(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    console.info(
      'Signup Doctor - doctor service - create doctor called with: ',
      createDoctorDto,
    );
    try {
      const newDoctor = new this.doctorModel(createDoctorDto);
      const createdDoctor = await newDoctor.save();
      return createdDoctor;
    } catch (error) {
      console.info('eroor while creating doctor', error);
      if (error.code === 11000) {
        // Duplicate key error (unique constraint violation)
        throw new ConflictException(
          `Account is already exist with ${createDoctorDto.phone}`,
        );
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Array<Doctor>> {
    const doctors = await this.doctorModel.find().exec();
    return doctors;
  }

  async findByCity(city: string, pincode: string): Promise<Array<Doctor>> {
    try {
      const allDoctors = await this.findAll();

      if (!allDoctors || allDoctors.length === 0) {
        return [];
      }

      const doctorsMap = new Map<string, Doctor>(); // Using Map to ensure uniqueness by phone

      for (const doctor of allDoctors) {
        const doctorClinics = await this.clinicService.getAllClinics(
          doctor.phone,
        );

        if (!doctorClinics || doctorClinics.length === 0) {
          continue;
        }

        const hasMatchingClinic = doctorClinics.some((clinic) => {
          const clinicAddress = clinic.clinicAddress.address;

          const cityMatches = city
            ? clinicAddress.city.toLowerCase() === city.toLowerCase()
            : true;

          const pincodeMatches = pincode
            ? clinicAddress.pincode === pincode
            : true;

          return cityMatches || pincodeMatches;
        });

        if (hasMatchingClinic) {
          doctorsMap.set(doctor.phone, doctor);
        }
      }

      return Array.from(doctorsMap.values());
    } catch (error) {
      throw new HttpException(
        `Error finding doctors by city: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Find doctors by specialization and location (city or pincode)
   * @param specialization Specialization to filter by
   * @param city Optional city to filter by
   * @param pincode Optional pincode to filter by
   * @returns Array of doctors matching the criteria
   */
  async findBySpecialisationAndLocation(
    specialisation: string,
    city?: string,
    pincode?: string,
  ): Promise<Array<Doctor>> {
    try {
      // Get all doctors
      const allDoctors = await this.findAll();

      if (!allDoctors || allDoctors.length === 0) {
        return [];
      }

      // Filter doctors by specialization
      const doctorsBySpecialisation = specialisation
        ? allDoctors.filter(
            (doctor) =>
              doctor.specialisation.toLowerCase() ===
              specialisation.toLowerCase(),
          )
        : allDoctors;

      if (doctorsBySpecialisation.length === 0 || (!city && !pincode)) {
        return doctorsBySpecialisation;
      }

      // Filter doctors by city or pincode
      const doctorsMap = new Map<string, Doctor>(); // Using Map to ensure uniqueness by phone

      for (const doctor of doctorsBySpecialisation) {
        const doctorClinics = await this.clinicService.getAllClinics(
          doctor.phone,
        );

        if (!doctorClinics || doctorClinics.length === 0) {
          continue;
        }

        const hasMatchingClinic = doctorClinics.some((clinic) => {
          const clinicAddress = clinic.clinicAddress.address;

          const cityMatches = city
            ? clinicAddress.city.toLowerCase() === city.toLowerCase()
            : false;

          const pincodeMatches = pincode
            ? clinicAddress.pincode === pincode
            : false;

          // Match if either city or pincode matches
          return cityMatches || pincodeMatches;
        });

        if (hasMatchingClinic) {
          doctorsMap.set(doctor.phone, doctor);
        }
      }

      return Array.from(doctorsMap.values());
    } catch (error) {
      throw new HttpException(
        `Error finding doctors by specialization and location: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByPhone(phone: string): Promise<Doctor> {
    const doctor = await this.doctorModel.findOne({ phone }).exec();
    if (!doctor) {
      return null;
    }
    return doctor;
  }

  async update(
    doctorId: string,
    updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor> {
    try {
      const doctor = await this.doctorModel.findOne({ phone: doctorId }).exec();
      if (!doctor) {
        throw new HttpException(
          `No doctor is found with this ${doctorId}`,
          HttpStatus.NOT_FOUND,
        );
      }
      doctor.experience = updateDoctorDto.experience;
      doctor.specialisation = updateDoctorDto.specialisation || '';
      doctor.specialisationCollege =
        updateDoctorDto.specialisationCollege || '';
      doctor.specialisationYear = updateDoctorDto.specialisationYear || '';
      doctor.otherQualification = updateDoctorDto.otherQualification;
      doctor.languages = updateDoctorDto.languages;
      doctor.imageUrl = updateDoctorDto?.imageUrl || '';
      const updatedDoctor = await doctor.save();
      return updatedDoctor;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Deletes a doctor by phone number
   * @param phone Phone number of the doctor to delete
   * @returns Object containing success status and message
   */
  async deleteDoctor(
    phone: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.doctorModel.findOneAndDelete({ phone }).exec();

      if (!result) {
        return {
          success: false,
          message: `Doctor not found with phone ${phone}`,
        };
      }

      return {
        success: true,
        message: `Doctor with phone ${phone} has been deleted successfully`,
      };
    } catch (error) {
      throw new HttpException(
        `Error deleting doctor: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
