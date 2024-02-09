import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { ObjectId } from 'mongoose';
import { Hotel } from 'src/mongo/schemas/hotel.schema';
import { SearchHotelParams } from './hotel.interface';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Multer } from 'src/config/multer.config';

@Controller('api')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Get('hotels')
  async getHotels(@Query() query: SearchHotelParams) {
    return this.hotelService.find(query);
  }
  @Get('hotel/:id')
  async getHotel(@Param() { id }: { id: ObjectId }) {
    return this.hotelService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['admin'])
  @Post('hotel')
  @UseInterceptors(Multer)
  async create(
    @Body() body: Partial<Hotel>,
    @UploadedFiles() files: any,
  ): Promise<any> {
    return await this.hotelService.create(body, files);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['admin'])
  @Put('hotel/:id')
  @UseInterceptors(Multer)
  async update(
    @UploadedFiles() files: any,
    @Param() { id }: { id: ObjectId },
    @Body() body: Partial<Hotel>,
  ) {
    body.images = Array.from(body.images).join('').split(',');

    if (files) {
      body.images = [...body.images, ...files.map((file) => file.filename)];
    }

    return this.hotelService.update({ id, params: body });
  }
}
